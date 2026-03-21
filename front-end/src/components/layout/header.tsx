"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Globe, Home, Rocket, Tag, Info, Newspaper, Mail, Building, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/icons";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../theme-toggle";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/new-launches", label: "New Launches", icon: Rocket },
  { href: "/developers", label: "Developers", icon: Building },
  { href: "/about", label: "About Us", icon: Info },
  { href: "/blog", label: "Blog", icon: Newspaper },
  { href: "/contact", label: "Contact", icon: Mail },
];

const mobileBottomNavLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/developers", label: "Developers", icon: Building },
  { href: "/blog", label: "Blog", icon: Newspaper },
];

export function Header() {
  const [open, setOpen] = React.useState(false);
  const [lang, setLang] = React.useState("EN");
  const pathname = usePathname();
  const [scrollY, setScrollY] = React.useState(0);
  const isHomePage = pathname === '/';

  React.useEffect(() => {
    // A simple check to ensure window is defined (for SSR)
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    // Set initial scrollY value
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLang = () => {
    setLang(current => (current === "EN" ? "AR" : "EN"));
  };
  
  const isTransparent = isHomePage && scrollY < 50;
  const barStyles = isTransparent 
    ? 'bg-black/20 backdrop-blur-md border border-white/10' 
    : 'bg-surface-container-low/90 backdrop-blur-2xl border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.08)]';
  
  return (
    <>
      {/* Desktop Header */}
      <header className={cn(
          "sticky top-0 z-50 w-full hidden md:block transition-all duration-500 py-4",
          scrollY > 20 ? "py-2" : "py-4"
      )}>
        <div className="max-w-7xl mx-auto px-8">
          <div className={cn(
              "flex h-16 w-full items-center rounded-full px-8 transition-all duration-500",
              barStyles
          )}>
            {/* Balanced Symmetrical Navigation */}
            <div className="relative flex w-full items-center justify-between h-16">
              {/* Left Navigation (Clustered towards Center) */}
              <nav className="flex flex-1 items-center justify-end gap-1 pr-[65px]">
                {navLinks.slice(1, 3).map(({ href, label, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    className={cn(
                      "flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                      {
                        'bg-primary text-on-primary shadow-xl scale-110': pathname === href && !isTransparent,
                        'bg-white text-primary shadow-xl scale-110': pathname === href && isTransparent,
                        'text-white/80 hover:text-white hover:bg-white/10': pathname !== href && isTransparent,
                         'text-muted-foreground hover:text-primary hover:bg-primary/5': pathname !== href && !isTransparent,
                      }
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="whitespace-nowrap">{label}</span>
                  </Link>
                ))}
              </nav>

              {/* Centered Brand Hub (Floating Over) */}
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-[45%] z-20">
                <Link href="/" className="flex items-center group relative">
                  <div className="bg-white dark:bg-slate-900 rounded-full p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/20 transition-transform duration-500 group-hover:scale-110">
                    <Logo className="h-20 w-20" />
                  </div>
                  {/* Cinematic Aura */}
                  <div className="absolute inset-x-0 bottom-0 h-4 bg-secondary/40 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </div>

              {/* Right Navigation (Clustered towards Center) & Symmetrical Actions */}
              <div className="flex flex-1 items-center justify-between pl-[65px]">
                <div className="flex items-center gap-1">
                  {navLinks.slice(3, 5).map(({ href, label, icon: Icon }) => (
                    <Link
                      key={label}
                      href={href}
                      className={cn(
                        "flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                        {
                          'bg-primary text-on-primary shadow-xl scale-110': pathname === href && !isTransparent,
                          'bg-white text-primary shadow-xl scale-110': pathname === href && isTransparent,
                          'text-white/80 hover:text-white hover:bg-white/10': pathname !== href && isTransparent,
                           'text-muted-foreground hover:text-primary hover:bg-primary/5': pathname !== href && !isTransparent,
                        }
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="whitespace-nowrap">{label}</span>
                    </Link>
                  ))}
                </div>
                
                <div className="flex items-center gap-3 ml-2 border-l border-white/10 pl-4">
                  <div className="scale-110">
                    <ThemeToggle isTransparent={isTransparent}/>
                  </div>
                  <Link href="/contact" className="hidden lg:block">
                    <Button className="rounded-full font-black uppercase tracking-widest text-[9px] h-10 px-6 shadow-xl shadow-primary/20 transition-transform hover:scale-105">
                      Establish Dialogue
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-4 inset-x-4 z-50 h-16 rounded-2xl border border-border/40 bg-background/80 backdrop-blur-md shadow-lg overflow-hidden">
        <nav className="flex h-full items-center justify-around text-muted-foreground">
          {mobileBottomNavLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex flex-col flex-1 items-center justify-center gap-1 p-1 text-xs font-medium transition-colors",
                pathname === href ? "text-primary" : "hover:text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
          {/* More Button */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col flex-1 items-center justify-center gap-1 p-1 text-xs font-medium transition-colors hover:text-primary">
                <Menu className="h-5 w-5" />
                <span>More</span>
              </button>
            </SheetTrigger>
              <SheetContent side="bottom" className="p-0 bg-background h-auto max-h-[85vh] rounded-t-2xl flex flex-col">
                <SheetHeader className="p-4 border-b text-left flex flex-row justify-between items-center">
                  <SheetTitle>
                      <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
                        <Logo className="h-10 w-10" />
                        <span className="ml-2 font-bold">4 Seasons</span>
                      </Link>
                  </SheetTitle>
                  <ThemeToggle />
                </SheetHeader>
                <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                  <Button variant="outline" onClick={()=>{toggleLang(); setOpen(false);}} className="w-full">
                    <Globe className="mr-2 h-5 w-5" />
                    Switch to {lang === "EN" ? "AR" : "EN"}
                  </Button>
                  {navLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary p-3 rounded-md",
                        pathname === href ? "bg-primary/10 text-primary" : "text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{label}</span>
                    </Link>
                  ))}
                </div>
              </SheetContent>
          </Sheet>
        </nav>
      </div>
    </>
  );
}
