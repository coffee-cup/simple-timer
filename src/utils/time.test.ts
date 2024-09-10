import { expect, test } from "bun:test";
import { formatMs, parseMs } from "./time";

test("formatMs", () => {
  expect(formatMs(0)).toBe("00:00");
  expect(formatMs(100)).toBe("00:00");
  expect(formatMs(1000)).toBe("00:01");
  expect(formatMs(29997)).toBe("00:30");
  expect(formatMs(59999)).toBe("01:00");
  expect(formatMs(60000)).toBe("01:00");
  expect(formatMs(3599999)).toBe("01:00:00");
  expect(formatMs(3600000)).toBe("01:00:00");
  expect(formatMs(36000000)).toBe("10:00:00");
  expect(formatMs(360000000)).toBe("100:00:00");
});

test("parseMs", () => {
  expect(parseMs("0")).toBe(0);
  expect(parseMs("100")).toBe(100 * 1000);
  expect(parseMs("1000")).toBe(1000 * 1000);
  expect(parseMs("10s")).toBe(10 * 1000);
  expect(parseMs("30m")).toBe(30 * 60 * 1000);
  expect(parseMs("2h")).toBe(2 * 60 * 60 * 1000);

  expect(parseMs("100h")).toBeNull();
  expect(parseMs("100h")).toBeNull();

  expect(parseMs("abc")).toBeNull();
});
