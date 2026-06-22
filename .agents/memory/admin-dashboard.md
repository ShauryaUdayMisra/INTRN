---
name: Admin dashboard
description: How the two admin pages differ and where the special-admin gating + analytics live.
---

# Admin dashboard (INTRN)

Two admin routes exist:
- `/admin` → `client/src/pages/admin-page.tsx` — the page the hamburger "Admin Panel" link points to (so this is the one users reach). It has a dedicated always-visible admin top bar (not the site hamburger), recharts analytics, and read-only tabs (Analytics, Applications, Internships, Students, Companies).
- `/admin-backend` → `client/src/pages/admin-backend.tsx` — separate, holds the management mutations + a Statistics tab. Not linked from the hamburger.

**Gating:** both gate on `isSpecialAdmin = ['admin1','admin2','admin3'].includes(user.username)` plus `user.role === 'admin'`. Keep all admin-only changes inside these pages — do NOT alter shared components (e.g. hamburger-navigation) in ways that change non-admin views.

**Internship totals gotcha:** the public `/api/internships` route returns ACTIVE internships only (`getInternships()` filters `isActive=true`). For admin totals/lists that must include inactive internships, use `/api/admin/internships` (→ `storage.getAllInternships()`), not the public route.

**Data source for "who applied to what":** `/api/admin/applications` (→ `getApplicationsWithDetails()`) returns rich joined rows: student fields (name/email/grade/school/skills), internshipTitle/Location, companyId, and a nested `company` object. Use it for all application-centric aggregations.
