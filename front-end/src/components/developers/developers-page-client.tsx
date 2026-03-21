"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Star, Award, Building2, TrendingUp, Users, Wallet, BarChart3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LuxuryDeveloper } from "@/lib/types";
import { getImageUrl, getPlaceholderImage } from "@/lib/image-helpers";

interface DevelopersPageClientProps {
  initialDevelopers: any[];
}

const CATEGORIES = ["ALL PARTNERS"];

export function DevelopersPageClient({ initialDevelopers }: DevelopersPageClientProps) {
  const [activeCategory, setActiveCategory] = React.useState("ALL PARTNERS");
  const [hoveredId, setHoveredId] = React.useState<number | null>(null);

  const enrichedDevelopers: LuxuryDeveloper[] = initialDevelopers.map((dev) => ({
    ...dev,
    // Use the representative image from compounds if available
    main_image: dev.representative_image || getPlaceholderImage("developer")
  }));

  const filteredDevelopers = enrichedDevelopers;

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-on-primary">
      {/* 1. Hero Section: Strategic Alliances */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-12">
            <div className="max-w-3xl">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-secondary text-xs font-black uppercase tracking-[0.4em] mb-6 block"
              >
                Strategic Alliances
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-display leading-[0.9] tracking-tighter"
              >
                The Visionary <br />
                Architects of <br />
                Modern <span className="font-serif italic text-primary">Egypt</span>
              </motion.h1>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-md lg:pb-4"
            >
              <p className="text-lg text-muted-foreground leading-relaxed font-serif italic mb-8">
                Partnering with Egypt&apos;s most visionaries to curate a collection of truly exceptional environments.
              </p>
              <Button variant="outline" className="rounded-none border-primary/20 hover:bg-primary hover:text-on-primary transition-all duration-500 group">
                View Network <ArrowDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Filter Bar (Hidden if only one category) */}
      {CATEGORIES.length > 1 && (
        <section className="sticky top-24 z-40 py-8 bg-background/80 backdrop-blur-md mb-12">
          <div className="container mx-auto flex justify-center">
            <div className="inline-flex items-center p-1.5 bg-secondary-container/30 rounded-full border border-primary/5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500",
                    activeCategory === cat 
                      ? "bg-white text-primary shadow-lg shadow-black/5 scale-[1.02]" 
                      : "text-muted-foreground/60 hover:text-primary hover:bg-white/50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Developer Grid */}
      <section className={cn("container mx-auto px-4 pb-32", CATEGORIES.length <= 1 && "pt-12")}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredDevelopers.map((dev, idx) => (
              <motion.div
                key={dev.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="group relative"
                onMouseEnter={() => setHoveredId(dev.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Link href={`/developers/${dev.id}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-6 shadow-2xl bg-muted/20">
                    <Image
                      src={getImageUrl(dev.main_image, getPlaceholderImage("developer"))}
                      alt={dev.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    {/* Glass Branding Overlay */}
                    <div className="absolute inset-x-4 bottom-4">
                      <div className="glass-premium p-4 flex items-center gap-4 rounded-xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="relative h-12 w-12 bg-white rounded-lg p-2 shadow-xl shrink-0">
                          <Image 
                            src={getImageUrl(dev.logo, getPlaceholderImage("developer"))} 
                            alt={dev.name} 
                            fill 
                            className="object-contain p-1"
                          />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-primary truncate">{dev.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 px-2">
                    <div className="flex items-center justify-between min-h-6">
                      {dev.tier ? (
                        <Badge className={cn(
                          "rounded-none px-3 py-1 text-[9px] font-black tracking-widest uppercase",
                          dev.tier === 'GLOBAL TIER' ? "bg-primary text-on-primary" : "bg-secondary text-on-secondary"
                        )}>
                          {dev.tier}
                        </Badge>
                      ) : (
                        <Badge className="rounded-none px-3 py-1 text-[9px] font-black tracking-widest uppercase bg-primary/10 text-primary border-none">
                          Concept Architect
                        </Badge>
                      )}
                      
                      {dev.rating && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                          <Star className="h-3 w-3 fill-primary" />
                          {dev.rating}
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground/80 leading-relaxed font-serif italic line-clamp-2">
                       {dev.description}
                    </p>

                    <div className="pt-4 border-t border-primary/5 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-muted-foreground/50">Experience</span>
                        <div className="text-sm font-black text-primary uppercase">{dev.experience || "Premier"}</div>
                      </div>
                      <div className="text-right space-y-1">
                        <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-muted-foreground/50">Masterpieces</span>
                        <div className="text-sm font-black text-primary uppercase">{dev.projects_count} Units</div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* 4. Cinematic CTA: Partner with the Hub */}
      <section className="container mx-auto px-4 pb-32">
        <div className="relative overflow-hidden rounded-[2rem] bg-emerald-950 p-12 md:p-20 shadow-[0_50px_100px_rgba(0,0,0,0.3)] group">
          {/* Symmetrical Diagonal Split Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(119,90,25,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,53,39,0.5)_0%,transparent_100%)] opacity-50" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="text-5xl md:text-6xl font-display text-white leading-tight mb-6">
                Partner with <br /> the <span className="text-secondary italic font-serif">Hub</span>
              </h2>
              <p className="text-lg text-white/60 font-serif italic max-w-lg mb-0 text-balance">
                Join an elite network of developers and reach the world&apos;s most discerning high-net-worth investors. 
                Our platform provides the visibility and trust your projects deserve.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Button size="xl" className="rounded-2xl bg-secondary hover:bg-secondary/90 text-white font-black uppercase tracking-widest px-10 h-16 shadow-2xl shadow-secondary/20 transition-transform hover:scale-105 active:scale-95">
                Apply to Network
              </Button>
              <Button size="xl" variant="outline" className="rounded-2xl border-white/20 text-white hover:bg-white/10 font-black uppercase tracking-widest px-10 h-16 transition-transform hover:scale-105 active:scale-95">
                Download Kit
              </Button>
            </div>
          </div>
          
          {/* Textural Detail */}
          <div className="absolute -bottom-20 -right-20 h-80 w-80 bg-white/5 rounded-full blur-3xl" />
        </div>
      </section>

      {/* 5. Network Performance Stats */}
      <section className="bg-surface-container-low/30 py-24 border-t border-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16">
            {[
              { label: "Active Listings", value: "450+", icon: BarChart3 },
              { label: "Premium Developers", value: "12", icon: Award },
              { label: "Asset Value", value: "$4.2B", icon: Wallet },
              { label: "Investor Satisfaction", value: "98%", icon: TrendingUp },
            ].map((stat, idx) => (
              <div key={stat.label} className="flex flex-col items-center lg:items-start space-y-4">
                <div className="h-10 w-10 bg-white rounded-xl shadow-lg border border-primary/5 flex items-center justify-center text-secondary">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="space-y-1 text-center lg:text-left">
                  <div className="text-4xl md:text-5xl font-display tracking-tight text-primary">
                    {stat.value}
                  </div>
                  <div className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
