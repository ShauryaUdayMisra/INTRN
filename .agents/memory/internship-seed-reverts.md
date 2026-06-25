---
name: Internship data reverts on restart
description: Why manual DB edits to certain internships keep reverting, and where to fix them
---

# Internship seed scripts overwrite manual DB edits

Several internships are re-seeded on EVERY server startup via startup seed functions invoked in `server/routes.ts` (e.g. `seedRipplesInternship`, `seedPreludeInternship`, `seedBirTerracesInternship`, each in `server/seed-*.ts`). Each runs an `UPDATE` against its internship row with hardcoded values.

**Why:** Editing internship rows directly in the DB triggers a workflow restart, the seed re-runs, and the hardcoded values overwrite the manual edit. This made location/duration/description edits appear to "revert" repeatedly.

**How to apply:** To durably change a seeded internship (location, duration, description, etc.), edit BOTH the `.set({...})` (update) block and the `.values({...})` (insert) block in the corresponding `server/seed-*.ts` file — not just the DB. Then restart so the seed applies the new values. Check `server/routes.ts` for the current list of startup seed calls.
