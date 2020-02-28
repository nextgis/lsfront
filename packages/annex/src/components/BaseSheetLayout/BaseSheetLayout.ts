import '../../sheetLayout.css';

import { Component, Vue, Prop, Watch, PropSync } from 'vue-property-decorator';
import NgwMap, { LngLatBoundsArray } from '@nextgis/ngw-map';
import { ResourceAdapter, NgwLayerOptions } from '@nextgis/ngw-kit';
import { GetLayersOptionsCb } from '@veles/common';

import { LoadingComponent } from '@veles/common/src/components/LoadingComponent';
import ResourceMap from '@veles/common/src/components/ResourceMapOl';
import { PlotLayerDefinition } from '@veles/plot/src/interfaces';

import SheetFooterAttribution from '../SheetFooterAttribution/SheetFooterAttribution.vue';
import { AnnexInputAttribution } from '../../interfaces';
import { numberWithSpaces } from '../../utils/utils';
import { calculateResolutionByScale, getScale } from '../../utils/olUtils';

@Component({
  components: {
    LoadingComponent,
    PlotNgwMap: ResourceMap,
    SheetFooterAttribution
  }
})
export default class extends Vue {
  @PropSync('scale', { type: Number }) activeScale!: number;
  @Prop({ type: String }) lesids!: string;
  @Prop({ type: Array, default: () => [] }) bounds!: LngLatBoundsArray;
  @Prop({ type: String, default: 'plotwebmap' }) webmap!: string;
  @Prop({ type: Array, default: () => [] }) inputAttributions!: Array<
    AnnexInputAttribution
  >;

  sheetScale = 0;
  ngwMap?: NgwMap | false = false;
  plotNgwMap?: ResourceMap | false = false;
  plot?: PlotLayerDefinition | false = false;
  layersOptions: Array<NgwLayerOptions | GetLayersOptionsCb> = [
    () => {
      return { keyname: this.webmap };
    },
    (opt: ResourceMap) => ({
      keyname: 'plot',
      id: 'plot',
      fit: true,
      adapterOptions: {
        order: 10,
        paint: { stroke: true, fillOpacity: 0.3, color: 'orange', weight: 2 },
        propertiesFilter: [['id', 'in', opt.resourcesIds]],
        labelField: 'ID_LES'
      }
    })
  ];

  attributes = [
    { name: 'Лесничество', field: 'LES' },
    { name: 'Участковое лесничество', field: 'UCH_LES' },
    { name: 'Урочище (при наличии)', field: 'UROCH' }
  ];

  _events: { [eventName: string]: (...args: any[]) => any } = {};

  get activeScaleHumanize() {
    return numberWithSpaces(this.sheetScale);
  }

  get properties() {
    return (
      (this.plot && this.plot.feature && this.plot.feature.properties) || {}
    );
  }

  get year() {
    return new Date().getFullYear();
  }

  mounted() {
    const ref = this.$refs.PlotNgwMap as ResourceMap;
    this.plotNgwMap = this.$refs.PlotNgwMap as ResourceMap;
    this.ngwMap = ref.ngwMap as NgwMap;
    const bounds = this.bounds;
    const firstPlot = this.lesids.split(',')[0];

    this.$watch('plotNgwMap.layerCreated', () => {
      const ngwMap = this.ngwMap;
      let layer: ResourceAdapter | undefined;
      if (firstPlot !== undefined && ngwMap) {
        layer = ngwMap.getLayer('plot') as ResourceAdapter;
        const map = ngwMap.mapAdapter.map;
        if (layer && layer.getLayers && map) {
          const layers = layer.getLayers();
          this.plot = layers[0] as PlotLayerDefinition;
        }
      }
      if (bounds && bounds.length) {
        this.setBounds(bounds);
      } else if (layer) {
        this.zoomToLayers(layer);
      }
    });
  }

  setScale(val: number) {
    this.activeScale = val;
    this.sheetScale = val;
  }

  @Watch('scale')
  setScaleRatio(scale: number) {
    const ngwMap = this.ngwMap;
    if (!ngwMap) return;

    const olMap = ngwMap.mapAdapter.map;
    const olView = olMap.getView();
    const resolution = calculateResolutionByScale(olView, scale);
    olView.setResolution(resolution);
  }

  @Watch('bounds')
  setBounds(bounds: LngLatBoundsArray) {
    const ngwMap = this.ngwMap;
    if (ngwMap) {
      ngwMap.fitBounds(bounds);
    }
  }

  @Watch('plot')
  async updatePlot(plot: PlotLayerDefinition) {
    const ngwMap = this.ngwMap;
    if (plot) {
      this._updateScale();
      if (ngwMap && plot) {
        this.removeMapZoomChangeListener();
        this.addMapZoomChangeListener();
      }
    }
  }

  async _updateScale() {
    const ngwMap = this.ngwMap;
    if (!ngwMap) return;

    const olMap = ngwMap.mapAdapter.map;
    const olView = olMap.getView();
    const scale = getScale(olView);
    this.setScale(scale);
  }

  protected zoomToLayers(layer: ResourceAdapter) {
    const ngwMap = this.ngwMap;
    if (ngwMap) {
      ngwMap.fitLayer(layer);
    }
  }

  private addMapZoomChangeListener() {
    const ngwMap = this.ngwMap;
    if (ngwMap) {
      this._events._updateScale = () => this._updateScale();
      ngwMap.emitter.on('zoomend', this._events._updateScale);
    }
  }

  private removeMapZoomChangeListener() {
    const ngwMap = this.ngwMap;
    if (ngwMap && this._events._updateScale) {
      ngwMap.emitter.off('zoomend', this._events._updateScale);
      delete this._events._updateScale;
    }
  }
}
