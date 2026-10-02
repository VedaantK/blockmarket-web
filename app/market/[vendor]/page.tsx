import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VendorStore } from "@/components/market/VendorStore";
import { findVendor, VENDORS } from "@/lib/vendors";

export function generateStaticParams() {
  return VENDORS.map((v) => ({ vendor: v.id }));
}

export async function generateMetadata(props: PageProps<"/market/[vendor]">): Promise<Metadata> {
  const { vendor } = await props.params;
  const v = findVendor(vendor);
  return { title: v ? `${v.name} | Block Market` : "Block Market" };
}

export default async function VendorPage(props: PageProps<"/market/[vendor]">) {
  const { vendor } = await props.params;
  const v = findVendor(vendor);
  if (!v) notFound();
  return <VendorStore vendorId={v.id} />;
}
