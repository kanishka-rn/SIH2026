# Reference application analysis (`testing2`)

Status: **archive not present in this environment.** Findings below do **not** claim to be a line-by-line audit of `testing2.zip`.

## Audit result

`testing2.zip` / an unpacked demo tree was not found in the SIH2026 workspace or a bounded filesystem search. No demo `node_modules`, SQLite files, or backend from that project were opened.

Phase 0 instructions already constrain how that demo may be used. This document records that contract and maps **problem-level** concepts to the new architecture. When `testing2` is available, re-run this file against actual modules and replace the “unverified” sections.

## What Phase 0 already forbids copying

Do **not** carry forward from the demo (even after it is inspected):

- `node_modules`, `.venv`, `dist`, build artifacts, caches
- SQLite as the production database
- `.env`, API keys, credentials
- Wholesale UI clone of a chatbot shell
- Fabricated standards, BIS URLs, or fake QCO/certification facts
- LLM-as-the-retriever (model invents IS numbers)

## Concept map (target SIH2026 vs typical demo)

| Concept | Reuse conceptually | Redesign | Do not carry forward |
| --- | --- | --- | --- |
| Standards entity | IS number as natural key; title/status fields | Canonical `standards` + multilingual titles + provenance | SQLite table dump as source of truth |
| Requirement entity | Extracted clauses from tender text | Typed `procurement_requirements` + attributes; no blob-only model | Silent merge of requirement and query string |
| Retrieval document | Searchable text per standard/chunk | `retrieval_documents` / `document_chunks` with `provenance_class` | One concatenated mega-document without chunk ids |
| Embeddings | Vector similarity as one retrieval arm | `embedding_models` + per-model vectors; unknown dim until V0.4 measured | Single hardcoded OpenAI dim without checking the dataset |
| Lexical retrieval | Keyword / FTS over titles and text | Postgres FTS + optional trigram; not a Python-only inverted index in prod | In-memory rankers that cannot scale to 24k+ and eval sets |
| Semantic retrieval | ANN over chunks | pgvector **after** enablement; filter-then-search with metadata | Embedding-only search |
| Hybrid fusion | Combine lexical + semantic | RRF / weighted fusion recorded on `recommendation_scores` | Hidden fusion with no scores stored |
| Reranking | Optional second stage | Store rerank model id + scores; eval against gold | LLM rerank that can add new IS numbers |
| Compliance | QCO / certification as enrichment | Assertion status enum (not boolean) | “Mandatory” badge without source |
| Lifecycle | Status / amendments | `standards.status` + `standard_amendments` | Overwriting historical versions in place with no history |
| Graph | Allied / normative links | `graph_entities` / `graph_relationships` in Postgres | Separate graph DB by default |
| Evidence | Snippets shown in UI | `evidence_spans` + `recommendation_evidence` | UI quotes not tied to a row id |
| Confidence | Score or label | Calibrated fields + abstention | Always-confident chatbot tone |
| Decision traces | Debug panel | `decision_traces` JSON/relational steps | Unstructured logs only |
| Evaluation | Held-out queries | `eval_*` tables; measured metrics | Hard-coded “95% accuracy” copy |
| UI workflows | Analyze → ranked list → details | Professional procurement chrome (already in Phase 0 shell) | Chat-first layout |

## Retrieval logic to redesign

Target pipeline (from project architecture; implement later):

```
query/document → normalize → extract requirements → lexical → semantic
→ metadata filter → fuse → rerank → expand graph → enrich compliance
→ attach evidence → confidence / abstain
```

The demo, if it short-circuits this with a single LLM or a single vector index, must not define production.

## When `testing2` arrives

Inspect and record (no copy):

- ORM models / SQLite schema
- Search field list
- How certification/QCO is decided
- Whether graph is stored or computed
- Eval scripts, if any
- UI route list

Update this document with file paths and citations. Still do not vendor the code.
