# ForestGuard Agent

An autonomous, multi-agent AI system for real-time detection, verification, and reporting of deforestation events. The system ingests satellite, drone, and community-submitted images, detects tree loss, verifies flagged events through multi-agent reasoning, estimates carbon impact, and auto-generates incident packages for NGOs, park rangers, and authorities.

## Features

- **Image Upload & Processing**: Upload images with metadata, automatic pipeline triggering.
- **Agentic Pipeline**: Vision Agent (ML detection), Verifier Agent (cross-verification), Geolocation Agent (area & carbon calc), Packager Agent (PDF reports), Decentralization Agent (Somnia publishing), Notification Agent (alerts).
- **Dashboard**: Mapbox-powered map with incident polygons, filters by date, confidence, status, search bar.
- **Incident Details**: View images, transcripts, carbon estimates, Somnia hash, download PDFs, navigation.
- **Authentication**: Builder ID integration (mock), Somnia wallet connection, JWT tokens.
- **Notifications**: Slack, Telegram, Email.
- **Storage**: Somnia decentralized storage (IPFS-compatible) with S3/local fallback.
- **Async Processing**: Celery for background tasks.
- **Decentralized Verification**: Blockchain timestamping and Somnia transaction hashes for tamper-proof records.

## Architecture

- **Frontend**: React + Tailwind CSS, Mapbox GL.
- **Backend**: FastAPI, PostgreSQL/SQLite, Celery + Redis.
- **ML**: PyTorch U-Net for segmentation.
- **Agents**: Python scripts for each agent.
- **Deployment**: Docker Compose.

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
SOMNIA_NODE_URL=https://somnia-node.example.com
SOMNIA_API_KEY=your-somnia-key
```

Frontend `.env`:
```
REACT_APP_MAPBOX_TOKEN=your-mapbox-token
REACT_APP_SOMNIA_WALLET_SDK_URL=https://somnia-wallet-sdk.example.com
```

## Usage

1. Register/Login with Builder ID.
2. Upload images on /upload.
3. View processing progress.
4. See incidents on /dashboard map.
5. Click incident for details, download PDF.

## Agent Orchestration

Built with Amazon Q Developer for code generation, Kiro for spec-driven development, and Somnia for decentralized agent execution. Agents run sequentially: Vision -> Verifier -> Geolocation -> Packager -> Decentralization -> Notification.

### Somnia Integration

- **Wallet Setup**: Register with a Somnia wallet address for decentralized identity.
- **Decentralized Storage**: Images and reports are stored on Somnia network for tamper-proof access.
- **Transaction Verification**: Each incident includes a Somnia transaction hash for blockchain verification.
- **Network Status**: Real-time indicator shows Somnia node connection.

## ML Model

Simple U-Net for semantic segmentation. Train on deforestation datasets for better accuracy.

## API Endpoints

- `POST /api/upload`: Upload images
- `GET /api/incidents`: List incidents with filters
- `GET /api/incidents/{id}`: Incident details
- `POST /api/agents/run`: Manual pipeline trigger
- `POST /api/notify`: Send notifications

## Contributing

Use Amazon Q Developer for code assistance, Kiro for testing specs.

## License

MIT