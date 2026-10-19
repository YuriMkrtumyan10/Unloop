import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Unloop",
    short_name: "Unloop",
    description: "Spin a challenge, go do it with your crew, keep the proof.",
    start_url: "/",
    display: "standalone",
    background_color: "#131210",
    theme_color: "#131210",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
