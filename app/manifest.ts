import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Siforma — Calendário de Marketing",
    short_name: "Siforma Calendário",
    description: "Calendário editorial, tarefas e metas de marketing da Siforma.",
    start_url: "/",
    display: "standalone",
    background_color: "#0e0f11",
    theme_color: "#68a04a",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
