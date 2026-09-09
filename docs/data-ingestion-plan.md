# Data ingestion plan — ManakSetu V0.4

Do **not** run this pipeline until (1) the V0.4 files are in the environment, (2) `docs/dataset-inventory.md` has measured row counts, and (3) the schema proposal is approved. This document is the design only.

## Goals

Idempotent load of canonical, relationship, retrieval, multilingual, and evaluation data with provenance. Re-runs must not duplicate standards or edges.

## Storage of raw files

- Keep the archive **outside Git** (`data/raw/` gitignored, or Supabase Storage bucket created only in a later approved phase).
- Record archive checksum on `ingestion_batches`.

## Pipeline stages

1. **Validate files** — expected names (from inventory), encodings, headers, non-zero files, checksums.
2. **Stage raw** — copy into `stg_*` tables or parquet with `source_file` + `source_row_num`. No business FKs yet.
3. **Normalize types** — dates, IS number normalization (`IS 456` vs `IS456`), locales, empty string → NULL.
4. **Preserve source IDs** — map to `source_row_id` / natural keys; never invent IS numbers.
5. **Detect duplicates** — same `is_number` or edge triple; keep authoritative row; report others.
6. **Validate FKs** — references to missing IS numbers → `unresolved` + report, not silent drop without a log.
7. **Provenance** — stamp `provenance_class` from inventory classification (A–E), not from model output.
8. **Trust split** — authoritative columns vs `*_inferred`; never in-place overwrite.
9. **Load canonical** — sectors, departments, committees, families, standards, titles.
10. **Load relationships** — amendments, `standard_references`, graph edges.
11. **Load retrieval** — documents, chunks; embeddings only if dim/model validated.
12. **Load multilingual** — `standard_titles`, locale on documents.
13. **Load evaluation** — benchmarks, queries, gold, hard negatives.
14. **Record batch** — `ingestion_batches` + `ingestion_file_reports`.
15. **Validation report** — counts vs inventory, orphan FKs, duplicate keys, embedding coverage, assertion_status distribution.

## Idempotency

- Upsert on natural keys (`is_number`, `(from,to,rel_type)`, `(model_id, chunk_id)`).
- Same archive checksum + version → skip or no-op.
- Graph paths: delete/rebuild derived rows for that batch rather than append.

## Import order (dependency)

1. `ingestion_batches`
2. `sectors`, `departments`, `committees`, `certification_schemes`
3. `standard_families`
4. `standards`
5. `standard_titles`, `standard_amendments`
6. `qcos`, `gazette_instruments`
7. `standard_references`, certification/QCO/gazette assertions
8. `graph_entities` then `graph_relationships` then `relationship_evidence`
9. `retrieval_documents`, `document_chunks`
10. `embedding_models` then embeddings (optional / later)
11. `query_expansions`
12. tenders, requirements, attributes, labels
13. `eval_*`
14. derived `graph_paths` if the file is classified derived

Application tables (`profiles`, history, saves) stay empty of dataset rows.

## Failure policy

- File header mismatch → fail the file, not the whole batch if configured, but block promotion of dependents.
- Unknown IS in an edge → insert entity stub only if policy allows; default is **do not create fake standards**; log orphan.
- Embedding dim mismatch → reject file; do not truncate vectors.

## Scripts (later phase)

`scripts/ingest/` — not implemented now. Python + FastAPI jobs or CLI. Use Supabase MCP/`execute_sql` only after migrations exist.

## What this phase must not do

No `CREATE TABLE`, no `COPY`, no Storage buckets, no `CREATE EXTENSION`.
