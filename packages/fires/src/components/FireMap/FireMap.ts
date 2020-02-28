import { Map } from 'leaflet';
import { Component, Watch, Prop, Vue, Ref } from 'vue-property-decorator';
import config from '../cfg';
import { NgwLayersList } from '@nextgis/vuetify-ngw-components';
// import { connector } from '@veles/common';
import VueNgwMap from '@nextgis/vue-ngw-leaflet';
import NgwMap, {
  LayerAdapter,
  NgwMapOptions,
  PropertyFilter
} from '@nextgis/ngw-map';

import { LoadingComponent } from '@veles/common';
import {} from '@mdi/js';
import NgwConnector from '@nextgis/ngw-connector';
import { Geometry, Feature, MultiPoint } from 'geojson';
import { Firms } from '../../interfaces';
import { VectorResourceAdapter } from '@nextgis/ngw-kit';

export const connector = new NgwConnector({
  baseUrl: config.mapOptions.baseUrl || '',
  auth: config.mapOptions.auth
});

@Component({
  components: {
    VueNgwMap,
    NgwLayersList,
    LoadingComponent
  }
})
export default class extends Vue {
  @Prop({ type: String, default: '' }) lesid!: string;
  @Ref('NgwMap') readonly vueNgwMap!: VueNgwMap;

  svg = {};

  mapOptions: NgwMapOptions = config.mapOptions;

  layersDrawer = false;
  ngwMap: NgwMap<Map> | false = false;

  isLoading = false;

  period = config.timedelta;
  periods = [
    [24, '24 часа'],
    [48, '48 часов'],
    [72, '72 часа'],
    [168, 'неделя']
  ];

  baseLayers: LayerAdapter[] = [];
  promises: Record<string, Promise<any>> = {};

  get connector() {
    return connector;
  }

  mounted() {
    const ref = this.vueNgwMap;
    const ngwMap = ref && (ref.ngwMap as NgwMap);

    if (ngwMap) {
      this.ngwMap = ngwMap;
      this.updateLayers();
    }
  }

  @Watch('period')
  changePeriod(newPeriod: number, old: number) {
    const ngwMap = this.ngwMap;
    if (ngwMap) {
      config.fires.forEach(x => {
        const layer = ngwMap.getLayer(x.id) as VectorResourceAdapter;
        if (layer && layer.propertiesFilter) {
          this.isLoading = true;
          try {
            layer.propertiesFilter([this._createFilter()]);
          } finally {
            this.isLoading = false;
          }
        }
      });
    }
  }

  async updateLayers() {
    this.isLoading = true;
    const ngwMap = this.ngwMap;
    if (ngwMap) {
      for (const x of config.fires) {
        await ngwMap.addNgwLayer({
          resourceId: x.resourceId,
          id: x.id,
          adapterOptions: {
            propertiesFilter: [this._createFilter()],
            paint: {
              stroke: true,
              color: x.color,
              fillOpacity: 0.6,
              radius: 5
            },
            selectable: true,
            selectedPaint: {
              stroke: true,
              color: x.color,
              fillOpacity: 0.9,
              radius: 7
            },
            selectOnHover: true,
            popupOnSelect: true,
            popupOptions: {
              createPopupContent: e => {
                if (e.feature) {
                  const feature = e.feature as Feature<MultiPoint, Firms>;
                  return this._createPopupContent<MultiPoint, Firms>(feature);
                }
              }
            }
          }
        });
      }
    }

    this.isLoading = false;
  }

  private _createFilter(): PropertyFilter {
    return [
      'timestamp',
      'ge',
      Math.floor(Date.now() / 1000) - Number(this.period) * 3600
    ];
  }

  private _createPopupContent<
    G extends Geometry = any,
    P = Record<string, string | number | boolean>
  >(feature: Feature<G, P>): HTMLElement {
    const popupElement = document.createElement('div');
    const pre = document.createElement('div');
    pre.className = 'properties';
    const propertiesList = Object.entries(feature.properties).map(
      ([key, value]) => {
        return {
          key,
          value
        };
      }
    );
    pre.innerHTML = this._createPropertiesHtml(propertiesList);
    // pre.style.whiteSpace = 'pre-wrap';
    popupElement.appendChild(pre);
    return popupElement;
  }

  private _createPropertiesHtml(
    properties: Array<{ key: string; value: any }>
  ) {
    let elem = '';
    properties.forEach(({ key, value }) => {
      if (typeof value === 'object' && value) {
        if ('year' in value) {
          value = [value.day, value.month, value.year].join('.');
        } else if ('hour' in value) {
          value = [value.hour, value.minute].join(':');
        }
      }
      elem += `
      <div class="columns">
        <div class="column is-two-fifths">${key}</div>
        <div class="column">${value}</div>
      </div>
      `;
    });
    return elem;
  }
}
