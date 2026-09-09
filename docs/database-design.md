# Production database design — SIH2026 / SIH26108

Status: **proposal only**. No SQL has been applied to Supabase. `pgvector` remains disabled until this design is approved and embedding dimension is measured from V0.4.

Scale target: ~24k standards; retrieval chunks, graph edges, and evaluation rows may be several times larger.

Natural keys from BIS (IS number, gazette id, QCO id) are stored in dedicated unique columns. Application rows use UUIDs (`gen_random_uuid()`).

## Trust model (every factual row)

Shared columns (table or `provenance_records` FK):

| Column | Meaning |
| --- | --- |
| `provenance_class` | `authoritative` \| `derived` \| `synthetic` \| `unresolved` |
| `assertion_status` | `SUPPORTED` \| `NOT_SUPPORTED_BY_DATA` \| `UNKNOWN` \| `NEEDS_VERIFICATION` |
| `source_dataset` | e.g. `manaksetu_bis_v0.4` |
| `source_file` | archive-relative path |
| `source_row_id` | stable id from file if present |
| `ingestion_batch_id` | FK |
| `validation_status` | `pending` \| `passed` \| `failed` \| `skipped` |

Never overwrite `authoritative` cells with `derived` values in place. Store inferences in derived tables or columns named `*_inferred`.

`UNKNOWN` stays `UNKNOWN`. It is not `false` and not `NOT_SUPPORTED_BY_DATA`.

## 1. Ingestion control

### `ingestion_batches`

- `id` UUID PK
- `dataset_name` text
- `dataset_version` text
- `started_at` / `finished_at` timestamptz
- `status` text
- `checksum` text (archive hash)
- Unique `(dataset_name, dataset_version, checksum)` for idempotent replays

### `ingestion_file_reports`

- `id` UUID PK
- `batch_id` FK
- `source_file` text
- `row_count` int (measured)
- `error_count` int
- `notes` jsonb

## 2. Standards domain

### `sectors`

- `id` UUID PK
- `code` text UNIQUE
- `name` text
- provenance columns

### `departments`

- `id` UUID PK
- `code` text UNIQUE
- `name` text

### `committees`

- `id` UUID PK
- `code` text UNIQUE
- `name` text
- `department_id` FK nullable

### `standard_families`

- `id` UUID PK
- `family_key` text UNIQUE (normalized family identifier from dataset, if any)
- `display_name` text
- `sector_id` FK nullable

### `standards`

Canonical product of record for an Indian Standard **as identified by IS number**.

- `id` UUID PK
- `is_number` text UNIQUE NOT NULL (normalized, e.g. `IS 456`)
- `is_number_raw` text
- `family_id` FK nullable
- `sector_id` FK nullable
- `committee_id` FK nullable
- `department_id` FK nullable
- `status` text (lifecycle label **as in source**; do not invent)
- `status_assertion` assertion_status (default `UNKNOWN` if source blank)
- `year` int nullable
- `title_en` text
- `scope_text` text nullable
- `ics_codes` text[] nullable
- `source_url` text nullable (only if present in dataset — never fabricated)
- `withdrawn_at` date nullable
- `superseded_by_id` UUID FK `standards.id` nullable
- provenance columns

### `standard_titles`

Multilingual / alternate titles.

- `id` UUID PK
- `standard_id` FK
- `locale` text (`en`, `hi`, …)
- `title` text
- `script` text nullable
- Unique `(standard_id, locale, title)`

### `standard_amendments`

- `id` UUID PK
- `standard_id` FK
- `amendment_label` text
- `issued_on` date nullable
- `summary` text nullable
- provenance columns
- Unique `(standard_id, amendment_label)` where label present

### `standard_references`

Directed relations used by the hot path (normative, allied, related, supersedes).

- `id` UUID PK
- `from_standard_id` FK
- `to_standard_id` FK
- `relation_type` text
- `provenance_class`
- `assertion_status`
- Unique `(from_standard_id, to_standard_id, relation_type)`

Prefer this table for 1-hop UI. Richer graph types live in the graph domain and can point at the same standards.

## 3. Procurement domain

### `tenders`

- `id` UUID PK
- `external_id` text UNIQUE nullable
- `title` text
- `body_text` text
- `language` text
- `issued_on` date nullable
- provenance (`synthetic` if demo tenders)

### `procurement_requirements`

- `id` UUID PK
- `tender_id` FK nullable
- `requirement_uid` text (stable extract id)
- `text` text
- `locale` text
- Unique `(tender_id, requirement_uid)` when both set

### `technical_attributes`

Catalog of attribute types (material, rating, IS clause theme, …).

- `id` UUID PK
- `code` text UNIQUE
- `name` text
- `value_type` text (`text`, `numeric`, `enum`)

### `requirement_attribute_values`

- `id` UUID PK
- `requirement_id` FK
- `attribute_id` FK
- `value_text` text nullable
- `value_num` numeric nullable
- Unique `(requirement_id, attribute_id)`

### `requirement_standard_labels`

Gold or human labels (evaluation / training), **not** live recommendations.

