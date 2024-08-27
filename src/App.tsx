import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./global.css";
import { Clock } from "./components/Clock";
import { Play, Power } from "lucide-react";
import parse from "parse-duration";

export const App = () => {
  const [value, setValue] = useState(0);
  const [total, setTotal] = useState(100);

  useEffect(() => {
    const delta = 100;
    const interval = setInterval(() => {
      setValue((v) => (v + 1000 / delta) % total);
    }, delta);
    return () => clearInterval(interval);
  }, []);

  const startTimer = (durationString: string) => {
    const durationMs = parse(durationString);
    if (durationMs == null) return;

    const durationSec = durationMs / 1000;
    setValue(0);
    setTotal(durationSec);
  };

  return (
    <div className="h-screen max-h-screen grid grid-rows-[auto_minmax(0,1fr)] bg-indigo-950 text-indigo-50">
      <div
        data-tauri-drag-region
        className="h-7 select-none flex justify-end"
      />

      <div className="grid grid-rows-[minmax(0,1fr)_auto] gap-4 py-4">
        <div className="flex items-center justify-center h-full mx-auto">
          <Clock currentValue={value} totalValue={100} />
        </div>

        <form
          className="grid grid-cols-[1fr_auto] mx-10 gap-2 items-center"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const time = formData.get("duration");
            startTimer(time as string);
          }}
        >
          <input
            name="duration"
            className="w-full bg-slate-50 text-indigo-950 px-3 py-2 rounded"
            placeholder="30s, 5m, 1h"
          />

          <button className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded">
            <Power />
          </button>
        </form>
      </div>
    </div>
  );
};
