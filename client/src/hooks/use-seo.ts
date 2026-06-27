import { useEffect } from "react";

const SITE_URL = "https://intrn.replit.app";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

interface SeoOptions {
  title: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  ogUrl?: string;
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  noIndex?: boolean;
}

const DEFAULT_TITLE = "INTRN — Internships for Highschoolers";
const DEFAULT_DESCRIPTION = "Find meaningful internship opportunities designed for high school students. Gain real-world experience and build your skills.";
const DEFAULT_CANONICAL = `${SITE_URL}/`;

export function useSeo({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogType = "website",
  ogUrl,
  ogImage = DEFAULT_OG_IMAGE,
  twitterCard = "summary_large_image",
  twitterTitle,
  twitterDescription,
  twitterImage,
  noIndex = false,
}: SeoOptions) {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const removeMeta = (name: string, property = false) => {
      const attr = property ? "property" : "name";
      const el = document.querySelector(`meta[${attr}="${name}"]`);
      if (el) el.remove();
    };

    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement("link");
        el.rel = rel;
        document.head.appendChild(el);
      }
      el.href = href;
    };

    const resolvedOgTitle = ogTitle ?? title;
    const resolvedOgDescription = ogDescription ?? description ?? DEFAULT_DESCRIPTION;
    const resolvedOgUrl = ogUrl ?? canonical ?? `${SITE_URL}${window.location.pathname}`;
    const resolvedCanonical = canonical ?? resolvedOgUrl;

    if (description) setMeta("description", description);

    setMeta("og:title", resolvedOgTitle, true);
    setMeta("og:description", resolvedOgDescription, true);
    setMeta("og:type", ogType, true);
    setMeta("og:url", resolvedOgUrl, true);
    setMeta("og:image", ogImage, true);
    setMeta("og:site_name", "INTRN", true);

    setMeta("twitter:card", twitterCard);
    setMeta("twitter:title", twitterTitle ?? resolvedOgTitle);
    setMeta("twitter:description", twitterDescription ?? resolvedOgDescription);
    setMeta("twitter:image", twitterImage ?? ogImage);

    setLink("canonical", resolvedCanonical);

    if (noIndex) {
      setMeta("robots", "noindex");
    } else {
      removeMeta("robots");
    }

    return () => {
      // Reset to site defaults on unmount so no state bleeds into the next route
      document.title = DEFAULT_TITLE;
      setMeta("description", DEFAULT_DESCRIPTION);
      setMeta("og:title", DEFAULT_TITLE, true);
      setMeta("og:description", DEFAULT_DESCRIPTION, true);
      setMeta("og:type", "website", true);
      setMeta("og:url", DEFAULT_CANONICAL, true);
      setMeta("og:image", DEFAULT_OG_IMAGE, true);
      setMeta("twitter:card", "summary_large_image");
      setMeta("twitter:title", DEFAULT_TITLE);
      setMeta("twitter:description", DEFAULT_DESCRIPTION);
      setMeta("twitter:image", DEFAULT_OG_IMAGE);
      setLink("canonical", DEFAULT_CANONICAL);
      removeMeta("robots");
    };
  }, [title, description, canonical, ogTitle, ogDescription, ogType, ogUrl, ogImage, twitterCard, twitterTitle, twitterDescription, twitterImage, noIndex]);
}
