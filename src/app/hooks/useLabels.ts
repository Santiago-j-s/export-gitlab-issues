import { getRandomHex, getTextColor } from "@/lib/colors";
import { useEffect, useReducer, useSyncExternalStore } from "react";
import { z } from "zod";
import { LabelOption } from "../components/SelectLabels";

function emptySubscribe() {
  return () => {};
}

const selectableLabelSchema = z.object({
  label: z.string(),
  backgroundColor: z.string(),
  color: z.string(),
});

function getLabelsFromStorage() {
  const labels = selectableLabelSchema
    .array()
    .transform((data) => {
      return data.sort((a, b) => a.label.localeCompare(b.label));
    })
    .safeParse(JSON.parse(localStorage.getItem("labels") ?? "[]"));

  if (!labels.success) {
    return [];
  }

  return labels.data;
}

const storageLabels = getLabelsFromStorage();

export function useLabels() {
  const initialLabels = useSyncExternalStore(
    emptySubscribe,
    () => storageLabels
  );

  const [labels, dispatchLabels] = useReducer(
    (
      state: LabelOption[],
      action:
        | {
            type: "ADD_LABEL";
            label: string;
            backgroundColor?: string;
          }
        | { type: "REMOVE_LABEL"; label: string }
        | { type: "RESET_LABELS" }
    ) => {
      switch (action.type) {
        case "ADD_LABEL": {
          const backgroundColor = action.backgroundColor || getRandomHex();
          return [
            ...state,
            {
              label: action.label,
              backgroundColor,
              color: getTextColor(backgroundColor),
            },
          ].sort((a, b) => a.label.localeCompare(b.label));
        }
        case "REMOVE_LABEL":
          return state.filter((label) => label.label !== action.label);
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

  const addLabel = (label: string, backgroundColor?: string) => {
    dispatchLabels({ type: "ADD_LABEL", label, backgroundColor });
  };

  const removeLabel = (label: string) => {
    dispatchLabels({ type: "REMOVE_LABEL", label });
  };

  const resetLabels = () => {
    dispatchLabels({ type: "RESET_LABELS" });
  };

  return [labels, addLabel, removeLabel, resetLabels] as const;
}
