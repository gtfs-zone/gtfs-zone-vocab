from gtfs_zone_vocab.route_types import (
    ROUTE_TYPE_FAMILIES,
    ROUTE_TYPES,
    route_base_type,
    route_type_family,
    route_type_info,
)

FAMILY_ORDER = [
    "tram",
    "metro",
    "rail",
    "coach",
    "bus",
    "trolleybus",
    "ferry",
    "cable",
    "funicular",
    "air",
    "taxi",
    "misc",
]
BASE_TYPES = [0, 1, 2, 3, 4, 5, 6, 7, 11, 12]


def test_families_unique_and_ordered():
    assert [f.slug for f in ROUTE_TYPE_FAMILIES] == FAMILY_ORDER


def test_codes_unique_and_sorted():
    codes = [rt.code for rt in ROUTE_TYPES]
    assert codes == sorted(set(codes))


def test_every_code_has_family_and_valid_base_type():
    for rt in ROUTE_TYPES:
        assert rt.family in FAMILY_ORDER, rt.code
        assert rt.base_type is None or rt.base_type in BASE_TYPES, rt.code
        assert rt.label.en and rt.label.fr and rt.label.de, rt.code


def test_base_codes_are_their_own_base_type():
    base = [rt for rt in ROUTE_TYPES if rt.source == "gtfs"]
    assert [rt.code for rt in base] == BASE_TYPES
    assert all(rt.base_type == rt.code for rt in base)


def test_lookups():
    info = route_type_info(109)
    assert info is not None
    assert info.label.en == "Suburban Railway"
    assert route_type_family(1200) == "ferry"
    assert route_base_type(715) == 3
    assert route_base_type(1100) is None
    assert route_type_info(9999) is None
    assert route_type_family(9999) is None
