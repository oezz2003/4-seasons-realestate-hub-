import Link from "next/link";
import { Logo, WhatsappIcon } from "@/components/icons";
import { Facebook, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary/10 border-t border-primary/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-headline">4 Seasons Real Estate</span>
            </Link>
            <p className="text-muted-foreground">Find your next home with us. We are committed to providing the best properties and services.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><WhatsappIcon className="h-6 w-6" /></Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 font-headline">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/search" className="text-muted-foreground hover:text-primary">Find a Property</Link></li>
              <li><Link href="/new-launches" className="text-muted-foreground hover:text-primary">New Launches</Link></li>
              <li><Link href="/sell-my-property" className="text-muted-foreground hover:text-primary">Sell Your Property</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 font-headline">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 font-headline">Contact Us</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>123 Real Estate St, Cairo, Egypt</li>
              <li>Email: contact@4seasons.com</li>
              <li>Phone: +20 123 456 7890</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-muted-foreground mt-12 border-t border-primary/20 pt-8">
          &copy; {new Date().getFullYear()} Four Seasons Real Estate. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
