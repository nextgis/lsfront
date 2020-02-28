import './PlotNgwMap.css';
import { Feature, GeoJsonObject, FeatureCollection, Point } from 'geojson';
import { CreateElement, VNode, VNodeData } from 'vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { FeatureGroup, Map } from 'leaflet';
import { getIcon } from '@nextgis/icons';
import { NgwLayerOptions, NgwIdentify } from '@nextgis/ngw-kit';
import { VueNgwResource } from '@nextgis/vue-ngw-map';
import VueNgwMap from '@nextgis/vue-ngw-leaflet';
import NgwMap, {
  GeoJsonAdapterOptions,
  LayerAdapter,
  VectorLayerAdapter,
  PropertiesFilter,
  VectorAdapterOptions
} from '@nextgis/ngw-map';
import { connector } from '@veles/common/src/ngw/connector';
import { AppVue } from '@veles/common/src/interfaces';

import { getRandomColor } from '@veles/common';

import {
  PlotProperties,
  PlotLayerDefinition,
  PlotResourceAdapter,
  PlotFeature,
  TurnPointType,
  ReferencePointFeature
} from '../../interfaces';
import { plotModule } from '../../store/plot';
import { createPointKmlStringFromPolygon } from '../../utils/kml';
import { download } from '../../utils/download';
import { getPointPaint, PointPaint } from '../../utils/getPointPaint';
import { getPointsFromPolygon } from '../../utils/getPointsFromPolygon';

@Component({
  components: {
    VueNgwMap,
    VueNgwResource
  }
})
export default class extends Vue {
  @Prop({ type: String, default: '' }) lesid!: string;
  @Prop({ type: Number, default: null }) qmsId!: string;
  @Prop({ type: Function }) createPlotHighlightLayerPopup!: (
    e: PlotLayerDefinition
  ) => HTMLElement;
  @Prop({ type: Boolean, default: false }) hideArea!: boolean;
  @Prop({ type: Boolean, default: false }) hideTooltip!: boolean;
  @Prop({ type: Boolean, default: false }) hideBaseLayers!: boolean;
  @Prop({ type: Boolean, default: false }) hideAdditionalLayers!: boolean;
  @Prop({ type: Boolean, default: true }) fit!: boolean;

  plot?: PlotLayerDefinition | false = false;

  $root!: AppVue;

  ngwMap: NgwMap<Map> | false = false;

  importLayers: LayerAdapter[] = [];
  plotHighlightLayerId = 'ngw_plot_highlight';
  referencePointLayerId = 'turn_point_reference';

  requiredPlotFields: Array<keyof PlotProperties> = [];

  layerCreated = false;
  baseLayers: LayerAdapter[] = [];

  promises: Record<string, Promise<any>> = {};

  plotFilter: PropertiesFilter | false = false;

  async getBaseLayersOptions(): Promise<NgwLayerOptions[]> {
    const { plot, turnpoint, plotwebmap } = await plotModule.getResources();
    if (plot && turnpoint) {
      const adapter = !this.lesid && this.plotFilter ? 'GEOJSON' : 'IMAGE';
      let opt: NgwLayerOptions[] = [
        {
          resourceId: plotwebmap,
          id: plotwebmap + '-baselayer',
          adapter: 'IMAGE',
          fit: !this.lesid
        },
        {
          keyname: plotModule.keyname,
          id: plot + '-baselayer',
          adapter,
          adapterOptions: {
            selectable: true,
            propertiesFilter: this.plotFilter || undefined,
            paint: {
              color: 'blue',
              stroke: true,
              fillOpacity: 0.1
            }
          }
        }
      ];
      // no way to filter ref points in vector layer
      if (adapter === 'IMAGE') {
        opt.push({
          resourceId: turnpoint,
          id: turnpoint + '-baselayer',
          adapter,
          adapterOptions: {
            paint: {
              stroke: true,
              fillColor: '#9b37f2',
              strokeColor: '#000',
              radius: 3
            }
          }
        });
      }
      opt = opt.map(x => {
        x.adapterOptions = x.adapterOptions || {};
        x.adapterOptions.visibility = !this.hideBaseLayers;
        return x;
      });
      return opt;
    }
    return [];
  }

  get plotAdapterOptions(): GeoJsonAdapterOptions {
    const opt: GeoJsonAdapterOptions = {
      selectable: true,
      unselectOnSecondClick: true,
      labelField: 'area',
      paint: { stroke: true, fillOpacity: 0.3, color: 'orange', weight: 2 }
      // selectedPaint: { stroke: true, fillOpacity: 0.5, color: 'red', weight: 3 }
    };
    if (!this.lesid) {
      opt.data = {} as GeoJsonObject;
    } else {
      opt.propertiesFilter = [['id', 'eq', this.lesid]];
    }
    opt.fit = this.fit;
    return opt;
  }

