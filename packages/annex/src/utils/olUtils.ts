import { getPointResolution } from 'ol/proj';
import Units from 'ol/proj/Units';

const cosh = (value: number) => {
  return (Math.exp(value) + Math.exp(-value)) / 2;
};

export function calculateResolutionByScale(olView: any, scale: number): number {
  const center = olView.getCenter();
  const pointResolution3857 = cosh(center[1] / 6378137);
  return (pointResolution3857 * scale) / (96 * 39.3701);
}

const DOTS_PER_INCH = 96;
const INCHES_PER_METER = 39.3701;

export function getScale(olView: any): number {
  const resolution = olView.getResolution();
  const projection = olView.getProjection();
  const center = olView.getCenter();
  const pointResolution = getPointResolution(
    projection,
    resolution,
    center,
    Units.METERS
  );
  return Math.round(pointResolution * INCHES_PER_METER * DOTS_PER_INCH);
}
