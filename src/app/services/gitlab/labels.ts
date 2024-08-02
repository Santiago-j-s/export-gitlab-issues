import { z } from "zod";
import { fetchGitlabAPI } from ".";

export const labelsSchema = z
  .array(
    z.object({
      id: z.number(),
      name: z.string(),
      color: z.string(),
    })
  )
  .transform((data) => {
    return data.sort((a, b) => a.name.localeCompare(b.name));
  });

export const getProjectLabels = async (projectId: number, token: string) => {
  const response = await fetchGitlabAPI(
    `/projects/${projectId}/labels?per_page=250`,
    token
  );

  if (!response.ok) {
    throw new Error("Failed to fetch labels");
  }

  const parseResult = labelsSchema.parse(await response.json());

  return parseResult;
};
