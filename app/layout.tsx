import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Deborah Kitay, LMFT | Depth-Oriented Therapy",
  description:
    "Collaborative, non-pathologizing therapy. Narrative Therapy, EMDR, and menopause-informed mental health. El Segundo, CA + Telehealth.",
  openGraph: {
    title: "Deborah Kitay, LMFT | Depth-Oriented Therapy",
    description:
      "Collaborative, non-pathologizing therapy. El Segundo, CA + Telehealth.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-body">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=EB+Garamond:ital@0;1&family=Inter:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased bg-[var(--color-paper)] text-[var(--color-charcoal)]">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navigation />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
