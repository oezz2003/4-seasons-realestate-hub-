"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home as HomeIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroSearch() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Any Type");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (type !== "Any Type") params.set("type", type);
    
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-background/90 dark:bg-card/90 backdrop-blur-3xl p-3 md:p-4 rounded-full shadow-[0_30px_60px_rgba(0,0,0,0.12)] flex flex-wrap md:flex-nowrap items-center gap-2 border border-white/20 dark:border-white/5 max-w-5xl mx-auto">
      {/* Location Input */}
      <div className="flex-1 px-4 md:px-8 flex items-center gap-4 border-r border-slate-100 dark:border-slate-800 min-w-[200px]">
        <MapPin className="w-5 h-5 text-primary shrink-0" />
        <div className="flex flex-col flex-1">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Location</span>
          <input 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border-none focus:ring-0 text-on-surface font-bold placeholder:text-slate-300 p-0 bg-transparent text-sm h-6" 
            placeholder="Where in Egypt?" 
            type="text"
          />
        </div>
      </div>
      
      {/* Typology Select */}
      <div className="flex-1 px-4 md:px-8 flex items-center gap-4 border-r border-slate-100 dark:border-slate-800 min-w-[150px] hidden md:flex relative group">
        <HomeIcon className="w-5 h-5 text-primary shrink-0" />
        <div className="flex flex-col flex-1 h-full cursor-pointer">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Typology</span>
          <select 
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border-none focus:ring-0 text-on-surface font-bold p-0 bg-transparent text-sm h-6 appearance-none cursor-pointer"
          >
            <option>Any Type</option>
            <option>Villa</option>
            <option>Penthouse</option>
            <option>Chalet</option>
            <option>Apartment</option>
          </select>
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-4 bottom-1 pointer-events-none transition-transform group-hover:translate-y-0.5" />
      </div>

      {/* Search Button */}
      <button 
        onClick={handleSearch}
        className="w-full md:w-auto bg-primary text-on-primary px-8 md:px-12 py-4 rounded-full font-black hover:bg-primary-dim transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 scale-95 hover:scale-100 active:scale-90 duration-200 uppercase tracking-[0.2em] text-[10px]"
      >
        <Search className="w-4 h-4" /> 
        Architectural Search
      </button>
    </div>
  );
}
