# DA-1 — Document Authority

## Purpose

Transform supporting evidence into family-owned understanding about Viktor.

## Source of truth

`DocumentAuthorityRecord` is authoritative. Uploaded files are supporting evidence and may never silently rewrite authored understanding.

## Invariants

1. Evidence never owns truth.
2. Understanding is human-authored and revisioned.
3. Review and acceptance are explicit family decisions.
4. Connections reference other authorities; they never duplicate their data.
5. Projections are read-only consumers.
6. Accepted records retain an acceptance review in history.

## Lifecycle

`draft → evidence_attached → understanding_authored → reviewed → accepted → archived`

Authoring a new understanding revision clears prior reviews and returns the record to `understanding_authored`.

## Projection consumers

- Studio dashboard
- Timeline projection
- Next Actions projection
- Human Portrait evidence projection

## Storage

The browser repository uses `liv.document-authority.v1`. DA-1 does not migrate or overwrite the legacy `viktors-liv.documents.v1` workspace.

## Next release

DA-2 will introduce Document Studio over this kernel. Legacy document records can then be deliberately imported through an explicit family-reviewed migration rather than silently transformed.
