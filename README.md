# CodeAudit — AI Code Review Platform

Connect a GitHub repository → the backend fetches source files → the Python AI engine runs AST/static analysis and optional LLM enrichment → results appear in a React dashboard with bugs, security issues, code smells, complexity, and suggested fixes.

## Architecture

```text
React (Vite) → Spring Boot (JWT auth, REST API) → PostgreSQL
                       ↓
               Python FastAPI AI engine
               (AST/static analysis → LLM explain/rank)
                       ↓
                  GitHub REST API
```

## Run locally

Prerequisites: Docker and Docker Compose.

```bash
cp .env.example .env
# Optionally set ANTHROPIC_API_KEY in .env for LLM explanations.
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api
- AI engine: http://localhost:8000 (docs at /docs)
- PostgreSQL: localhost:5432

Without an LLM key, the engine uses deterministic fallback explanations for local development. Never commit `.env` or real credentials.

## API overview

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create account and receive JWT |
| POST | `/api/auth/login` | Login and receive JWT |
| POST | `/api/repositories` | Add a GitHub repository |
| GET | `/api/repositories` | List repositories |
| POST | `/api/reviews` | Start a review |
| GET | `/api/reviews?repositoryId=` | Review history |
| GET | `/api/reviews/{id}/issues` | Findings for a review |

AI engine endpoints include `/api/analyze`, `/api/explain`, `/api/optimize`, and `/api/generate-tests`.

## Project structure

- `frontend/` — React + Vite UI
- `backend/` — Spring Boot REST API, JWT auth, persistence, GitHub source fetching
- `ai-engine/` — FastAPI service for language detection, static analysis, optional LLM enrichment, and scoring

## Scope and next steps

Implemented: JWT authentication, GitHub source fetching for public repositories, Python AST/static analysis, heuristic analysis for Java/JavaScript/C++, review history, issue ranking, and scored reports. LLM explanations are optional.

Potential improvements: OAuth for private repositories, caching, CI/CD workflows, richer language parsers, and an inline diff viewer.
