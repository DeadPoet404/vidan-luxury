This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

# AI Concierge Demo (branch: ai-booking-demo)

A simulated AI booking assistant layered over the real site. A visitor taps
the gold chat bubble, talks with the Vidan Concierge (Google Gemini), and
watches a reservation summary fill in live. When the assistant has gathered
a complete booking request, the team receives an instant Telegram alert
with every detail.

## How it works

    [ chat widget ] --POST /api/chat--> [ Gemini, structured JSON ] --> reply + booking state
                          \
                           +--> [ Telegram Bot API ]  (once, when booking is complete)

- src/lib/residences.ts .............. single source of truth for the portfolio
- src/lib/concierge.ts ............... prompt, response schema, fallback assistant, alerts
- src/app/api/chat/route.ts .......... POST /api/chat (Gemini -> fallback -> Telegram)
- src/components/ConciergeWidget.tsx . floating panel + live booking card (localStorage)

## Environment

    GEMINI_API_KEY       Google AI Studio key
    GEMINI_MODEL         optional, defaults to gemini-2.5-flash
    TELEGRAM_BOT_TOKEN   from @BotFather
    TELEGRAM_CHAT_ID     chat that receives booking alerts

Template lives in .env.example; real values go in .env.local (git-ignored).

## Demo script

1. Open the site and tap the gold bubble (bottom right)
2. Say: I am interested in a one-bedroom in East Legon
3. Give name, WhatsApp number, dates and guests in one message
4. Watch the Reservation Summary card fill field by field
5. On completion: green "team notified" line + the Telegram ping
6. Use Reset in the panel header to run it again; a reload keeps history

If Gemini or Telegram is unreachable, the chat degrades to a scripted
assistant with an amber notice, and Telegram retries once automatically.
The demo never breaks: no real booking is created and rates are indicative.
