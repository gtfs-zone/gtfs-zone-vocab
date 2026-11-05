#!/bin/sh
# TS and Python checks plus the snapshot diff; run by the pre-commit hook and CI.
set -e
pnpm check
uv run ruff check .
uv run ruff format --check .
uv run pytest -q
