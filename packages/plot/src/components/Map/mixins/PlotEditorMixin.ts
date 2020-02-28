import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

import { Vue, Component, Watch } from 'vue-property-decorator';
import { Map, LayerGroup, Polygon, Marker } from 'leaflet';
import NgwMap, { VectorLayerAdapter } from '@nextgis/ngw-map';
import customTranslation from './i18n.json';
import { Modes } from '../PlotMap';
import PlotNgwMap from '../../PlotNgwMap/PlotNgwMap.js';
import { plotModule } from '../../../store/plot';
import {
  PlotProperties,
  PlotFeature,
  ReferencePointFeature
} from '../../../interfaces';

type Layer = LayerGroup;

@Component
export class PlotEditorMixin extends Vue {
  mode!: Modes;
  ngwMap!: NgwMap | false;
  attrDrawer!: boolean;
  plotNgwMap: PlotNgwMap | false = false;

  get plotFields(): Array<keyof PlotProperties> {
    return plotModule.fields.map(x => x.keyname) as Array<keyof PlotProperties>;
  }

  get map(): Map {
    return this.ngwMap && this.ngwMap.mapAdapter.map;
  }

  get isReady(): boolean {
    return this.plotNgwMap && this.plotNgwMap.layerCreated;
  }

  @Watch('isReady')
  setInitMode() {
    this.toggleEditorMode();
  }

  toggleEditorMode(status?: boolean) {
    status = typeof status === 'boolean' ? status : this.mode === 'edit';
    if (status) {
      this.startEditorMode();
    } else {
      this.stopEditorMode();
    }
  }

  private async startEditorMode() {
    const ngwMap = this.ngwMap;
    if (ngwMap && this.map) {
      await ngwMap.onLoad('controls:create');
      // @ts-ignore
      this.map.pm.setLang('veles', customTranslation, 'ru');
      // this.map.pm.setPathOptions;
      this.map.pm.addControls({
        position: 'topleft',
        drawPolyline: false,
        // drawMarker: false,
        // @ts-ignore
        drawRectangle: false,
        cutPolygon: false,
        drawCircle: false,
        drawCircleMarker: false
      });

      this.map.on(
        'pm:create',
        (e: any) => {
          if (e.shape === 'Polygon') {
            const layer: Polygon = e.layer;
            const plotGeoJson = this._preparePlotGeoJson(layer);
            ngwMap.setLayerData(plotModule.keynames.plot, plotGeoJson);
            if (this.plotNgwMap) {
              this.plotNgwMap.updatePlot();
              this.attrDrawer = true;
              this.map.pm.disableDraw('Polygon');
            }
          } else if (e.shape === 'Marker' && this.plotNgwMap) {
            const layer: Marker = e.layer;
            const geojson = layer.toGeoJSON() as ReferencePointFeature;
            geojson.properties.idpnt = 0;
            geojson.properties.type = 0;
            ngwMap.setLayerData(this.plotNgwMap.referencePointLayerId, geojson);
            this.map.pm.disableDraw('Marker');
          }
          e.layer.remove();
        },
        this
      );
      this.map.on(
        'pm:remove',
        (e: any) => {
          const isPlot =
            e.layer.feature &&
            e.layer.feature.geometry &&
            e.layer.feature.geometry.type === 'Polygon';
          if (this.plotNgwMap && isPlot) {
            ngwMap.clearLayerData(plotModule.keynames.plot);
            ngwMap.clearLayerData(plotModule.keynames.turnpoint);
            this.plotNgwMap.updatePlot();
          } else if (this.plotNgwMap) {
            ngwMap.clearLayerData(this.plotNgwMap.referencePointLayerId);
          }
        },
        this
      );

      const plotLayer = ngwMap.getLayer(
        plotModule.keynames.plot
      ) as VectorLayerAdapter;
      if (plotLayer) {
        plotLayer.layer.on('pm:edit', (e: any) => {
          if (this.plotNgwMap) {
            this.plotNgwMap.updatePlot();
          }
        });
      }
      if (this.plotNgwMap) {
        const referencePointLayerId = this.plotNgwMap.referencePointLayerId;
        const refAdapter = ngwMap.getLayer(
          referencePointLayerId
        ) as VectorLayerAdapter;
        if (refAdapter) {
          refAdapter.layer.on('pm:edit', (e: any) => {
            const refLayer = refAdapter.getLayers && refAdapter.getLayers()[0];
            if (refLayer && refLayer.feature) {
              const newFeature = refLayer.layer.toGeoJSON();
              ngwMap.setLayerData(referencePointLayerId, newFeature);
            }
          });
        }
      }
    }
  }

  private _preparePlotGeoJson(layer: Polygon): PlotFeature {
    const geojson = layer.toGeoJSON() as PlotFeature;
    this.plotFields.forEach(x => {
      // @ts-ignore
      geojson.properties[x] = geojson.properties[x] || '';
    });
    return geojson;
  }

  private stopEditorMode() {
    if (this.map) {
      // @ts-ignore
      this.map.pm.removeControls();
      this.map.off('pm:create');
      this.map.off('pm:drawstart');
    }
  }
}
