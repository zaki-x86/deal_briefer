# Deal Briefer

Quick start for running the app with Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Quick start

1. **Clone the repo** (if you haven’t already):
   ```bash
   git clone <repo-url>
   cd deal_briefer
   ```

2. **Set up environment files**

   Backend (Postgres + Django):
   ```bash
   cp backend/example.env backend/.env
   ```
   Edit `backend/.env` and set `GEMINI_API_KEY` to your [Google AI API key](https://aistudio.google.com/apikey) if you want deal-brief generation. Other defaults work for local dev.

   UI (API URL for the frontend):
   ```bash
   cp ui/.env.example ui/.env
   ```
   `ui/.env` is preconfigured for Docker (`VITE_API_URL=http://host.docker.internal:8000`). For local-only runs you can use `http://localhost:8000`.

3. **Start the stack**
   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```

4. **Open the app**
   - **UI:** http://localhost:3000  
   - **API:** http://localhost:8000 (e.g. http://localhost:8000/api/deals/)  
   - **DB:** localhost:5432 (credentials in `backend/.env`)

To stop: `Ctrl+C`, then `docker compose -f docker-compose.dev.yml down` if you want to remove containers.


## Running tests

You can run tests inside docker compose using:

```bash
docker compose -f docker-compose.dev.yml exec backend python -m pytest
```

## Deployment Strategy on AWS

- Full deployment and CI/CD: [docs/deployment.md](docs/deployment.md)
