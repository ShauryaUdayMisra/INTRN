---
name: Internship images
description: How per-internship images are mapped and the brittleness to watch for.
---

# Internship images (INTRN)

`client/src/lib/internship-images.ts` holds an exact internship-title → imported-image map plus helpers `getInternshipImage(title)` (returns `string | undefined`) and `getTitleGradient(title)` (deterministic gradient fallback). Shared by the internship card, internship-detail page, and landing-page preview cards.

**Why it matters:** The map is keyed by the EXACT seeded title string. If a seed renames an internship title, its image silently disappears.

**How to apply:**
- The card and detail page already fall back gracefully (card shows a gradient tile with the first letter; detail shows a Building icon). When changing seeded titles, update the keys in `internship-images.ts` in lockstep.
- Landing preview cards render the image directly with no fallback, so their two mapped titles ("Research Intern - Social Impact of Sports", "Research & Presentation Specialist") must stay in sync with the seed.
