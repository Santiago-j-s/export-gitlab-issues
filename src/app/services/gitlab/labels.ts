import { z } from 'zod';
import { fetchGitlabAPI } from ".";

export const labelsSchema = z.array(z.object({
  id: z.number(),
  name: z.string(),
}))

export const getProjectLabels = async (projectId: number, token: string) => {
  const response = await fetchGitlabAPI(`/projects/${projectId}/labels`, token);

  if (!response.ok) {
    throw new Error("Failed to fetch labels");
  }

  const parseResult = labelsSchema.parse(await response.json());

  return parseResult;
}