- `id` UUID PK
- `requirement_id` FK
- `standard_id` FK
- `label_role` text (`gold`, `hard_negative`, `partial`)
- `provenance_class` (often `derived` or `synthetic`)
- Unique `(requirement_id, standard_id, label_role)`

## 4. Retrieval domain

### `retrieval_documents`

One searchable document per standard or other owner.

- `id` UUID PK
- `owner_type` text (`standard`, `requirement`, `chunk_group`)
- `owner_id` UUID
- `language` text
- `title` text
- `body` text
- `search_tsv` tsvector (generated from title+body — created in a later migration)
- provenance
- Unique `(owner_type, owner_id, language)` if 1:1

### `document_chunks`

- `id` UUID PK
- `document_id` FK
- `chunk_index` int
- `text` text
- `token_count` int nullable
- Unique `(document_id, chunk_index)`

### `embedding_models`

- `id` UUID PK
- `provider` text
- `model_name` text
- `dimension` int NOT NULL
- `distance` text (`cosine` default)
- Unique `(provider, model_name)`

**Dimension is UNKNOWN until V0.4 embedding files are measured.** Do not add a `vector(N)` column until `N` is known. If multiple dimensions exist, **do not** mix them in one pgvector column/index: use one embeddings table **per dimension** (e.g. `embeddings_d768`) or partition by `model_id` with homogeneous dim.

### `embeddings` (logical)

- `id` UUID PK
- `model_id` FK
- `chunk_id` FK nullable
- `document_id` FK nullable
- `embedding` vector — **deferred**
- `content_sha256` text
- Unique `(model_id, chunk_id)` or `(model_id, document_id)`

Precomputed vectors from the dataset should be loaded only after checksum/dimension validation. Missing vectors stay absent (`UNKNOWN` coverage), not zero-filled.

### `query_expansions`

- `id` UUID PK
- `source_query` text
- `expanded_query` text
- `locale` text
- `method` text
- `provenance_class` (usually `derived` or `synthetic`)

## 5. Knowledge graph domain

Postgres is sufficient: entities + typed edges + recursive CTEs. No separate graph database in this proposal.

### `graph_entities`

- `id` UUID PK
- `entity_type` text (`standard`, `sector`, `qco`, `product_category`, …)
- `standard_id` FK nullable
- `external_key` text
- `label` text
- Unique `(entity_type, external_key)`

### `graph_relationships`

- `id` UUID PK
- `from_entity_id` FK
- `to_entity_id` FK
- `rel_type` text
- `weight` numeric nullable
- provenance + `assertion_status`
- Unique `(from_entity_id, to_entity_id, rel_type)`

### `relationship_evidence`

- `id` UUID PK
- `relationship_id` FK
- `evidence_span_id` FK nullable
- `note` text
- provenance

### `graph_paths`

**Only if the dataset ships precomputed paths** (do not invent paths). Derived, rebuildable.

- `id` UUID PK
- `from_entity_id` FK
- `to_entity_id` FK
- `hops` int
- `path_entity_ids` UUID[]
- `rel_types` text[]
- `provenance_class` = `derived`

Traversal later: recursive CTE from `graph_relationships` indexed on `(from_entity_id, rel_type)` and `(to_entity_id, rel_type)`, depth cap (e.g. 3). Materialize 1-hop into `standard_references` for the recommendation hot path.

## 6. Compliance domain

Booleans are forbidden for “is certification mandatory?”. Use assertions.

### `certification_schemes`

- `id` UUID PK
- `code` text UNIQUE
- `name` text
- `description` text nullable

### `standard_certification_assertions`

- `id` UUID PK
- `standard_id` FK
- `scheme_id` FK
- `assertion_status` NOT NULL
- `applicable_from` / `applicable_to` date nullable
- `notes` text
- provenance
- Unique `(standard_id, scheme_id, applicable_from)` 

### `qcos`

- `id` UUID PK
- `qco_id` text UNIQUE (source identifier)
- `title` text
- `issued_on` date nullable

### `qco_standard_assertions`

- same assertion pattern as certification
- Unique `(qco_id, standard_id, applicable_from)`

### `gazette_instruments`

- `id` UUID PK
- `instrument_no` text UNIQUE nullable
- `title` text
- `published_on` date nullable
- `url` text nullable (source only)

### `gazette_standard_map`

- `gazette_id` FK
- `standard_id` FK
- `assertion_status`
- provenance

## 7. Evidence, provenance, decisions

### `provenance_records`

Optional normalized store when many rows share a source tuple.

- `id` UUID PK
- `provenance_class`
- `source_dataset` / `source_file` / `source_row_id`
- Unique those three + class

### `evidence_spans`

- `id` UUID PK
- `chunk_id` FK nullable
- `standard_id` FK nullable
- `text` text
- `start_char` / `end_char` int nullable
- provenance

### `decision_traces`

- `id` UUID PK
- `run_id` FK
- `step_index` int
- `step_type` text (`lexical`, `semantic`, `fusion`, `rerank`, `graph`, `abstain`, …)
- `payload` jsonb (candidate ids, scores — no secrets)
- Unique `(run_id, step_index)`

