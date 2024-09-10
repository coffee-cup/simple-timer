import parse from "parse-duration";

export const formatMs = (ms: number) => {
  // Round up to the nearest second if within 500ms of the next second
  ms = Math.round(ms / 1000) * 1000;

  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  if (hours > 0) {
    const formattedHours = hours.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  } else {
    return `${formattedMinutes}:${formattedSeconds}`;
  }
};

export const parseMs = (
  time: string,
  _maxMs?: number | null
): number | null => {
  const isAllNumeric = time.trim().length > 0 && /^[0-9]+$/.test(time);
  if (isAllNumeric) {
    time = `${time}s`;
  }

  const maxMs = _maxMs === undefined ? parse("99h") : _maxMs;
  const parsed = parse(time);

  if (parsed == null) return null;
  if (maxMs != null && parsed > maxMs) return null;

  return parsed;
};
