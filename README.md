# Jupiter Portfolio Rebalancer

A showcase application demonstrating Jupiter Protocol integration for portfolio rebalancing on Solana.

## 🚀 Features

- **Wallet Connection**: Connect Solana wallets (Phantom, Solflare, etc.)
- **Portfolio Display**: View your token balances and portfolio overview
- **Jupiter Integration**: Direct links to Jupiter Terminal and API documentation
- **Modern UI**: Beautiful, responsive design with Jupiter branding
- **Real-time Updates**: Live wallet connection status

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS v4
- **Wallet**: Solana Wallet Adapter
- **Blockchain**: Solana (Devnet)
- **Icons**: Lucide React
- **Package Manager**: pnpm

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jup-rebalancer
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Connecting Your Wallet
1. Click the "Connect Wallet" button in the header
2. Select your preferred Solana wallet (Phantom recommended)
3. Approve the connection in your wallet

### Viewing Your Portfolio
- Once connected, your token balances will be displayed
- Click the refresh button to update balances
- Portfolio shows SOL and USDC balances (expandable)

### Jupiter Integration
- Click "Open Jupiter Integration" to explore Jupiter features
- Access Jupiter Terminal for swapping tokens
- View Jupiter API documentation for developers

## 🔗 Jupiter Ecosystem Links

- **Jupiter Protocol**: [https://jup.ag](https://jup.ag)
- **Jupiter Terminal**: [https://terminal.jup.ag](https://terminal.jup.ag)
- **Developer Docs**: [https://dev.jup.ag](https://dev.jup.ag)
- **Branding Guidelines**: [https://dev.jup.ag/docs/misc/integrator-guidelines](https://dev.jup.ag/docs/misc/integrator-guidelines)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── WalletProvider.tsx    # Solana wallet context
│   ├── globals.css               # Global styles and Jupiter branding
│   ├── layout.tsx                # Root layout with wallet provider
│   └── page.tsx                  # Main rebalancer interface
├── public/                       # Static assets
└── package.json                  # Dependencies and scripts
```

## 🎨 Jupiter Branding

This application follows Jupiter's branding guidelines:
- **Primary Colors**: Purple (#9945FF) and Pink (#FF6B9D)
- **Gradient**: Purple to Pink gradient for buttons and accents
- **Typography**: Clean, modern fonts with proper hierarchy
- **Icons**: Consistent iconography using Lucide React

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Manual Build
```bash
pnpm build
pnpm start
```

## 🔧 Development

### Available Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Environment Variables
No environment variables required for basic functionality.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Jupiter Protocol](https://jup.ag) for the amazing DeFi infrastructure
- [Solana Labs](https://solana.com) for the blockchain platform
- [Next.js](https://nextjs.org) for the React framework
- [Tailwind CSS](https://tailwindcss.com) for the styling system

---

**Built for the Jupiverse Event** 🚀
