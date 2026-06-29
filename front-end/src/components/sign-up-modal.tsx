"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function SignUpModal({ mobile }: { mobile?: boolean }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [locations, setLocations] = useState<any[]>([]);
  const [compounds, setCompounds] = useState<any[]>([]);
  const [developers, setDevelopers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    locationId: "",
    compoundId: "",
    developerId: "",
    message: "",
  });

  useEffect(() => {
    if (open) {
      // Fetch dynamic options when modal opens
      const fetchData = async () => {
        try {
          const [locRes, compRes, devRes] = await Promise.all([
            fetch("/api/locations"),
            fetch("/api/compounds"),
            fetch("/api/developers"),
          ]);
          if (locRes.ok) setLocations(await locRes.json());
          if (compRes.ok) setCompounds(await compRes.json());
          if (devRes.ok) setDevelopers(await devRes.json());
        } catch (error) {
          console.error("Error fetching filters:", error);
        }
      };
      fetchData();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          locationId: formData.locationId ? parseInt(formData.locationId) : undefined,
          compoundId: formData.compoundId ? parseInt(formData.compoundId) : undefined,
          developerId: formData.developerId ? parseInt(formData.developerId) : undefined,
        }),
      });

      if (res.ok) {
        toast({
          title: "Success",
          description: "Your request has been submitted successfully.",
        });
        setOpen(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          locationId: "",
          compoundId: "",
          developerId: "",
          message: "",
        });
      } else {
        const error = await res.json();
        toast({
          title: "Error",
          description: error.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mobile ? (
          <Button variant="default" className="w-full uppercase tracking-widest text-xs font-bold">
            Sign Up
          </Button>
        ) : (
          <Button className="rounded-full font-black uppercase tracking-widest text-[9px] h-10 px-6 shadow-xl shadow-primary/20 transition-transform hover:scale-105">
            Sign Up
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register Your Interest</DialogTitle>
          <DialogDescription>
            Provide your details below to receive personalized offers and updates.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preferred Location (Optional)</Label>
            <Select
              value={formData.locationId}
              onValueChange={(val) => setFormData({ ...formData, locationId: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id.toString()}>{loc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Preferred Compound (Optional)</Label>
            <Select
              value={formData.compoundId}
              onValueChange={(val) => setFormData({ ...formData, compoundId: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any Compound" />
              </SelectTrigger>
              <SelectContent>
                {compounds.map((comp) => (
                  <SelectItem key={comp.id} value={comp.id.toString()}>{comp.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Developer/Company (Optional)</Label>
            <Select
              value={formData.developerId}
              onValueChange={(val) => setFormData({ ...formData, developerId: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any Developer" />
              </SelectTrigger>
              <SelectContent>
                {developers.map((dev) => (
                  <SelectItem key={dev.id} value={dev.id.toString()}>{dev.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Tell us more about your requirements..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
