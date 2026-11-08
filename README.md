# gtfs-zone-vocab

[![CI](https://img.shields.io/github/actions/workflow/status/gtfs-zone/gtfs-zone-vocab/check.yml?branch=main&label=CI)](https://github.com/gtfs-zone/gtfs-zone-vocab/actions/workflows/check.yml?query=branch%3Amain) [![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE.txt) [![Latest tag](https://img.shields.io/github/v/tag/gtfs-zone/gtfs-zone-vocab?sort=semver)](https://github.com/gtfs-zone/gtfs-zone-vocab/tags)

Shared GTFS vocabularies for the gtfs.zone apps, one table read from both
TypeScript and Python. Today it holds `route_type`: the GTFS base codes (0-12)
and Google's extended Hierarchical Vehicle Type codes (100-1702), each mapped to
a base type and a mode family.

## Data

`data/route-types.json` is the single source:

- `families`: the mode families in canonical display order (`tram`, `metro`,
  `rail`, `coach`, `bus`, `trolleybus`, `ferry`, `cable`, `funicular`, `air`,
  `taxi`, `misc`), each with an en/fr/de label.
- `routeTypes`: one entry per code, sorted by code:
  - `code`
  - `source`: `gtfs` (base) or `google-hvt` (extended)
  - `label.en`: the spec wording (MobilityData for base codes, Google for
    extended ones); `label.fr` and `label.de`: translations
  - `examples`: Google's examples, or `null`
  - `googleSupported`: whether Google Maps supports the code
  - `baseType`: the base code (0-12) it falls back to, or `null` for air, taxi
    and misc
  - `family`: a `families` slug

`reference/google-extended-route-types.md` is a verbatim snapshot of Google's
table. `scripts/check-route-types` diffs the extended entries (codes, `label.en`,
`googleSupported`, `examples`) against it and runs in the pre-commit hook and CI.

## TypeScript

Raw `.ts`, no build step. Consumed as a pinned git dependency:

```
pnpm add "gtfs-zone-vocab@github:gtfs-zone/gtfs-zone-vocab#vX.Y.Z"
```

```ts
import {
  ROUTE_TYPES,
  ROUTE_TYPE_FAMILIES,
  routeTypeInfo,
  routeTypeFamily,
  routeBaseType,
} from 'gtfs-zone-vocab/route-types';
```

The module imports the JSON, so the consumer's `tsconfig.json` needs
`resolveJsonModule`.

## Python

Dependency-free, with the JSON shipped as package data:

```toml
[project]
dependencies = ["gtfs-zone-vocab"]

[tool.uv.sources]
gtfs-zone-vocab = { git = "https://github.com/gtfs-zone/gtfs-zone-vocab.git", tag = "vX.Y.Z" }
```

```python
from gtfs_zone_vocab.route_types import (
    ROUTE_TYPES,
    ROUTE_TYPE_FAMILIES,
    route_type_info,
    route_type_family,
    route_base_type,
)
```

An unknown code returns `undefined` / `None`; the caller decides how to log it.

## Refreshing the Google snapshot

1. Re-download the table from
   https://developers.google.com/transit/gtfs/reference/extended-route-types
   over `reference/google-extended-route-types.md`, keeping the header comment
   and updating its page revision and fetch date.
2. Run `scripts/check-route-types` and fix `data/route-types.json` until it
   exits zero. A new code also needs `label.fr`, `label.de`, `baseType` and `family`.

## License

Apache-2.0. The Google snapshot is CC-BY-4.0 (Google LLC); see `REUSE.toml`.
