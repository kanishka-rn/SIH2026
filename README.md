# SIH2026

**SIH26108 — AI-Powered Recommendation Engine for Identifying Applicable Indian Standards for Procurement Specifications.**

Smart India Hackathon 2026. This repository is a procurement standards intelligence platform: it will help officers determine which Indian Standards apply to a requirement or tender specification, with evidence, provenance, confidence, and abstention.

This is Phase 0 (foundation). Retrieval, the database, dataset import, and product features are not implemented yet.

## Purpose

Procurement officers need to map natural-language requirements and technical specifications to applicable Indian Standards. The finished system will:

1. Accept natural-language procurement requirements, specification text, and PDF/DOCX/TXT documents
2. Extract requirements and search the Indian Standards corpus
3. Combine lexical and semantic retrieval (hybrid), then rank candidates
4. Identify related, allied, and normative standards
5. Enrich with certification, QCO/compliance, and lifecycle/amendment data **only where authoritative sources exist**
6. Show evidence, provenance, and confidence — and abstain when evidence is insufficient
7. Support multilingual queries, history, saved standards, comparison, methodology, and evaluation

The product is not a generic chatbot. The LLM must not invent or select standards; it will explain evidence-backed results from the retrieval and ranking pipeline.

## High-level architecture

```
Frontend (React + TypeScript + Vite)
        │
        ▼
Backend (Python + FastAPI)
        │
        ▼
PostgreSQL on Supabase (pgvector + full-text search)
```

Planned pipeline:

User query/document → normalization → requirement extraction → lexical retrieval → semantic retrieval → metadata filtering → candidate fusion → reranking → relationship expansion → compliance/lifecycle enrichment → evidence extraction → confidence calculation → recommendation.

See [docs/architecture.md](docs/architecture.md) and [architecture.md](architecture.md). Development sequence is in [docs/development-plan.md](docs/development-plan.md).

## Planned technology stack

| Layer | Stack |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, Lucide icons |
| Backend | Python, FastAPI, Pydantic, modular services |
| Database | Supabase, PostgreSQL, pgvector, PostgreSQL FTS |
| AI / retrieval | Hybrid lexical + semantic retrieval, reranking, evidence-first LLM explanation |

## Local development (Phase 0)

Prerequisites: Node.js 22+, Python 3.12, Git.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Build check: `npm run build`  
Lint: `npm run lint`

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-dev.txt
cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Health check: `GET http://localhost:8000/health`

Helper scripts: `scripts/dev-frontend.sh` and `scripts/dev-backend.sh`.

### Tests

From the repository root, with the backend virtualenv activated or its pytest on `PATH`:

```bash
backend/.venv/bin/pytest
```

## Security principles

- Never commit `.env`, API keys, tokens, passwords, Supabase service-role keys, or LLM keys
- Use `.env.example` files for variable names only
- Distinguish authoritative, derived, synthetic, and unresolved data
- Never fabricate BIS metadata, standard numbers, or BIS URLs
- Never treat UNKNOWN as a positive fact
- Never claim certification or QCO mandates without authoritative data
- Every future recommendation must be traceable to evidence

## Dataset

The ManakSetu BIS Data V0.4 corpus will be integrated after the production schema is designed. Do not import it in Phase 0.

## Repository layout

```
frontend/     React + Vite application
backend/      FastAPI application
supabase/     Future migrations (empty of tables in Phase 0)
scripts/      Local development helpers
docs/         Architecture and phase plan
tests/        Automated tests
.cursor/      Cursor Agent project rules
```
