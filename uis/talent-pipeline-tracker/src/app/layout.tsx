import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talent Pipeline | TrackFlow",
  description: "TrackFlow People & Talent candidate management",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <header className="site-header">
          <div className="shell header-inner">
            <Link className="brand" href="/">Track<span>Flow</span></Link>
            <span className="workspace">People &amp; Talent</span>
          </div>
        </header>
        <main className="shell main" id="main">{children}</main>
      </body>
    </html>
  );
}
