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

  const isDirty = textValue.trim() !== timer.activeDurationString;

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
    textValue.trim() === timer.activeDurationString;

  return (
    <div className="h-screen max-h-screen grid grid-rows-[auto_minmax(0,1fr)] bg-indigo-950 text-indigo-50 selection:bg-fuchsia-400/30">
      <div
        data-tauri-drag-region
        className="h-7 select-none flex justify-end"
      />

      <div className="grid gap-2 grid-cols-1 grid-rows-[minmax(0,1fr)_auto] items-center justify-center px-3 pb-3">
        <div
          data-tauri-drag-region
          className="flex justify-center items-center text-5xl bg-indigo-900 w-full h-full text-center rounded text-fuchsia-500 relative overflow-hidden"
          style={{
            textShadow: "rgba(225,33,255,0.9) 0px 0px 42px",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)",
              backgroundSize: "100% 2px",
            }}
          />
          <TimeRemaining timer={timer} />
        </div>

        <form
          className="w-full grid grid-cols-1 gap-y-2 gap-x-1"
          onSubmit={handleSubmit}
        >
          <div className="flex w-full bg-indigo-900 rounded border border-transparent focus-within:border-fuchsia-500">
            <input
              name="duration"
              className="w-full bg-transparent text-sm px-3 py-2 h-[40px] placeholder:text-fuchsia-300/60 text-fuchsia-300 focus:outline-none"
              placeholder="Enter duration (30s, 5m, 1h)"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
            />

            {showResetButton && (
              <button
                type="button"
                className="text-fuchsia-200/60 mr-2 hover:text-fuchsia-200/80 focus:outline-none"
                onClick={() => {
                  if (timer.activeDurationString == null) return;
                  startTimer(
                    timer.activeDurationString,
                    timer.state === "running"
                  );
                }}
              >
                <RotateCcw size={18} className="" />
              </button>
            )}
          </div>

          <Button
            Icon={isDirty ? Play : timer.state === "running" ? Pause : Play}
            text={
              isDirty ? "Start" : timer.state === "running" ? "Pause" : "Resume"
            }
            disabled={textValue.trim() === "" || !isValid}
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
      `flex gap-1 items-center justify-center text-sm border-2 rounded px-2 py-2 h-[40px]`,
      "text-fuchsia-500 border-fuchsia-500",
      "disabled:opacity-60",
      className
    )}
    {...props}
  >
    <Icon size={16} fill={noFill ? "transparent" : "currentColor"} />
    <span>{text}</span>
  </button>
);