  getTurnPointsAdapterOptions(
    options: {
      type?: TurnPointType;
      color?: string;
      pointPaint?: PointPaint;
      selectable?: boolean;
      interactive?: boolean;
    } = {}
  ): GeoJsonAdapterOptions {
    const pointPaint =
      options.pointPaint || getPointPaint(options.color || 'blue');
    const opt: GeoJsonAdapterOptions = {
      selectable: options.selectable,
      interactive: options.interactive,
      labelField: this.hideTooltip ? undefined : plotModule.turnPointIdField,
      ...pointPaint
    };
    if (!this.lesid) {
      opt.data = {} as GeoJsonObject;
    } else {
      const type: TurnPointType = options.type !== undefined ? options.type : 1;
      opt.propertiesFilter = [
        [plotModule.foreignResources.turnpoint.relationField, 'eq', this.lesid],
        ['type', 'eq', type]
      ];
    }
    return opt;
  }

  get connector() {
    return connector;
  }

  updatePlot(): void {
    if (this.ngwMap) {
      const plotLayer = this.ngwMap.getLayer<PlotResourceAdapter>(
        plotModule.keynames.plot
      );
      if (plotLayer && plotLayer.getLayers) {
        const layers = plotLayer.getLayers();
        const layer = layers[0];
        if (layer && layer.layer) {
          const feature = layer.layer.toGeoJSON() as PlotFeature;
          layer.feature = feature;
        }
        this.plot = layer;
      }
      this.updateTurnPoints();
      this.updatePlotAreaProperty();
    }
  }

  updateTurnPoints() {
    const plot = this.plot;
    const feature = plot && plot.feature;
    if (this.ngwMap && feature) {
      const pointsFromPolygon = getPointsFromPolygon(feature.geometry);
      const pointsCollection: FeatureCollection = {
        type: 'FeatureCollection',
        features: pointsFromPolygon.map((coordinates, i) => {
          const pointFeature: Feature<Point> = {
            type: 'Feature',
            geometry: { type: 'Point', coordinates },
            properties: { [plotModule.turnPointIdField]: i + 1 }
          };
          return pointFeature;
        })
      };
      this.ngwMap.setLayerData(plotModule.keynames.turnpoint, pointsCollection);
    }
  }

  mounted() {
    const ref = this.$refs.NgwMap as VueNgwMap;
    if (ref && ref.ngwMap) {
      this.ngwMap = ref.ngwMap;
      const ngwMap = this.ngwMap;
      if (ngwMap) {
        this._addLayers();
      }
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
      // props: { }
      // domProps: { id: this.id }
    };
    return h(VueNgwMap, data, this.$slots.default);
  }

  async updateLayers() {
    this.layerCreated = false;
    const ngwMap = this.ngwMap;
    const { plot, turnpoint } = await plotModule.getResources();
    if (ngwMap && plot && turnpoint) {
      this._removeImportedLayer();
      ngwMap.removeLayer(this.plotHighlightLayerId);
      ngwMap.removeLayer(this.referencePointLayerId);
      ngwMap.removeLayer(plotModule.keynames.plot);
      ngwMap.removeLayer(plotModule.keynames.turnpoint);

      const plotAdapter = await ngwMap.addNgwLayer({
        resourceId: plot,
        id: plotModule.keynames.plot,
        adapterOptions: this.plotAdapterOptions
      });
      if (plotAdapter && ngwMap.mapAdapter.map) {
        const layer = plotAdapter.layer as FeatureGroup;
        const bounds = layer.getBounds();
        if (bounds && bounds.isValid()) {
          ngwMap.mapAdapter.map.fitBounds(bounds);
        } else {
          ngwMap.fitLayer(plotAdapter);
        }
      }

      await ngwMap.addNgwLayer({
        resourceId: turnpoint,
        id: plotModule.keynames.turnpoint,
        adapterOptions: this.getTurnPointsAdapterOptions()
      });

      await ngwMap.addNgwLayer({
        resourceId: turnpoint,
        id: this.referencePointLayerId,
        adapterOptions: this.getTurnPointsAdapterOptions({
          type: 0,
          color: 'green',
          interactive: true,
          pointPaint: {
            paint: getIcon({
              color: 'green',
              shape: 'triangle',
              size: 20,
              stroke: 1,
              strokeColor: 'white'
            })
          }
        })
      });
      this.layerCreated = true;

      if (!this.hideAdditionalLayers) {
        await ngwMap.addGeoJsonLayer({
          id: this.plotHighlightLayerId,
          paint: {
            stroke: true,
            fillOpacity: 0.5,
            color: 'blue'
          },
          popup: true,
          popupOptions: {
            minWidth: 150,
            createPopupContent: e =>
              this._createPlotHighlightLayerPopup(e as PlotLayerDefinition)
          }
        });
      }
      this.updatePlot();
    }
  }

