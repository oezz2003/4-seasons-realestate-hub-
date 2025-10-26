"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function HeroSearchForm() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Search by City, Compound, or Developer..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-14 pl-5 pr-12 text-base text-gray-800 rounded-full"
        />
        <Button type="submit" size="icon" className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full w-10 h-10">
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}
