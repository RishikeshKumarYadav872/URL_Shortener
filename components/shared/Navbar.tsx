"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession, signIn, signOut } from "next-auth/react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.inner}>
        <a href="/" className={styles.logo}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M13 7l5 5-5 5M6 12h12" stroke="url(#g)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs><linearGradient id="g" x1="6" y1="7" x2="18" y2="17"><stop stopColor="#14b8a6"/><stop offset="1" stopColor="#06b6d4"/></linearGradient></defs>
          </svg>
          <span>Sniplink</span>
        </a>
        <div className={styles.links}>
          <a href="#features" className={styles.link}>Features</a>
          <a href="#shorten" className={styles.link}>Shorten</a>
          {status === "loading" ? null : session ? (
            <>
              <a href="/dashboard" className={styles.ctaBtn}>Dashboard</a>
              <button onClick={() => signOut({ callbackUrl: '/' })} className={styles.link} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                Sign Out
              </button>
            </>
          ) : (
            <button onClick={() => signIn()} className={styles.ctaBtn} style={{ border: 'none', cursor: 'pointer' }}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
