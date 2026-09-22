"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Radio, Building2, User, Globe, ChevronDown, Check } from "lucide-react";
import { Container } from "@/components/layout/container";
import { authService } from "@/features/auth/services/auth.service";

const languages = [
  { id: "en", label: "English", native: "English" },
  { id: "ar", label: "Arabic", native: "العربية" },
  { id: "de", label: "German", native: "Deutsch" },
  { id: "es", label: "Spanish", native: "Spanish" },
  { id: "ur", label: "Urdu", native: "اردو" },
  { id: "fa", label: "Farsi", native: "فارسی" },
  { id: "es-es", label: "Espanol", native: "Español" },
];

export function MarketingHeader() {
  const [session, setSession] = useState<any>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    authService
      .getSession()
      .then((s) => setSession(s))
      .catch(() => setSession(null));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const user = session?.user;
  const isCreatorVerified = Boolean(user?.isCreatorVerified || user?.isCreator || user?.creatorStatus === "approved");
  const isAgencyVerified = Boolean(user?.isAgencyVerified || user?.agencyMembership?.agency_id?.status === "approved");

  return (
    <header className="bg-surface/95 backdrop-blur-md sticky top-0 z-40 border-b border-border shadow-xs">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <img
            src="/assets/frenzone-logo.png"
            alt="Frenzone Live"
            className="h-8 md:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>
        <nav className="text-text-secondary hidden gap-6 text-sm font-semibold md:flex items-center">
          <Link href="/" className="hover:text-brand transition-colors">Home</Link>
          <Link href="/creators" className="hover:text-brand transition-colors">Creators</Link>
          <Link href="/agencies" className="hover:text-brand transition-colors">Agencies</Link>
          <Link href="/coins" className="hover:text-brand transition-colors">Coins</Link>

          {/* Language Dropdown Selector */}
          <div className="relative" ref={langMenuRef}>
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center space-x-1.5 py-1.5 px-2.5 rounded-lg border border-border/80 bg-surface hover:border-brand/40 hover:bg-brand-soft/30 transition-all text-xs font-semibold text-text-primary cursor-pointer shadow-2xs"
              aria-label="Select Language"
              aria-expanded={isLangOpen}
            >
              <Globe className="h-3.5 w-3.5 text-brand" />
              <span>{selectedLang.label}</span>
              <ChevronDown
                className={`h-3 w-3 text-text-muted transition-transform duration-200 ${
                  isLangOpen ? "rotate-180 text-brand" : ""
                }`}
              />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-surface shadow-elevated p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1 text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-border mb-1">
                  Select Language
                </div>
                <div className="space-y-0.5 max-h-64 overflow-y-auto">
                  {languages.map((lang) => {
                    const isSelected = selectedLang.id === lang.id;
                    return (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => {
                          setSelectedLang(lang);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg font-medium transition-colors text-left cursor-pointer ${
                          isSelected
                            ? "bg-brand text-white font-bold"
                            : "text-text-primary hover:bg-brand-soft hover:text-brand"
                        }`}
                      >
                        <span>{lang.label}</span>
                        <div className="flex items-center space-x-1.5">
                          <span
                            className={`text-[11px] ${
                              isSelected ? "text-white/90" : "text-text-muted"
                            }`}
                          >
                            {lang.native}
                          </span>
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              {isAgencyVerified ? (
                <Link
                  className="bg-brand hover:bg-brand-hover text-white transition-colors rounded-xl px-4 py-2 text-sm font-bold shadow-sm flex items-center space-x-1.5"
                  href="/agency"
                >
                  <Building2 className="h-4 w-4" />
                  <span>Agency Workspace</span>
                </Link>
              ) : isCreatorVerified ? (
                <Link
                  className="bg-brand hover:bg-brand-hover text-white transition-colors rounded-xl px-4 py-2 text-sm font-bold shadow-sm flex items-center space-x-1.5"
                  href="/creator"
                >
                  <Radio className="h-4 w-4" />
                  <span>Creator Studio</span>
                </Link>
              ) : (
                <>
                  <Link
                    className="text-text-secondary hover:text-text-primary transition-colors px-3 py-2 text-sm font-semibold"
                    href="/creator"
                  >
                    Dashboard
                  </Link>
                  <Link
                    className="bg-brand hover:bg-brand-hover text-white transition-colors rounded-xl px-4 py-2 text-sm font-bold shadow-sm flex items-center space-x-1"
                    href="/creator-apply"
                  >
                    <span>Apply as Creator</span>
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link
                className="text-text-secondary hover:text-text-primary transition-colors px-3 py-2 text-sm font-semibold"
                href="/login"
              >
                Sign in
              </Link>
              <Link
                className="bg-brand hover:bg-brand-hover text-white transition-colors rounded-xl px-4 py-2 text-sm font-bold shadow-sm flex items-center space-x-1"
                href="/creator-apply"
              >
                <span>Apply as Creator</span>
              </Link>
            </>
          )}
        </div>
      </Container>
    </header>
  );
}
