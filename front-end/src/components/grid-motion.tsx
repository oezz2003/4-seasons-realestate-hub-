"use client";

import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GridMotionProps {
  items?: (string | ReactNode)[];
}

const GridMotion: FC<GridMotionProps> = ({ items = [] }) => {
  const totalItems = 28;
  const defaultItems = Array.from({ length: totalItems }, (_, i) => `Item ${i}`);
  const combinedItems = items.length > 0 ? items : defaultItems;

  const rows = Array.from({ length: 4 }, (_, rowIndex) => {
    const animationClass = rowIndex % 2 === 0 ? "animate-marqueeRight" : "animate-marqueeLeft";
    
    // Duplicate items to create a seamless loop
    const rowItems = [...combinedItems, ...combinedItems].slice(rowIndex * 7, rowIndex * 7 + 14);

    return (
        <div key={rowIndex} className={cn("flex flex-row gap-4", animationClass)}>
            {rowItems.map((content, itemIndex) => (
                <div key={`${rowIndex}-${itemIndex}`} className="relative aspect-square w-[calc(140vw/7)] flex-shrink-0">
                    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[10px] border border-white/10 bg-black/20 text-base text-white backdrop-blur-sm">
                      {typeof content === "string" && content.startsWith("http") ? (
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${content})` }}
                        ></div>
                      ) : (
                        <div className="z-[1] p-4 text-center">{content}</div>
                      )}
                    </div>
                </div>
             ))}
        </div>
    );
  });

  return (
    <div className="h-full w-full overflow-hidden">
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="flex-none relative w-[200vw] h-auto flex flex-col gap-4 rotate-[-15deg] origin-center z-[2]">
            {rows}
        </div>
      </div>
    </div>
  );
};

export { GridMotion };
