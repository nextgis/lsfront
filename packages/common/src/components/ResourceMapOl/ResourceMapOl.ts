import Map from 'ol/Map';
import { Component, Mixins } from 'vue-property-decorator';

import { GeoJsonProperties, Geometry } from 'geojson';

import VueNgwMap from '@nextgis/vue-ngw-ol';

import ResourceMap from '../ResourceMap';

@Component
export default class ResourceMapOl<
  P extends GeoJsonProperties = GeoJsonProperties,
  G extends Geometry = Geometry
> extends Mixins<ResourceMap<VueNgwMap, Map>>(ResourceMap) {
  // @ts-ignore
  readonly vueNgwMapComponent = VueNgwMap;
}
