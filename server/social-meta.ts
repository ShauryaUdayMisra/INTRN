import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

const SITE_URL = "https://intrn.replit.app";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

function safeDate(value: unknown): string {
  if (!value) return "";
  try {
    const d = new Date(value as string);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "";
  }
}

function safeISODate(value: unknown): string {
  if (!value) return "";
  try {
    const d = new Date(value as string);
    if (isNaN(d.getTime())) return "";
    return d.toISOString();
  } catch {
    return "";
  }
}

function esc(s: string | undefined | null): string {
  if (!s) return "";
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Server-side markdown-to-semantic-HTML renderer (mirrors client/src/pages/blog-post-detail.tsx)
function renderMarkdownToHtml(content: string): string {
  const lines = content.split("\n");
  const html: string[] = [];
  let inUl = false;
  let inOl = false;

  const closeList = () => {
    if (inUl) { html.push("</ul>"); inUl = false; }
    if (inOl) { html.push("</ol>"); inOl = false; }
  };

  const inlineFormat = (text: string): string =>
    esc(text)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      closeList();
      continue;
    }

    if (/^#{1}\s/.test(trimmed)) {
      closeList();
      html.push(`<h2>${inlineFormat(trimmed.replace(/^#\s+/, ""))}</h2>`);
      continue;
    }

    if (/^#{2}\s/.test(trimmed)) {
      closeList();
      html.push(`<h2>${inlineFormat(trimmed.replace(/^#{2}\s+/, ""))}</h2>`);
      continue;
    }

    if (/^#{3}\s/.test(trimmed)) {
      closeList();
      html.push(`<h3>${inlineFormat(trimmed.replace(/^#{3}\s+/, ""))}</h3>`);
      continue;
    }

    if (/^#{4,}\s/.test(trimmed)) {
      closeList();
      html.push(`<h4>${inlineFormat(trimmed.replace(/^#{4,}\s+/, ""))}</h4>`);
      continue;
    }

    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (olMatch) {
      if (inUl) { html.push("</ul>"); inUl = false; }
      if (!inOl) { html.push("<ol>"); inOl = true; }
      html.push(`<li>${inlineFormat(olMatch[2])}</li>`);
      continue;
    }

    if (/^[-*]\s/.test(trimmed)) {
      if (inOl) { html.push("</ol>"); inOl = false; }
      if (!inUl) { html.push("<ul>"); inUl = true; }
      html.push(`<li>${inlineFormat(trimmed.replace(/^[-*]\s+/, ""))}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${inlineFormat(trimmed)}</p>`);
  }

  closeList();
  return html.join("\n");
}

function buildHtml(opts: {
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
  ogTitle?: string;
  ogDescription?: string;
  ldJson?: object;
  body: string;
}): string {
  const t = esc(opts.title);
  const d = esc(opts.description);
  const u = esc(opts.canonical);
  const ogT = esc(opts.ogTitle ?? opts.title);
  const ogD = esc(opts.ogDescription ?? opts.description);
  const ogType = esc(opts.ogType ?? "website");
  const ldBlock = opts.ldJson
    ? `\n  <script type="application/ld+json">${JSON.stringify(opts.ldJson)}</script>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${t}</title>
  <meta name="description" content="${d}" />
  <link rel="canonical" href="${u}" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/favicon.svg" />
  <meta property="og:site_name" content="INTRN" />
  <meta property="og:type" content="${ogType}" />
  <meta property="og:url" content="${u}" />
  <meta property="og:title" content="${ogT}" />
  <meta property="og:description" content="${ogD}" />
  <meta property="og:image" content="${DEFAULT_IMAGE}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${ogT}" />
  <meta name="twitter:description" content="${ogD}" />
  <meta name="twitter:image" content="${DEFAULT_IMAGE}" />${ldBlock}
</head>
<body>
${opts.body}
</body>
</html>`;
}

// --- Route renderers ---

