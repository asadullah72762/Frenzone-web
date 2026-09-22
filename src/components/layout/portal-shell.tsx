"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import type { NavigationItem } from "@/config/navigation";
import { Container } from "./container";
import { LogOut, User, Building2, ChevronRight, ShieldAlert, RefreshCw, ArrowRight } from "lucide-react";
import { authService } from "@/features/auth/services/auth.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { Button } from "@/components/ui/button";

type Props = {
  product: "Creator" | "Agency";
  links: NavigationItem[];
  children: ReactNode;
};

export function PortalShell({ product, links, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isLoading, error, refetch } = useAsyncData(
    () => authService.getSession(),
    [],
    100
  );

  useEffect(() => {
    const handleProfileUpdated = () => {
      refetch();
    };
    window.addEventListener("frenzone_profile_updated", handleProfileUpdated);
    return () => {
      window.removeEventListener("frenzone_profile_updated", handleProfileUpdated);
    };
  }, [refetch]);

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

  const isAgencyUser = Boolean(
    session?.user?.isAgencyMember ||
    session?.user?.agencyId ||
    session?.user?.role?.startsWith("AGENCY_")
  );

  const isCreatorUser = Boolean(
    session?.user?.isCreator ||
    session?.user?.creatorStatus === "approved" ||
    session?.user?.creatorStatus === "pending"
  );

  // Role Access Enforcement Checks
  const isBlockedFromAgency = product === "Agency" && session && !isAgencyUser;
  const isBlockedFromCreator = product === "Creator" && session && isAgencyUser && !isCreatorUser;

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

      {/* Main Layout */}
      <div className="flex-1 min-w-0">
        <Container className="grid gap-4 lg:gap-8 py-4 lg:py-6 lg:grid-cols-[16rem_1fr] items-start min-w-0">
          {/* Sidebar Navigation: compact horizontal bar on mobile, full sticky sidebar on desktop */}
          <aside className="w-full min-w-0 max-w-full lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto pr-0 lg:pr-2 pb-0 lg:pb-8 lg:scrollbar-thin lg:scrollbar-thumb-border lg:hover:scrollbar-thumb-text-muted transition-colors flex flex-col justify-between">
            <div className="space-y-2 lg:space-y-4 min-w-0">
              {/* Sidebar Header Badge (Desktop Only) */}
              <div className="px-3 pt-2 hidden lg:block">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted">
                  {product} Workspace
                </span>
              </div>

              {/* Navigation Items (smooth horizontal touch scrolling on mobile) */}
              <nav className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none lg:flex-col lg:overflow-x-visible w-full min-w-0 overscroll-x-contain touch-pan-x [-webkit-overflow-scrolling:touch]">
                {links.map(({ href, icon: Icon, label }) => {
                  const isActive =
                    pathname === href ||
                    (href !== "/creator" && href !== "/agency" && pathname.startsWith(href));

                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-extrabold transition-all whitespace-nowrap lg:whitespace-normal cursor-pointer shrink-0 select-none ${
                        isActive
                          ? "bg-brand text-white shadow-sm"
                          : "text-text-secondary hover:bg-surface hover:text-text-primary bg-surface/80 border border-border/40 lg:border-transparent lg:bg-transparent"
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

            {/* Sidebar Bottom User Profile Card (Desktop Only to prevent mobile overlays/gaps) */}
            <div className="pt-6 border-t border-border mt-6 px-1 hidden lg:block">
              <div className="rounded-2xl border border-border bg-surface p-3.5 shadow-sm space-y-3">
                <div className="flex items-center space-x-3">
                  {session?.user?.profilePicture ? (
                    <img
                      src={session.user.profilePicture}
                      alt={session?.user?.displayName || "User"}
                      className="h-9 w-9 rounded-xl object-cover border border-brand/20 shadow-sm"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-cta text-white font-extrabold text-xs shadow-sm select-none">
                      {session?.user?.displayName ? (
                        session.user.displayName.charAt(0).toUpperCase()
                      ) : product === "Creator" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Building2 className="h-4 w-4" />
                      )}
                    </div>
                  )}
                  <div className="overflow-hidden flex-1">
                    <p className="text-xs font-bold text-text-primary truncate">
                      {session?.user?.displayName || (product === "Creator" ? "Creator User" : "Agency Member")}
                    </p>
                    <p className="text-[10px] text-text-muted truncate">
                      {session?.user?.email || "Authenticating..."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="flex items-center space-x-1 text-[10px] font-bold text-success bg-success-soft/60 px-2 py-0.5 rounded-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-success animate-ping" />
                    <span>{session?.user?.role || "ACTIVE"}</span>
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

          {/* Main Content Area with Strict Role Guard */}
          <main className="min-w-0 pb-16">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-3">
                <RefreshCw className="h-6 w-6 animate-spin text-brand" />
                <p className="text-xs text-text-secondary">Verifying workspace permissions...</p>
              </div>
            ) : isBlockedFromAgency ? (
              /* Creator Account attempting to view Agency Workspace */
              <div className="max-w-lg mx-auto mt-12 rounded-2xl border border-warning/30 bg-surface p-8 text-center space-y-4 shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-warning-soft text-warning">
                  <ShieldAlert className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-primary">Agency Workspace Restricted</h2>
                  <p className="text-sm text-text-secondary mt-2">
                    You are signed in as a <strong>Creator</strong> ({session?.user?.displayName}). Your account is not registered as an active Agency member.
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Button variant="primary" className="flex-1" onClick={() => router.push("/creator")}>
                    Go to Creator Portal
                  </Button>
                  {session?.user?.isAgencyVerified ? (
                    <Button variant="outline" className="flex-1" onClick={() => router.push("/agency")}>
                      Open Agency Portal
                    </Button>
                  ) : session?.user?.agencyStatus === "pending" ? (
                    <Button variant="outline" className="flex-1" onClick={() => router.push("/agency")}>
                      Agency Application in Review
                    </Button>
                  ) : (
                    <Button variant="outline" className="flex-1" onClick={() => router.push("/agency-apply")}>
                      Apply as Agency
                    </Button>
                  )}
                </div>
              </div>
            ) : isBlockedFromCreator ? (
              /* Agency Account attempting to view Creator Workspace */
              <div className="max-w-lg mx-auto mt-12 rounded-2xl border border-warning/30 bg-surface p-8 text-center space-y-4 shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-warning-soft text-warning">
                  <ShieldAlert className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-primary">Creator Workspace Restricted</h2>
                  <p className="text-sm text-text-secondary mt-2">
                    You are signed in with an <strong>Agency</strong> account ({session?.user?.displayName}). Agency accounts cannot access the Creator portal.
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Button variant="primary" className="flex-1" onClick={() => router.push("/agency")}>
                    Go to Agency Portal
                  </Button>
                  {session?.user?.isCreatorVerified ? (
                    <Button variant="outline" className="flex-1" onClick={() => router.push("/creator")}>
                      Open Creator Hub
                    </Button>
                  ) : session?.user?.creatorStatus === "pending" ? (
                    <Button variant="outline" className="flex-1" onClick={() => router.push("/creator/application")}>
                      Creator Review in Progress
                    </Button>
                  ) : (
                    <Button variant="outline" className="flex-1" onClick={() => router.push("/creator-apply")}>
                      Apply for Creator Program
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              children
            )}
          </main>
        </Container>
      </div>
    </div>
  );
}