  async save() {
    if (this.ngwMap && this.validatePlot()) {
      const plotLayer = this.plot;
      if (plotLayer) {
        const layer = plotLayer;
        const properties = layer.feature && layer.feature.properties;
        if (properties) {
          const isValidProperties = this.requiredPlotFields.every(
            x => properties[x]
          );
          if (isValidProperties) {
            await this._savePlot(layer);
          } else {
            // this.overlay = true;
          }
        }
      } else {
        window.alert('Невозможно сохранить проект без контура лесосеки');
      }
    }
  }

  async remove() {
    if (this.lesid) {
      const confirm = this.$root.$confirm;

      confirm
        .open({ message: 'Вы уверены что хотите удалить эту лесосеку' })
        .then(resp => {
          if (resp) {
            this._remove();
          }
        });
    }
  }

  export() {
    const plotLayer = this.plot;
    if (plotLayer) {
      const layer = plotLayer;
      const feature = layer.feature;
      if (feature) {
        const kml = createPointKmlStringFromPolygon(feature);
        download('plot.kml', kml);
      }
    }
  }

  async import() {
    const fileDialog = this.$root.$file;
    const file = await fileDialog.open({
      message: 'Выберите GPX файл с угловыми точками',
      options: { accept: '.gpx' }
    });
    if (file && file.name.search(/.gpx/i) !== -1) {
      const reader = new FileReader();
      reader.onload = e => {
        if (reader.result && typeof reader.result === 'string') {
          this._onFileLoad(reader.result, file)
            .then(geojson => {
              const count = geojson.features && geojson.features.length;
              this.$root.$snackbar.open(
                `Добавлено объектов на карту: ${count}`,
                {
                  color: 'success'
                }
              );
            })
            .catch(er => {
              this.$root.$snackbar.open('Ошибка импора', { color: 'error' });
            });
        }
      };
      reader.readAsText(file);
    }
  }

  validatePlot(): boolean {
    return !!this.plot;
  }

  goToList() {
    this.$router.push('/plot/list');
  }

  goToEdit(lesid: string | number) {
    this.$router.push({
      path: `/plot/edit/${lesid}`,
      params: { mode: 'edit' }
    });
  }

  async updatePlotAreaProperty() {
    if (!this.hideArea) {
      const ngwMap = this.ngwMap;
      if (ngwMap) {
        const plotAdapter = ngwMap.getLayer(
          plotModule.keynames.plot
        ) as VectorLayerAdapter;
        if (plotAdapter && plotAdapter.getLayers) {
          const area = await import('@turf/area');
          const layers = plotAdapter.getLayers();
          layers.forEach(({ layer, feature }) => {
            if (layer) {
              const featureArea = area.default(
                layer.toGeoJSON() as PlotFeature
              );
              const hectares = (featureArea / 10000).toFixed(2);
              layer.feature.properties.area = hectares + 'га';
              if (this.plot && this.plot.feature) {
                this.plot.feature.properties.AREA_REAL = parseFloat(hectares);
              }
              if (plotAdapter.updateTooltip) {
                plotAdapter.updateTooltip({ feature, layer });
              }
            }
          });
        }
      }
    }
  }

  setPlotHighlightLayer(identify: NgwIdentify) {
    const ngwMap = this.ngwMap;
    this._cleanPlotHighlightLayer();
    if (ngwMap) {
      this.promises.getFeaturePromise = ngwMap
        .getIdentifyGeoJson(identify)
        .then(geojson => {
          delete this.promises.getFeaturePromise;
          if (geojson) {
            ngwMap.setLayerData(this.plotHighlightLayerId, geojson);
          }
        });
    }
  }

  @Watch('plotFilter')
  async updateBaseLayers() {
    const options = await this.getBaseLayersOptions();
    const ngwMap = this.ngwMap;
    if (ngwMap) {
      const baseLayers: LayerAdapter[] = [];
      const doNotUpdate: string[] = [];
      this.baseLayers.forEach((x: VectorLayerAdapter) => {
        const oldAdapter = x.options.adapter;
        const oldFilters = x.options.propertiesFilter;
        if (x.id) {
          const newLayer = options.find(l => l.id === x.id);
          const newAdapter = newLayer && newLayer.adapter;
          const newFilter =
            newLayer &&
            newLayer.adapterOptions &&
            (newLayer.adapterOptions as VectorAdapterOptions).propertiesFilter;
          const differentFilters =
            (oldFilters || newFilter) &&
            JSON.stringify(oldFilters) !== JSON.stringify(newFilter);
          if (newAdapter !== oldAdapter || differentFilters) {
            ngwMap.removeLayer(x.id);
            if (newLayer) {
              newLayer.fit = false;
              newLayer.adapterOptions = newLayer.adapterOptions || {};
              newLayer.adapterOptions.fit = false;
            }
          } else {
            doNotUpdate.push(x.id);
          }
        }
      });
      for (const k of options) {
        if (k.id && doNotUpdate.includes(k.id)) {
          const oldBaseLayer = this.baseLayers.find(x => x.id === k.id);
          if (oldBaseLayer) {
            baseLayers.push(oldBaseLayer);
          }
        } else {
          const baseLayer = await ngwMap.addNgwLayer(k);
          if (baseLayer) {
            baseLayers.push(baseLayer);
          }
        }
      }
      this.baseLayers = baseLayers;
    }
  }

