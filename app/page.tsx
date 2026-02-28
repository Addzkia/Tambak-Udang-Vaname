"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [temperature, setTemperature] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/sensor");
      const data = await res.json();
      setTemperature(data.temperature);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-900">

      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-slate-800 p-8 border-r border-slate-700">
        <h1 className="text-2xl font-bold text-white mb-10">
          IoT Dashboard
        </h1>

        <div className="bg-slate-700 text-white px-4 py-3 rounded-lg">
          Dashboard
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 md:p-12">

        <h2 className="text-3xl font-semibold text-white mb-10">
          Dashboard Monitoring
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Temperature Card */}
          <div className="bg-slate-800 p-10 rounded-2xl shadow-lg border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Temperature</p>
            <p className="text-5xl font-bold text-emerald-400">
              {temperature !== null ? `${temperature}°C` : "--"}
            </p>
          </div>

          {/* DO Virtual */}
          <div className="bg-slate-800 p-10 rounded-2xl shadow-lg border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">DO Virtual</p>
            <p className="text-5xl font-bold text-indigo-400">
              {temperature !== null ? (temperature / 10).toFixed(1) : "--"}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}