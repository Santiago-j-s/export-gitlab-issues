"use server";

import { auth } from "@/app/lib/auth";
import { getProjectLabels, labelsSchema } from "@/app/services/gitlab/labels";
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
    };
  }

  let projectId: number;
  try {
    projectId = z
      .number({ coerce: true })
      .min(1)
      .parse(formData.get("project"));
  } catch (e) {
    return {
      status: "error" as const,
      message: "You need to provide a project name",
    };
  }

  try {
    const labels = await getProjectLabels(projectId, session.accessToken);

    return {
      status: "success" as const,
      result: labels,
    };
  } catch (e) {
    if (e instanceof z.ZodError) {
      return {
        status: "error" as const,
        message: e.errors.map((err) => err.message).join("\n"),
      };
    }

    return {
      status: "error" as const,
      message: (e as Error).message,
    };
  }
};
