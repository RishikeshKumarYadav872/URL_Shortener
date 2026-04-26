"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import styles from "./Stats.module.css";

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
}

const stats: StatItem[] = [
  { label: "Links Created", value: 2400000, suffix: "M+", prefix: "" },
  { label: "Redirects Served", value: 850, suffix: "M+", prefix: "" },
  { label: "Avg Redirect Speed", value: 12, suffix: "ms", prefix: "<" },
  { label: "Uptime", value: 99.99, suffix: "%", prefix: "" },
];

function formatValue(item: StatItem): string {
  if (item.suffix === "M+") {
    return `${(item.value / 1000000).toFixed(item.value >= 1000000 ? 1 : 0)}`;
  }
  if (item.suffix === "%") return item.value.toFixed(2);
  return item.value.toString();
}

function AnimatedCounter({ item, inView }: { item: StatItem; inView: boolean }) {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const target = item.suffix === "M+" ? item.value / 1000000 : item.value;
    const duration = 1500;
    const steps = 40;
    const stepDuration = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const progress = current / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = target * eased;
      if (item.suffix === "%") setDisplay(val.toFixed(2));
      else if (item.suffix === "M+") setDisplay(val.toFixed(1));
      else setDisplay(Math.round(val).toString());
      if (current >= steps) clearInterval(timer);
    }, stepDuration);

    return () => clearInterval(timer);
  }, [inView, item]);

  return (
    <span className={styles.statValue}>
      {item.prefix}{display}{item.suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.container}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className={styles.statCard}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <AnimatedCounter item={stat} inView={inView} />
            <span className={styles.statLabel}>{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
