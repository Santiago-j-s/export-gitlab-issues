'use server'

import { auth } from "@/app/lib/auth";
import { getProjectLabels, labelsSchema } from "@/app/services/gitlab/labels";
import { getProjectByName, projectSchema } from "@/app/services/gitlab/projects";
import { z } from "zod";

interface ErrorFormState {
  status: "error";
  message: string;
}

interface BaseFormState {
  status: "success" | "error" | "idle";
}

interface SuccessFormState extends BaseFormState {
  status: "success";
  result: z.infer<typeof labelsSchema>;
}

interface IdleFormState extends BaseFormState {
  status: "idle";
}

export type FormState = SuccessFormState | ErrorFormState | IdleFormState;

export const importLabels = async (formData: FormData): Promise<FormState> => {
  const session = await auth();

  if (!session) {
    return {
      status: "error" as const,
      message: "You need to be logged in to import labels",
    }
  }

  let term: string;
  try {
    term = z.string().min(1).parse(formData.get("project"))
  } catch (e) {
    return {
      status: "error" as const,
      message: "You need to provide a project name",
    }
  }


  let project: z.infer<typeof projectSchema>;
  try {
    project = await getProjectByName(term, session.accessToken);
  } catch (e) {
    return {
      status: "error" as const,
      message: (e as Error).message,
    }
  }

  try {
    const labels = await getProjectLabels(project.id, session.accessToken);

    return {
      status: "success" as const,
      result: labels,
    }
  } catch (e) {
    if (e instanceof z.ZodError) {
      return {
        status: "error" as const,
        message: e.errors.map((err) => err.message).join("\n"),
      }
    }

    return {
      status: "error" as const,
      message: (e as Error).message,
    }
  }
}