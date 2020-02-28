import { NgwMapOptions } from '@nextgis/ngw-map';

export interface FireResource {
  resourceId: number;
  id: string;
  color?: string;
}

export interface BaseLayer {
  name?: string;
  qmsId: number;
}

export interface FireMapOptions {
  mapOptions: NgwMapOptions;
  fires: FireResource[];
  basemaps?: BaseLayer[];
  timedelta: 24;
}

export interface Firms {
  acq_date: string;
  acq_time: string; // '09:06';
  bright_t31?: number;
  brightness?: number;
  confidence: string;
  daynight: 'D';
  frp: number;
  latitude: number;
  longitude: number;
  satellite: 'N';
  scan: number;
  track: number;
  version: string;
}
