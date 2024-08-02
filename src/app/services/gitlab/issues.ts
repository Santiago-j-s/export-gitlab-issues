import { z } from "zod";
import { postGitlabAPI } from ".";
import { getProjectMilestoneByName } from "./milestones";

export const issuesToUploadSchema = z.array(
  z.object({
    title: z.string(),
    description: z.string().nullable(),
    labels: z.array(z.string()),
    milestone: z.string(),
  })
);

type IssuesToUpload = z.infer<typeof issuesToUploadSchema>;

export const addIssues = async (
  projectId: number,
  issues: IssuesToUpload,
  accessToken: string
) => {
  const milestonesToSearch = issues
    .map((issue) => issue.milestone)
    .filter((milestone) => milestone);
  const milestones = await Promise.all(
    milestonesToSearch.map((milestone) =>
      getProjectMilestoneByName({ projectId, term: milestone }, accessToken)
    )
  );

  const responses = await Promise.all(
    issues.map((issue) => {
      const searchParams = new URLSearchParams();
      searchParams.set("title", issue.title);

      if (issue.labels.length) {
        searchParams.set("labels", issue.labels.join(","));
      }

      if (issue.description) {
        searchParams.set("description", issue.description);
      }

      const milestone = milestones.find(
        (milestone) => milestone.title === issue.milestone
      );

      if (milestone) {
        searchParams.set("milestone_id", String(milestone.id));
      }

      return postGitlabAPI(
        `/projects/${projectId}/issues?${searchParams.toString()}`,
        accessToken
      );
    })
  );

  return responses;
};
