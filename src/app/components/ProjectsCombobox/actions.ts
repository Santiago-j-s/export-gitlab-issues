"use server";

import { auth } from "@/app/lib/auth";
import { getProjectsByName } from "@/app/services/gitlab/projects";

export const getProjectsComboboxOptions = async (term: string) => {
  const session = await auth();
  const projects = await getProjectsByName(
    term,
    session?.accessToken as string
  );
  return projects.map((project) => ({
    value: String(project.id),
    label: project.name,
  }));
};
