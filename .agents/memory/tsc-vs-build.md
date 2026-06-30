---
name: tsc errors are pre-existing, build is the real gate
description: This repo has long-standing tsc --noEmit errors that do NOT block the dev server or production build.
---

# tsc --noEmit reports pre-existing errors that do not block builds

Running `npx tsc --noEmit` surfaces several long-standing errors that exist
independent of any current change, mainly in:
- `server/storage.ts` (Drizzle insert/where overload + `session.SessionStore` typings)
- `server/replitAuth.ts`
- `server/seed-new-companies.ts`
- `client/src/pages/internship-detail.tsx` — a local `type Internship` that omits
  `"online"`/`"remote"`, so the `isRemote` comparison flags TS2367.

**Why:** Dev runs via `tsx` and the production build via Vite/esbuild — neither does
strict type-checking, so these errors never break running or shipping the app.

**How to apply:** After a frontend change, don't treat a non-zero `tsc` exit as a
regression. Confirm your *own* edits produce no new errors (grep the tsc output for
your new symbols/files); ignore the pre-existing backend/detail-page noise. Use
`npm run build` (or successful Vite HMR) as the real correctness gate.
