"use client";

import { useState, useEffect, useRef } from 'react';
import { Award, Building, Users, Smile } from "lucide-react";

type Stat = {
  icon: React.ElementType;
  value: number;
  label: string;
  suffix?: string;
};

interface AnimatedStatsProps {
  stats: {
    properties: number;
    compounds: number;
    developers: number;
    clients: number;
  };
}

const statsData: Stat[] = [
  { icon: Award, value: 10, label: "Years of Experience", suffix: "+" },
  { icon: Building, value: 500, label: "Properties Sold", suffix: "+" },
  { icon: Users, value: 1200, label: "Happy Clients", suffix: "+" },
  { icon: Smile, value: 98, label: "Satisfaction Rate", suffix: "%" },
];

function AnimatedNumber({ value, suffix = "", startAnimation }: { value: number; suffix?: string; startAnimation: boolean }) {
  const [count, setCount] = useState(0);
  const duration = 2000; // Animation duration in milliseconds

  useEffect(() => {
    if (!startAnimation) {
      return; // Don't start the animation if the component isn't visible
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const newCount = Math.floor(percentage * value);
      setCount(newCount);

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(value); // Ensure it ends on the exact value
      }
    };

    // Start the animation
    animationFrameId = requestAnimationFrame(animate);

    // Cleanup function to cancel the animation frame on component unmount
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, startAnimation]); // Rerun the effect if the value or the start trigger changes

  return (
    <p className="text-4xl font-bold">
      {count}
      {suffix}
    </p>
  );
}

export function AnimatedStats({ stats }: AnimatedStatsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const displayStats = [
    { value: stats?.properties || 1200, label: "Properties Listed", suffix: "+", color: "text-primary" },
    { value: stats?.compounds || 45, label: "Premium Compounds", suffix: "", color: "text-secondary" },
    { value: stats?.developers || 850, label: "Happy Clients", suffix: "+", color: "text-tertiary" },
    { value: 4, label: "Portfolio Value", suffix: "B+", color: "text-on-surface" },
  ];

  return (
    <section ref={sectionRef} className="py-24 max-w-7xl mx-auto px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {displayStats.map((stat, idx) => (
          <div 
            key={idx} 
            className="text-center p-8 rounded-2xl bg-surface-container-low transition-all hover:scale-[1.05] duration-500"
          >
            <div className={`text-4xl md:text-5xl font-headline font-black mb-2 ${stat.color}`}>
              <AnimatedNumber value={stat.value} suffix={stat.suffix} startAnimation={isVisible} />
            </div>
            <div className="font-label text-[10px] uppercase tracking-widest text-muted-foreground/60 font-black">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
