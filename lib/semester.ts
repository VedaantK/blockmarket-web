// Fall 2026 figures. Sources: CMU Dining 2026–27 dining plan agreements and
// the CMU 2026–27 official academic calendar.

export type Plan = {
  id: "green" | "blue" | "red";
  name: string;
  blocks: number;
};

export const PLANS: Plan[] = [
  { id: "green", name: "Green", blocks: 292 },
  { id: "blue", name: "Blue", blocks: 252 },
  { id: "red", name: "Red", blocks: 205 },
];

// First day of classes, Mon Aug 24 2026, 12:00 AM Eastern (EDT, UTC-4).
export const PACE_START = Date.parse("2026-08-24T00:00:00-04:00");

// Make-up final exams, Mon Dec 14 2026, end of day Eastern (EST, UTC-5).
export const SEMESTER_END = Date.parse("2026-12-14T23:59:59-05:00");
