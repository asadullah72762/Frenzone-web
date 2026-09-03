"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import type { NavigationItem } from "@/config/navigation";
import { Container } from "./container";
import { LogOut, User, Building2, ChevronRight } from "lucide-react";
import { authService } from "@/features/auth/services/auth.service";

type Props = {
  product: "Creator" | "Agency";
  links: NavigationItem[];
  children: ReactNode;
};

export function PortalShell({ product, links, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("frenzone_token");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      await authService.logout().catch(() => {});
    } catch {
      // Ignore network errors on client logout
    } finally {
      router.push("/login");
    }
  };

  return (
    <div className="bg-surface-muted min-h-screen flex flex-col">
      {/* Top Header Navbar */}
      <header className="bg-surface/90 backdrop-blur-md sticky top-0 z-40 border-b border-border">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-brand font-black text-xl tracking-tight flex items-center space-x-2">
              <span>Frenzone</span>
            </Link>
            <span className="text-border text-lg font-light">/</span>
            <span className="rounded-full bg-gradient-to-r from-violet-50 via-indigo-50 to-pink-50 px-3 py-1 text-xs font-extrabold text-brand border border-brand/20">
              {product} Portal
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-xs font-bold text-text-secondary hover:text-brand transition-colors hidden sm:block"
            >
              ← Back to Main Site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center space-x-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-bold text-text-secondary hover:text-danger hover:border-danger transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </Container>
      </header>

      {/* Main Grid with Separately Scrollable Sticky Sidebar */}
      <div className="flex-1">
        <Container className="grid gap-8 py-6 lg:grid-cols-[16rem_1fr] items-start">
          {/* Separately Scrollable Sticky Sidebar Column */}
          <aside className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto pr-2 pb-8 scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-text-muted transition-colors flex flex-col justify-between">
            <div className="space-y-4">
              {/* Sidebar Header Badge */}
              <div className="px-3 pt-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted">
                  Workspace Navigation
                </span>
              </div>

              {/* Navigation Items */}
              <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-x-visible">
                {links.map(({ href, icon: Icon, label }) => {
                  const isActive = pathname === href || (href !== "/creator" && href !== "/agency" && pathname.startsWith(href));

                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-extrabold transition-all whitespace-nowrap lg:whitespace-normal cursor-pointer ${
                        isActive
                          ? "bg-brand text-white shadow-sm"
                          : "text-text-secondary hover:bg-surface hover:text-text-primary"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon
                          className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                            isActive ? "text-white" : "text-text-muted group-hover:text-brand"
                          }`}
                        />
                        <span>{label}</span>
                      </div>
                      {isActive ? (
                        <ChevronRight className="h-3.5 w-3.5 text-white/80 hidden lg:block" />
                      ) : null}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar Bottom User Profile Card */}
            <div className="pt-6 border-t border-border mt-6 px-1">
              <div className="rounded-2xl border border-border bg-surface p-3.5 shadow-sm space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-cta text-white font-extrabold text-xs shadow-sm">
                    {product === "Creator" ? <User className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="text-xs font-bold text-text-primary truncate">
                      {product === "Creator" ? "Alex Rivera" : "Nexus Talent Agency"}
                    </p>
                    <p className="text-[10px] text-text-muted truncate">
                      {product === "Creator" ? "alex.rivera@example.com" : "admin@nexustalent.invalid"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="flex items-center space-x-1 text-[10px] font-bold text-success bg-success-soft/60 px-2 py-0.5 rounded-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-success animate-ping" />
                    <span>ACTIVE</span>
                  </span>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-[11px] font-bold text-text-secondary hover:text-danger transition-colors cursor-pointer"
                  >
                    <LogOut className="h-3 w-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="min-w-0 pb-16">{children}</main>
        </Container>
      </div>
    </div>
  );
}
