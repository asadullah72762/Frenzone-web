"use client";

import { useRef } from "react";
import { Swords, ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/container";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "pk-battle",
    title: "PK Battle Arena",
    description: "Live competitive streaming battles with real-time gift meters, sound cues, and viewer rounds.",
    imageSrc: "/assets/pk-battle-cover.png",
  },
  {
    id: "wolf-spirit",
    title: "Mythic Wolf",
    description: "Full-screen 3D animated wolf summon that elevates streamer ranking and room hype.",
    imageSrc: "/assets/pk-battle-wolf.png",
  },
  {
    id: "cyber-bike",
    title: "Superbike Entry",
    description: "High-octane neon cyberbike visual for top supporters entering creator streams.",
    imageSrc: "/assets/pk-battle-motorcycle.png",
  },
  {
    id: "boxing-gloves",
    title: "PK Power Gloves",
    description: "Boost points and trigger double-point combos in tight PK battle matches.",
    imageSrc: "/assets/pk-gloves.png",
  },
  {
    id: "golden-lion",
    title: "Golden Lion",
    description: "The crown jewel gift of Frenzone Live, activating room-wide particle animations.",
    imageSrc: "/assets/live-gift-lion.png",
  },
];

export function PkBattlesGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-surface to-surface-muted/60 border-y border-border">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 max-w-5xl h-64 bg-gradient-to-r from-brand/10 via-cta/10 to-brand-hover/10 blur-3xl pointer-events-none -z-10" />

      <Container>
        {/* Header with Title and Scroll Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 rounded-full bg-brand-soft px-3.5 py-1 text-xs font-extrabold text-brand border border-brand/20">
              <Swords className="h-3.5 w-3.5 text-brand" />
              <span>LIVE ENTERTAINMENT & MONETIZATION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
              PK battles, gifts and creator tools.
            </h2>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Experience the adrenaline of real-time streamer showdowns, hyper-visual 3D animated gifts, and audience-engaging interactive features that make Frenzone streams unforgettable.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center space-x-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Scroll left"
              className="h-10 w-10 rounded-full border border-border bg-surface hover:bg-surface-muted text-text-primary flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Scroll right"
              className="h-10 w-10 rounded-full border border-border bg-surface hover:bg-surface-muted text-text-primary flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Gallery Scroll Track */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-6 pt-2 scroll-smooth no-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              className="group relative flex-none w-[270px] sm:w-[290px] md:w-[310px] rounded-3xl overflow-hidden bg-slate-950 border border-white/10 shadow-elevated snap-start transition-all duration-300 hover:border-brand/50 hover:shadow-2xl hover:-translate-y-1.5 flex flex-col"
            >
              {/* Clean Visual Frame - No Labels Over Image */}
              <div className="relative h-[360px] sm:h-[380px] w-full overflow-hidden bg-slate-900">
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Card Bottom Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-2 bg-slate-950 text-white border-t border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300/80 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center space-x-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
                    <span>In-Stream Asset</span>
                  </span>
                  <span className="text-brand font-bold uppercase tracking-wider">Frenzone Live</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
