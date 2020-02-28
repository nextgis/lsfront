import { Component, Prop, Vue, Ref } from 'vue-property-decorator';
import {
  CreateElement,
  VNode,
  VNodeData,
  Component as VueComponent
} from 'vue';
import { Feature, GeoJsonProperties, Geometry } from 'geojson';

import { VectorResourceAdapter, NgwLayerOptions } from '@nextgis/ngw-kit';

import NgwMap, { LayerDefinition } from '@nextgis/ngw-map';

import { VueNgwMap, VueNgwResource } from '@nextgis/vue-ngw-map';

import { connector } from '../../ngw/connector';

import { AppVue, GetLayersOptionsCb } from '../../interfaces';

export type ResourceLayerDefinition<
  P extends GeoJsonProperties = GeoJsonProperties,
  G extends Geometry = Geometry
> = LayerDefinition<Feature<G, P>>;
export type ResourceAdapter<
  P extends GeoJsonProperties = GeoJsonProperties,
  G extends Geometry = Geometry,
  L = any
> = VectorResourceAdapter<any, L, any, Feature<G, P>>;

@Component({
  components: {
    VueNgwResource
  }
})
export default class ResourceMap<
  VM extends VueNgwMap = any,
  M extends any = any
> extends Vue {
  @Prop({ type: String, default: '' }) resourcesIds!: string;
  @Prop({ type: Number, default: null }) qmsId!: string;
  @Prop({ type: Boolean, default: true }) fit!: boolean;
  @Prop({ type: Array, default: () => ({}) }) layersOptions!: Array<
    NgwLayerOptions | GetLayersOptionsCb
  >;
  @Ref('NgwMap') readonly vueNgwMapRef!: VM;

  $root!: AppVue;

  readonly vueNgwMapComponent!: VM;

  ngwMap: NgwMap<M> | false = false;
  layerCreated = false;
  addedLayers: ResourceAdapter[] = [];

  get connector() {
    return connector;
  }

  mounted() {
    const ref = this.vueNgwMapRef;
    this.ngwMap = ref.ngwMap;
    const ngwMap = this.ngwMap;
    if (ngwMap) {
      this._addLayers();
    }
  }

  render(h: CreateElement): VNode {
    const data: VNodeData = {
      ref: 'NgwMap',
      attrs: {
        connector: this.connector,
        qmsId: this.qmsId,
        'full-filling': true
      }
    };
    return h(
      this.vueNgwMapComponent as VueComponent,
      data,
      this.$slots.default
    );
  }

  async updateLayers() {
    this.layerCreated = false;
    this._removeLayers();
    const ngwMap = this.ngwMap;
    const layers = this._getLayersOptions();
    if (ngwMap) {
      for (const l of layers) {
        const layer = await ngwMap.addNgwLayer(l);
        if (layer) {
          this.addedLayers.push(layer);
        }
      }
    }
    this.layerCreated = true;
  }

  private _getLayersOptions(): NgwLayerOptions[] {
    const layerOptions: NgwLayerOptions[] = [];
    this.layersOptions.forEach(x => {
      if (typeof x === 'object') {
        layerOptions.push(x);
      } else if (typeof x === 'function') {
        layerOptions.push(x(this));
      }
    });
    return layerOptions;
  }

  private _removeLayers() {
    const ngwMap = this.ngwMap;
    if (ngwMap) {
      this.addedLayers.forEach(x => ngwMap.removeLayer(x));
    }
  }

  private async _addLayers() {
    await this.updateLayers();
  }
}
