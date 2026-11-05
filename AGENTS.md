# AGENTS.md

Shared GTFS vocabularies for the gtfs.zone apps. `data/route-types.json` is
the single source; `ts/` and `python/gtfs_zone_vocab/` read it with the same
API. It ships raw TypeScript and a dependency-free Python package with no build
step, consumed as a git dependency pinned by tag; it has no deployment.

## Commands

```bash
scripts/check.sh            # pnpm check + ruff + pytest (the pre-commit hook)
pnpm run check              # typecheck + lint + knip + check:route-types + TS tests
scripts/check-route-types   # diff the JSON against the Google snapshot
pnpm vuln                   # osv-scanner on pnpm-lock.yaml and uv.lock
```

## Architecture

- **What belongs here.** Small tables that more than one repo needs, in a
  form both TS and Python can read. A table moves in when a second repo
  needs it. The full GTFS Schedule spec and the Google field/file overlays
  live in gtfs-zone-editor (`src/gtfs-spec/`), their only consumer.
- **One table, two readers.** Edit `data/route-types.json`, never a list in
  `ts/` or `python/`. `python/gtfs_zone_vocab/route-types.json` is a symlink to
  it so the wheel carries the data.
- **The TS and Python APIs stay in step.** Same names (camelCase in TS,
  snake_case in Python), same semantics, same tests.
- **The snapshot is verbatim.** `reference/google-extended-route-types.md` is
  Google's table as published; `label.en`, `googleSupported` and `examples` of
  the `google-hvt` entries follow it, and `check-route-types` enforces that.
  `label.fr`, `baseType` and `family` are curated.
- **Unknown codes return `undefined` / `None`.** Nothing here logs; consumers
  log with their own prefix.
- **No barrel files.** Each vocabulary is its own `exports` entry
  (`gtfs-zone-vocab/route-types`).

## Conventions

- **Commits**: Conventional Commits, enforced by the `commit-msg` hook. Setup and
  release are in [CONTRIBUTING.md](CONTRIBUTING.md).
- **Releasing**: `cz bump` updates both `pyproject.toml` and `package.json`.
  Push the tag as well as the commit (`--follow-tags`); consumers pin by tag.
- **Plans**: write plans to `CURRENT_PLAN.md` at the repo root as a
  checklist (`- [ ]`), ticked off as work lands. It is neither tracked nor
  gitignored: never stage or commit it.
