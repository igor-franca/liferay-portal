# LPS-003 Categorize Expense Requests

## Story

As an employee submitting an expense, I want to categorize my request so the accounting team can classify it and the right reviewer gets the work.

## Acceptance Criteria

### AC1. Expense Type picklist
The expense form shows a dropdown labeled "Expense Type" with three values:

- Travel Expenses
- Educational Expenses
- Office Expenses

### AC2. Required field
Submitting without selecting an Expense Type shows a field-level validation error and blocks the submission.

### AC3. Routing to a dedicated reviewer *(future delivery)*
The first review task is assigned directly to Ana Buchmann from accounting, not to the generic Expense Approver role.

This AC is **not** covered by the current change. It needs a workflow edit that we discuss in the talk but do not ship in this PR.

### AC4. Reviewer sees the type
When the assigned reviewer opens the task, the selected Expense Type is visible on the request detail.

### AC5. Closed picklist
The field rejects any value outside the three predefined options. Custom or free-text input is not accepted.

## Test Map

Each AC maps to a Playwright test in `modules/test/playwright/tests/workspaces/liferay-reimbursement-workspace/main/expenseRequest.spec.ts`:

| AC | Test name | Type |
|---|---|---|
| AC1 | `can submit a reimbursement request` (updated) | happy path |
| AC2 | `can not submit without an expense type` | validation |
| AC4 | covered by the existing approver flow once the type is filled | flow |
| AC5 | enforced by the picklist field type at the platform level. covered implicitly by AC1 + AC2 | platform |
| AC3 | not yet covered, depends on a workflow change in a follow-up story | n/a |

## References

The exports under `workspaces/liferay-reimbursement-workspace/client-extensions/` follow Liferay's Site Initializer and Batch Engine formats. See:

- [Site Initializer](https://learn.liferay.com/dxp/latest/en/site-building/developer-guide/creating-site-initializers.html) for the layout and asset structure.
- [Batch Engine](https://learn.liferay.com/dxp/latest/en/headless-delivery/batch-engine.html) for the JSON import format used by the `liferay-reimbursement-batch` client extension.
