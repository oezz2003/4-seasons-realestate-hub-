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
  { href: "/sell-my-property", label: "Sell Your Property", icon: Tag },
  { href: "/about", label: "About Us", icon: Info },
  { href: "/blog", label: "Blog", icon: Newspaper },
  { href: "/contact", label: "Contact", icon: Mail },
];

const mobileBottomNavLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/developers", label: "Developers", icon: Building },
  { href: "/sell-my-property", label: "Sell", icon: Tag },
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
  const barStyles = isTransparent ? 'bg-black/30 backdrop-blur-sm' : 'bg-background/95 shadow-lg';
  
  return (
    <>
      {/* Desktop Header */}
      <header className={cn(
          "sticky top-0 z-50 w-full hidden md:block transition-colors duration-300 py-2",
      )}>
        <div className="container mx-auto">
          <div className={cn(
              "flex h-16 w-full items-center rounded-2xl px-4 transition-all duration-300",
              barStyles
          )}>
            {/* Left Side: takes up equal space */}
            <div className="flex-1 justify-start">
              <Link href="/" className={cn("flex items-center space-x-2", isTransparent ? 'text-white' : 'text-foreground')}>
                <Logo className={cn("h-6 w-6", isTransparent ? 'text-white' : 'text-primary')}/>
                <span className="font-bold sm:inline-block font-headline">
                  4 Seasons
                </span>
              </Link>
            </div>

            {/* Centered Navigation */}
            <nav className="flex-shrink-0">
              <div className="flex items-center justify-center gap-1.5">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-2 py-2 text-sm font-medium transition-colors",
                      {
                        'bg-primary/10 text-primary': pathname === href && !isTransparent,
                        'bg-white/20 text-white font-semibold': pathname === href && isTransparent,
                        'text-white hover:text-white hover:bg-white/10': pathname !== href && isTransparent,
                         'text-muted-foreground hover:text-primary': pathname !== href && !isTransparent,
                      }
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </nav>

            {/* Right Side: takes up equal space */}
            <div className="flex flex-1 items-center justify-end gap-2">
                <ThemeToggle isTransparent={isTransparent}/>
                <Button variant="ghost" onClick={toggleLang} aria-label="Toggle Language" className={cn("rounded-full", isTransparent ? "text-white hover:bg-white/10 hover:text-white" : "text-muted-foreground hover:text-primary")}>
                    <Globe className="h-5 w-5" />
                    <span className="ml-2 font-semibold">{lang}</span>
                </Button>
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
                        <Logo className="h-6 w-6 text-primary" />
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
