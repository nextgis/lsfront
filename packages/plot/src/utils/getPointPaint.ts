import { CirclePaint, IconPaint } from '@nextgis/webmap';

export interface PointPaint {
  paint: CirclePaint | IconPaint;
  selectedPaint?: CirclePaint | IconPaint;
}

export function getPointPaint(color = 'blue'): PointPaint {
  return {
    paint: {
      stroke: true,
      fillOpacity: 1,
      strokeColor: 'white',
      color,
      radius: 5
    },
    selectedPaint: {
      stroke: true,
      fillOpacity: 1,
      strokeColor: 'white',
      color,
      radius: 7
    }
  };
}
