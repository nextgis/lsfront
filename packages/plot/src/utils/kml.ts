import { Polygon, Feature, GeoJsonObject } from 'geojson';
import { getPointsFromPolygon } from './getPointsFromPolygon';

interface PlaceMarkOptions {
  name: string;
  coordinates: string;
  description?: string;
}

function craetePlaceMarkStr(opt: PlaceMarkOptions) {
  return `<Placemark>
            <name>${opt.name}</name>
            <description>${opt.description || ''}</description>
            <Point>
              <coordinates>${opt.coordinates}</coordinates>
            </Point>
          </Placemark>
          `;
}

export function createPointKmlStringFromPolygon(feature: Feature<Polygon>) {
  const polygon = feature.geometry;
  let placeMarks = '';
  getPointsFromPolygon(polygon).forEach((x, i) => {
    placeMarks += craetePlaceMarkStr({
      name: String(i),
      coordinates: x.join(',')
    });
  });
  const kml = `<?xml version="1.0" encoding="UTF-8"?>
  <kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
    <Document>
      ${placeMarks}
    </Document>
  </kml>`;
  return kml;
}

export async function tokml(geojson: GeoJsonObject) {
  // @ts-ignore
  const tokml = await import('tokml');
  return tokml.default(geojson, { simplestyle: true });
}
