# Agent instructions

## Implementation workflow

1. Start from up-to-date `master` and create a regular
   `implement-<short-description>` branch in the existing checkout. Work in
   that checkout throughout; do not create a worktree or use
   `implement/issue-<number>` branch names. Preserve unrelated local work.
2. Complete the changes and relevant checks, then commit them on that branch.
3. Push the branch and create a pull request against `master`. When addressing
   an issue, include `Closes #<number>` in the PR body so merging closes it.
4. Share the PR link and validation results for review; leave merging to the user.

## Issue tracker

Specs and tickets live in GitHub Issues. Before tracker operations, read
docs/agents/issue-tracker.md.

## Triage labels

Use the five canonical triage labels. Before triaging or labeling issues,
read docs/agents/triage-labels.md.

## Domain docs

This repository uses a root CONTEXT.md and docs/adr/.
Before exploring domain concepts or architectural decisions, read
docs/agents/domain.md.
