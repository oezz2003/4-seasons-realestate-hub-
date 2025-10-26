import { SellPropertyForm } from "@/components/sell-property-form";

export default function SellMyPropertyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="text-center mb-10">
        <div className="overflow-hidden py-1">
          <h1 className="text-4xl font-bold font-headline animate-title-reveal">Sell Your Property With Us</h1>
        </div>
        <div className="overflow-hidden py-1">
          <p className="mt-2 text-lg text-muted-foreground animate-title-reveal" style={{ animationDelay: '0.1s' }}>
            Fill out the form below, and our AI will help you craft the perfect listing.
          </p>
        </div>
      </div>
      <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
        <SellPropertyForm />
      </div>
    </div>
  );
}
