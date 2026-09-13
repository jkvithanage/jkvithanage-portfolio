# Issue tracker: GitHub

Specs and tickets live in GitHub Issues. Use the gh CLI.
Resolve the repository from the origin remote.

## Operations

- Publish a spec by creating an issue.
- Read tickets with gh issue view <number> --comments, including labels.
- List issues with appropriate state and label filters.
- Apply triage labels using the mapping in triage-labels.md.
- For multiline issue bodies and comments, write the content to a temporary
  file and use --body-file to preserve formatting.
- Publish completed specs with the ready-for-agent label.

## Ticket relationships

Use GitHub sub-issues for parent-child relationships and native issue
dependencies for blockers. If unavailable, use parent task lists,
“Part of #<number>”, and “Blocked by: #<number>” references.

A ticket is unblocked when all its blockers are closed.

## Pull requests

PRs as a request surface: no.

GitHub issues and pull requests share a number space. Resolve the resource
type before acting on an ambiguous number.
