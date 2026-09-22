"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Radio, Building2, Languages, ChevronDown, Menu, X } from "lucide-react";
import { Container } from "@/components/layout/container";
import { authService } from "@/features/auth/services/auth.service";

const languages = [
  { code: "en", name: "English" },
  { code: "ar", name: "العربية" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "pt", name: "Português" },
  { code: "tr", name: "Türkçe" },
  { code: "ru", name: "Русский" },
  { code: "ur", name: "اردو" },
  { code: "hi", name: "हिन्दी" },
  { code: "fa", name: "فارسی" },
];

export function MarketingHeader() {
  const [session, setSession] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

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

  const changeLanguage = (langCode: string, langName: string) => {
    setSelectedLang(langName);
    setIsLangOpen(false);
    
    // Set Google Translate cookie
    const targetLang = langCode || "en";
    document.cookie = `googtrans=/en/${targetLang}`;
    window.location.reload(); // Reload to apply translation across the page
  };

  const user = session?.user;
  const isCreatorVerified = Boolean(user?.isCreatorVerified || user?.isCreator || user?.creatorStatus === "approved");
  const isAgencyVerified = Boolean(user?.isAgencyVerified || user?.agencyMembership?.agency_id?.status === "approved");

  const portalHref = isAgencyVerified ? "/agency" : isCreatorVerified ? "/creator" : "/login";
  const portalLabel = isAgencyVerified ? "Agency workspace" : isCreatorVerified ? "Creator studio" : "Portal sign in";
  const PortalIcon = isAgencyVerified ? Building2 : Radio;

  return (
    <header className="bg-surface sticky top-0 z-40 border-b-2 border-text-primary">
      <Container className="flex h-20 items-center justify-between gap-4">
        {/* Logo mark */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setMenuOpen(false)}>
          <svg viewBox="0 0 40 40" className="h-8 w-8 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2a18 18 0 1 0 0 36" stroke="var(--color-brand)" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M20 10a10 10 0 1 0 0 20" stroke="var(--color-brand)" strokeWidth="4.5" strokeLinecap="round" />
          </svg>
          <span className="leading-none">
            <span className="block text-xl font-black tracking-tight text-text-primary">
              FREN <span className="text-brand">ZONE</span>
            </span>
            <span className="block text-[10px] font-extrabold tracking-[0.25em] text-text-primary">LIVE</span>
          </span>
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
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-sm font-semibold text-text-primary hover:bg-surface-muted transition-colors"
            >
              <Languages className="h-4 w-4 text-text-primary" />
              {selectedLang}
              <ChevronDown className={`h-3.5 w-3.5 text-text-muted transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-surface border border-border rounded-xl shadow-lg py-1 z-50 max-h-60 overflow-y-auto">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => changeLanguage(lang.code, lang.name)}
                    className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface-muted transition-colors"
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

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

            <div className="flex items-center gap-3 mt-4 relative">
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-sm font-semibold text-text-primary"
              >
                <Languages className="h-4 w-4" />
                {selectedLang}
                <ChevronDown className={`h-3.5 w-3.5 text-text-muted transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
              </button>

              {isLangOpen && (
                <div className="absolute left-0 top-full mt-2 w-40 bg-surface border border-border rounded-xl shadow-lg py-1 z-50 max-h-60 overflow-y-auto">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => changeLanguage(lang.code, lang.name)}
                      className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface-muted transition-colors"
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
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