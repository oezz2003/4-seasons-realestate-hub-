import Link from "next/link";
import { Logo } from "@/components/icons";
import { Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-slate-200 dark:border-slate-800 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 font-body text-sm uppercase tracking-widest font-black">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center space-x-3 mb-6 group">
            <Logo className="h-10 w-10 transition-transform duration-500 group-hover:scale-105" />
            <span className="font-headline text-2xl font-black text-primary">4 Seasons Hub</span>
          </Link>
          <p className="text-muted-foreground normal-case tracking-normal mb-8 leading-relaxed font-medium">
            Curating the finest real estate across Egypt&apos;s most exclusive destinations. Excellence in every season.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm hover:text-primary transition-all">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="#" className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm hover:text-primary transition-all">
              <Instagram className="w-5 h-5" />
            </Link>
          </div>
        </div>
        
        <div>
          <h5 className="font-black text-primary mb-8">Properties</h5>
          <ul className="space-y-4 font-bold">
            <li><Link href="/search?typology=Villa" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">Coastline Villas</Link></li>
            <li><Link href="/search?typology=Penthouse" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">Urban Penthouses</Link></li>
            <li><Link href="/search?typology=Chalet" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">Desert Retreats</Link></li>
            <li><Link href="/new-launches" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">New Developments</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-black text-primary mb-8">The Hub</h5>
          <ul className="space-y-4 font-bold">
            <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">About Us</Link></li>
            <li><Link href="/developers" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">Our Team</Link></li>
            <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">Sustainability</Link></li>
            <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">Press Kit</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-black text-primary mb-8">Newsletter</h5>
          <p className="text-muted-foreground normal-case tracking-normal mb-6 font-medium">Stay updated with the latest Egyptian luxury releases.</p>
          <div className="flex flex-col gap-2">
            <input 
              className="bg-white dark:bg-slate-900 border-none rounded-lg px-4 py-3 text-sm focus:ring-primary shadow-sm" 
              placeholder="Email Address" 
              type="email"
            />
            <Button className="font-black tracking-widest uppercase text-[10px] h-12">Subscribe</Button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 mt-20 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60 text-xs font-bold tracking-widest uppercase">
        <p>© {new Date().getFullYear()} 4 Seasons Hub. Curating Time and Place.</p>
        <div className="flex gap-8">
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
