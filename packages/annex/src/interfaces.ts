import { LngLatBoundsArray } from '@nextgis/webmap';

export interface AnnexInputAttributionMap {
  person: string;
  head: string;
  date: Date;
  sign: string;
}

export interface ReportsInputAttributionMap {
  mode: 'usage' | 'recovery';
}

// export interface AnnexInputAttribution<
//   T extends keyof AnnexInputAttributionMap = keyof AnnexInputAttributionMap
// > {
//   name: T;
//   label: string;
//   hidden?: boolean;
//   value?: AnnexInputAttributionMap[T];
// }

export interface AnnexInputAttribution {
  name: string;
  label: string;
  hidden?: boolean;
  value?: any;
  saved?: boolean;
}

export interface ThirdAnnexDataProperties<
  T extends Record<string, any> = Record<string, any>
> {
  ids: number[];
  inputAttributions?: Partial<T>;
  layers?: string[];
}

export interface FourthSheetProperties {
  id: string;
  bounds: LngLatBoundsArray;
}

export interface FourthAnnexDataProperties {
  sheets: FourthSheetProperties[];
  inputAttributions: Record<string, any>;
}

export interface ReportsDataProperties {
  bounds?: LngLatBoundsArray;
}
