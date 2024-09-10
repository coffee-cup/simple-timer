import { useEffect, useState } from "react";
import { Timer } from "../hooks/useTimer";
import { formatMs } from "../utils/time";

const UPDATE_FREQUENCY = 300;

export const TimeRemaining = ({
  timer,
}: {
  timer: Timer;
  className?: string;
}) => {
  const calculateRemainingMs = () => {
    if (timer.state !== "running" && timer.durationMs != null) {
      return timer.durationMs;
    }

    if (timer.startTime == null || timer.durationMs == null) {
      return null;
    }

    const elapsedMs = Date.now() - timer.startTime;
    const remainingMs = timer.durationMs - elapsedMs;

    return Math.max(remainingMs, 0);
  };

  const [remainingMs, setRemainingMs] = useState<number | null>(
    calculateRemainingMs()
  );

  useEffect(() => {
    setRemainingMs(calculateRemainingMs());

    if (timer.state === "running") {
      const interval = setInterval(() => {
        setRemainingMs(calculateRemainingMs());
      }, UPDATE_FREQUENCY);

      return () => clearInterval(interval);
    }
  }, [timer.state, timer.startTime, timer.durationMs]);

  return <span>{remainingMs === null ? "00:00" : formatMs(remainingMs)}</span>;
};
