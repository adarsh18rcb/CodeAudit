# CodeAudit — AI Code Review Platform

Connect a GitHub repository → the backend fetches source files → the Python AI engine runs AST/static analysis + an LLM pass → results land in a React dashboard with bugs, security issues, code smells, complexity, and suggested fixes.

## Architecture

```text
React (Vite) → Spring Boot (JWT auth, REST API) → PostgreSQL
                      │
                      ▼
             Python FastAPI AI engine
             (AST/static analysis → LLM explain/rank)
                      │
                      ▼
               GitHub REST API
```

## Run locally

Prerequisites: Docker and Docker Compose.

```bash
cp .env.example .env
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api
- AI engine: http://localhost:8000 (docs at /docs)
- PostgreSQL: localhost:5432

Set `ANTHROPIC_API_KEY` in `.env` to enable LLM explanations; without it, the AI engine uses deterministic fallback explanations. Never commit `.env` or real credentials.

## Services

- `frontend/` — React + Vite UI
- `backend/` — Spring Boot REST API, JWT authentication, persistence, GitHub repository integration
- `ai-engine/` — FastAPI service for language detection, static analysis, LLM enrichment, and scoring

## Main API routes

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register and receive a JWT |
| POST | `/api/auth/login` | Authenticate and receive a JWT |
| POST | `/api/repositories` | Add a GitHub repository |
| GET | `/api/repositories` | List repositories |
| POST | `/api/reviews` | Start a code review |
| GET | `/api/reviews?repositoryId=` | Review history |
| GET | `/api/reviews/{id}/issues` | Findings for a review |

## Security

- Copy `.env.example` to `.env` for local configuration.
- Replace all development-only secrets before deployment.
- Never commit API keys, access tokens, passwords, or production JWT secrets.

## Current scope and next steps

Implemented: JWT authentication, GitHub source fetching, Python AST/static analysis, heuristic analysis for Java/JavaScript/C++, review history, issue ranking, and scored reports. LLM explanations are optional and use the Anthropic API when configured.

Potential improvements: OAuth for private repositories, caching, CI/CD workflows, richer Java AST parsing, and an inline diff viewer.
