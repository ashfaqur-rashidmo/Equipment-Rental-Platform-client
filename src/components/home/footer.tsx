"use client";

import { useLayoutEffect, useRef } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  FacebookLogo,
  LinkedInLogo,
  XLogo,
  YouTubeLogo,
} from "@/components/brand-icons";

const categoryLinks = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

const socials = [
  { label: "X (Twitter)", href: "https://x.com", icon: XLogo },
  { label: "Facebook", href: "https://facebook.com", icon: FacebookLogo },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedInLogo },
  { label: "YouTube", href: "https://youtube.com", icon: YouTubeLogo },
];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  // Share the footer's measured height with the dashboard sidebar: the
  // sidebar then stops right where the footer begins, so the footer
  // connects with the sidebar's bottom corner instead of being overlapped.
  useLayoutEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const syncFooterHeight = () => {
      document.documentElement.style.setProperty(
        "--footer-height",
        `${el.offsetHeight}px`
      );
    };

    syncFooterHeight();
    window.addEventListener("resize", syncFooterHeight);

    return () =>
      window.removeEventListener("resize", syncFooterHeight);
  }, []);

  return (
    <footer ref={footerRef} className="bg-neutral text-neutral-content">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-content">
                {/* Forklift icon is client-side in the navbar; keep footer server-rendered with a static SVG */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden
                >
                  <path d="M12 2h8" />
                  <path d="M18 2v5" />
                  <path d="M20 16a2 2 0 1 0-4 0" />
                  <path d="M4 8h9" />
                  <path d="M4 16v-5a1 1 0 0 1 1-1h1.5a1 1 0 0 1 1 1v5" />
                  <path d="M17.5 8h1a1.5 1.5 0 0 1 1.5 1.5V14" />
                  <circle cx="6" cy="18" r="2" />
                  <circle cx="12" cy="18" r="2" />
                  <path d="M4 18h6" />
                  <path d="M14 18h2" />
                </svg>
              </span>
              <span className="text-xl font-bold tracking-tight">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-sm leading-6 text-neutral-content/70">
              {siteConfig.description}
            </p>
            <div className="flex gap-2">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="btn btn-circle btn-ghost btn-sm text-neutral-content/80 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Quick links">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-content/60">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {siteConfig.navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-content/80 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Categories */}
          <nav aria-label="Categories">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-content/60">
              Categories
            </h3>
            <ul className="space-y-2 text-sm">
              {categoryLinks.map((category) => (
                <li key={category}>
                  <Link
                    href="/all-equipment"
                    className="text-neutral-content/80 transition-colors hover:text-primary"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-content/60">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-neutral-content/80">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{siteConfig.contact.address}</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{siteConfig.contact.phone}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{siteConfig.contact.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-neutral-content/10 pt-6 text-xs text-neutral-content/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>
            Built with Next.js, Tailwind CSS &amp; DaisyUI
          </p>
        </div>
      </div>
    </footer>
  );
}
