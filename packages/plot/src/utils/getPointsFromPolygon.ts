import { Polygon } from 'geojson';

export function getPointsFromPolygon(polygon: Polygon): number[][] {
  const coordinates: number[][] = [];
  polygon.coordinates.forEach(x => {
    for (let fry = 0; fry < x.length - 1; fry++) {
      coordinates.push(x[fry]);
    }
  });
  return coordinates;
}
