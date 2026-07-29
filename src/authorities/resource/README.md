# RA-1 — Resource Authority

## Purpose

Help families find trusted information that makes a difficult subject easier to understand.

A resource may be a book, website, PDF, law, authority guide, organisation, video, podcast, research paper, checklist, template, family guide or personal note.

## Authority boundary

A resource does not decide what is true about a person. It supports Knowledge Authority and other LIV experiences with traceable material.

`ResourceRecord` owns the canonical description, location, relevance, trust review and connections of a resource.

## Core invariants

1. Every resource explains **why it matters**.
2. Trust is explicit; it is never inferred from the medium or publisher name.
3. Resources are never invented by recommendation logic.
4. Search is deterministic over authored metadata and connections.
5. Resource Packs contain references to resources; they do not duplicate resource truth.
6. Only published packs may be installed.
7. Projections are read-only consumers.

## Resource Packs

A Resource Pack is a curated, ordered collection for a topic or audience, for example:

- Good Man Pack
- Autism Pack
- LSS Decisions Pack
- Moving Home Pack

Packs may be created by a family, professional or trusted organisation. Publication is explicit and requires at least one resource.

## Storage

- Resources: `liv.resource-authority.v1`
- Resource Packs: `liv.resource-packs.v1`

## Search

`searchResources` ranks title, topic and content matches, then adds small deterministic trust boosts for official and family-trusted resources. It does not call an external model and does not generate citations.

## Projection consumers

- Understanding panels
- Trusted Library
- Resource Pack catalogue
- Knowledge Authority evidence selection
- Document and Life Event contextual guidance

## Next release

RA-2 will introduce Resource Studio: Add Resource, review trust, connect it to people/documents/topics, curate packs, and install published packs.
