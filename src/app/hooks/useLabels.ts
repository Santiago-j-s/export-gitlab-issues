import { useEffect, useReducer, useSyncExternalStore } from "react";

function emptySubscribe() {
  return () => {};
}

function getLabelsFromStorage() {
  return JSON.parse(localStorage.getItem("labels") ?? "[]") as string[];
}

const storageLabels = getLabelsFromStorage();

export function useLabels() {
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
