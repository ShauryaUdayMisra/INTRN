import { useEffect } from "react";

interface SeoOptions {
  title: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  noIndex?: boolean;
}

export function useSeo({ title, description, ogTitle, ogDescription, ogType = "website", noIndex = false }: SeoOptions) {
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

    if (description) setMeta("description", description);
    if (ogTitle ?? title) setMeta("og:title", ogTitle ?? title, true);
    if (ogDescription ?? description) setMeta("og:description", ogDescription ?? description ?? "", true);
    setMeta("og:type", ogType, true);
    if (noIndex) setMeta("robots", "noindex");

    return () => {
      document.title = "INTRN — Internships for Highschoolers";
    };
  }, [title, description, ogTitle, ogDescription, ogType, noIndex]);
}
