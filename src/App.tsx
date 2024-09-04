import { useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./global.css";
import { Clock } from "./components/Clock";
import { Play, Power, RotateCcw, Pause } from "lucide-react";
import parse from "parse-duration";
import { cn } from "./utils/styles";
import { useTimer } from "./hooks/useTimer";
import { formatMs, parseMs } from "./utils/time";

export const App = () => {
  const { timer, startTimer } = useTimer();

  const [textValue, setTextValue] = useState("");
  const parsedValue = useMemo(() => parseMs(textValue), [textValue]);
  const isValid = parsedValue != null;

  // useEffect(() => {
  //   const delta = 100;
  //   const interval = setInterval(() => {
  //     setRemainingMs((v) => v - delta);
  //   }, delta);
  //   return () => clearInterval(interval);
  // }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) return;

    startTimer(textValue);
  };

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
          <div
            className="relative z-10 w-full"
            // style={{
            //   textShadow:
            //     "0 0 5px #4ade80, 0 0 10px #4ade80, 0 0 15px #4ade80, 0 0 20px #4ade80",
            // }}
          >
            {formatMs(timer.remainingMs)}
          </div>
        </div>

        <form
          className="w-full grid grid-cols-[auto_1fr_1fr] gap-y-2 gap-x-1"
          onSubmit={handleSubmit}
        >
          <input
            name="duration"
            className="w-full bg-indigo-900 text-indigo-50 border border-indigo-500 rounded px-2 py-1 max-w-[80px]"
            placeholder="30s, 5m"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
          />

          <Button
            Icon={Play}
            text="Start"
            disabled={textValue.trim() === "" || !isValid}
            className={cn("text-green-500 border-green-500")}
          />

          {/* <Button
            type="button"
            Icon={Pause}
            text="Pause"
            disabled={timer.state !== "running"}
            className={cn("text-yellow-500 border-yellow-500")}
          /> */}

          <Button
            type="button"
            Icon={RotateCcw}
            text="Reset"
            disabled={timer.state === "running" || timer.state === "paused"}
            noFill
            className={cn("text-red-500 border-red-500")}
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
      `flex gap-1 items-center justify-center text-sm border rounded px-2 py-1`,
      "disabled:opacity-50",
      className
    )}
    {...props}
  >
    <Icon size={16} fill={noFill ? "transparent" : "currentColor"} />
    <span>{text}</span>
  </button>
);
