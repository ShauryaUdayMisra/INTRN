---
name: Navigation layout
description: How the landing header and global hamburger nav coexist, and how to avoid the top-right overlap.
---

# Navigation layout (INTRN)

Two navigation systems coexist:
- `client/src/components/hamburger-navigation.tsx` — global. Renders a fixed top-left hamburger button AND fixed top-right auth controls (Sign Up when logged out / avatar dropdown when logged in). Used by landing, search, internship-detail, blog, help, etc.
- The landing page (`client/src/pages/landing-page.tsx`) ALSO renders its own in-flow header with Sign In + Sign Up buttons.

**Rule:** Gate the hamburger nav's floating top-right controls (and the hamburger button) behind the `showHamburger` state. On the landing page `showHamburger` is scroll-gated (false at top, true after scrolling ~100px); on every other page it is true immediately.

**Why:** At the top of the landing page both the page's own header buttons and the global floating Sign Up render in the same top-right corner and visually overlap. Gating by `showHamburger` hides the floating control until the landing header has scrolled away.

**How to apply:** If you add new floating page-level controls in a corner, check whether the landing page already has an in-flow header element there; if so, gate by `showHamburger` or hide on `location === "/"`.

**Also:** fixed top-left hamburger (`top-4 left-4`, ~40px tall) overlaps page headings. Clear it with top padding on the page container (search uses `pt-20`, internship-detail header uses `pt-16`) rather than a left-margin hack.
