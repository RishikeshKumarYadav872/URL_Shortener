"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ShortenForm.module.css";

interface ShortenResult {
  id: string;
  slug: string;
  shortUrl: string;
  qrCodeUrl: string;
}

export default function ShortenForm() {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShortenResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const body: Record<string, string> = { url };
      if (customAlias.trim()) {
        body.customAlias = customAlias.trim().toLowerCase();
      }

      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setResult(data);
      setUrl("");
      setCustomAlias("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = result.shortUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <section className={styles.section} id="shorten">
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputRow}>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste your long URL here..."
                  className={styles.urlInput}
                  required
                  id="url-input"
                />
              </div>
              <motion.button
                type="submit"
                className={styles.submitBtn}
                disabled={loading || !url}
                whileTap={{ scale: 0.97 }}
                id="shorten-btn"
              >
                {loading ? (
                  <span className={styles.spinner} />
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                      <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    Shorten
                  </>
                )}
              </motion.button>
            </div>

            {/* Options toggle */}
            <button
              type="button"
              className={styles.optionsToggle}
              onClick={() => setShowOptions(!showOptions)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                width="14"
                height="14"
                style={{ transform: showOptions ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
              {showOptions ? "Hide options" : "Custom alias"}
            </button>

            <AnimatePresence>
              {showOptions && (
                <motion.div
                  className={styles.optionsRow}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.aliasInput}>
                    <span className={styles.aliasPrefix}>sniplink.co/</span>
                    <input
                      type="text"
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      placeholder="your-alias"
                      className={styles.aliasField}
                      pattern="^[a-z0-9-]{3,32}$"
                      id="alias-input"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                className={styles.error}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                className={styles.result}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className={styles.resultUrl}>
                  <span className={styles.resultLabel}>Your short link</span>
                  <span className={styles.resultLink}>{result.shortUrl}</span>
                </div>
                <div className={styles.resultActions}>
                  <motion.button
                    className={`${styles.copyBtn} ${copied ? styles.copyBtnSuccess : ""}`}
                    onClick={copyToClipboard}
                    whileTap={{ scale: 0.95 }}
                    id="copy-btn"
                  >
                    {copied ? (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Copy
                      </>
                    )}
                  </motion.button>
                  <a
                    href={result.qrCodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.qrBtn}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                      <rect x="14" y="14" width="3" height="3" />
                      <rect x="18" y="18" width="3" height="3" />
                    </svg>
                    QR
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
