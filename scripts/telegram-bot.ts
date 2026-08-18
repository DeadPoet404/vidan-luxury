// ─────────────────────────────────────────────────────────────
// Vidan 24/7 admin bot — long-polling runner.
//
//   npm run bot
//
// Reads TELEGRAM_BOT_TOKEN + TELEGRAM_ADMIN_CHAT_IDS from the
// environment (falling back to .env.local / .env). No webhook or
// public URL needed — it polls api.telegram.org directly.
// ─────────────────────────────────────────────────────────────

import { readFileSync } from "fs";
import { handleUpdate, type BotDeps } from "@/lib/bot-core";
import {
  answerCallback,
  callTelegram,
  editText,
  sendText,
  type TgUpdate,
} from "@/lib/telegram";

// ── .env.local loader (Next does this for the web server; the
//    standalone bot process has to do it itself) ──────────────

function loadEnvFile(name: string): void {
  let text: string;
  try {
    text = readFileSync(name, "utf8");
  } catch {
    return;
  }
  for (const line of text.split("\n")) {
    const m = line.match(
      /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/,
    );
    if (!m) continue;
    const key = m[1];
    if (process.env[key] !== undefined) continue; // real env always wins
    process.env[key] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const ts = () => new Date().toISOString().replace("T", " ").slice(0, 19);
const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const token = process.env.TELEGRAM_BOT_TOKEN ?? "";
if (!token) {
  console.error("✖ TELEGRAM_BOT_TOKEN missing — set it in .env.local");
  process.exit(1);
}

const adminChatIds = new Set(
  (process.env.TELEGRAM_ADMIN_CHAT_IDS ?? "")
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n) && n > 0),
);
if (adminChatIds.size === 0) {
  console.error(
    "✖ TELEGRAM_ADMIN_CHAT_IDS missing — comma-separated admin chat IDs in .env.local",
  );
  process.exit(1);
}

// ── Side effects wired to the real Bot API ─────────────────────

const deps: BotDeps = {
  async send(chatId, text, markup) {
    const r = await sendText(token, chatId, text, markup);
    if (!r.ok) console.error(`[${ts()}] sendMessage failed: ${r.error}`);
  },
  async edit(chatId, messageId, text, markup) {
    const r = await editText(token, chatId, messageId, text, markup);
    if (!r.ok) console.error(`[${ts()}] editMessageText failed: ${r.error}`);
  },
  async answer(callbackQueryId, text) {
    const r = await answerCallback(token, callbackQueryId, text);
    if (!r.ok) console.error(`[${ts()}] answerCallbackQuery failed: ${r.error}`);
  },
};

const SLASH_MENU = [
  { command: "status", description: "Live availability board" },
  { command: "block", description: "Block dates (offline booking)" },
  { command: "unblock", description: "Release a blocked range" },
  { command: "bookings", description: "Active holds & bookings, with refs" },
  { command: "pause", description: "Pause/resume a residence" },
  { command: "resume", description: "Pause/resume a residence" },
  { command: "release", description: "Release by ref: /release VX-XXXX" },
  { command: "cancel", description: "Cancel the current flow" },
  { command: "help", description: "What this bot can do" },
];

// ── Boot + long-poll loop ──────────────────────────────────────

async function main(): Promise<void> {
  const me = await callTelegram<{ id: number; username?: string }>(
    token,
    "getMe",
    {},
  );
  if (!me.ok) {
    console.error(
      `✖ getMe failed: ${me.error}\n  (wrong token, or no network route to Telegram)`,
    );
    process.exit(1);
  }
  console.log(`[${ts()}] online as @${me.result.username ?? me.result.id}`);

  await callTelegram(token, "deleteWebhook", {
    drop_pending_updates: false,
  });
  await callTelegram(token, "setMyCommands", { commands: SLASH_MENU });

  // Skip any backlog from before the bot started (never replay stale taps).
  let offset = 0;
  const tail = await callTelegram<TgUpdate[]>(
    token,
    "getUpdates",
    { timeout: 0, offset: -1 },
    1,
  );
  if (tail.ok && tail.result.length > 0) {
    offset = tail.result[tail.result.length - 1].update_id + 1;
  }

  console.log(`[${ts()}] admins: ${[...adminChatIds].join(", ")}`);
  console.log(
    `[${ts()}] polling — message @${me.result.username ?? "the bot"} /help from an admin chat. Ctrl+C to stop.`,
  );

  for (;;) {
    const res = await callTelegram<TgUpdate[]>(
      token,
      "getUpdates",
      {
        offset,
        timeout: 35,
        allowed_updates: ["message", "callback_query"],
      },
      1, // the loop itself is the retry — no inner attempts
      45_000, // must comfortably exceed the long-poll timeout
    );
    if (!res.ok) {
      console.error(`[${ts()}] poll error: ${res.error} — retrying in 5s`);
      if (res.error.includes("401")) {
        console.error("✖ token rejected by Telegram — exiting");
        process.exit(1);
      }
      await sleep(5_000);
      continue;
    }
    for (const update of res.result) {
      offset = update.update_id + 1;
      await handleUpdate(update, { adminChatIds }, deps);
    }
  }
}

process.on("SIGINT", () => {
  console.log("\n[bot] stopped.");
  process.exit(0);
});
process.on("SIGTERM", () => {
  console.log("[bot] terminated.");
  process.exit(0);
});

main().catch((error) => {
  console.error(`[${ts()}] fatal:`, error);
  process.exit(1);
});
