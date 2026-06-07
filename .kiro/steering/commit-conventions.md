# Commit Conventions

## Format

Conventional commits with gitmoji as text codes:

```
type(scope): :emoji_code: short description

Detailed explanation of what and why.
```

## Types

- `feat` — New feature (`:sparkles:`)
- `fix` — Bug fix (`:bug:`)
- `perf` — Performance (`:zap:`)
- `docs` — Documentation (`:memo:`)
- `chore` — Maintenance (`:wrench:`, `:arrow_up:`)
- `refactor` — Refactoring (`:recycle:`)
- `test` — Tests (`:white_check_mark:`)
- `style` — Formatting (`:art:`)
- `ci` — CI/CD (`:construction_worker:`)

## Rules

- One scope per commit (component or area affected)
- Always use text codes (`:sparkles:`), never actual emoji
- Include a body explaining what and why
- Breaking changes: `!` after type/scope + `BREAKING CHANGE:` in body
