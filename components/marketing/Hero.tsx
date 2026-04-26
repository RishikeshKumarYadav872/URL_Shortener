"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import styles from "./Hero.module.css";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);

  return (
    <section ref={ref} className={styles.hero}>
      {/* Grid background */}
      <div className={styles.gridBg} />

      {/* Floating cards */}
      <motion.div className={styles.floatingCards} style={{ y: y1, opacity }}>
        <motion.div
          className={styles.floatCard}
          style={{ top: "15%", left: "8%" }}
          animate={{ y: [0, -15, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className={styles.floatCardUrl}>snip.link/launch</span>
          <span className={styles.floatCardClicks}>2,847 clicks</span>
        </motion.div>
        <motion.div
          className={styles.floatCard}
          style={{ top: "25%", right: "6%" }}
          animate={{ y: [0, 12, 0], rotate: [1, -2, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <span className={styles.floatCardUrl}>snip.link/demo</span>
          <span className={styles.floatCardClicks}>14,203 clicks</span>
        </motion.div>
        <motion.div
          className={styles.floatCard}
          style={{ bottom: "30%", left: "12%" }}
          animate={{ y: [0, -10, 0], rotate: [2, -1, 2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <span className={styles.floatCardUrl}>snip.link/pitch</span>
          <span className={styles.floatCardClicks}>891 clicks</span>
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div className={styles.content} style={{ y: y2, scale }}>
        <motion.div
          className={styles.badge}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className={styles.badgeDot} />
          Ultra-Fast Edge Redirects
        </motion.div>

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Shorten Links.
          <br />
          <span className="gradient-text">Amplify Reach.</span>
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Create powerful short links in milliseconds. Track every click
          with real-time analytics. Deploy on the edge for blazing speed.
        </motion.p>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className={styles.bottomFade} />
    </section>
  );
}
