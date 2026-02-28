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
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-10">
          IoT Dashboard
        </h1>

        <div className="space-y-4 text-gray-600">
          <div className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium">
            Dashboard
          </div>
          <div className="hover:bg-gray-100 px-4 py-2 rounded-lg cursor-pointer">
            Profile
          </div>
          <div className="hover:bg-gray-100 px-4 py-2 rounded-lg cursor-pointer">
            Settings
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-12">

        {/* Mobile Header */}
        <div className="md:hidden bg-white shadow-sm p-4 rounded-xl mb-6 text-center font-semibold text-gray-800">
          IoT Dashboard
        </div>

        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-8">
          Dashboard Monitoring
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Temperature Card */}
          <div className="bg-white p-8 rounded-2xl shadow-md border hover:shadow-lg transition">
            <p className="text-gray-500 text-sm mb-2">Temperature</p>
            <p className="text-4xl font-bold text-emerald-600">
              {temperature !== null ? `${temperature}°C` : "--"}
            </p>
          </div>

          {/* DO Virtual Card */}
          <div className="bg-white p-8 rounded-2xl shadow-md border hover:shadow-lg transition">
            <p className="text-gray-500 text-sm mb-2">DO Virtual</p>
            <p className="text-4xl font-bold text-indigo-600">
              {temperature !== null ? (temperature / 10).toFixed(1) : "--"}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}