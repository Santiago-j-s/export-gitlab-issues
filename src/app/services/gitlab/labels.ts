import { z } from 'zod';
import { BASE_GITLAB_API } from ".";

export const labelsSchema = z.array(z.object({
  id: z.number(),
  name: z.string(),
}))

export const getProjectLabels = async (projectId: number, token: string) => {
  const response = await fetch(`${BASE_GITLAB_API}/projects/${projectId}/labels`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch labels");
  }

  const parseResult = labelsSchema.parse(await response.json());

  return parseResult;
}