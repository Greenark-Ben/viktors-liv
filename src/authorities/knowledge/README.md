# Knowledge Authority

Knowledge Authority owns the family’s explicit catalogue of subjects they need to understand. It does not own facts about a person, documents, decisions or events.

## Canonical storage

`liv.knowledge-authority.v1`

## Contract

A `KnowledgeTopicRecord` has a stable ID, human title, plain-language description, optional category and aliases, lifecycle state and append-only history.

## Invariants

- title and description are required
- aliases are normalised and unique
- topics are never inferred from resources, people or documents
- archiving is explicit
- legacy knowledge-shaped storage is not silently migrated or overwritten

Resource Authority connects to Knowledge Authority by stable `knowledgeTopicIds` only.
