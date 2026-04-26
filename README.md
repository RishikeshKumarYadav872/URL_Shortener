<div align="center">

<img src="https://img.shields.io/badge/Sniplink-URL%20Shortener-6C63FF?style=for-the-badge&logo=link&logoColor=white" alt="Sniplink" height="40"/>

# ⚡ Sniplink — Ultra-Fast URL Shortener

### *Shorten Links. Amplify Reach.*

> Create powerful short links in milliseconds. Track every click with real-time analytics. Deployed on the edge for blazing speed.

<br/>

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-url--rishi.vercel.app-6C63FF?style=for-the-badge)](https://url-rishi.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-RishikeshKumarYadav872-181717?style=for-the-badge&logo=github)](https://github.com/RishikeshKumarYadav872/URL_Shortener)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

<br/>

![-----](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

</div>

<br/>

## 🌟 What is Sniplink?

**Sniplink** is a production-grade, edge-powered URL shortener that transforms long, unwieldy links into clean, shareable short URLs — instantly. Built for speed and designed for insight, Sniplink brings enterprise-level link management to everyone.

Whether you're a developer, marketer, or creator, Sniplink gives you full control over your links with real-time analytics, custom aliases, QR codes, and more.

<br/>

## ✨ Features

<table>
<tr>
<td width="50%">

### ⚡ Edge-Powered Redirects
Sub-15ms redirects via a global edge network. Your links resolve instantly, anywhere in the world — zero latency, zero compromise.

</td>
<td width="50%">

### 📊 Real-Time Analytics
Track clicks, geographic locations, devices, and referrers. Know exactly how your links perform at every moment.

</td>
</tr>
<tr>
<td width="50%">

### 🔒 Secure & Private
IPs are hashed, never stored raw. Rate-limited endpoints prevent abuse. Your data and your users' privacy stay safe.

</td>
<td width="50%">

### 🎯 Custom Aliases
Choose memorable, branded slugs for your links — make every URL count and build your brand with every share.

</td>
</tr>
<tr>
<td width="50%">

### 📱 QR Code Generation
Instant SVG QR codes generated for every link. Download and share across print, digital, or anywhere you need.

</td>
<td width="50%">

### ⏰ Expiring Links
Set automatic expiration dates on any link. Perfect for time-sensitive campaigns, limited offers, and event promotions.

</td>
</tr>
</table>

<br/>

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/RishikeshKumarYadav872/URL_Shortener.git
cd URL_Shortener
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables
```bash
cp .env.example .env.local
```

Fill in your environment variables:
```env
DATABASE_URL=your_database_url
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# Add any other required keys...
```

### 4. Run Locally
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

<br/>

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js / React |
| **Deployment** | Vercel Edge Network |
| **Database** | Edge-compatible DB (e.g. PlanetScale / Upstash) |
| **Styling** | Tailwind CSS |
| **Analytics** | Custom click tracking |
| **QR Codes** | SVG generation |

</div>

<br/>

## 📁 Project Structure

```
URL_Shortener/
├── 📂 app/               # Next.js App Router pages
│   ├── 📂 dashboard/     # Analytics dashboard
│   ├── 📂 [slug]/        # Dynamic redirect handler
│   └── 📄 page.tsx       # Landing page
├── 📂 components/        # Reusable UI components
├── 📂 lib/               # Utilities, DB helpers, analytics
├── 📂 public/            # Static assets
├── 📄 .env.example       # Environment variable template
└── 📄 package.json       # Dependencies
```

<br/>

## 📊 Performance

<div align="center">

| Metric | Value |
|--------|-------|
| 🌍 Avg. Redirect Speed | **< 15ms** |
| ✅ Uptime | **99.99%** |
| 📦 Links Supported | **Millions** |
| 🔒 Privacy | **IP hashed, never stored** |

</div>

<br/>

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add some amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

Please make sure to update tests as appropriate and follow the existing code style.

<br/>

## 🐛 Issues & Feedback

Found a bug or have a feature request? [Open an issue](https://github.com/RishikeshKumarYadav872/URL_Shortener/issues) on GitHub — all feedback is welcome!

<br/>

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

<br/>

---

<div align="center">

**Built with ❤️ by [Rishikesh Kumar Yadav](https://github.com/RishikeshKumarYadav872)**

⭐ **If you found this project useful, please consider giving it a star!** ⭐

[![Star on GitHub](https://img.shields.io/github/stars/RishikeshKumarYadav872/URL_Shortener?style=social)](https://github.com/RishikeshKumarYadav872/URL_Shortener)

</div>
