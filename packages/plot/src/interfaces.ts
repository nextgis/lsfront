import { Polygon as LPolygon } from 'leaflet';
import { VectorResourceAdapter } from '@nextgis/ngw-kit';
import { LayerDefinition } from '@nextgis/webmap';
import { Feature, Polygon, Point } from 'geojson';

export type PlotFeature = Feature<Polygon, PlotProperties>;
export type PlotLayerDefinition = LayerDefinition<PlotFeature>;
export type PlotResourceAdapter = VectorResourceAdapter<
  any,
  LPolygon,
  any,
  PlotFeature
>;

export interface PlotProperties {
  REG: string;
  MUN: string;
  LES: string;
  UCH_LES: string;
  UROCH: string;
  KV: string;
  VD: string;
  AREA_PLAN: number;
  AREA_REAL: number; // "Площадь лесосеки фактическая, га "
  AREA_OPER: number;
  NOM_LESKEY: number;
  PORODA: string;
  TYPE_RUB: string;
  FORMA_RUB: string;
  VOLUME: number;
  CONTRACTOR: number;
  DATE: Date;
  VOLUME_REA: number;
  OBJ_INFRA: string;
  CHAR: string;
  WIDTH: number;
  LENGTH: number;
  LAND_REC: string;
  YEAR_BUILD: string;
  SENDER_NAM: string;
  YEAR_DEV: string;
  ID_LES: string;
}

export type TurnPointType = 0 | 1 | 2;

export interface ReferencePointProperty extends TurnPointProperties {
  type: 0;
  idpnt: 0;
}
export type ReferencePointFeature = Feature<Point, ReferencePointProperty>;
export type ReferencePointDefinition = LayerDefinition<ReferencePointFeature>;

export interface TurnPointProperties {
  idpnt: number;
  type: TurnPointType;
  plotid: number;
}

export type LookupTables = { [field: string]: Record<string, string> };
