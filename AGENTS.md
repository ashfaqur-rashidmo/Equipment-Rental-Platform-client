<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Equipment Rental Platform — Client

Frontend for an equipment rental marketplace (assignment project). Next.js 16 App Router + TypeScript + Tailwind v4 + DaisyUI + Framer Motion. The Express/MongoDB backend lives in a separate repository.

## Commands

- `npm run dev` — dev server at http://localhost:3000 (Turbopack).
- `npm run lint` — ESLint flat config, no args needed.
- `npx tsc --noEmit` — typecheck; there is no typecheck script.
- `npm run build` — production build. No tests or CI are configured.

## Stack notes

- Next.js 16 App Router, code lives in `src/app`. Path alias `@/*` → `src/*`.
- Tailwind v4 is wired through `@tailwindcss/turbopack` rules in `next.config.ts`, **not** PostCSS. There is no `tailwind.config` file — theme tokens are defined via `@plugin "daisyui/theme"` blocks in `src/app/globals.css`.
- React Compiler is enabled (`reactCompiler: true` in `next.config.ts`). Do not add manual `useMemo`/`useCallback`/`memo` — the compiler memoizes automatically.

## Structure

- `src/app/(public)/` — public pages (Home, All Equipment, Equipment Details, About, Contact, How It Works); layout renders shared Navbar + Footer.
- `src/app/(auth)/` — Login/Register with a minimal layout (no navbar/footer).
- `src/app/dashboard/` — role-based dashboards (Customer / Owner / Admin) with their own sidebar layout, full-width, no public footer.
- `src/config/site.ts` — single source of truth for site name, nav links, contact info.
- `src/lib/auth-client.ts` — session hook consumed by the Navbar; currently a stub with the BetterAuth `useSession()` shape. When the Express + BetterAuth server is wired up, replace the stub body only — do not change call sites.

## Conventions

- Auth state always comes from `useSession()` in `src/lib/auth-client.ts`, never from ad-hoc fetches.
- Client keys are env vars prefixed `NEXT_PUBLIC_` (see `.env.example`). Never hardcode API URLs or the Stripe publishable key.
- Icons come from `lucide-react`; animations from `framer-motion` (used in banner, featured equipment, categories, extra sections).
- Keep every route reachable without 404s and reload-safe (private routes must not bounce to login on refresh) — deployment is graded on this.
