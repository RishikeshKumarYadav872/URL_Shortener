"use client";

import { motion } from "framer-motion";
import styles from "./Features.module.css";

const features = [
  {
    icon: "⚡",
    title: "Edge-Powered Redirects",
    desc: "Sub-15ms redirects via global edge network. Your links resolve instantly, anywhere in the world.",
  },
  {
    icon: "📊",
    title: "Real-Time Analytics",
    desc: "Track clicks, locations, devices, and referrers. Know exactly how your links perform.",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    desc: "IPs are hashed, not stored. Rate-limited endpoints prevent abuse. Your data stays safe.",
  },
  {
    icon: "🎯",
    title: "Custom Aliases",
    desc: "Choose memorable, branded slugs for your links. Make every URL count.",
  },
  {
    icon: "📱",
    title: "QR Code Generation",
    desc: "Instant SVG QR codes for every link. Download and share anywhere.",
  },
  {
    icon: "⏰",
    title: "Expiring Links",
    desc: "Set automatic expiration dates. Perfect for time-sensitive campaigns.",
  },
];

export default function Features() {
  return (
    <section className={styles.section} id="features">
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>
            Everything you need to <span className="gradient-text">own your links</span>
          </h2>
          <p className={styles.subtitle}>
            Built for speed, designed for insight, engineered for scale.
          </p>
        </motion.div>
        <div className={styles.grid}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <span className={styles.icon}>{f.icon}</span>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardDesc}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
