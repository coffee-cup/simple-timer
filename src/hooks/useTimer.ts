import { useEffect, useState } from "react";
import { parseMs } from "../utils/time";
import { invoke } from "@tauri-apps/api";

export type TimerState = "running" | "paused";

export interface Timer {
  state: TimerState;
  durationMs: number;
  activeDurationString?: string;
  startTime?: number;
}

export const useTimer = () => {
  const [timer, setTimer] = useState<Timer>({
    state: "paused",
    durationMs: 0,
  });

  const onTimerEnd = async () => {
    console.log("timer ended!");
    await invoke("play_alarm");
  };

  useEffect(() => {
    if (timer.state === "running" && timer.startTime && timer.durationMs) {
      const timeoutId = setTimeout(() => {
        onTimerEnd();

        setTimer((t) => ({
          ...t,
          state: "paused",
          durationMs: 0,
          activeDurationString: undefined,
          startTime: undefined,
        }));
      }, timer.durationMs);

      return () => clearTimeout(timeoutId);
    }
  }, [timer.state, timer.startTime, timer.durationMs]);

  const startTimer = (durationString: string) => {
    const durationMs = parseMs(durationString);
    if (durationMs == null) return;

    setTimer({
      state: "running",
      startTime: Date.now(),
      activeDurationString: durationString,
      durationMs: durationMs,
    });
  };

  const pauseTimer = () => {
    if (
      timer.state !== "running" ||
      timer.startTime == null ||
      timer.durationMs == null
    ) {
      return;
    }

    const elapsedMs = Date.now() - timer.startTime;
    const remainingMs = Math.max(timer.durationMs - elapsedMs, 0);

    setTimer((t) => ({
      ...t,
      state: "paused",
      durationMs: remainingMs,
      startTime: undefined,
    }));
  };

  const resumeTimer = () => {
    if (timer.state !== "paused") {
      return;
    }

    setTimer((t) => ({
      ...t,
      state: "running",
      startTime: Date.now(),
    }));
  };

  return { timer, startTimer, pauseTimer, resumeTimer };
};
