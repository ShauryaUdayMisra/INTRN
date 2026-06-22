---
name: Seed title lookups & dev auto-restart
description: Why renaming seeded internships can silently create duplicate DB rows
---

# Seeded records are keyed by title, and the dev server re-seeds on file save

The internship seed files (`server/seed-*.ts`) find existing rows with
`where(eq(internships.title, "..."))`. If no row matches, they fall through to an
INSERT path and create a new row.

**The trap:** the `npm run dev` workflow runs under `tsx` and restarts the server
whenever a `server/*.ts` file is saved. Seeds run on every boot. So if you change
a seed file's lookup title to a NEW name *before* the existing DB row has that new
name, the lookup misses, the INSERT path runs, and you get a duplicate internship.

**How to apply (renaming a seeded internship safely):**
1. First `UPDATE` the existing DB rows to the new title (and location, etc.).
2. Then edit the seed file so its lookup title AND its insert/update values match
   the new title.
3. If duplicates already appeared, delete the extra rows by id.

**Why:** seeds are idempotent only when the lookup key matches what's already in
the DB. The seed key is the title string, so title and DB must move together.

Note: two internships (Wisdom Tree School "Content Writing & Editorial..." and the
"INTRN Platform" listing) exist ONLY in the DB — no seed file — so SQL edits to
them are permanent and won't be reverted on restart.