async function renderLanding(): Promise<string> {
  const [internships, stats] = await Promise.all([
    storage.getInternships().catch(() => [] as any[]),
    storage.getStats().catch(() => null),
  ]);

  const featured = (internships as any[]).slice(0, 6);

  const internshipItems = featured
    .map(
      (i: any) => `
    <article>
      <h3><a href="${SITE_URL}/internship/${i.id}">${esc(i.title)}</a></h3>
      <p><strong>Location:</strong> ${esc(i.location)} &mdash; <strong>Type:</strong> ${esc(i.type)}</p>
      ${i.duration ? `<p><strong>Duration:</strong> ${esc(i.duration)}</p>` : ""}
      <p>${esc((i.description ?? "").slice(0, 220))}${(i.description ?? "").length > 220 ? "…" : ""}</p>
      <a href="${SITE_URL}/internship/${i.id}">View Internship &rarr;</a>
    </article>`
    )
    .join("\n");

  const statsBlock = stats
    ? `<section>
      <h2>Platform Highlights</h2>
      <ul>
        <li>${stats.students ?? 0} students registered</li>
        <li>${stats.companies ?? 0} companies partnered</li>
        <li>${stats.internships ?? internships.length} internship opportunities</li>
      </ul>
    </section>`
    : "";

  const body = `
  <header>
    <h1>INTRN — Internships for Highschoolers</h1>
    <p>Find meaningful internship opportunities designed for high school students across South Asia. Gain real-world experience, build skills, and launch your career early.</p>
    <a href="${SITE_URL}/search">Browse All Internships &rarr;</a>
  </header>
  ${statsBlock}
  <main>
    <h2>Featured Internship Opportunities</h2>
    ${internshipItems || "<p>New internships added regularly. Check back soon!</p>"}
  </main>
  <footer>
    <p>INTRN connects high school students with companies offering meaningful, learning-focused internship experiences.</p>
    <nav>
      <a href="${SITE_URL}/search">Search Internships</a> |
      <a href="${SITE_URL}/blog">Career Blog</a> |
      <a href="${SITE_URL}/company-info">For Companies</a> |
      <a href="${SITE_URL}/help">Help</a>
    </nav>
  </footer>`;

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "INTRN",
    url: `${SITE_URL}/`,
    description: "Internship platform for high school students",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return buildHtml({
    title: "INTRN — Internships for Highschoolers",
    description:
      "Find meaningful internship opportunities designed for high school students across South Asia. Gain real-world experience, build skills, and launch your career early.",
    canonical: `${SITE_URL}/`,
    ogTitle: "INTRN — Internships for Highschoolers",
    ogDescription:
      "The leading platform connecting high school students with internship opportunities. Real experience, real learning.",
    ldJson,
    body,
  });
}

