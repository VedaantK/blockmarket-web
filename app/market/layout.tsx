import { CartButton } from "@/components/market/CartButton";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteTabs } from "@/components/SiteTabs";
import { CartProvider } from "@/lib/cart";

export default function MarketLayout({ children }: LayoutProps<"/market">) {
  return (
    <CartProvider>
      <SiteHeader tabs={<SiteTabs />}>
        <CartButton />
      </SiteHeader>
      <main className="theme-light flex-1">{children}</main>
      <SiteFooter />
    </CartProvider>
  );
}
