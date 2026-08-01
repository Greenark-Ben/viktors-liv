# FA-1 — Financial Activity Authority

Canonical storage for purchases, expenses, reimbursements, corrections and reporting periods.

## Invariants

- Every activity has an explicit payer, date, merchant/payee, description and at least one categorised line.
- Line totals must equal the recorded total.
- Currency is SEK and amounts are stored as integer öre.
- Evidence is referenced, never inferred.
- Reported activities cannot be silently edited or deleted; they require a linked correction.
- Reimbursement is explicit and never inferred from payer identity.
- Reporting periods are bounded, contain unique activity IDs and become immutable when closed.
- The authority is separate from the budget model: budget is planned cost; financial activity is what actually happened.

## Storage

- `liv.financial-activity-authority.v1`
- `liv.financial-reporting-periods.v1`
