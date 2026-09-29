"use client";

import { useEffect, useState } from "react";

/**
 * Current time, ticking every second. Returns null until mounted so the
 * server render never disagrees with the client.
 *
 * In development, `?now=2026-11-01T12:00` jumps the clock and `?speed=3600`
 * fast-forwards it, which makes the odometers easy to check.
 */
export function useNow() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    let origin = Date.now();
    let speed = 1;
    if (process.env.NODE_ENV === "development") {
      const params = new URLSearchParams(window.location.search);
      const override = params.get("now");
      if (override && !Number.isNaN(Date.parse(override))) origin = Date.parse(override);
      speed = Number(params.get("speed")) || 1;
    }
    const realStart = Date.now();
    const read = () => origin + (Date.now() - realStart) * speed;

    const tick = () => setNow(read());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, speed > 1 ? 100 : 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  return now;
}
