# Development plan — SIH2026 / SIH26108

This is a sequencing document. Phases after 0 are **not** implemented until requested.

## Phase 0 — Foundation

Monorepo, frontend Vite/React/TypeScript shell, FastAPI shell, Supabase directory, docs, gitignore, env examples. Current phase.

## Phase 1 — GitHub + Supabase MCP

Confirm remotes. Connect Supabase MCP in Cursor. No table creation unless explicitly requested as part of a later schema phase.

## Phase 2 — Database architecture

Design PostgreSQL schema for standards, relationships, compliance, provenance, users/history. Migrations and indexes. pgvector and FTS. No SQLite production path.

## Phase 3 — Dataset ingestion

Import ManakSetu BIS Data V0.4 with explicit data-class tagging (authoritative / derived / synthetic / unresolved). No fabrication.

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
