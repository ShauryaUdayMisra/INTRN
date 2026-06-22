---
name: Admin-only application fields must be stripped from student/company API
description: Why adminStatus (admin organisation status) must never reach the student-facing /api/applications response
---

# Admin-only application metadata is student-safe only if stripped at the API layer

The applications table has an `adminStatus` column (pending/confirmed/completed) used purely for
admin-side organisation. It is separate from `status` (pending/reviewed/accepted/rejected), which IS
student-facing and triggers acceptance emails on "accepted".

**Rule:** any admin-only column added to the `applications` table leaks to students/companies unless
the non-admin read route (`GET /api/applications`, which uses `storage.getApplications()` selecting the
raw row) explicitly strips it. Stripping is done in the route by mapping out the field before `res.json`.

**Why:** "not shown in the admin-built UI" is not the same as "not in the payload." A student can read
the raw JSON. The requirement was that adminStatus must never reflect to students, so UI omission alone
is insufficient — it must be removed server-side.

**How to apply:** when adding any internal/admin field to a shared table, either (a) use a sanitized
select for non-admin reads, or (b) strip the field in the non-admin route. Note `confirmationToken`,
`confirmed`, `confirmedAt` are also internal fields on the same table that currently still flow through
that endpoint (pre-existing).
