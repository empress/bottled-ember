---
'buttered-ember': minor
---

Any time the package.json for the buttered app is modified,
we have a chance to unwravel the workspace protocol, if pnpm is used.
This is useful when a buttered app is used as a boilerplate-free test-app
and the package needing tests is in the same monorepo.

This is not possible to support with yarn or npm monorepos,
as they don't have any sort of workspace protocol -- a way to differentiate between
real published packages and packages in a monorepo
