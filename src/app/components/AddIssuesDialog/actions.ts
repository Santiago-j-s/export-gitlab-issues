"use server";

import { auth } from "@/app/lib/auth";
import { addIssues } from "@/app/services/gitlab/issues";
import {
  getProjectByName,
  projectSchema,
} from "@/app/services/gitlab/projects";
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
}

interface IdleFormState extends BaseFormState {
  status: "idle";
}

export type FormState = SuccessFormState | ErrorFormState | IdleFormState;

export const saveIssues = async (formData: FormData): Promise<FormState> => {
  const session = await auth();
  const issues = z
    .array(
      z.object({
        title: z.string(),
        description: z
          .string()
          .nullable()
          .transform((v) => v ?? ""),
        labels: z
          .array(
            z.object({
              label: z.string(),
            })
          )
          .transform((v) => v.map((l) => l.label)),
        milestone: z.string(),
      })
    )
    .parse(JSON.parse(formData.get("issues") as string));

  if (!session) {
    return {
      status: "error" as const,
      message: "You need to be logged in to import labels",
    };
  }

  let term: string;
  try {
    term = z.string().min(1).parse(formData.get("project"));
  } catch (e) {
    return {
      status: "error" as const,
      message: "You need to provide a project name",
    };
  }

  let project: z.infer<typeof projectSchema>;
  try {
    project = await getProjectByName(term, session.accessToken);
  } catch (e) {
    return {
      status: "error" as const,
      message: (e as Error).message,
    };
  }

  await addIssues(project.id, issues, session.accessToken);

  return {
    status: "success" as const,
  };
};
