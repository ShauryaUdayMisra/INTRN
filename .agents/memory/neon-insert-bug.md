---
name: Neon serverless INSERT bug
description: Drizzle + @neondatabase/serverless Pool with poolQueryViaFetch=true throws a JS error on plain INSERT even though the row IS written to DB. Workaround: use execSync(psql) for all INSERTs in seed files.
---

## The rule
When `neonConfig.poolQueryViaFetch = true`, any `db.insert().values()` call (with or without `.returning()`) throws `TypeError: Cannot read properties of null (reading 'map')` in `processQueryResult`. The INSERT **does succeed** in the DB, but Neon's HTTP response processing crashes on the "no rows" result format.

**Why:** Neon's HTTP API returns `rows: null` for a plain INSERT (no RETURNING), and `processQueryResult` assumes rows is always an array. This is a bug in `@neondatabase/serverless`. SELECTs and UPDATEs always return rows arrays and are not affected.

**How to apply:** In all seed files that insert NEW rows (companies, internships, etc.), bypass Drizzle entirely for inserts and use `execSync(psql)` with the `DATABASE_URL`. Then use Drizzle SELECT to get the ID after the insert. Updates and selects work fine with Drizzle.

The pattern:
```typescript
import { execSync } from "child_process";
function psqlExec(sql: string) {
  execSync(`psql "${process.env.DATABASE_URL}" -c ${JSON.stringify(sql)}`, { stdio: "pipe" });
}
// Insert via psql, then SELECT via Drizzle for the ID
psqlExec(`INSERT INTO users (...) VALUES (...) ON CONFLICT (username) DO NOTHING;`);
const [row] = await db.select({ id: users.id }).from(users).where(eq(users.username, username));
```
