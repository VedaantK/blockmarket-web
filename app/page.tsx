import type { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteTabs } from "@/components/SiteTabs";
import { StatsStrip } from "@/components/StatsStrip";
import { VendorRail } from "@/components/VendorRail";

export const metadata: Metadata = {
};

export default function Home() {
  return (
    <>
      <SiteHeader tabs={<SiteTabs />} />
      <main className="theme-light flex-1">
        <Hero />
        <StatsStrip />
        <VendorRail />
        <HowItWorks />
        <Faq />
      </main>
      <SiteFooter />
      <MobileCtaBar />
    </>
  );
}
