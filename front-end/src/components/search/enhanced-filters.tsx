'use client';

import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Home, Building2, Building, Warehouse, Hotel, MapPin, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TypologySelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export function TypologySelector({ value, onChange, options }: TypologySelectorProps) {
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'apartment': return <Building2 className="w-5 h-5" />;
      case 'villa': return <Home className="w-5 h-5" />;
      case 'penthouse': return <Hotel className="w-5 h-5" />;
      case 'duplex': return <Building className="w-5 h-5" />;
      default: return <Warehouse className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Typology</label>
        <span className="text-[10px] font-serif italic text-primary/60">{value || 'All Estates'}</span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        <button
          onClick={() => onChange('all-types')}
          className={cn(
            "flex flex-col items-center justify-center min-w-[80px] h-[100px] rounded-2xl border transition-all duration-500 gap-3",
            value === 'all-types' || !value
              ? "bg-primary text-white border-primary shadow-xl shadow-primary/20"
              : "bg-surface-low/30 border-primary/5 text-muted-foreground/60 hover:bg-background/80 hover:border-primary/20"
          )}
        >
          <div className={cn("p-2 rounded-xl", value === 'all-types' || !value ? "bg-white/20" : "bg-primary/5")}>
             <Search className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider">All</span>
        </button>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={cn(
              "flex flex-col items-center justify-center min-w-[80px] h-[100px] rounded-2xl border transition-all duration-500 gap-3",
              value === option
                ? "bg-primary text-white border-primary shadow-xl shadow-primary/20"
                : "bg-surface-low/30 border-primary/5 text-muted-foreground/60 hover:bg-background/80 hover:border-primary/20"
            )}
          >
            <div className={cn("p-2 rounded-xl", value === option ? "bg-white/20" : "bg-primary/5")}>
               {getIcon(option)}
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider line-clamp-1 px-1">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

interface PriceRangeSliderProps {
  min: number;
  max: number;
  minPrice: string;
  maxPrice: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}

export function PriceRangeSlider({ min, max, minPrice, maxPrice, onMinChange, onMaxChange }: PriceRangeSliderProps) {
  const currentValues = [
    minPrice ? parseInt(minPrice) : min,
    maxPrice ? parseInt(maxPrice) : max
  ];

  const handleValueChange = (values: number[]) => {
    onMinChange(values[0].toString());
    onMaxChange(values[1].toString());
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
    return val.toString();
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Price Corridor (EGP)</label>
        <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-display text-primary">{formatCurrency(currentValues[0])}</span>
            <span className="text-[10px] text-muted-foreground/30">—</span>
            <span className="text-xs font-bold font-display text-primary">{formatCurrency(currentValues[1])}</span>
        </div>
      </div>
      <div className="px-2">
        <Slider
          defaultValue={[min, max]}
          value={currentValues}
          min={min}
          max={max}
          step={500000}
          onValueChange={handleValueChange}
        />
      </div>
    </div>
  );
}

interface CustomSelectProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: { id: string | number, name: string }[];
  icon: React.ReactNode;
}

export function CustomSelect({ label, placeholder, value, onChange, options, icon }: CustomSelectProps) {
  return (
    <div className="space-y-4">
      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="group">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-primary/5 text-secondary transition-colors group-hover:bg-primary/10">
                {icon}
             </div>
             <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Global Explorer</SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt.id} value={opt.name.toString()}>
              {opt.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
