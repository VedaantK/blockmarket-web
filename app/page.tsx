import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { StatsStrip } from "@/components/StatsStrip";
import { VendorRail } from "@/components/VendorRail";
import { VersionSwitch } from "@/components/VersionSwitch";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <StatsStrip />
      <VendorRail />
      <HowItWorks />
      <Faq />
      <VersionSwitch />
    </main>
  );
}
