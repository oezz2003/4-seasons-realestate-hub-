"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((lead) =>
            lead.id === id ? { ...lead, status: newStatus } : lead
          )
        );
        toast({ title: "Success", description: "Status updated" });
      } else {
        toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Network error", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
        toast({ title: "Success", description: "Lead deleted" });
      } else {
        toast({ title: "Error", description: "Failed to delete lead", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Network error", variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading leads...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">Manage user sign-ups and property interests.</p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Interests</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                  No leads found.
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(lead.submittedAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">{lead.email}</div>
                    {lead.phone && <div className="text-xs text-muted-foreground">{lead.phone}</div>}
                  </TableCell>
                  <TableCell>
                    <div className="text-xs space-y-1">
                      {lead.location && <div><span className="font-semibold">Loc:</span> {lead.location.name}</div>}
                      {lead.compound && <div><span className="font-semibold">Comp:</span> {lead.compound.name}</div>}
                      {lead.developer && <div><span className="font-semibold">Dev:</span> {lead.developer.name}</div>}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={lead.message}>
                    {lead.message || "-"}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={lead.status}
                      onValueChange={(val) => handleStatusChange(lead.id, val)}
                    >
                      <SelectTrigger className="w-[130px] h-8 text-xs">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Contacted">Contacted</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(lead.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
