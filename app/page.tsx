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
    <div className="min-h-screen bg-slate-100 flex flex-col">

      {/* Top Bar (Mobile Friendly) */}
      <div className="bg-slate-900 text-white p-4 text-center text-xl font-semibold shadow-md">
        IoT Monitoring
      </div>

      {/* Content */}
      <div className="flex-1 p-6">

        <h2 className="text-2xl font-semibold text-slate-700 mb-6 text-center">
          Monitoring Sensor
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Temperature Card */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-8 rounded-3xl shadow-xl">
            <h3 className="text-lg opacity-80">Temperature</h3>
            <p className="text-4xl md:text-5xl font-bold mt-2">
              {temperature !== null ? `${temperature}°C` : "--"}
            </p>
          </div>

          {/* Dummy Card */}
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-8 rounded-3xl shadow-xl">
            <h3 className="text-lg opacity-80">Dummy Sensor</h3>
            <p className="text-4xl md:text-5xl font-bold mt-2">
              {temperature !== null ? (temperature / 10).toFixed(1) : "--"}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}