import type { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { storage } from "./storage";

const SITE_URL = "https://intrn.replit.app";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

// Only true social-unfurl bots — NOT search crawlers (Googlebot, bingbot, etc.)
// Search crawlers are handled via the full SPA HTML path with injected metadata
const SOCIAL_UNFURL_BOT_UA = /Twitterbot|facebookexternalhit|LinkedInBot|Slackbot|Slack-ImgProxy|WhatsApp|TelegramBot|Discordbot|Pinterest|iMessageLinkBot/i;

function esc(s: string | undefined | null): string {
  if (!s) return "";
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

interface RouteMeta {
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
}

function buildMinimalHtml(m: RouteMeta): string {
  const t = esc(m.title), d = esc(m.description), u = esc(m.canonical), img = DEFAULT_IMAGE;
  const ogType = esc(m.ogType ?? "website");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${t}</title>
<meta name="description" content="${d}"/>
<link rel="canonical" href="${u}"/>
<meta property="og:site_name" content="INTRN"/>
<meta property="og:type" content="${ogType}"/>
<meta property="og:url" content="${u}"/>
<meta property="og:title" content="${t}"/>
<meta property="og:description" content="${d}"/>
<meta property="og:image" content="${img}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${t}"/>
<meta name="twitter:description" content="${d}"/>
<meta name="twitter:image" content="${img}"/>
</head>
<body><p>${t}</p><p>${d}</p></body>
</html>`;
}

function injectMetaIntoSpaHtml(html: string, m: RouteMeta): string {
  const t = esc(m.title), d = esc(m.description), u = esc(m.canonical), img = DEFAULT_IMAGE;
  const ogType = esc(m.ogType ?? "website");
  // Remove placeholder tags injected by the static shell
  let out = html
    .replace(/<title>[^<]*<\/title>/i, "")
    .replace(/<meta\s+name="description"[^>]*>/i, "")
    .replace(/<link\s+rel="canonical"[^>]*>/i, "")
    .replace(/<!--[^>]*canonical[^>]*-->/ig, "")
    .replace(/<meta\s+property="og:[^>]*>/ig, "")
    .replace(/<meta\s+name="twitter:[^>]*>/ig, "")
    .replace(/<meta\s+name="twitter:card"[^>]*>/ig, "");
  // Inject route-specific tags right before </head>
  const injection = `
  <title>${t}</title>
  <meta name="description" content="${d}"/>
  <link rel="canonical" href="${u}"/>
  <meta property="og:site_name" content="INTRN"/>
  <meta property="og:type" content="${ogType}"/>
  <meta property="og:url" content="${u}"/>
  <meta property="og:title" content="${t}"/>
  <meta property="og:description" content="${d}"/>
  <meta property="og:image" content="${img}"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${t}"/>
  <meta name="twitter:description" content="${d}"/>
  <meta name="twitter:image" content="${img}"/>`;
  return out.replace(/(<\/head>)/i, injection + "\n$1");
}

function readSpaHtml(): string | null {
  // Try production build first, then dev source
  const candidates = [
    path.resolve(process.cwd(), "server", "public", "index.html"),
    path.resolve(process.cwd(), "dist", "public", "index.html"),
    path.resolve(process.cwd(), "client", "index.html"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return fs.readFileSync(p, "utf-8");
  }
  return null;
}

async function resolveRouteMeta(pathname: string): Promise<RouteMeta | null> {
  if (pathname === "/" || pathname === "") {
    return {
      title: "INTRN — Internships for Highschoolers",
      description: "Find meaningful internship opportunities designed for high school students. Gain real-world experience, build skills, and launch your career early.",
      canonical: `${SITE_URL}/`,
    };
  }
  if (pathname === "/search") {
    return {
      title: "Search Internships — INTRN",
      description: "Browse and filter internship opportunities for high school students. Search by field, location, and duration to find the perfect fit.",
      canonical: `${SITE_URL}/search`,
    };
  }
  if (pathname === "/blog") {
    return {
      title: "Career Insights & Advice — INTRN Blog",
      description: "Read expert career advice for high school students. Tips on internships, skill-building, and launching your career early.",
      canonical: `${SITE_URL}/blog`,
    };
  }
  if (pathname === "/company-info") {
    return {
      title: "Partner With Us — INTRN for Companies",
      description: "Learn how to post internship opportunities for high school students on INTRN. Connect with motivated young talent.",
      canonical: `${SITE_URL}/company-info`,
    };
  }
  if (pathname === "/help") {
    return {
      title: "Help & Support — INTRN",
      description: "Get help with your INTRN account, internship applications, and more. Contact our support team or browse common questions.",
      canonical: `${SITE_URL}/help`,
    };
  }
  const blogMatch = pathname.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    try {
      const post = await storage.getBlogPostBySlug(blogMatch[1]);
      if (post) {
        return {
          title: `${post.title} — INTRN Blog`,
          description: post.excerpt ?? "Career advice for high school students on INTRN.",
          canonical: `${SITE_URL}/blog/${post.slug}`,
          ogType: "article",
        };
      }
    } catch { /* fall through */ }
    return {
      title: "INTRN Blog",
      description: "Career advice for high school students on INTRN.",
      canonical: `${SITE_URL}/blog`,
      ogType: "article",
    };
  }
  const internshipMatch = pathname.match(/^\/internship\/(\d+)$/);
  if (internshipMatch) {
    try {
      const internship = await storage.getInternship(parseInt(internshipMatch[1], 10));
      if (internship) {
        const loc = internship.location ? ` in ${internship.location}` : "";
        return {
          title: `${internship.title} Internship — INTRN`,
          description: `Apply for the ${internship.title} internship${loc}. Designed for high school students on INTRN.`,
          canonical: `${SITE_URL}/internship/${internship.id}`,
        };
      }
    } catch { /* fall through */ }
    return {
      title: "Internship — INTRN",
      description: "Find internship opportunities for high school students on INTRN.",
      canonical: `${SITE_URL}/search`,
    };
  }
  return null;
}

export async function socialMetaMiddleware(req: Request, res: Response, next: NextFunction) {
  const path = req.path;

  // Skip API calls, Vite internals, and static assets
  if (
    path.startsWith("/api/") ||
    path.startsWith("/auth/") ||
    path.startsWith("/@") ||
    path.startsWith("/__") ||
    /\.[a-zA-Z0-9]+$/.test(path)
  ) {
    return next();
  }

  try {
    const meta = await resolveRouteMeta(path);
    if (!meta) return next();

    const ua = req.headers["user-agent"] ?? "";

    if (SOCIAL_UNFURL_BOT_UA.test(ua)) {
      // Social bots: serve minimal HTML (no app JS needed for unfurling)
      return res.set("Content-Type", "text/html").send(buildMinimalHtml(meta));
    }

    // All other requests (regular users, search crawlers): serve full SPA HTML
    // with route-specific metadata injected into <head>
    const spaHtml = readSpaHtml();
    if (spaHtml) {
      const injected = injectMetaIntoSpaHtml(spaHtml, meta);
      return res.set("Content-Type", "text/html").send(injected);
    }
  } catch (err) {
    // On any error fall through to normal handling
  }

  return next();
}
