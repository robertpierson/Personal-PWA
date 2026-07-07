import type { MetadataRoute } from "next";
import { brand } from "@/content/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/services", "/pricing", "/contact", "/privacy", "/terms"];
  return routes.map((route) => ({
    url: `${brand.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
