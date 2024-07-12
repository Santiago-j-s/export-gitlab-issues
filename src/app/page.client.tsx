"use client";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { useEffect, useReducer, useState, useSyncExternalStore } from "react";
import { Issue, Issues } from "./components/Issues";
import { LabelsAndMilestoneForm } from "./components/LabelsAndMilestoneForm";

function emptySubscribe() {
  return () => {};
}

function getLabelsFromStorage() {
  return JSON.parse(localStorage.getItem("labels") ?? "[]") as string[];
}

const storageLabels = getLabelsFromStorage();

function useLabels() {
  const initialLabels = useSyncExternalStore(
    emptySubscribe,
    () => storageLabels
  );

  const [labels, dispatchLabels] = useReducer(
    (
      state: string[],
      action:
        | {
            type: "ADD_LABEL";
            label: string;
          }
        | { type: "REMOVE_LABEL"; label: string }
        | { type: "RESET_LABELS" }
    ) => {
      switch (action.type) {
        case "ADD_LABEL":
          return [...state, action.label];
        case "REMOVE_LABEL":
          return state.filter((label) => label !== action.label);
        case "RESET_LABELS":
          return [];
        default:
          // @ts-expect-error - check for unhandled action types
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          throw new Error(`Unhandled action type: ${action.type}`);
      }
    },
    initialLabels ?? []
  );

  // save labels to local storage
  useEffect(() => {
    localStorage.setItem("labels", JSON.stringify(labels));
  }, [labels]);

  const addLabel = (label: string) => {
    dispatchLabels({ type: "ADD_LABEL", label });
  };

  const removeLabel = (label: string) => {
    dispatchLabels({ type: "REMOVE_LABEL", label });
  };

  const resetLabels = () => {
    dispatchLabels({ type: "RESET_LABELS" });
  };

  return [labels, addLabel, removeLabel, resetLabels] as const;
}

type IssueAction =
  | {
      type: "ADD_ISSUE";
      issue: Pick<Issue, "title" | "labels" | "description" | "milestone">;
    }
  | { type: "REMOVE_ISSUE"; id: string }
  | { type: "CLEAR_ISSUES" };

function getIssuesFromStorage() {
  return JSON.parse(localStorage.getItem("issues") ?? "[]") as Issue[];
}

const issueLabels = getIssuesFromStorage();

function useIssues() {
  const initialIssues = useSyncExternalStore(emptySubscribe, () => issueLabels);

  const initialIssuesWithOnRemove = initialIssues.map((issue) => ({
    ...issue,
    onRemove: () => {
      dispatchIssues({ type: "REMOVE_ISSUE", id: issue.id });
    },
  }));

  const [issues, dispatchIssues] = useReducer(
    (state: Issue[], action: IssueAction) => {
      switch (action.type) {
        case "ADD_ISSUE": {
          const id = crypto.randomUUID();

          return [
            ...state,
            {
              ...action.issue,
              id,
              onRemove: () => {
                dispatchIssues({ type: "REMOVE_ISSUE", id });
              },
            },
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

  return [issues, addIssue, clearIssues] as const;
}

function createCsv(issues: Issue[]) {
  const headers = ["title", "due_date", "milestone", "description"].join(",");

  const rows = issues.map((issue) => {
    const labels = issue.labels.map((label) => `~""${label}""`).join(" ");

    return `"${issue.title}",,"${issue.milestone}","${issue.description}\n/label ${labels}",`;
  });

  return [headers, ...rows].join("\n");
}

export default function ClientPage() {
  const [labels, addLabel, removeLabel, resetLabels] = useLabels();
  const [issues, addIssue, clearIssues] = useIssues();
  const [milestone, setMilestone] = useState<string | null>(null);
  const [exportUrl, setExportUrl] = useState<string | null>(null);

  useEffect(() => {
    const blob = new Blob([createCsv(issues)], { type: "text/csv" });

    const url = URL.createObjectURL(blob);
    setExportUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [issues, setExportUrl]);

  return (
    <>
      <LabelsAndMilestoneForm
        addLabel={addLabel}
        resetLabels={resetLabels}
        milestone={milestone ?? ""}
        setMilestone={setMilestone}
      />

      <div className="col-span-8">
        <Issues
          labels={labels}
          issues={issues}
          milestone={milestone}
          onRemoveLabel={removeLabel}
        />
        <form
          id="issue-form"
          action={(data: FormData) => {
            const labels = data.get("label");

            addIssue({
              title: data.get("title") as string,
              labels:
                labels && typeof labels === "string" ? labels.split(",") : [],
              description: data.get("description") as string,
              milestone: data.get("milestone") as string,
            });
          }}
        >
          <input hidden readOnly name="milestone" value={milestone ?? ""} />
        </form>
      </div>

      <div className="flex gap-4">
        <Button asChild>
          <a href={exportUrl ?? undefined} download="issues.csv">
            <Download className="mr-2 h-4 w-4" /> Export Issues
          </a>
        </Button>
        <Button variant="secondary" onClick={clearIssues}>
          <Trash2 className="mr-2 h-4 w-4" /> Clear Issues
        </Button>
      </div>
    </>
  );
}
