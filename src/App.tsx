import { Pause, Play, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { TimeRemaining } from "./components/TimeRemaining";
import "./global.css";
import { useTimer } from "./hooks/useTimer";
import { cn } from "./utils/styles";
import { parseMs } from "./utils/time";

export const App = () => {
  const { timer, startTimer, pauseTimer, resumeTimer } = useTimer();

  const [textValue, setTextValue] = useState("");
  const parsedValue = useMemo(() => parseMs(textValue), [textValue]);
  const isValid = parsedValue != null;

  const isDirty = textValue !== timer.activeDurationString;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isDirty) {
      // Start the timer with a new duration
      startTimer(textValue);
    } else if (timer.state === "running") {
      // Pause the timer
      pauseTimer();
    } else if (timer.state === "paused" && timer.durationMs > 0) {
      // Resume the timer
      resumeTimer();
    } else {
      // Start the timer with a new duration
      startTimer(textValue);
    }
  };

  const showResetButton =
    timer.activeDurationString != null &&
    textValue === timer.activeDurationString;

  return (
    <div className="h-screen max-h-screen grid grid-rows-[auto_minmax(0,1fr)] bg-indigo-950 text-indigo-50">
      <div
        data-tauri-drag-region
        className="h-7 select-none flex justify-end"
      />

      <div className="grid gap-2 grid-cols-1 grid-rows-[minmax(0,1fr)_auto] items-center justify-center px-3 pb-3">
        <div
          data-tauri-drag-region
          className="flex justify-center items-center text-5xl font-bold bg-indigo-900 text-pink-400 w-full h-full text-center rounded"
        >
          <TimeRemaining timer={timer} />
        </div>

        <form
          className="w-full grid grid-cols-1 gap-y-2 gap-x-1"
          onSubmit={handleSubmit}
        >
          <div className="flex w-full bg-indigo-900 rounded border border-indigo-500">
            <input
              name="duration"
              className="w-full bg-transparent px-3 py-2 focus:outline-none"
              placeholder="Enter duration (e.g. 30s, 5m, 1h)"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
            />

            {showResetButton && (
              <button
                type="button"
                onClick={() => {
                  if (timer.activeDurationString == null) return;
                  startTimer(timer.activeDurationString);
                }}
              >
                <RotateCcw
                  size={18}
                  className="text-white/50 mr-2 hover:text-white/80"
                />
              </button>
            )}
          </div>

          <Button
            Icon={isDirty ? Play : timer.state === "running" ? Pause : Play}
            text={
              isDirty ? "Start" : timer.state === "running" ? "Pause" : "Resume"
            }
            disabled={textValue.trim() === "" || !isValid}
            className={cn("text-green-500 border-green-500")}
          />
        </form>
      </div>
    </div>
  );
};

const Button = ({
  Icon,
  text,
  className,
  noFill,
  ...props
}: {
  Icon: React.ElementType;
  text: string;
  noFill?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      `flex gap-1 items-center justify-center text-sm border-2 rounded px-2 py-2`,
      "disabled:opacity-50",
      className
    )}
    {...props}
  >
    <Icon size={16} fill={noFill ? "transparent" : "currentColor"} />
    <span>{text}</span>
  </button>
);
