# Dataset inventory — ManakSetu BIS V0.4 FINAL

Status: **blocked on source files**. No row counts in this document are estimates.

## Audit result

The Cloud Agent workspace (`/workspace`, GitHub `kanishka-rn/SIH2026`, and a bounded filesystem search) does **not** contain:

- an archive named like `ManakSetu BIS Data V0.4 FINAL`
- `testing2.zip` or an unpacked `testing2/` tree
- CSV/Parquet/JSON dataset files for Indian Standards

Searched (non-exhaustive but practical): `/workspace`, `/home/ubuntu`, `/opt/cursor/artifacts`, `/tmp`, `/mnt`, `/media`, and a timeout-bounded `/` find for `*V0.4*`, `*testing2*`, `*ManakSetu*BIS*`.

GitHub `SIH2026` has no dataset files. Other public SIH26108 repositories were **not** treated as this team's V0.4 corpus (different projects; copying them would invent the wrong inventory).

**No file names, column lists, or row counts were invented.**

## How to complete this inventory (next agent turn)

Place the archive in the workspace (for example `data/raw/manaksetu-v0.4/`) **without committing the full dump to Git**. Then re-run measurement:

```bash
# example only — do not run until files exist
find data/raw -type f | wc -l
python3 scripts/audit_dataset.py data/raw
```

For each file record:

| Field | Rule |
| --- | --- |
| `file_name` | basename |
| `file_type` | extension + encoding |
| `row_count` | counted from the file (CSV lines minus header, etc.) |
| `columns` | header row as-is |
| `likely_pk` | uniqueness check, not assumed |
| `null_heavy` | columns with >50% empty **after counting** |
| `provenance_type` | A canonical / B derived / C retrieval / D synthetic / E evaluation — from README/metadata in the archive, not guessed |

## Inventory table (measured)

| file_name | purpose | row_count | important_fields | provenance_type | relationships | import_priority | proposed_destination | store_mode |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| _none found_ | — | **not measured** | — | — | — | — | — | — |

## Classification keys (to apply per file once present)

- **A. Canonical/source** — BIS identifiers, titles, committees, official status, gazette/QCO if source-tagged
- **B. Derived** — search text, families inferred from numbering, graph expansions
- **C. Retrieval-support** — chunks, embeddings, query expansions, BM25 corpora
- **D. Synthetic** — generated queries, fake tenders, model-written abstracts
- **E. Validation/evaluation** — gold labels, hard negatives, multilingual probes

## Expected domains (unverified against files)

These are **capability domains** from SIH26108, not a file listing:

Standards, procurement, retrieval, knowledge graph, compliance/QCO/certification, evidence/provenance, evaluation, multilingual, application history.

## Embedding metadata

**Not measured.** Provider, model, dimension, coverage, and completeness are `UNKNOWN` until embedding files or a dataset README are present.

Do not enable `vector` in Postgres until those values are known and a single production dimension (or a per-model storage strategy) is chosen.

## Ambiguity

**A1.** The V0.4 archive must be attached or copied into this environment (or a private storage URL the agent can read) before ingestion design can be bound to real columns.
