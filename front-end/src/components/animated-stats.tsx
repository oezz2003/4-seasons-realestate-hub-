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
        // When the component comes into view, set isVisible to true
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once it's visible to animate only once
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the component is visible
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Use real stats if available, otherwise fallback to mock data
  const displayStats = stats ? [
    { icon: Building, value: stats.properties, label: "Properties Available", suffix: "+" },
    { icon: Award, value: stats.compounds, label: "Compounds", suffix: "+" },
    { icon: Users, value: stats.developers, label: "Developers", suffix: "+" },
    { icon: Smile, value: stats.clients, label: "Happy Clients", suffix: "+" },
  ] : statsData;

  return (
    <section ref={sectionRef} className="py-12 md:py-20 bg-primary/10">
      <div className="container mx-auto px-4">
        <div className="overflow-hidden py-1 text-center">
          <h2 className="text-3xl font-bold mb-10 font-headline animate-title-reveal">Our Journey in Numbers</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {displayStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label} 
                className="group p-6"
              >
                <div className="relative inline-block mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                    <Icon className="w-12 h-12 text-primary" />
                </div>
                {/* Always render AnimatedNumber, but control its animation with the `startAnimation` prop */}
                <AnimatedNumber value={stat.value} suffix={stat.suffix} startAnimation={isVisible} />
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
