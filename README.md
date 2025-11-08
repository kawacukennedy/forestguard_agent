# ForestGuard Agent Universal

An omnichain AI + Web3 system that detects, verifies, and tokenizes deforestation incidents across Solana, Sui, TON, and other chains via ZetaChain. It integrates AI agents (Vision, Verifier, Geolocation, Packager), mints NFT/reward proofs, and synchronizes them cross-chain. Each incident report is verified, tokenized, and accessible on multiple chains. The app demonstrates true universal connectivity with onCall, onRevert, and onAbort functions enabling seamless cross-chain interactions.

## Features

- **Omnichain NFT Minting**: Mint incident NFTs across Solana, Sui, TON via ZetaChain Gateway and Universal NFT contracts.
- **Cross-Chain Synchronization**: onCall/onRevert/onAbort hooks for seamless multi-chain interactions.
- **Image Upload & Processing**: Upload images with metadata, automatic omnichain pipeline triggering.
- **Agentic Pipeline**: Vision Agent (ML detection), Verifier Agent (cross-verification), Geolocation Agent (area & carbon calc), Packager Agent (PDF reports), ZetaChain NFT Agent (cross-chain minting), Notification Agent (alerts).
- **Dashboard**: Mapbox-powered map with incident polygons, filters by date, confidence, status, chain, search bar.
- **Incident Details**: View images, transcripts, carbon estimates, cross-chain TX hashes, NFT IDs, download PDFs, claim rewards.
- **Authentication**: Builder ID integration (mock), multi-wallet connection (Solana/Sui/TON/Somnia), JWT tokens.
- **Notifications**: Slack, Telegram, Email, Web3 dashboards.
- **Storage**: IPFS/Somnia decentralized storage with S3/local fallback.
- **Async Processing**: Celery for background tasks.
- **Universal Verification**: Cross-chain timestamping and NFT proofs for tamper-proof records.

## Architecture

- **Frontend**: React + Tailwind CSS + Web3 wallet SDKs (Solana/Sui/TON/Somnia), Mapbox GL.
- **Backend**: FastAPI, PostgreSQL/SQLite, Celery + Redis, ZetaChain SDK.
- **ML**: PyTorch U-Net for segmentation.
- **Agents**: Python scripts for each agent, ZetaChain integration.
- **Deployment**: Docker Compose, ZetaChain testnet.

## Setup & Run

### Prerequisites
- Docker & Docker Compose
- Node.js & npm
- Python 3.11+

### Local Development

1. Clone repo: `git clone <repo> && cd forestguard`

2. Backend setup:
   ```bash
   cd backend
   pip install -r requirements.txt
   python init_db.py
   ```

3. Frontend setup:
   ```bash
   cd frontend
   npm install
   ```

4. Run services:
   - Backend: `uvicorn main:app --reload`
   - Frontend: `npm start`
   - Redis: `redis-server` (for Celery)

### Docker Deployment

```bash
docker-compose up --build
```

Services:
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- Database: PostgreSQL
- Redis: For Celery

### Environment Variables

Create `.env` in backend/:
```
DATABASE_URL=postgresql://user:password@localhost/forestguard
SECRET_KEY=your-secret
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET=forestguard-bucket
SLACK_WEBHOOK_URL=...
TELEGRAM_BOT_TOKEN=...
EMAIL_SMTP_SERVER=smtp.gmail.com
EMAIL_USERNAME=...
EMAIL_PASSWORD=...
ZETACHAIN_TESTNET_RPC=https://zetachain-testnet.example.com
ZETACHAIN_PRIVATE_KEY=your-private-key
```

Frontend `.env`:
```
REACT_APP_MAPBOX_TOKEN=your-mapbox-token
REACT_APP_SOLANA_RPC=https://api.mainnet-beta.solana.com
REACT_APP_SUI_RPC=https://fullnode.mainnet.sui.io
REACT_APP_TON_RPC=https://toncenter.com/api/v2/jsonRPC
```

## Usage

1. Register/Login with Builder ID and connect multi-chain wallets (Solana/Sui/TON).
2. Upload images on /upload; earn reward points upon cross-chain NFT minting.
3. View processing progress with onCall/onRevert/onAbort status.
4. See incidents on /dashboard map with cross-chain NFT proofs.
5. Click incident for details, download PDF, claim rewards on selected chain.
6. Check leaderboard on /stats for top contributors across chains.

## Agent Orchestration

Built with Amazon Q Developer for code generation, Kiro for spec-driven development, and ZetaChain for omnichain NFT minting. Agents run sequentially: Vision -> Verifier -> Geolocation -> Packager -> ZetaChain NFT (onCall/onRevert/onAbort) -> Notification.

### ZetaChain Omnichain Integration

- **Universal NFT Minting**: Incidents are minted as NFTs on multiple chains (Solana, Sui, TON) using ZetaChain Gateway and Universal NFT contracts.
- **onCall/onRevert/onAbort Hooks**: Seamless cross-chain synchronization with rollback on failure.
- **Multi-Chain Wallets**: Connect wallets across chains for identity and reward claiming.
- **Cross-Chain Verification**: NFT proofs are verifiable on any supported chain.
- **Testnet Deployment**: Use ZetaChain testnet for development and demo.

### Web3 Features

- **NFT Minting**: Each verified incident mints an NFT as proof of environmental impact.
- **Tokenized Rewards**: Users earn reward points based on carbon impact; claimable via wallet.
- **Leaderboard**: Top contributors ranked by reward points.
- **Wallet Integration**: Connect MetaMask or Somnia wallet for NFT ownership and reward claiming.

#### Wallet Setup

1. Install MetaMask or Somnia Wallet extension.
2. Create/connect a wallet.
3. In the app, go to Login and connect your wallet.
4. Use the wallet to claim rewards and view NFTs.

#### NFT Minting

- NFTs are minted automatically after pipeline completion.
- View NFT ID in incident details.
- Transfer or trade NFTs on supported marketplaces.

## ML Model

Simple U-Net for semantic segmentation. Train on deforestation datasets for better accuracy.

## API Endpoints

The API is documented with Swagger UI at `http://localhost:8000/docs` when running the backend.

- `POST /api/upload`: Accepts image(s) and metadata, triggers Somnia agentic pipeline, returns incident ID, pipeline status, and Somnia transaction hash
- `GET /api/incidents`: Returns list of incidents with filters for date, confidence, region, status, chain, and cross-chain verification
- `GET /api/incidents/{id}`: Returns detailed incident data including images, polygon, carbon impact, agent transcript, and cross-chain TX hashes/NFT IDs
- `GET /api/incidents/stats`: Returns statistics on incidents, carbon impact, and trends
- `GET /api/incidents/leaderboard`: Returns top users by reward points across chains
- `POST /api/agents/run`: Trigger omnichain agentic workflow; logs reasoning, transaction hashes, onCall/onRevert/onAbort events
- `POST /api/notify`: Send alerts to Slack, Telegram, Email, or Web3 dashboards
- `POST /api/infer`: Direct ML inference on uploaded images

## Contributing

Use Amazon Q Developer for code assistance, Kiro for testing specs.

## License

MIT