<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Equipment Rental Platform — Client

Frontend for an equipment rental marketplace (assignment project). Next.js 16 App Router + TypeScript + Tailwind v4 + DaisyUI + Framer Motion. The Express/MongoDB backend lives in a separate repository.

## Commands

- `npm run dev` — dev server at http://localhost:3000 (Turbopack).
- `npm run build` — production build (`next build`).
- `npm run start` — production server (`next start`).
- `npm run lint` — ESLint flat config (`eslint.config.mjs`), no args needed.
- `npx tsc --noEmit` — typecheck; there is no typecheck script in `package.json`.
- No tests or CI are configured.

## Stack notes

- Next.js 16 App Router; code lives in `src/app`. Path alias `@/*` → `src/*` (tsconfig `paths` + `components.json`).
- Tailwind v4 via `@tailwindcss/turbopack` loader in `next.config.ts` — there is **no** `tailwind.config.js`. Theme tokens are DaisyUI themes defined with `@plugin "daisyui/theme"` blocks in `src/app/globals.css` (light/dark, applied via `data-theme` on `<html>`).
- React Compiler is enabled (`reactCompiler: true` in `next.config.ts` + `babel-plugin-react-compiler`). Do not add manual `useMemo`/`useCallback`/`memo` — the compiler memoizes automatically.
- UI primitives: shadcn/ui (`components.json`, style `base-nova`, icons `lucide`), `sonner` Toaster (mounted in root layout), `framer-motion` for animations, `cn` + `class-variance-authority` for class merging.

## Structure

- `src/app/layout.tsx` — root layout: Navbar + `{children}` + Toaster + Footer, Geist fonts, theme-restore script (`localStorage` theme, falls back to system dark/light).
- `src/app/(public)/` — public pages: Home, All Equipment, About, Contact, How It Works; layout renders Navbar + Footer.
- `src/app/(auth)/` — Login/Register with a minimal layout (no navbar/footer).
- `src/app/dashboard/` — role-based dashboards (Customer / Owner / Admin) with their own sidebar layout, full-width, no public footer. Customer dashboard sub-routes: `/dashboard` (My Rentals), `/dashboard/favorites`, `/dashboard/profile`. Sidebar lives at `src/app/component/CustomerDashboard/DashboardSidebar.tsx`. Dashboard pages are UI-only with mock data — no backend functionality wired.
- `src/app/component/{AdminDashboard,CustomerDashboard,OwnerDashboard}` — dashboard UI shell components.
- `src/app/api/auth/` — BetterAuth route handler mounted by the backend-mounted auth client.
- `src/app/error.tsx`, `src/app/loading.tsx`, `src/app/not-found.tsx` — Next.js error/loading/not-found conventions.
- `src/config/site.ts` — single source of truth for site name, nav links, contact info (`equiprent.com` placeholder contact).
- `src/lib/utils.ts` — shadcn `cn` helper (`@/lib/utils` per `components.json`).

## Conventions

- Auth state always comes from `useSession()` in `src/lib/auth-client.ts` (`better-auth/react` `createAuthClient` with `baseURL: NEXT_PUBLIC_BETTER_AUTH_URL`), never from ad-hoc fetches. `signIn`/`signUp`/`signOut` are exported from the same module.
- Client-facing env keys are prefixed `NEXT_PUBLIC_` (`NEXT_PUBLIC_BETTER_AUTH_URL`, `NEXT_PUBLIC_API_BASE_URL=http://localhost:6000`, `NEXT_PUBLIC_IMGBB_API_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`). Never hardcode API URLs or the Stripe publishable key; server-only secrets (`BETTER_AUTH_SECRET`, `BETTER_AUTH_DB_URI`) stay off the client.
- Icons from `lucide-react`; animations from `framer-motion`.
- Keep every route reachable without 404s and reload-safe (private routes must not bounce to login on refresh) — deployment is graded on this.

## Gotchas

- `.env` is committed and contains real values (MongoDB Atlas URI with credentials, ImgBB key, Stripe test key). `.gitignore` ignores `.env*` but un-ignores `.env.example`, which does not exist. Do not add new secrets to `.env`; treat existing values as placeholders to rotate if exposed.
- Backend (Express + BetterAuth + MongoDB) is a separate repo; `NEXT_PUBLIC_API_BASE_URL` points at `http://localhost:6000`. The dev server alone will not satisfy API calls until the backend is running.
