// ─────────────────────────────────────────────────────────────
// Minimal typed Telegram Bot API client (long-polling flavour).
// Shared by the admin bot process; the concierge alert path keeps
// its own dedicated helper in concierge.ts.
// ─────────────────────────────────────────────────────────────

export type InlineButton = { text: string; callback_data: string };

export type ReplyMarkup =
  | { inline_keyboard: InlineButton[][] }
  | {
      keyboard: { text: string }[][];
      resize_keyboard?: boolean;
      is_persistent?: boolean;
    };

export type TgUser = {
  id: number;
  first_name?: string;
  username?: string;
};

export type TgMessage = {
  message_id: number;
  from?: TgUser;
  chat: { id: number };
  text?: string;
  date?: number;
};

export type TgCallbackQuery = {
  id: string;
  from: TgUser;
  message?: TgMessage;
  data?: string;
};

export type TgUpdate = {
  update_id: number;
  message?: TgMessage;
  callback_query?: TgCallbackQuery;
};

export type TgResult<T> =
  | { ok: true; result: T }
  | { ok: false; error: string };

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

function describeError(error: unknown): string {
  if (error instanceof Error) {
    const cause = (error as { cause?: { code?: string } }).cause?.code;
    return `${error.name}: ${error.message}${cause ? ` (${cause})` : ""}`;
  }
  return String(error);
}

/**
 * Call a Bot API method with bounded retries. 4xx answers are returned
 * immediately (retrying never helps); network failures and 5xx retry
 * with linear backoff.
 */
export async function callTelegram<T>(
  token: string,
  method: string,
  payload: Record<string, unknown>,
  attempts = 3,
  timeoutMs = 15_000,
): Promise<TgResult<T>> {
  const url = `https://api.telegram.org/bot${token}/${method}`;
  let lastError = "unknown Telegram error";

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(timeoutMs),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        description?: string;
        result?: T;
      } | null;
      if (res.ok && data?.ok) {
        return { ok: true, result: data.result as T };
      }
      lastError = `Telegram HTTP ${res.status}${
        data?.description ? `: ${data.description}` : ""
      }`;
      if (res.status >= 400 && res.status < 500 && res.status !== 429) {
        return { ok: false, error: lastError };
      }
    } catch (error) {
      lastError = describeError(error);
    }
    if (attempt < attempts) await sleep(1_200 * attempt);
  }
  return { ok: false, error: lastError };
}

export function sendText(
  token: string,
  chatId: number,
  text: string,
  markup?: ReplyMarkup,
): Promise<TgResult<TgMessage>> {
  return callTelegram<TgMessage>(token, "sendMessage", {
    chat_id: chatId,
    text,
    ...(markup ? { reply_markup: markup } : {}),
  });
}

export function editText(
  token: string,
  chatId: number,
  messageId: number,
  text: string,
  markup?: ReplyMarkup,
): Promise<TgResult<unknown>> {
  return callTelegram(token, "editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    ...(markup ? { reply_markup: markup } : {}),
  });
}

export function answerCallback(
  token: string,
  callbackQueryId: string,
  text?: string,
): Promise<TgResult<unknown>> {
  return callTelegram(token, "answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    ...(text ? { text } : {}),
  });
}
