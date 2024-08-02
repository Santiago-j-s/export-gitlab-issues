import { z } from 'zod';
import { fetchGitlabAPI } from ".";

export const milestonesSchema = z.array(z.object({
  id: z.number(),
  title: z.string(),
}))

export const getProjectMilestoneByName = async ({ projectId, term }: {
  projectId: number;
  term: string;
}, token: string) => {
  const response = await fetchGitlabAPI(`/projects/${projectId}/milestones?title=${term}`, token);

  if (!response.ok) {
    throw new Error("Failed to fetch milestones");
  }

  const parseResult = milestonesSchema.parse(await response.json());

  if (parseResult.length === 0) {
    throw new Error(`Milestone ${term} not found`);
  }

  if (parseResult.length > 1) {
    throw new Error(`Multiple milestones with the same name found`);
  }

  return parseResult[0];
}