  private async _addImportedLayer(data: GeoJsonObject, name: string) {
    if (this.ngwMap) {
      const importLayer = await this.ngwMap.addGeoJsonLayer({
        labelField: 'name',
        name,
        data,
        ...getPointPaint(getRandomColor())
      });
      this.importLayers.push(importLayer);
      this.baseLayers.push(importLayer);
    }
  }

  private _removeImportedLayer() {
    const ngwMap = this.ngwMap;
    if (ngwMap) {
      const baseLayers = [...this.baseLayers];
      this.importLayers.forEach(x => {
        ngwMap.removeLayer(x);
        const baseLayerIndex = baseLayers.indexOf(x);
        if (baseLayerIndex !== -1) {
          baseLayers.splice(baseLayerIndex, 1);
        }
      });
      this.baseLayers = baseLayers;
      this.importLayers = [];
    }
  }

  private _createPlotHighlightLayerPopup(e: PlotLayerDefinition) {
    if (this.createPlotHighlightLayerPopup) {
      return this.createPlotHighlightLayerPopup(e);
    }
    return undefined;
  }

  private async _onFileLoad(result: string, file: File) {
    const xml = new DOMParser().parseFromString(result, 'text/xml');
    // @ts-ignore
    const togeojson = await import('@mapbox/togeojson');
    try {
      const geojson = togeojson.gpx(xml);
      const ngwMap = this.ngwMap;
      if (ngwMap && geojson) {
        this._addImportedLayer(geojson, file.name);
        return geojson;
      }
      throw new Error(`Can't load data`);
    } catch (er) {
      throw new Error(er);
    }
  }

  private async _addLayers() {
    await this.updateBaseLayers();
    await this.updateLayers();
  }

  private async _savePlot(plot: PlotLayerDefinition) {
    if (plot.feature) {
      const lesid = Number(this.lesid);
      const fid =
        this.lesid &&
        this.plot &&
        this.plot.feature &&
        this.plot.feature.id &&
        this.plot.feature.id === lesid
          ? lesid
          : undefined;
      try {
        let refPoint: ReferencePointFeature | undefined;
        const refAdapter =
          this.ngwMap &&
          (this.ngwMap.getLayer(
            this.referencePointLayerId
          ) as VectorLayerAdapter<any, any, any, ReferencePointFeature>);
        if (refAdapter) {
          const refLayer = refAdapter.getLayers && refAdapter.getLayers()[0];
          if (refLayer) {
            refPoint = refLayer.feature;
          }
        }
        const newPlot = await plotModule.patch({
          item: plot.feature,
          fid,
          refPoint
        });

        if (newPlot) {
          this.goToEdit(newPlot.id);
          this._redrawPlotBaseLayers();
        }
      } catch (er) {
        const message = `Во время сохранения произошла ошибка`;
        const info = this.$root.$confirm;
        info.open({
          message: message,
          options: { rejectBtn: false, acceptText: 'Закрыть' }
        });
      }
    }
  }

  private async _redrawPlotBaseLayers() {
    const resources = await plotModule.getResources();
    const { plot, turnpoint } = resources;
    [plot, turnpoint].forEach(resource => {
      const baseLayerId = resource + '-baselayer';
      if (this.ngwMap && this.ngwMap.isLayerVisible(baseLayerId)) {
        const baseLayer = this.ngwMap && this.ngwMap.getLayer(baseLayerId);
        if (baseLayer) {
          this.ngwMap.updateLayer(baseLayer);
        }
      }
    });
  }

  private async _remove() {
    try {
      await this._removePlot();
      this.goToList();
    } catch (er) {
      // TODO: Handle error
    }
  }

  private async _removePlot() {
    const fid = this.plot && this.plot.feature && this.plot.feature.id;
    if (fid) {
      plotModule.delete(Number(fid));
    }
  }

  private _cleanPlotHighlightLayer() {
    if (this.ngwMap) {
      this.ngwMap.clearLayerData(this.plotHighlightLayerId);
    }
  }
}
