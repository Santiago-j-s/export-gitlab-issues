import { Issue } from "@/app/components/IssueItem";
import { postGitlabAPI } from ".";
import { getProjectMilestoneByName } from "./milestones";

export const addIssues = async (projectId: number, issues: Omit<Issue, 'onEdit' | 'onRemove' | 'id'>[], accessToken: string) => {
  const milestonesToSearch = issues.map((issue) => issue.milestone).filter((milestone) => milestone);
  const milestones = await Promise.all(
    milestonesToSearch.map((milestone) => getProjectMilestoneByName({ projectId, term: milestone }, accessToken))
  );

  const responses = await Promise.all(
    issues.map((issue) => {
      const searchParams = new URLSearchParams()
      searchParams.set('title', issue.title);

      if (issue.labels.length) {
        searchParams.set('labels', issue.labels.join(','));
      }

      if (issue.description) {
        searchParams.set('description', issue.description);
      }

      const milestone = milestones.find((milestone) => milestone.title === issue.milestone);

      if (milestone) {
        searchParams.set('milestone_id', String(milestone.id));
      }

      return postGitlabAPI(`/projects/${projectId}/issues?${searchParams.toString()}`, accessToken);
    })
  );

  return responses;
}