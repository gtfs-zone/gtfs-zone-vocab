import data from '../data/route-types.json' with { type: 'json' };

export type RouteTypeSource = 'gtfs' | 'google-hvt';

export interface LocalizedLabel {
  en: string;
  fr: string;
}

export interface RouteTypeFamily {
  slug: string;
  label: LocalizedLabel;
}

export interface RouteTypeInfo {
  code: number;
  source: RouteTypeSource;
  label: LocalizedLabel;
  examples: string | null;
  googleSupported: boolean;
  /** Base GTFS route_type (0-12), or null for air, taxi and misc. */
  baseType: number | null;
  family: string;
}

/** Families in canonical display order. */
export const ROUTE_TYPE_FAMILIES: readonly RouteTypeFamily[] = data.families;

/** Every known route_type, base codes first, then Google HVT codes, by code. */
export const ROUTE_TYPES: readonly RouteTypeInfo[] =
  data.routeTypes as RouteTypeInfo[];

const BY_CODE = new Map(ROUTE_TYPES.map((rt) => [rt.code, rt]));

/** The entry for a route_type code, or undefined when the code is unknown. */
export function routeTypeInfo(code: number): RouteTypeInfo | undefined {
  return BY_CODE.get(code);
}

/** The family slug for a code, or undefined when the code is unknown. */
export function routeTypeFamily(code: number): string | undefined {
  return BY_CODE.get(code)?.family;
}

/**
 * The base GTFS route_type for a code: null when the code has none (air,
 * taxi, misc), undefined when the code is unknown.
 */
export function routeBaseType(code: number): number | null | undefined {
  return BY_CODE.get(code)?.baseType;
}
