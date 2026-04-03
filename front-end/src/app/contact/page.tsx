import { getPageContent } from "@/lib/api";
import { ContactClient } from "./contact-client";

export default async function ContactPage() {
  const cmsData = await getPageContent('contact-info');

  return (
    <ContactClient cmsData={cmsData} />
  );
}
