"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const themes = [
  { id: 'winter', label: 'Winter Sky', color: '#004258', icon: '❄️' },
  { id: 'autumn', label: 'Autumn Sunset', color: '#a33700', icon: '🍂' },
  { id: 'spring', label: 'Spring Leaf', color: '#3c6600', icon: '🌿' },
  { id: 'summer', label: 'Summer Gold', color: '#775a19', icon: '☀️' },
];

export function ExperienceThePalette() {
  const [activeTheme, setActiveTheme] = useState(themes[0].id);

  return (
    <section className="py-24 max-w-7xl mx-auto px-8">
      <div className="bg-surface-container-low rounded-[4rem] p-16 md:p-24 text-center">
        <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tighter mb-4">Experience the Palette</h2>
        <p className="font-body text-muted-foreground/80 mb-12 max-w-2xl mx-auto">
          How The Obsidian Retreat transforms through the Equinox. Select a season to see the atmospheric shift.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setActiveTheme(theme.id)}
              className={cn(
                "flex items-center gap-3 px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] transition-all duration-500",
                activeTheme === theme.id 
                  ? "bg-white text-primary shadow-xl ring-2 ring-primary/5 scale-105" 
                  : "bg-white/50 text-muted-foreground hover:bg-white"
              )}
            >
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: theme.color }}
              />
              {theme.label}
            </button>
          ))}
        </div>

        <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden group shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTheme}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {/* This would ideally be project-specific themed renders */}
              <div 
                className="w-full h-full bg-cover bg-center transition-all duration-1000"
                style={{ 
                  backgroundImage: `url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2000')`,
                  filter: activeTheme === 'winter' ? 'sepia(0.2) hue-rotate(180deg) brightness(1.1)' : 
                          activeTheme === 'autumn' ? 'sepia(0.5) saturate(1.5) hue-rotate(-30deg)' :
                          activeTheme === 'spring' ? 'saturate(1.2) hue-rotate(30deg)' : 'brightness(1.1) saturate(1.1)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-12 left-12 text-left">
                <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Atmospheric Simulation</span>
                <h4 className="text-3xl font-headline font-black text-white tracking-widest uppercase">
                  {themes.find(t => t.id === activeTheme)?.label}
                </h4>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
