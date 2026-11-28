# Equipment Rental Platform — Client

**Live URL:** _https://equipment-rental-platform-client-mu.vercel.app_

## Purpose

Frontend of an equipment rental marketplace. Equipment owners list their
equipment for rent, customers browse/book/pay for a rental period, and admins
manage users, equipment and rentals. Built with Next.js 16 App Router,
TypeScript, Tailwind CSS v4, DaisyUI and shadcn/ui. The Express + MongoDB API
lives in the separate `Equipment-Rental-Platform-server` repository.

## Key features

- **Public pages** — Home with hero/banner, 6 approved featured equipment,
  categories, why-choose-us, reviews and extra sections; All Equipment with
  server-side search, filters (category, rental type, price, availability) and
  sorting; About, Contact and How It Works.
- **Authentication** — email/password and Google sign-in through BetterAuth
  with a JWT plugin; role-based access for `Customer`, `Owner` and `Admin`.
- **Customer dashboard** — My Rentals, Favorites, Profile, booking details and
  Stripe payment pages.
- **Owner dashboard** — Add Equipment (ImgBB image upload), My Equipment,
  My Equipment Rental, Earnings with charts, and Profile.
- **Admin dashboard** — All Users, All Equipment (approve/reject), All Rentals,
  platform analytics with charts, and Profile.
- **Booking & payment** — date range and quantity selection, server-calculated
  total, stock check, Stripe Checkout, transaction recorded and booking marked
  paid/confirmed on success.
- **Extras** — dark/light theme toggle saved in local storage, loading/error/
  not-found pages, responsive layouts for mobile/tablet/desktop, Framer Motion
  animations, and an admin button to run the overdue-booking cron job manually.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other commands:

```bash
npm run build      # production build
npm run start      # production server
npm run lint       # ESLint
npx tsc --noEmit   # typecheck
```

## Environment variables

Create a `.env` file (never commit real secrets):

```env
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=<your imgbb key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your stripe publishable key>
RESEND_API_KEY=<your resend api key>
EMAIL_FROM=EquipRent <onboarding@resend.dev>

BETTER_AUTH_SECRET=<your secret>
BETTER_AUTH_DB_URI=<your mongodb connection string>
STRIPE_SECRET_KEY=<your stripe secret key>
BETTER_AUTH_GOOGLE_CLIENT_ID=<your google client id>
BETTER_AUTH_GOOGLE_CLIENT_SECRET=<your google client secret>
```

A ready-to-copy template is in `.env.example`.

## Email verification (Resend)

One API key is used for the **whole website** — users never enter their own
email credentials anywhere.

1. Sign up at <https://resend.com> using the email address you will test with.
2. Open **API Keys** → **Create API Key** → copy the key (starts with `re_...`).
3. Paste it into `.env`: `RESEND_API_KEY=re_your_key_here`.
4. Restart `npm run dev` (env vars are read only at startup).
5. Register with that same email — the verification link arrives in the inbox.
6. Click the link → redirected to `/login?verified=1` → log in.

With the free `onboarding@resend.dev` sender you can only send to your own
Resend email. For production, verify your domain in Resend and set
`EMAIL_FROM=EquipRent <no-reply@yourdomain.com>`; then any registered user
receives the email. Add `RESEND_API_KEY` to your hosting platform's environment
variables as well.

Without a key, the verification link is printed in the terminal so the flow can
still be tested locally.

## npm packages used

**Dependencies:** `@base-ui/react`, `@better-auth/mongo-adapter`,
`@stripe/stripe-js`, `better-auth`, `class-variance-authority`, `cn`,
`es-toolkit`, `framer-motion`, `lucide-react`, `mongodb`, `next`, `nodemailer`, `react`,
`react-dom`, `recharts`, `shadcn`, `sonner`, `stripe`, `tw-animate-css`,
`node-cron`.

**Dev dependencies:** `@tailwindcss/turbopack`, `@types/node`, `@types/react`,
`@types/react-dom`, `babel-plugin-react-compiler`, `daisyui`, `eslint`,
`eslint-config-next`, `tailwindcss`, `typescript`.
