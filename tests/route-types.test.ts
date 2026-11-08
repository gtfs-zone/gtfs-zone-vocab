import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  ROUTE_TYPE_FAMILIES,
  ROUTE_TYPES,
  routeBaseType,
  routeTypeFamily,
  routeTypeInfo,
} from '../ts/route-types.ts';

const FAMILY_ORDER = [
  'tram',
  'metro',
  'rail',
  'coach',
  'bus',
  'trolleybus',
  'ferry',
  'cable',
  'funicular',
  'air',
  'taxi',
  'misc',
];
const BASE_TYPES = [0, 1, 2, 3, 4, 5, 6, 7, 11, 12];

test('families are unique and in canonical order', () => {
  assert.deepEqual(
    ROUTE_TYPE_FAMILIES.map((f) => f.slug),
    FAMILY_ORDER
  );
});

test('codes are unique and sorted', () => {
  const codes = ROUTE_TYPES.map((rt) => rt.code);
  assert.deepEqual(
    codes,
    [...new Set(codes)].sort((a, b) => a - b)
  );
});

test('every code has a known family and a valid base type', () => {
  for (const rt of ROUTE_TYPES) {
    assert.ok(FAMILY_ORDER.includes(rt.family), `${rt.code}: ${rt.family}`);
    assert.ok(
      rt.baseType === null || BASE_TYPES.includes(rt.baseType),
      `${rt.code}: baseType ${rt.baseType}`
    );
    assert.ok(
      rt.label.en && rt.label.fr && rt.label.de,
      `${rt.code}: missing label`
    );
  }
});

test('base codes are their own base type', () => {
  const base = ROUTE_TYPES.filter((rt) => rt.source === 'gtfs');
  assert.deepEqual(
    base.map((rt) => rt.code),
    BASE_TYPES
  );
  for (const rt of base) {
    assert.equal(rt.baseType, rt.code);
  }
});

test('lookups', () => {
  assert.equal(routeTypeInfo(109)?.label.en, 'Suburban Railway');
  assert.equal(routeTypeFamily(1200), 'ferry');
  assert.equal(routeBaseType(715), 3);
  assert.equal(routeBaseType(1100), null);
  assert.equal(routeTypeInfo(9999), undefined);
  assert.equal(routeTypeFamily(9999), undefined);
  assert.equal(routeBaseType(9999), undefined);
});