## 8. Recommendation domain

### `recommendation_runs`

- `id` UUID PK
- `user_id` UUID nullable (auth)
- `requirement_id` FK nullable
- `raw_query` text
- `pipeline_version` text NOT NULL
- `embedding_model_id` FK nullable
- `created_at` timestamptz
- `abstained` boolean
- `abstain_reason` text nullable

### `recommendation_items`

- `id` UUID PK
- `run_id` FK
- `standard_id` FK
- `rank` int
- `confidence` numeric nullable
- `confidence_label` text nullable
- Unique `(run_id, standard_id)`

### `recommendation_scores`

- `id` UUID PK
- `item_id` FK
- `channel` text (`lexical`, `semantic`, `fusion`, `rerank`, `graph_bonus`)
- `score` numeric
- Unique `(item_id, channel)`

### `recommendation_evidence`

- `item_id` FK
- `evidence_span_id` FK
- `role` text (`match`, `normative_link`, `qco`, …)
- PK `(item_id, evidence_span_id, role)`

This answers: which standard, why (scores + traces), which requirement, which span, whether the source was authoritative, confidence, pipeline version.

## 9. Application domain

Use Supabase Auth `auth.users`. Do not duplicate passwords.

### `profiles`

- `id` UUID PK = `auth.users.id`
- `display_name` text

### `search_history` / `analysis_history`

- `id` UUID PK
- `user_id` FK
- `run_id` FK nullable
- `query` text
- `created_at`

### `saved_standards`

- `user_id` + `standard_id` unique

### `saved_recommendations`

- `user_id` + `run_id` unique

### `saved_comparisons`

- `id` UUID PK
- `user_id`
- `standard_ids` UUID[] (small lists)

## 10. Evaluation domain

### `eval_benchmarks`

- `id` UUID PK
- `name` text UNIQUE
- `kind` text (`retrieval`, `multilingual`, `robustness`)

### `eval_queries`

- `id` UUID PK
- `benchmark_id` FK
- `query_text` text
- `locale` text
- `external_id` text
- Unique `(benchmark_id, external_id)`

### `eval_gold_labels` / `eval_hard_negatives`

- query_id + standard_id
- provenance (`synthetic` vs `authoritative` if humans labeled)

### `eval_runs`

- `id` UUID PK
- `benchmark_id` FK
- `pipeline_version` text
- `started_at`

### `eval_run_metrics`

- `run_id` FK
- `metric_name` text (`recall@10`, `mrr`, …)
- `metric_value` numeric
- Unique `(run_id, metric_name)`

### `eval_run_items`

- per-query ranks for audit

## 11. Vector architecture (after inspection)

Until V0.4 embedding files are measured:

- Do **not** `CREATE EXTENSION vector`
- Do **not** pick a dimension
- Register models in `embedding_models` only after reading README/columns (`model`, `dim`, `provider`)

If the dataset has **one** complete model: one `embeddings` table `vector(D)` + HNSW cosine.

If **multiple** dims/models: table-per-dimension or separate indexes; never one HNSW over mixed dims.

If embeddings are **absent**: generate later; store `coverage_status` on documents (`complete` / `partial` / `none`).

## 12. Search architecture (indexes — not created yet)

| Mechanism | Fields | Index (later) |
| --- | --- | --- |
| Exact IS lookup | `standards.is_number` | unique B-tree |
| Metadata filters | sector, committee, status, family | B-tree |
| Full-text | `retrieval_documents.search_tsv`, titles | GIN (`gin_tsvector_ops`) |
| Fuzzy IS / title | `is_number`, `title_en` | GIN `pg_trgm` (after `CREATE EXTENSION pg_trgm`) |
| BM25-compatible | FTS `ts_rank_cd` on `search_tsv` as v1; revisit only if eval shows need for an external BM25 engine | GIN |
| Vector | `embeddings.embedding` | HNSW (`vector_cosine_ops`) once dim known |
| Hybrid | application fusion (RRF) over lexical + vector candidate sets | no extra DB index |
| Graph | `graph_relationships(from_entity_id, rel_type)` | composite B-tree |
| History | `(user_id, created_at desc)` | composite B-tree |

`pg_trgm` and `vector` stay **unenabled** until schema approval + dataset confirm.

Lexical v1 is PostgreSQL FTS, not a custom inverted-index table. That avoids duplicating 24k+ documents in a second engine.

## 13. Storage strategy

| Asset | Location |
| --- | --- |
| Canonical rows, graph, eval, history, vectors | **Supabase PostgreSQL** |
| Original PDFs, full V0.4 zip, large embedding dumps | **Supabase Storage** or local disk, not Git |
| Schema docs, migration SQL (later), small fixtures | **Git** |
| `node_modules`, `.venv`, SQLite, generated dumps | **Gitignored local artifacts** |

Do not commit the full dataset or DB dumps.

## 14. Out of scope tables

Not created just to match CSV filenames. Staging CSVs belong in Storage or a throwaway `stg_*` schema during load, dropped or truncated after promotion.

No Mongo/Neo4j/SQLite production path.
