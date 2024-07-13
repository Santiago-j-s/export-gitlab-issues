import { useEffect, useReducer, useState, useSyncExternalStore } from "react";
import { Issue } from "../components/IssueItem";

type IssueAction =
  | {
      type: "ADD_ISSUE";
      issue: Pick<Issue, "title" | "labels" | "description" | "milestone">;
    }
  | { type: "REMOVE_ISSUE"; id: string }
  | { type: "CLEAR_ISSUES" };

function getIssuesFromStorage() {
  return JSON.parse(localStorage.getItem("issues") ?? "[]") as Omit<
    Issue,
    "onRemove" | "onEdit"
  >[];
}

const issueLabels = getIssuesFromStorage();

function emptySubscribe() {
  return () => {};
}

export function useIssues() {
  const initialIssues = useSyncExternalStore(emptySubscribe, () => issueLabels);
  const [openEditModal, setOpenEditModal] = useState<Omit<
    Issue,
    "onRemove" | "onEdit"
  > | null>(null);

  const initialIssuesWithOnRemove = initialIssues.map((issue) => ({
    ...issue,
    onRemove: () => {
      dispatchIssues({ type: "REMOVE_ISSUE", id: issue.id });
    },
    onEdit: () => {
      setOpenEditModal(issue);
    },
  }));

  const [issues, dispatchIssues] = useReducer(
    (state: Issue[], action: IssueAction) => {
      switch (action.type) {
        case "ADD_ISSUE": {
          const id = crypto.randomUUID();

          return [
            {
              ...action.issue,
              id,
              onRemove: () => {
                dispatchIssues({ type: "REMOVE_ISSUE", id });
              },
              onEdit: () => {
                setOpenEditModal({ ...action.issue, id });
              },
            },
            ...state,
          ];
        }
        case "REMOVE_ISSUE":
          return state.filter((issue) => issue.id !== action.id);
        case "CLEAR_ISSUES":
          return [];
        default:
          // @ts-expect-error - check for unhandled action types
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          throw new Error(`Unhandled action type: ${action.type}`);
      }
    },
    initialIssuesWithOnRemove ?? []
  );

  // save issues to local storage
  useEffect(() => {
    localStorage.setItem("issues", JSON.stringify(issues));
  }, [issues]);

  const addIssue = (
    issue: Extract<IssueAction, { type: "ADD_ISSUE" }>["issue"]
  ) => {
    dispatchIssues({ type: "ADD_ISSUE", issue });
  };

  const clearIssues = () => {
    dispatchIssues({ type: "CLEAR_ISSUES" });
  };

  const removeIssue = (id: string) => {
    dispatchIssues({ type: "REMOVE_ISSUE", id });
  };

  return [
    issues,
    addIssue,
    clearIssues,
    {
      editing: openEditModal,
      setEditing: setOpenEditModal,
    },
    removeIssue,
  ] as const;
}
