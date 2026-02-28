"use client";

import { useEffect, useState } from "react";
import mqtt from "mqtt";

export default function Dashboard() {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [alertSent, setAlertSent] = useState(false); // anti spam

  useEffect(() => {
    const client = mqtt.connect("wss://broker.hivemq.com:8000/mqtt");

    client.on("connect", () => {
      console.log("Connected to MQTT");
      client.subscribe("tambak/suhu");
    });

    client.on("message", async (topic, message) => {
      if (topic === "tambak/suhu") {
        const value = parseFloat(message.toString());
        setTemperature(value);

        // 🔥 Jika suhu lebih dari 32°C dan belum kirim alert
        if (value > 32 && !alertSent) {
          setAlertSent(true);

          await fetch("/api/sensor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              alert: `⚠️ Suhu tinggi terdeteksi!\nNilai: ${value}°C`,
            }),
          });
        }

        // Reset alert kalau suhu kembali normal
        if (value <= 32) {
          setAlertSent(false);
        }
      }
    });

    client.on("error", (err) => {
      console.error("MQTT error:", err);
    });

    return () => {
      client.end();
    };
  }, [alertSent]);

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