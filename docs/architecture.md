# Architecture — SIH2026 / SIH26108

Status: **planned**. Phase 0 ships application shells only.

## Positioning

This is a procurement standards intelligence platform. Users analyze a procurement requirement and receive ranked, evidence-backed Indian Standards — not a chat transcript of model guesses.

## System context

```
Procurement officer
        │
        ▼
┌───────────────────────────────────────┐
│  Frontend                             │
│  React + TypeScript + Vite + Tailwind │
│  Search, analyze, directory, compare, │
│  saved, history, compliance, method   │
└───────────────────┬───────────────────┘
                    │ HTTPS JSON
                    ▼
┌───────────────────────────────────────┐
│  Backend                              │
│  FastAPI + Pydantic                   │
│  routes → services → retrieval/AI     │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│  Supabase PostgreSQL                  │
│  standards corpus, relations,         │
│  compliance, history, pgvector, FTS   │
└───────────────────────────────────────┘
```

## Frontend (planned)

Professional procurement UI, not a chatbot layout.

Future surfaces (not implemented in Phase 0):

- Home / Search
- Analyze Specification
- Standards Directory
- Standard Details
- Compare
- Saved
- History
- Compliance
- Methodology

## Backend modules (planned)

Package layout under `backend/app/` is reserved for:

| Module | Role |
| --- | --- |
| `api/` | HTTP routes |
| `core/` | configuration |
| `db/` | database access |
| `models/` | persistence models |
| `schemas/` | request/response contracts |
| `services/` | orchestration |
| `retrieval/` | lexical, semantic, hybrid, rerank |
| `ai/` | evidence-only explanation |
| `documents/` | PDF/DOCX/TXT extraction |
| `compliance/` | QCO / certification enrichment |
| `standards/` | standard and relationship domain |
| `evidence/` | provenance assembly |
| `evaluation/` | retrieval evaluation |

Phase 0 implements configuration plus `GET /health`.

## Retrieval pipeline (planned)

```
User query / document
  → normalization
  → requirement extraction
  → lexical retrieval
  → semantic retrieval
  → metadata filtering
  → candidate fusion
  → reranking
  → relationship expansion
  → compliance / lifecycle enrichment
  → evidence extraction
  → confidence calculation
  → final recommendation
```

The LLM does **not** independently invent or select standards. It explains ranked candidates produced by this pipeline.

## Data integrity

Every stored or displayed fact must be classified as:

- authoritative / source-derived
- derived / inferred
- synthetic
- unresolved / unknown

Unknown must remain unknown. Certification and QCO obligations are stated only when authoritative data supports them. Recommendations must carry evidence, provenance, and confidence, and must abstain when evidence is insufficient.

## Expected user flow (planned)

Procurement requirement → Analyze → Requirements detected → Candidates retrieved → Ranked standards → Related standards → Compliance/lifecycle → Evidence + provenance → Confidence → Recommendation → Save / Compare / Export.

## What Phase 0 does not include

- Production tables or migrations
- Dataset import
- Retrieval or embeddings
- Fake standards, fake API payloads, or placeholder production data
