import { GeoJsonObject } from 'geojson';
import WebMap, { LngLatBoundsArray } from '@nextgis/webmap';

export async function getBoundsFromGeojson(
  geojson: GeoJsonObject
): Promise<LngLatBoundsArray> {
  // @ts-ignore
  const bbox = await import('@turf/bbox');
  const bboxArray = bbox.default(geojson);
  return bboxArray;
}

export function createGeoJsonFromBounds(b: LngLatBoundsArray) {
  return WebMap.utils.getBoundsPolygon(b);
}
