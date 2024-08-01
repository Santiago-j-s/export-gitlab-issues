import { z } from 'zod';
import { BASE_GITLAB_API } from ".";

export const projectSchema = z.object({
  id: z.number(),
  description: z.string().nullable(),
  name: z.string(),
})

export const getProjectByName = async (term: string, token: string) => {
  const response = await fetch(`${BASE_GITLAB_API}/projects?search=${term}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  const parseResult = z.array(projectSchema).parse(await response.json());

  if (parseResult.length === 0) {
    throw new Error("No project found");
  }
  if (parseResult.length > 1) {
    throw new Error("Multiple projects found");
  }

  return parseResult[0];
}