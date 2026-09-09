# Development plan — SIH2026 / SIH26108

This is a sequencing document. Phases after 0 are **not** implemented until requested.

## Phase 0 — Foundation

Monorepo, frontend Vite/React/TypeScript shell, FastAPI shell, Supabase directory, docs, gitignore, env examples. Complete.

## Phase 1 — GitHub + Supabase MCP

GitHub remote confirmed. Official Supabase MCP authenticated in Cursor. Organization **SIH2026** is visible.

## Phase 2 — Database architecture

**Connection/inspection complete** for database project **SIH2026** (`umgugjqfspmkrwtargen`). Postgres 17.6 is reachable via MCP. `public` has no application tables. `vector` is available but not enabled.

## Phase 3 — Dataset audit + schema design

Design docs added (`docs/dataset-inventory.md`, `docs/database-design.md`, and related). **V0.4 files and `testing2` were not present in the agent workspace**; inventory row counts were not invented. **No tables created. No import.**

Original ingestion work remains blocked until files are available and the schema is approved.

## Phase 4 — Backend API

Read APIs for health (already present), standards lookup, analysis jobs — without fake records.

## Phase 5 — Lexical retrieval

PostgreSQL full-text / keyword retrieval over the corpus.

## Phase 6 — Semantic retrieval

Embeddings and pgvector similarity search.

## Phase 7 — Hybrid retrieval

Fusion of lexical and semantic candidates.

## Phase 8 — Reranking

Score and order candidates with explainable features.

## Phase 9 — Requirement extraction

Normalize queries and documents; extract procurement requirements.

## Phase 10 — Standards relationship intelligence

Related, allied, and normative references from authoritative graph data.

## Phase 11 — Compliance / QCO / certification

Enrich only from authoritative sources. Unknown stays unknown.

## Phase 12 — Evidence / provenance

Attach source spans, field provenance, and citations to every recommendation.

## Phase 13 — Confidence / abstention

Calibrated confidence; abstain when evidence is insufficient.

## Phase 14 — Multilingual search

Procurement queries in Indian languages supported by the dataset and models.

## Phase 15 — Frontend application

Implement the professional UI flows listed in architecture.md.

## Phase 16 — Evaluation

Offline retrieval evaluation using dataset evaluation splits.

## Phase 17 — Security / testing

Auth, RLS, secret hygiene, automated tests, threat review.

## Phase 18 — Deployment

Hosted frontend, API, and Supabase production configuration.

## Phase 19 — SIH demo preparation

Demo script, methodology narrative, evaluation summary, no fabricated results.
