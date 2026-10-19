import type { Metadata, Viewport } from "next";
import { Caveat, Figtree, Manrope, Noto_Sans_Armenian, Unbounded } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { ServiceWorker } from "@/components/ServiceWorker";
import "./globals.css";

const unbounded = Unbounded({ subsets: ["latin", "cyrillic"], weight: ["500", "700", "800"], variable: "--font-unbounded" });
const figtree = Figtree({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-figtree" });
// Figtree has no Cyrillic, and neither display font has Armenian: these fill the gaps.
const manrope = Manrope({ subsets: ["cyrillic"], weight: ["400", "500", "600", "700"], variable: "--font-manrope" });
const armenian = Noto_Sans_Armenian({ subsets: ["armenian"], weight: ["400", "500", "600", "700", "800"], variable: "--font-armenian" });
const caveat = Caveat({ subsets: ["latin", "cyrillic"], weight: ["600"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: "Unloop",
  description: "Spin a challenge, go do it with your crew, keep the proof.",
  applicationName: "Unloop",
  appleWebApp: { capable: true, title: "Unloop", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#131210",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body className={`${unbounded.variable} ${figtree.variable} ${manrope.variable} ${armenian.variable} ${caveat.variable} antialiased`}>
        <NextIntlClientProvider>
          <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">{children}</div>
        </NextIntlClientProvider>
        <ServiceWorker />
      </body>
    </html>
  );
}
