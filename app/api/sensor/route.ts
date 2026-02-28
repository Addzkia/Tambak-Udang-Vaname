import { NextResponse } from "next/server";

const token = process.env.TELEGRAM_TOKEN;

// ⚠️ Akan hilang kalau serverless restart
let subscribers = new Set<string>();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ===============================
    // 1️⃣ Jika request dari Telegram (Webhook)
    // ===============================
    if (body?.message) {
      const chatId = body.message.chat.id.toString();
      const text = body.message.text;

      if (text === "/start") {
        subscribers.add(chatId);

        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "✅ Kamu terdaftar notifikasi suhu!",
          }),
        });
      }

      return NextResponse.json({ ok: true });
    }

    // ===============================
    // 2️⃣ Jika request dari Dashboard (alert)
    // ===============================
    if (body?.alert) {
      for (const chatId of subscribers) {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: body.alert,
          }),
        });
      }

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false });

  } catch (err) {
    return NextResponse.json({ ok: false });
  }
}