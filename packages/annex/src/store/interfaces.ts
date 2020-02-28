import { VectorResourceAdapter } from '@nextgis/ngw-kit';
import { LayerDefinition } from '@nextgis/webmap';
import { Feature, Polygon } from 'geojson';

export type ThirdAnnexFeature = Feature<Polygon, ThirdAnnexProperties>;
export type ThirdAnnexDefinition = LayerDefinition<ThirdAnnexFeature>;
export type ThirdAnnexAdapter = VectorResourceAdapter<
  any,
  Polygon,
  any,
  ThirdAnnexFeature
>;

export interface ThirdAnnexProperties {
  lesids: string;
  MUN?: string;
  LES?: string;
  data: string;
}

export type ReportsProperties = ThirdAnnexProperties;

export type FourthAnnexFeature = Feature<Polygon, FourthAnnexProperties>;
export type FourthAnnexDefinition = LayerDefinition<FourthAnnexFeature>;
export type FourthAnnexAdapter = VectorResourceAdapter<
  any,
  Polygon,
  any,
  FourthAnnexFeature
>;

export interface FourthAnnexProperties {
  annex3ids: string;
  lesids?: string;
  MUN?: string;
  LES?: string;
  data: string;
}
