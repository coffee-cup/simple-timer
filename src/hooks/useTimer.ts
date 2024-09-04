import { useState } from "react";
import { parseMs } from "../utils/time";

export type TimerState = "idle" | "running" | "paused";

export interface Timer {
  state: TimerState;
  totalMs: number;
  remainingMs: number;
}

export const useTimer = () => {
  const [timer, setTimer] = useState<Timer>({
    state: "idle",
    totalMs: 0,
    remainingMs: 0,
  });

  const startTimer = (durationString: string) => {
    const durationMs = parseMs(durationString);
    if (durationMs == null) return;

    setTimer({
      state: "paused",
      totalMs: durationMs,
      remainingMs: durationMs,
    });
  };

  return { timer, startTimer };
};
