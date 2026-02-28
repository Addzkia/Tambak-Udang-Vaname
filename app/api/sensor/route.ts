import { NextResponse } from "next/server";

let latestData = { temperature: 0 };
let lastNotificationTime = 0;

// 🔥 Simpan semua user yang daftar
let subscribers: string[] = [];

const token = "TOKEN_BARU_KAMU";

export async function GET() {
  return NextResponse.json(latestData);
}

export async function POST(req: Request) {
  const body = await req.json();

  // ===============================
  // 1️⃣ Kalau dari ESP32 (ada temperature)
  // ===============================
  if (body.temperature !== undefined) {
    const temperature = body.temperature;
    latestData = body;

    if (temperature > 50) {
      const now = Date.now();

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
  // 2️⃣ Kalau dari Telegram (registrasi)
  // ===============================

  if (body.message) {
    const chatId = body.message.chat.id.toString();

    if (!subscribers.includes(chatId)) {
      subscribers.push(chatId);

      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "✅ Kamu berhasil terdaftar!",
        }),
      });
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false });
}