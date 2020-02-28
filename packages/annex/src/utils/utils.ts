import { LngLatArray } from '@nextgis/webmap';
import { defaultScales } from '../config';

export function numberWithSpaces(x: number): string {
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return parts.join('.');
}

/** Returns width of map in meters on specified latitude. */
export function getMapWidthForLanInMeters(currentLan: number) {
  return 6378137 * 2 * Math.PI * Math.cos((currentLan * Math.PI) / 180);
}

export async function distance(lngLatFrom: LngLatArray, lngLatTo: LngLatArray) {
  // @ts-ignore
  const distance = await import('@turf/distance');
  const options = { units: 'kilometers' };
  return distance.default(lngLatFrom, lngLatTo, options);
}

export async function direction(
  lngLatFrom: LngLatArray,
  lngLatTo: LngLatArray
) {
  // @ts-ignore
  const bearing = await import('@turf/bearing');
  let dir = bearing.default(lngLatFrom, lngLatTo);
  if (dir < 0) {
    dir = 360 + dir;
  }
  return dir;
}

export function getSelectScaleItems(activeScale: number, scales?: number[]) {
  scales = scales !== undefined ? scales : defaultScales;
  const selectScaleItems: { text: string; value: any }[] = [];

  const createItem = (value: number) => {
    return { text: '1:' + numberWithSpaces(value), value };
  };

  if (activeScale) {
    selectScaleItems.push(createItem(activeScale));
  }
  scales.forEach(x => {
    selectScaleItems.push(createItem(x));
  });
  return selectScaleItems;
}
