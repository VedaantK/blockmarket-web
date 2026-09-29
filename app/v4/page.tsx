import type { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { HeroV2 } from "@/components/HeroV2";
import { HowItWorks } from "@/components/HowItWorks";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StatsStrip } from "@/components/StatsStrip";
import { VendorRail } from "@/components/VendorRail";
import { VersionSwitch } from "@/components/VersionSwitch";

export const metadata: Metadata = {
  title: "Block Market (V4) | CMU meal block tracker and marketplace",
};

export default function HomeV4() {
  return (
    <>
      <SiteHeader />
      <main className="theme-light theme-white flex-1">
        <HeroV2 />
        <StatsStrip />
        <VendorRail />
        <HowItWorks />
        <Faq />
      </main>
      <SiteFooter />
      <MobileCtaBar />
      <VersionSwitch />
    </>
  );
}
