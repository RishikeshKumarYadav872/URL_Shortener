"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./DashboardClient.module.css";

interface UrlRecord {
  id: string;
  slug: string;
  destination: string;
  clickCount: number;
  isActive: boolean;
  createdAt: string;
  expiresAt: string | null;
}

interface AnalyticsData {
  totalClicks: number;
  uniqueVisitors: number;
  data: Array<{ date?: string; clicks?: number; country?: string; _count?: { id: number } }>;
}

export default function DashboardClient() {
  const [urls, setUrls] = useState<UrlRecord[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("7d");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const appUrl = typeof window !== "undefined" ? window.location.origin : "";

  const fetchData = useCallback(async () => {
    try {
      const [urlsRes, analyticsRes] = await Promise.all([
        fetch("/api/dashboard/urls"),
        fetch(`/api/analytics?range=${range}`),
      ]);
      if (urlsRes.ok) setUrls(await urlsRes.json());
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function copyLink(slug: string, id: string) {
    try {
      await navigator.clipboard.writeText(`${appUrl}/${slug}`);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { /* fallback */ }
  }

  async function toggleStatus(id: string, currentStatus: boolean) {
    setUrls(urls.map((u) => u.id === id ? { ...u, isActive: !currentStatus } : u));
    try {
      const res = await fetch(`/api/dashboard/urls/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to toggle");
    } catch (e) {
      setUrls(urls.map((u) => u.id === id ? { ...u, isActive: currentStatus } : u));
      console.error("Toggle error:", e);
    }
  }

  const totalLinks = urls.length;
  const totalClicks = urls.reduce((sum, u) => sum + u.clickCount, 0);
  const activeLinks = urls.filter((u) => u.isActive).length;

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Manage your links and track performance</p>
        </div>
        <a href="/" className={styles.backLink}>← Back to home</a>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        {[
          { label: "Total Links", value: totalLinks, icon: "🔗" },
          { label: "Total Clicks", value: totalClicks, icon: "📊" },
          { label: "Active Links", value: activeLinks, icon: "✅" },
          { label: "Unique Visitors", value: analytics?.uniqueVisitors ?? 0, icon: "👥" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            className={styles.statCard}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
          >
            <span className={styles.statIcon}>{stat.icon}</span>
            <span className={styles.statValue}>{stat.value.toLocaleString()}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Range Filter */}
      <div className={styles.filterRow}>
        <span className={styles.filterLabel}>Analytics Range:</span>
        {["24h", "7d", "30d", "90d"].map((r) => (
          <button
            key={r}
            className={`${styles.filterBtn} ${range === r ? styles.filterBtnActive : ""}`}
            onClick={() => setRange(r)}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Links Table */}
      <div className={styles.tableWrapper}>
        <h2 className={styles.sectionTitle}>Your Links</h2>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : urls.length === 0 ? (
          <div className={styles.empty}>
            <p>No links yet. <a href="/#shorten">Create your first short link →</a></p>
          </div>
        ) : (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Short Link</span>
              <span>Destination</span>
              <span>Clicks</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            <AnimatePresence>
              {urls.map((url) => (
                <motion.div
                  key={url.id}
                  className={styles.tableRow}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  layout
                >
                  <span className={styles.slugCell}>
                    <span className={styles.slugText}>/{url.slug}</span>
                  </span>
                  <span className={styles.destCell} title={url.destination}>
                    {url.destination.length > 40
                      ? url.destination.slice(0, 40) + "..."
                      : url.destination}
                  </span>
                  <span className={styles.clicksCell}>{url.clickCount.toLocaleString()}</span>
                  <span className={`${styles.statusBadge} ${url.isActive ? styles.active : styles.inactive}`}>
                    {url.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className={styles.actionsCell}>
                    <button
                      className={styles.actionBtn}
                      onClick={() => copyLink(url.slug, url.id)}
                    >
                      {copiedId === url.id ? "✓" : "Copy"}
                    </button>
                    <button
                      className={`${styles.actionBtn} ${url.isActive ? styles.dangerBtn : styles.successBtn}`}
                      onClick={() => toggleStatus(url.id, url.isActive)}
                    >
                      {url.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
