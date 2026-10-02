import type { Metadata } from "next";
import { Checkout } from "@/components/market/Checkout";

export const metadata: Metadata = {
  title: "Checkout | Block Market",
};

export default function CheckoutPage() {
  return <Checkout />;
}
