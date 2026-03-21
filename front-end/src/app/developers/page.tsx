import { getDevelopers } from "@/lib/api";
import { DevelopersPageClient } from "@/components/developers/developers-page-client";

export default async function DevelopersPage() {
  const developersData = await getDevelopers();

  return (
    <DevelopersPageClient initialDevelopers={developersData.results} />
  );
}