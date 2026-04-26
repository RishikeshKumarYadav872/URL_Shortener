import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>Sniplink</span>
          <p className={styles.tagline}>Ultra-fast URL shortener built on the edge.</p>
        </div>
        <div className={styles.links}>
          <a href="#features">Features</a>
          <a href="#shorten">Shorten</a>
          <a href="/dashboard">Dashboard</a>
        </div>
        <div className={styles.copy}>
          &copy; {new Date().getFullYear()} Sniplink. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