async function renderSearch(): Promise<string> {
  const internships = await storage.getInternships().catch(() => [] as any[]);

  const items = (internships as any[])
    .map(
      (i: any) => `
    <article>
      <h2><a href="${SITE_URL}/internship/${i.id}">${esc(i.title)}</a></h2>
      <p><strong>Location:</strong> ${esc(i.location)} &mdash; <strong>Type:</strong> ${esc(i.type)}</p>
      ${i.duration ? `<p><strong>Duration:</strong> ${esc(i.duration)}</p>` : ""}
      <p>${esc((i.description ?? "").slice(0, 250))}${(i.description ?? "").length > 250 ? "…" : ""}</p>
      ${
        Array.isArray(i.skills) && i.skills.length
          ? `<p><strong>Skills:</strong> ${(i.skills as string[]).map(esc).join(", ")}</p>`
          : ""
      }
      <a href="${SITE_URL}/internship/${i.id}">View &amp; Apply &rarr;</a>
    </article>`
    )
    .join("\n");

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "High School Internship Listings",
    url: `${SITE_URL}/search`,
    numberOfItems: (internships as any[]).length,
    itemListElement: (internships as any[]).slice(0, 20).map((i: any, idx: number) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${SITE_URL}/internship/${i.id}`,
      name: i.title,
    })),
  };

  const body = `
  <header>
    <h1>Search Internships for High School Students</h1>
    <p>Browse ${(internships as any[]).length} internship opportunities available on INTRN. Filter by field, location, and duration to find the perfect fit.</p>
  </header>
  <main>
    ${items || "<p>No internships found. Check back soon for new opportunities.</p>"}
  </main>
  <nav>
    <a href="${SITE_URL}/">Home</a> |
    <a href="${SITE_URL}/blog">Career Blog</a> |
    <a href="${SITE_URL}/company-info">For Companies</a>
  </nav>`;

  return buildHtml({
    title: "Search Internships — INTRN",
    description: `Browse ${(internships as any[]).length} internship opportunities for high school students. Search by field, location, and duration to find the perfect fit.`,
    canonical: `${SITE_URL}/search`,
    ldJson,
    body,
  });
}

async function renderInternshipDetail(id: string): Promise<string | null> {
  const internship = await storage.getInternship(Number(id)).catch(() => undefined);
  // Return null for non-existent or inactive internships — crawler sees 404 or falls through
  if (!internship || !internship.isActive) return null;

  const company = await storage.getUser(internship.companyId).catch(() => undefined);
  const companyName = company?.companyName ?? "Company";
  const isRemote = internship.type === "remote" || internship.type === "online";

  const ldJson: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: internship.title,
    description: internship.description,
    datePosted: internship.createdAt,
    employmentType: "INTERN",
    ...(Array.isArray(internship.skills) && internship.skills.length && {
      skills: (internship.skills as string[]).join(", "),
    }),
    hiringOrganization: {
      "@type": "Organization",
      name: companyName,
      ...(company?.website && { sameAs: company.website }),
    },
    ...(isRemote && { jobLocationType: "TELECOMMUTE" }),
    ...(internship.location && {
      jobLocation: {
        "@type": "Place",
        address: { "@type": "PostalAddress", addressLocality: internship.location },
      },
    }),
  };

  const skillsBlock =
    Array.isArray(internship.skills) && internship.skills.length
      ? `<p><strong>Skills:</strong> ${(internship.skills as string[]).map(esc).join(", ")}</p>`
      : "";

  const body = `
  <header>
    <h1>${esc(internship.title)}</h1>
    <p><strong>${esc(companyName)}</strong> &mdash; ${esc(internship.location)}</p>
    <p><strong>Type:</strong> ${esc(internship.type)}${internship.duration ? ` &mdash; <strong>Duration:</strong> ${esc(internship.duration)}` : ""}</p>
    ${company?.companyField ? `<p><strong>Field:</strong> ${esc(company.companyField)}</p>` : ""}
  </header>
  <main>
    <section>
      <h2>About This Internship</h2>
      <p>${esc(internship.description).replace(/\n/g, "<br />")}</p>
    </section>
    ${
      internship.requirements
        ? `<section>
      <h2>Requirements &amp; Skills</h2>
      <p>${esc(internship.requirements)}</p>
      ${skillsBlock}
    </section>`
        : ""
    }
    ${
      company
        ? `<section>
      <h2>About ${esc(companyName)}</h2>
      ${company.companyField ? `<p><strong>Industry:</strong> ${esc(company.companyField)}</p>` : ""}
      ${company.location ? `<p><strong>Location:</strong> ${esc(company.location)}</p>` : ""}
      ${company.website ? `<p><strong>Website:</strong> <a href="${esc(company.website)}" rel="noopener noreferrer">${esc(company.website)}</a></p>` : ""}
    </section>`
        : ""
    }
    <section>
      <h2>How to Apply</h2>
      <p>Create a free student account on INTRN to apply for this internship. It only takes a minute.</p>
      <a href="${SITE_URL}/auth?tab=register">Sign Up &amp; Apply &rarr;</a>
    </section>
  </main>
  <nav>
    <a href="${SITE_URL}/search">Browse All Internships</a> |
    <a href="${SITE_URL}/">Home</a>
  </nav>`;

  const loc = internship.location ? ` in ${internship.location}` : "";
  return buildHtml({
    title: `${internship.title} Internship — INTRN`,
    description: `Apply for the ${internship.title} internship${loc}. Designed for high school students on INTRN.`,
    canonical: `${SITE_URL}/internship/${internship.id}`,
    ldJson,
    body,
  });
}

async function renderBlog(): Promise<string> {
  // Only fetch published posts to match sitemap and public listing behaviour
  const posts = await storage.getBlogPosts(true).catch(() => [] as any[]);

  const items = (posts as any[])
    .map(
      (p: any) => {
        const isoDate = safeISODate(p.createdAt);
        const humanDate = safeDate(p.createdAt);
        return `
    <article>
      <h2><a href="${SITE_URL}/blog/${esc(p.slug)}">${esc(p.title)}</a></h2>
      ${p.category ? `<p><strong>Category:</strong> ${esc(p.category)}</p>` : ""}
      ${p.excerpt ? `<p>${esc(p.excerpt)}</p>` : ""}
      ${isoDate ? `<p><time datetime="${isoDate}">${humanDate}</time></p>` : ""}
      <a href="${SITE_URL}/blog/${esc(p.slug)}">Read Article &rarr;</a>
    </article>`;
      }
    )
    .join("\n");

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "INTRN Career Blog",
    url: `${SITE_URL}/blog`,
    description: "Career advice and insights for high school students pursuing internships.",
    blogPost: (posts as any[]).slice(0, 10).map((p: any) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      description: p.excerpt ?? "",
      datePublished: safeISODate(p.createdAt) || undefined,
    })),
  };

  const body = `
  <header>
    <h1>Career Insights &amp; Advice — INTRN Blog</h1>
    <p>Expert guidance, industry insights, and success stories to help you navigate your internship journey.</p>
  </header>
  <main>
    ${items || "<p>Career articles coming soon. Check back for expert advice on internships and career development.</p>"}
  </main>
  <nav>
    <a href="${SITE_URL}/">Home</a> |
    <a href="${SITE_URL}/search">Browse Internships</a>
  </nav>`;

  return buildHtml({
    title: "Career Insights & Advice — INTRN Blog",
    description:
      "Read expert career advice for high school students. Tips on internships, skill-building, and launching your career early.",
    canonical: `${SITE_URL}/blog`,
    ldJson,
    body,
  });
}

async function renderBlogPost(slug: string): Promise<string | null> {
  const post = await storage.getBlogPostBySlug(slug).catch(() => undefined);
  // Reject non-existent or unpublished posts — do not expose draft content to crawlers
  if (!post || !post.published) return null;

  const isoDate = safeISODate(post.createdAt);
  const humanDate = safeDate(post.createdAt);
  const isoModified = safeISODate(post.updatedAt ?? post.createdAt);

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? "",
    ...(isoDate && { datePublished: isoDate }),
    ...(isoModified && { dateModified: isoModified }),
    articleSection: post.category,
    keywords: Array.isArray(post.tags) ? (post.tags as string[]).join(", ") : (post.tags ?? ""),
    author: { "@type": "Organization", name: "INTRN Editorial Team" },
    publisher: { "@type": "Organization", name: "INTRN" },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    url: `${SITE_URL}/blog/${post.slug}`,
  };

  const tagsBlock =
    Array.isArray(post.tags) && (post.tags as string[]).length
      ? `<p><strong>Tags:</strong> ${(post.tags as string[]).map(esc).join(", ")}</p>`
      : "";

  // Render content as semantic HTML using shared markdown renderer
  const articleBody = renderMarkdownToHtml(post.content ?? "");

  const body = `
  <header>
    <h1>${esc(post.title)}</h1>
    ${post.excerpt ? `<p>${esc(post.excerpt)}</p>` : ""}
    <p>By INTRN Editorial Team${humanDate ? ` &mdash; <time datetime="${isoDate}">${humanDate}</time>` : ""}</p>
    ${post.category ? `<p>Category: ${esc(post.category)}</p>` : ""}
  </header>
  <main>
    <article>
      ${articleBody}
    </article>
    ${tagsBlock}
  </main>
  <nav>
    <a href="${SITE_URL}/blog">Back to Blog</a> |
    <a href="${SITE_URL}/search">Browse Internships</a> |
    <a href="${SITE_URL}/">Home</a>
  </nav>`;

  return buildHtml({
    title: `${post.title} — INTRN Blog`,
    description: post.excerpt ?? "Career advice for high school students on INTRN.",
    canonical: `${SITE_URL}/blog/${post.slug}`,
    ogType: "article",
    ldJson,
    body,
  });
}

function renderCompanyInfo(): string {
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Partner with INTRN — Post Internships for High School Students",
    url: `${SITE_URL}/company-info`,
    description:
      "Connect your company with motivated high school students. Post internship opportunities and find talented young professionals on INTRN.",
  };

  const body = `
  <header>
    <h1>Partner with INTRN — Post Internships for High School Students</h1>
    <p>Connect your company with motivated high school students. Find talented young professionals eager to learn and contribute.</p>
  </header>
  <main>
    <section>
      <h2>Why Partner with INTRN?</h2>
      <ul>
        <li>Access a curated pool of motivated high school students ready to learn</li>
        <li>Support youth career development and give back to the community</li>
        <li>Simple onboarding — list your internship in minutes after approval</li>
        <li>Flexible formats: remote, on-site, or hybrid internships supported</li>
      </ul>
    </section>
    <section>
      <h2>How It Works</h2>
      <ol>
        <li>Submit your company information through our application form</li>
        <li>Our team reviews and approves your company profile</li>
        <li>Create and publish your internship listings on the platform</li>
        <li>Receive applications from qualified high school students</li>
      </ol>
    </section>
    <section>
      <h2>Get Started</h2>
      <p>Ready to connect with the next generation of talent? Apply to partner with INTRN today.</p>
      <a href="${SITE_URL}/company-signup">Apply to Partner &rarr;</a>
    </section>
  </main>
  <nav>
    <a href="${SITE_URL}/">Home</a> |
    <a href="${SITE_URL}/search">Browse Internships</a>
  </nav>`;

  return buildHtml({
    title: "Partner with INTRN — Post Internships for High School Students",
    description:
      "Connect your company with motivated high school students. Post internship opportunities and find talented young professionals on INTRN.",
    canonical: `${SITE_URL}/company-info`,
    ldJson,
    body,
  });
}

function renderHelp(): string {
  // FAQ entries — keep in sync with visible body copy below
  const faqs = [
    {
      question: "How do I create an account?",
      answer:
        'Click "Sign Up" on the homepage and select "Student" as your role. Fill in your details including your grade, school name, and areas of interest.',
    },
    {
      question: "How do I apply for an internship?",
      answer:
        'Browse internships on the search page, click on one that interests you, and click "Apply for This Internship". You must be logged in as a student to apply.',
    },
    {
      question: "Are the internships paid?",
      answer:
        "INTRN focuses on learning-based, unpaid internships that provide valuable real-world experience for high school students. The focus is on skill development and mentorship.",
    },
    {
      question: "Can I apply for multiple internships?",
      answer: "Yes, you can apply for multiple internship opportunities at the same time.",
    },
    {
      question: "What grades are eligible?",
      answer:
        "INTRN is open to students in 9th through 12th grade (high school). College students are not currently eligible.",
    },
    {
      question: "How do I post an internship?",
      answer:
        "Apply to become a company partner on the Company Info page. Once your account is approved by our team, you can create and manage internship listings from your dashboard.",
    },
    {
      question: "What types of internships can I post?",
      answer:
        "You can post remote, on-site, or hybrid internships. All internships must be appropriate for high school students and focused on learning and skill development.",
    },
    {
      question: "Is there a cost to post internships?",
      answer:
        "INTRN is currently free for companies to use. We believe in making youth career development accessible.",
    },
  ];

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const body = `
  <header>
    <h1>Help &amp; Support — INTRN</h1>
    <p>Find answers to common questions about using INTRN as a student or company.</p>
  </header>
  <main>
    <section>
      <h2>For Students</h2>
      <h3>How do I create an account?</h3>
      <p>Click "Sign Up" on the homepage and select "Student" as your role. Fill in your details including your grade, school name, and areas of interest.</p>
      <h3>How do I apply for an internship?</h3>
      <p>Browse internships on the search page, click on one that interests you, and click "Apply for This Internship". You must be logged in as a student to apply.</p>
      <h3>Are the internships paid?</h3>
      <p>INTRN focuses on learning-based, unpaid internships that provide valuable real-world experience for high school students. The focus is on skill development and mentorship.</p>
      <h3>Can I apply for multiple internships?</h3>
      <p>Yes, you can apply for multiple internship opportunities at the same time.</p>
      <h3>What grades are eligible?</h3>
      <p>INTRN is open to students in 9th through 12th grade (high school). College students are not currently eligible.</p>
    </section>
    <section>
      <h2>For Companies</h2>
      <h3>How do I post an internship?</h3>
      <p>Apply to become a company partner on the Company Info page. Once your account is approved by our team, you can create and manage internship listings from your dashboard.</p>
      <h3>What types of internships can I post?</h3>
      <p>You can post remote, on-site, or hybrid internships. All internships must be appropriate for high school students and focused on learning and skill development.</p>
      <h3>Is there a cost to post internships?</h3>
      <p>INTRN is currently free for companies to use. We believe in making youth career development accessible.</p>
    </section>
  </main>
  <nav>
    <a href="${SITE_URL}/">Home</a> |
    <a href="${SITE_URL}/search">Browse Internships</a> |
    <a href="${SITE_URL}/blog">Career Blog</a>
  </nav>`;

  return buildHtml({
    title: "Help & Support — INTRN",
    description:
      "Find answers to common questions about INTRN — the internship platform for high school students. Learn how to apply, create an account, and more.",
    canonical: `${SITE_URL}/help`,
    ldJson,
    body,
  });
}

// --- Middleware ---

// Named crawlers (search engines, AI, social-unfurl, SEO tools)
const KNOWN_BOTS_UA =
  /googlebot|google-inspectiontool|google-extended|bingbot|yandexbot|duckduckbot|baiduspider|slurp|applebot|twitterbot|facebookexternalhit|linkedinbot|whatsapp|telegrambot|discordbot|slackbot|slack-imgproxy|pinterest|imessagelinkbot|gptbot|chatgpt-user|claudebot|anthropic-ai|perplexitybot|cohere-ai|ccbot|ia_archiver|semrushbot|ahrefsbot|dotbot|rogerbot|proximic|mj12bot|pinterestbot|bytespider/i;

// Generic bot signals: catch any unlisted crawler without matching real browsers.
// Real browsers always identify themselves with "Mozilla" plus a browser engine
// marker (Chrome, Safari, Firefox, Edg, OPR). Anything lacking those is treated
// as a non-rendering requester and receives server-side metadata.
const BROWSER_UA = /mozilla.*(chrome|safari|firefox|edg\/|edg[ea]|opr\/|opera)/i;

function isBot(ua: string | undefined): boolean {
  if (!ua) return true; // no UA → likely a programmatic/headless requester
  if (KNOWN_BOTS_UA.test(ua)) return true;
  // Catch any UA that advertises "bot", "crawler", "spider", "fetcher",
  // "archiver", or "preview" in its string (covers most unlisted crawlers)
  if (/bot|crawler|spider|fetcher|archiver|preview|scraper/i.test(ua)) return true;
  // Catch non-browser runtimes: curl, wget, Python, Java, Go, Node, etc.
  if (/^(curl|wget|python|java|go-http|node-fetch|axios|got|ruby|php)/i.test(ua)) return true;
  // If the UA doesn't look like a real browser, treat it as a bot
  if (!BROWSER_UA.test(ua)) return true;
  return false;
}

export async function socialMetaMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const pathname = req.path;

  // Skip API routes, Vite internals, and static assets
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/@") ||
    pathname.startsWith("/__") ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return next();
  }

  // Only handle bot/crawler requests — real browsers get the full SPA with
  // client-side SEO via use-seo.ts. The isBot() check is intentionally broad
  // so unlisted AI crawlers and future search bots receive correct metadata.
  if (!isBot(req.headers["user-agent"])) {
    return next();
  }

  try {
    let html: string | null = null;

    if (pathname === "/" || pathname === "") {
      html = await renderLanding();
    } else if (pathname === "/search") {
      html = await renderSearch();
    } else if (pathname === "/blog") {
      html = await renderBlog();
    } else if (pathname === "/company-info") {
      html = renderCompanyInfo();
    } else if (pathname === "/help") {
      html = renderHelp();
    } else {
      const internshipMatch = pathname.match(/^\/internship\/(\d+)$/);
      if (internshipMatch) {
        html = await renderInternshipDetail(internshipMatch[1]);
      } else {
        const blogMatch = pathname.match(/^\/blog\/([^/]+)$/);
        if (blogMatch) {
          html = await renderBlogPost(decodeURIComponent(blogMatch[1]));
        }
      }
    }

    if (html) {
      res.status(200).set({ "Content-Type": "text/html; charset=utf-8" }).end(html);
      return;
    }
  } catch (err) {
    console.error("[social-meta] Error rendering bot response:", err);
  }

  return next();
}
