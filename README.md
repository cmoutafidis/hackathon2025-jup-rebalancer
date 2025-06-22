# Jupiter Rebalancer & Swap DApp

[![Live Demo](https://img.shields.io/badge/Live%20Demo-jup--rebalancer.vercel.app-blue?style=flat-square)](https://jup-rebalancer.vercel.app/swap)

**Live Deployment:** [https://jup-rebalancer.vercel.app/swap](https://jup-rebalancer.vercel.app/swap)

---

## 🚀 Project Overview

Jupiter Rebalancer & Swap is a modern Solana dApp that lets you:
- Explore all tokens supported by [Jupiter Exchange](https://jup.ag)
- View real-time prices for each token
- Search and filter tokens instantly
- Paginate through the token list (20 per page)
- Enjoy a clean, card-based UI with custom branding
- Seamlessly navigate between Home, Swap, and GitHub
- Built with a focus on performance, clarity, and extensibility

---

## 🖼️ Branding
- **Logo:** Custom SVG logo (`jupi.svg`) in the header
- **Favicon:** Custom ICO favicon (`jupi.ico`)

---

## 🧭 Navigation
- **Home:** `/` — Portfolio Rebalancer (future extension)
- **Swap:** `/swap` — Token explorer and price board
- **GitHub:** [Project Repo](https://github.com/harshakp06/jup-rebalancer)

---

## 🔗 APIs Used
- **Jupiter Token List:** [`https://token.jup.ag/strict`](https://token.jup.ag/strict)
- **Jupiter Price API:** [`https://quote-api.jup.ag/v6/quote`](https://quote-api.jup.ag/v6/quote)
- **Local API (tokens):** `/api/jupiter-tokens`
- **Local API (prices):** `/api/jupiter-prices`

---

## 🛠️ Technologies
- **Framework:** Next.js 15 (React 19)
- **Styling:** Tailwind CSS v4
- **Wallet:** Solana Wallet Adapter
- **Icons:** Lucide React
- **Package Manager:** pnpm

---

## 📦 Setup & Usage

### Prerequisites
- Node.js (v18+ recommended)
- pnpm (recommended)

### Install
```bash
pnpm install
```

### Development
```bash
pnpm dev --port 3000
```
Visit [http://localhost:3000/swap](http://localhost:3000/swap)

### Production
```bash
pnpm build
pnpm start
```

---

## ✨ Features
- **/swap page:**
  - Lists all Jupiter-supported tokens (20 per page, paginated)
  - Real-time price fetching
  - Search bar with clear UI
  - Responsive, modern card design
  - Navigation bar with Home, Swap, GitHub (spaced, styled)
  - Custom logo and favicon
- **API integration:**
  - Uses Jupiter's strict token list and quote APIs
  - Local API endpoints for tokens and prices
- **Branding:**
  - Custom SVG logo and ICO favicon

---

## 🪐 Built at Namaste Jupiverse - Hackathon Edition (HYD)

This project was created at the [Namaste Jupiverse - Hackathon Edition (HYD)](https://lu.ma/e72uehpe?tk=J8J2UI), a high-intensity, in-person builder jam powered by Jupiter Exchange and the Jup India Chapter.

**About Jupiter Exchange:**
> Jupiter is the #1 liquidity aggregator on Solana, powering the best possible token swaps across the entire ecosystem. Jupiter is more than just a swap engine — it's the backbone of Solana DeFi, with products like Jupiter Mobile, Pro, Portfolio, and the upcoming Jupiter Lend. Jupiter is trusted by builders and protocols shaping the future of Solana. ([source](https://lu.ma/e72uehpe?tk=J8J2UI))

**Event Highlights:**
- Real-world dApp use cases
- Deep dives into Jupiter APIs
- Mentorship from Jupiter DevRel and core team
- Prizes and opportunities for further development

---

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License
MIT
