"""Route type vocabulary: GTFS base codes plus Google's extended HVT codes."""

import json
from dataclasses import dataclass
from importlib.resources import files
from typing import Literal

RouteTypeSource = Literal["gtfs", "google-hvt"]


@dataclass(frozen=True)
class LocalizedLabel:
    en: str
    fr: str


@dataclass(frozen=True)
class RouteTypeFamily:
    slug: str
    label: LocalizedLabel


@dataclass(frozen=True)
class RouteTypeInfo:
    code: int
    source: RouteTypeSource
    label: LocalizedLabel
    examples: str | None
    google_supported: bool
    # Base GTFS route_type (0-12), or None for air, taxi and misc.
    base_type: int | None
    family: str


_DATA = json.loads(
    files("gtfs_zone_vocab").joinpath("route-types.json").read_text("utf-8")
)

# Families in canonical display order.
ROUTE_TYPE_FAMILIES: tuple[RouteTypeFamily, ...] = tuple(
    RouteTypeFamily(slug=f["slug"], label=LocalizedLabel(**f["label"]))
    for f in _DATA["families"]
)

# Every known route_type, base codes first, then Google HVT codes, by code.
ROUTE_TYPES: tuple[RouteTypeInfo, ...] = tuple(
    RouteTypeInfo(
        code=rt["code"],
        source=rt["source"],
        label=LocalizedLabel(**rt["label"]),
        examples=rt["examples"],
        google_supported=rt["googleSupported"],
        base_type=rt["baseType"],
        family=rt["family"],
    )
    for rt in _DATA["routeTypes"]
)

_BY_CODE = {rt.code: rt for rt in ROUTE_TYPES}


def route_type_info(code: int) -> RouteTypeInfo | None:
    """The entry for a route_type code, or None when the code is unknown."""
    return _BY_CODE.get(code)


def route_type_family(code: int) -> str | None:
    """The family slug for a code, or None when the code is unknown."""
    rt = _BY_CODE.get(code)
    return rt.family if rt else None


def route_base_type(code: int) -> int | None:
    """The base GTFS route_type for a code.

    None both when the code has no base type (air, taxi, misc) and when the
    code is unknown; use route_type_info to tell the two apart.
    """
    rt = _BY_CODE.get(code)
    return rt.base_type if rt else None
