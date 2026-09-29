export type Vendor = {
  id: string;
  name: string;
  cuisine: string;
  /** Extra words people might search for. */
  tags: string[];
  image: string;
};

// Photos are placeholders until we have real shots of each spot.
export const VENDORS: Vendor[] = [
  { id: "hunan", name: "Hunan Express", cuisine: "Chinese", tags: ["orange chicken", "fried rice", "rangoon"], image: "/vendors/hunan.jpg" },
  { id: "the-edge", name: "The Edge", cuisine: "Pizza", tags: ["margherita", "italian", "slice"], image: "/vendors/the-edge.jpg" },
  { id: "au-bon-pain", name: "Au Bon Pain", cuisine: "Bakery & café", tags: ["bagel", "breakfast", "sandwich", "coffee"], image: "/vendors/au-bon-pain.jpg" },
  { id: "k-truck", name: "K Truck", cuisine: "Korean", tags: ["rice bowl", "gochujang", "food truck"], image: "/vendors/k-truck.jpg" },
];

/** Empty slots shown after the real vendors to fill out the rail. */
export const PLACEHOLDER_COUNT = 5;

export function matchesQuery(vendor: Vendor, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [vendor.name, vendor.cuisine, ...vendor.tags].some((s) => s.toLowerCase().includes(q));
}
