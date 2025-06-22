# Jupiter Rebalancer & Swap DApp

A Solana dApp to explore, price, and (future) swap all tokens supported by [Jupiter Exchange](https://jup.ag), the #1 liquidity aggregator on Solana. Built for the Namaste Jupiverse - Hackathon Edition (HYD).

---

## 🚀 About This Project

This project is a modern Next.js dApp that:
- Lists all coins supported by Jupiter with real-time prices
- Fetches token data and prices using Jupiter's official APIs
- Displays tokens in a beautiful card-based UI with logos
- (Planned) Integrates Jupiter swap functionality for seamless token swaps

Access the swap explorer at `/swap`.

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

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- pnpm (recommended)

### Setup
```bash
pnpm install
```

### Development
```bash
pnpm dev --port 3000
```
Visit [http://localhost:3000/swap](http://localhost:3000/swap) to use the token explorer.

### Production Build
```bash
pnpm build
pnpm start
```

---

## 📄 Features
- **/swap page:** Lists all Jupiter-supported tokens with price and logo
- **API integration:** Uses Jupiter's strict token list and quote APIs
- **Modern UI:** Responsive, card-based design
- **Ready for extension:** Foundation for full Jupiter swap integration

---

## 🙏 Credits & Links
- [Namaste Jupiverse - Hackathon Edition (HYD)](https://lu.ma/e72uehpe?tk=J8J2UI)
- [Jupiter Exchange](https://jup.ag)
- [Jup India Chapter Telegram](https://t.me/JupIndia)
- [Jupiter Dev Docs](https://dev.jup.ag/docs/api-setup)

---

## License
MIT
