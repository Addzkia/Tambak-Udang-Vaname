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
    <div className="flex min-h-screen bg-slate-100">
      
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-200 p-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-10 tracking-wide">
          IoT Dashboard
        </h1>

        <div className="bg-slate-800 px-4 py-3 rounded-lg">
          Dashboard
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-12">
        <h2 className="text-3xl font-semibold text-slate-700 mb-10">
          Monitoring Sensor
        </h2>

        <div className="grid grid-cols-2 gap-8">

          {/* Temperature Card */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-10 rounded-2xl shadow-xl transition hover:scale-105 duration-300">
            <h3 className="text-lg opacity-80">Temperature</h3>
            <p className="text-5xl font-bold mt-2">
              {temperature !== null ? `${temperature}°C` : "--"}
            </p>
          </div>

          {/* Dummy Card */}
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-10 rounded-2xl shadow-xl transition hover:scale-105 duration-300">
            <h3 className="text-lg opacity-80">Dummy Sensor</h3>
            <p className="text-5xl font-bold mt-2">
              {temperature !== null ? (temperature / 10).toFixed(1) : "--"}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}