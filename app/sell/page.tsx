import type { Metadata } from "next";
import { SellDashboard } from "@/components/sell/SellDashboard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteTabs } from "@/components/SiteTabs";

export const metadata: Metadata = {
  title: "Sell your blocks | Block Market",
};

export default function SellPage() {
  return (
    <>
      <SiteHeader tabs={<SiteTabs />} />
      <main className="theme-light flex-1">
        <SellDashboard />
      </main>
      <SiteFooter />
    </>
  );
}
