import { useEffect, useReducer, useRef } from "react";

type Action =
  | {
      type: "RESIZE_START";
    }
  | {
      type: "RESIZE_MOVE";
      payload: {
        positionX: number;
      };
    }
  | {
      type: "RESIZE_END";
    };

interface State {
  resizing: boolean;
  positionX: number;
}

const MIN_A_WIDTH = 275;
const MIN_B_WIDTH = 500;

const initialState: State = {
  resizing: false,
  positionX: 420,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "RESIZE_START":
      return {
        ...state,
        resizing: true,
      };
    case "RESIZE_MOVE":
      return {
        ...state,
        positionX: action.payload.positionX,
      };
    case "RESIZE_END":
      return {
        ...state,
        resizing: false,
      };
    default:
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Invalid action type: ${action.type}`);
  }
};

export const TwoResizableColumns = ({
  columnA,
  columnB,
}: {
  columnA: React.ReactNode;
  columnB: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      if (state.resizing && wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();

        const positionX = Math.min(
          Math.max(event.clientX - rect.left, MIN_A_WIDTH),
          rect.width - MIN_B_WIDTH
        );

        dispatch({
          type: "RESIZE_MOVE",
          payload: {
            positionX,
          },
        });
      }
    };
    const onMouseUp = () => {
      dispatch({
        type: "RESIZE_END",
      });
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [state.resizing]);

  return (
    <div className="flex w-full relative" ref={wrapperRef}>
      <div
        style={{
          width: state.positionX,
        }}
        className="pr-md1"
      >
        {columnA}
      </div>
      <button
        className="w-sm1 h-full bg-border rounded-md cursor-col-resize absolute"
        style={{
          left: state.positionX - 2,
        }}
        onMouseDown={() => {
          dispatch({
            type: "RESIZE_START",
          });
        }}
      />
      <div
        style={{
          width: `calc(100% - ${state.positionX}px)`,
        }}
        className="pl-md1 overflow-scroll"
      >
        {columnB}
      </div>
    </div>
  );
};
