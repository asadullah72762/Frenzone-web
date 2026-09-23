"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Radio, Building2, Languages, ChevronDown, Menu, X } from "lucide-react";
import { Container } from "@/components/layout/container";
import { authService } from "@/features/auth/services/auth.service";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
  { code: "tr", label: "Türkçe" },
  { code: "ru", label: "Русский" },
  { code: "ur", label: "اردو" },
  { code: "hi", label: "हिन्दी" },
  { code: "he", label: "עברית" },
  { code: "fa", label: "فارسی" },
];

const RTL_LANGUAGES = ["ar", "ur", "he", "fa"];

export function MarketingHeader() {
  const [session, setSession] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState("English");

  const applyLanguage = (langLabel: string) => {
    const found = LANGUAGES.find((l) => l.label === langLabel) || LANGUAGES[0];
    if (typeof document !== "undefined") {
      document.documentElement.lang = found.code;
      document.documentElement.dir = RTL_LANGUAGES.includes(found.code) ? "rtl" : "ltr";
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("frenzone_lang");
      if (saved) {
        setLanguage(saved);
        applyLanguage(saved);
      }
    }
  }, []);

  const handleLangChange = (val: string) => {
    setLanguage(val);
    applyLanguage(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("frenzone_lang", val);
    }
  };

  useEffect(() => {
    authService
      .getSession()
      .then((s) => setSession(s))
      .catch(() => setSession(null));
  }, []);

  // Close the mobile menu automatically if the viewport grows past the mobile breakpoint
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const user = session?.user;
  const isCreatorVerified = Boolean(user?.isCreatorVerified || user?.isCreator || user?.creatorStatus === "approved");
  const isAgencyVerified = Boolean(user?.isAgencyVerified || user?.agencyMembership?.agency_id?.status === "approved");

  const portalHref = isAgencyVerified ? "/agency" : isCreatorVerified ? "/creator" : "/login";
  const portalLabel = isAgencyVerified ? "Agency workspace" : isCreatorVerified ? "Creator studio" : "Portal sign in";
  const PortalIcon = isAgencyVerified ? Building2 : Radio;

  return (
    <header className="bg-surface/95 backdrop-blur-md sticky top-0 z-40 border-b border-border">
      <Container className="flex h-20 items-center justify-between gap-4">
        {/* Logo mark */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setMenuOpen(false)}>
          <img
            src="/assets/frenzone-logo.png"
            alt="Frenzone Live"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Primary nav — desktop only */}
        <nav className="hidden lg:flex items-center gap-8 text-[15px] font-bold text-text-primary">
          <Link href="/" className="hover:text-brand transition-colors">Home</Link>
          <Link href="/creators" className="hover:text-brand transition-colors">Creators</Link>
          <Link href="/agencies" className="hover:text-brand transition-colors">Agencies</Link>
          <Link href="/coins" className="hover:text-brand transition-colors">Buy coins</Link>
        </nav>

        {/* Right cluster — desktop only */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <label className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-semibold text-text-primary hover:bg-surface-muted transition-colors cursor-pointer">
            <Languages className="h-4 w-4 text-text-primary shrink-0" />
            <select
              aria-label="Language"
              value={language}
              onChange={(e) => handleLangChange(e.target.value)}
              className="bg-transparent text-sm font-semibold text-text-primary cursor-pointer border-none outline-none focus:outline-none focus:ring-0 pr-1"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.label}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>

          <Link
            href={portalHref}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-bold text-text-primary hover:bg-surface-muted transition-colors"
          >
            {user ? <PortalIcon className="h-4 w-4" /> : null}
            {portalLabel}
          </Link>

          <Link
            href="/creator-apply"
            className="inline-flex items-center rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-hover transition-colors"
          >
            Apply now
          </Link>
        </div>

        {/* Mobile: Apply now stays visible + hamburger toggle */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          <Link
            href="/creator-apply"
            className="inline-flex items-center rounded-full bg-brand px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-brand-hover transition-colors"
          >
            Apply now
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-border text-text-primary"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile menu drawer */}
      {menuOpen ? (
        <div className="lg:hidden border-t border-border bg-surface">
          <Container className="py-5 flex flex-col gap-1">
            <Link href="/" onClick={() => setMenuOpen(false)} className="py-3 text-base font-bold text-text-primary border-b border-border-subtle">Home</Link>
            <Link href="/creators" onClick={() => setMenuOpen(false)} className="py-3 text-base font-bold text-text-primary border-b border-border-subtle">Creators</Link>
            <Link href="/agencies" onClick={() => setMenuOpen(false)} className="py-3 text-base font-bold text-text-primary border-b border-border-subtle">Agencies</Link>
            <Link href="/coins" onClick={() => setMenuOpen(false)} className="py-3 text-base font-bold text-text-primary border-b border-border-subtle">Buy coins</Link>

            <div className="flex items-center gap-3 mt-4">
              <label className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-2 text-sm font-semibold text-text-primary">
                <Languages className="h-4 w-4 text-text-primary shrink-0" />
                <select
                  aria-label="Language"
                  value={language}
                  onChange={(e) => handleLangChange(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-text-primary cursor-pointer border-none outline-none focus:outline-none focus:ring-0"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.label}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <Link
              href={portalHref}
              onClick={() => setMenuOpen(false)}
              className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-4 py-3 text-sm font-bold text-text-primary"
            >
              {user ? <PortalIcon className="h-4 w-4" /> : null}
              {portalLabel}
            </Link>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
