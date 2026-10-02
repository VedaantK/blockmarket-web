export type Vendor = {
  id: string;
  name: string;
  cuisine: string;
  /** Extra words people might search for. */
  tags: string[];
  image: string;
  /** Opening hours in Eastern time, as decimal hours (21.5 = 9:30 PM). */
  hours: { open: number; close: number };
  /** Typical wait from ordering to pickup, in minutes. */
  readyMins: [number, number];
};

// Photos are placeholders until we have real shots of each spot.
export const VENDORS: Vendor[] = [
  { id: "hunan", name: "Hunan Express", cuisine: "Chinese", tags: ["orange chicken", "fried rice", "rangoon"], image: "/vendors/hunan.jpg", hours: { open: 11, close: 21 }, readyMins: [15, 25] },
  { id: "the-edge", name: "The Edge", cuisine: "Pizza", tags: ["margherita", "italian", "slice"], image: "/vendors/the-edge.jpg", hours: { open: 11, close: 23 }, readyMins: [10, 20] },
  { id: "au-bon-pain", name: "Au Bon Pain", cuisine: "Bakery & café", tags: ["bagel", "breakfast", "sandwich", "coffee"], image: "/vendors/au-bon-pain.jpg", hours: { open: 7, close: 16 }, readyMins: [5, 15] },
  { id: "k-truck", name: "K Truck", cuisine: "Korean", tags: ["rice bowl", "gochujang", "food truck"], image: "/vendors/k-truck.jpg", hours: { open: 11, close: 19.5 }, readyMins: [10, 20] },
];

/** Empty slots shown after the real vendors to fill out the rail. */
export const PLACEHOLDER_COUNT = 5;

export function matchesQuery(vendor: Vendor, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [vendor.name, vendor.cuisine, ...vendor.tags].some((s) => s.toLowerCase().includes(q));
}

export function findVendor(id: string) {
  return VENDORS.find((v) => v.id === id);
}

/** Current time of day in Eastern, as decimal hours. */
export function easternHour(now: number) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return get("hour") + get("minute") / 60;
}

export function isOpen(vendor: Vendor, now: number) {
  const h = easternHour(now);
  return h >= vendor.hours.open && h < vendor.hours.close;
}

/** 21.5 → "9:30 PM" */
export function formatHour(h: number) {
  const hour = Math.floor(h);
  const mins = Math.round((h - hour) * 60);
  const suffix = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return mins ? `${h12}:${String(mins).padStart(2, "0")} ${suffix}` : `${h12} ${suffix}`;
}

/** Short open/closed line for a vendor, e.g. "Open until 9 PM". */
export function hoursLabel(vendor: Vendor, now: number) {
  return isOpen(vendor, now)
    ? `Open until ${formatHour(vendor.hours.close)}`
    : `Closed · opens ${formatHour(vendor.hours.open)}`;
}
