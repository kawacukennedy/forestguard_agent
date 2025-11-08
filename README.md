# ForestGuard Agent

An autonomous AI system for real-time deforestation detection.

## Setup

1. Install dependencies:
   - Backend: `cd backend && pip install -r requirements.txt`
   - Frontend: `cd frontend && npm install`

2. Run with Docker: `docker-compose up`

3. Or run locally:
   - Backend: `cd backend && uvicorn main:app --reload`
   - Frontend: `cd frontend && npm start`

## Features

- Image upload and processing
- Agentic pipeline for deforestation detection
- Dashboard with map view
- Incident reports

## Next Steps

- Implement ML model
- Add agent logic
- Integrate notifications
- Add authentication