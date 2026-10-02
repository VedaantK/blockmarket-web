"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/** Phone-only bottom bar that appears once the hero is off screen and hides at the footer. */
export function MobileCtaBar() {
  const reduce = useReducedMotion();
  const [heroVisible, setHeroVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(false);
  const show = !heroVisible && !footerVisible;

  useEffect(() => {
    const hero = document.getElementById("hero");
    const footer = document.getElementById("site-footer");
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) setHeroVisible(e.isIntersecting);
        if (e.target === footer) setFooterVisible(e.isIntersecting);
      }
    });
    if (hero) observer.observe(hero);
    if (footer) observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { y: "110%" }}
          animate={reduce ? { opacity: 1 } : { y: 0 }}
          exit={reduce ? { opacity: 0 } : { y: "110%" }}
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
          className="fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t-2 border-ink bg-paper px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden"
        >
          <Link href="/market" className="btn btn-primary btn-sm flex-1 justify-center">
            Order food
          </Link>
          <Link href="/sell" className="btn btn-secondary btn-sm flex-1 justify-center">
            Sell blocks
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
