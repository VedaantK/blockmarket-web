import type { Metadata } from "next";
import { MarketHome } from "@/components/market/MarketHome";

export const metadata: Metadata = {
  title: "Order food | Block Market",
};

export default function MarketPage() {
  return <MarketHome />;
}
