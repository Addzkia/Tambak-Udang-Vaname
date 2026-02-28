import { NextResponse } from "next/server";

let latestData = { temperature: 0 };
let lastNotificationTime = 0;

// ⚠️ WARNING:
// Di Vercel (serverless) data ini bisa hilang jika function restart.
// Untuk production serius sebaiknya pakai database.
let subscribers: string[] = [];

const token = process.env.TELEGRAM_TOKEN;

if (!token) {
  throw new Error("TELEGRAM_TOKEN tidak ditemukan di environment variable!");
}

// ===============================
// GET → Untuk Dashboard
// ===============================
export async function GET() {
  return NextResponse.json(latestData);
}

// ===============================
// POST → Untuk ESP32 & Telegram
// ===============================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ===============================
    // 1️⃣ DATA DARI ESP32
    // ===============================
    if (body?.temperature !== undefined) {
      const temperature = body.temperature;
      latestData = { temperature };

      if (temperature > 70) {
        const now = Date.now();

        // Cooldown 1 menit
        if (now - lastNotificationTime > 60000) {
          const message = `⚠️ ALERT!\nSuhu melebihi batas!\nNilai: ${temperature}°C`;

          for (const chatId of subscribers) {
            await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: chatId,
                text: message,
              }),
            });
          }

          lastNotificationTime = now;
        }
      }

      return NextResponse.json({ success: true });
    }

    // ===============================
    // 2️⃣ DATA DARI TELEGRAM
    // ===============================
    if (body?.message) {
      const chatId = body.message.chat.id.toString();
      const text = body.message.text;

      // Command /start
      if (text === "/start") {
        if (!subscribers.includes(chatId)) {
          subscribers.push(chatId);
        }

        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "✅ Kamu berhasil terdaftar!\nBot akan mengirim notifikasi jika suhu melebihi batas.",
          }),
        });

        return NextResponse.json({ success: true });
      }

      // Pesan biasa
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "Ketik /start untuk mendaftar notifikasi.",
        }),
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false });
  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json({ success: false });
  }
}