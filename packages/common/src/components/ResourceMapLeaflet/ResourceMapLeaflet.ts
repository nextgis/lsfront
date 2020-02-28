import './ResourceMapLeaflet.css';
import { Map } from 'leaflet';
import { Component, Mixins } from 'vue-property-decorator';

import { GeoJsonProperties, Geometry } from 'geojson';

import VueNgwMap from '@nextgis/vue-ngw-leaflet';

import ResourceMap from '../ResourceMap';

@Component
export default class ResourceMapLeaflet<
  P extends GeoJsonProperties = GeoJsonProperties,
  G extends Geometry = Geometry
> extends Mixins<ResourceMap<VueNgwMap, Map>>(ResourceMap) {
  // @ts-ignore
  vueNgwMapComponent = VueNgwMap;
}
