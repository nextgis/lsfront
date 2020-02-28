import '../../sheetLayout.css';

import { Feature, LineString, Position } from 'geojson';

import { Component, Mixins, Watch } from 'vue-property-decorator';
import { getIcon } from '@nextgis/icons';
import { NgwLayerOptions, ResourceAdapter } from '@nextgis/ngw-kit';

import { GetLayersOptionsCb } from '@veles/common/src/interfaces';
import PlotNgwMap from '@veles/common/src/components/ResourceMapOl';
import { LoadingComponent } from '@veles/common/src/components/LoadingComponent';

import RestoreError from '../RestoreError/RestoreError.vue';
import SheetFooterAttribution from '../SheetFooterAttribution/SheetFooterAttribution.vue';
//@ts-ignore
import GeodesyTableComponent from '../GeodesyTable/GeodesyTable.vue';
import BaseSheetLayout from '../BaseSheetLayout/BaseSheetLayout';
import { getSelectScaleItems } from '../../utils/utils';
import {
  PlotLayerDefinition,
  ReferencePointDefinition
} from '@veles/plot/src/interfaces';
import { VectorLayerAdapter } from 'nextgisweb_frontend/packages/webmap/src';

@Component({
  components: {
    PlotNgwMap,
    SheetFooterAttribution,
    GeodesyTableComponent,
    RestoreError,
    LoadingComponent
  }
})
export default class extends Mixins(BaseSheetLayout) {
  turnPointsLayerId = 'turnpoints';
  referencePointLayerId = 'referencepoints';
  isError = false;
  isLoading = true;
  selectScaleItems: { text: string; value: number }[] = [];

  layersOptions: Array<NgwLayerOptions | GetLayersOptionsCb> = [
    { keyname: this.webmap },
    (opt: PlotNgwMap) => ({
      keyname: 'plot',
      id: 'plot',
      fit: true,
      adapterOptions: {
        paint: { stroke: true, fillOpacity: 0.3, color: 'orange', weight: 2 },
        propertiesFilter: [['id', 'in', opt.resourcesIds]]
      }
    }),
    (opt: PlotNgwMap) => ({
      keyname: 'turnpoint',
      id: this.turnPointsLayerId,
      adapterOptions: {
        paint: {
          stroke: true,
          fillOpacity: 1,
          strokeColor: 'white',
          color: 'blue',
          radius: 5
        },
        labelField: 'idpnt',
        propertiesFilter: [
          ['plotid', 'eq', opt.resourcesIds],
          ['type', 'eq', 1]
        ]
      }
    }),
    (opt: PlotNgwMap) => ({
      keyname: 'turnpoint',
      id: this.referencePointLayerId,
      adapterOptions: {
        paint: getIcon({
          color: 'green',
          shape: 'triangle',
          size: 20,
          stroke: 1,
          strokeColor: 'white'
        }),
        labelField: 'idpnt',
        propertiesFilter: [
          ['plotid', 'eq', opt.resourcesIds],
          ['type', 'eq', 0]
        ]
      }
    })
  ];

  private refLine?: VectorLayerAdapter;

  mounted() {
    const ngwMap = this.ngwMap;
    if (ngwMap) {
      ngwMap
        .addLayer('GEOJSON', {
          id: 'referenceline',
          visibility: true,
          type: 'line',
          order: 3,
          paint: {
            weight: 2,
            color: 'orange'
          }
        })
        .then(layer => {
          this.refLine = layer;
        });
    }
  }

  @Watch('sheetScale')
  onActiveScaleChange(val: number) {
    this._updateSelectScaleItems();
    this.setScaleRatio(val);
  }

  @Watch('plot')
  createConnectingLine(plot: PlotLayerDefinition) {
    this.isLoading = true;
    const ngwMap = this.ngwMap;
    const refLine = this.refLine;
    if (ngwMap && refLine) {
      const coordinates: Position[] = [];
      ngwMap.clearLayerData(refLine);
      if (plot) {
        const toPosition = plot.feature?.geometry.coordinates[0];
        if (toPosition) {
          coordinates.push(toPosition[0]);
        }
      }

      if (ngwMap) {
        const layer = ngwMap.getLayer(
          this.referencePointLayerId
        ) as ResourceAdapter;
        const map = ngwMap.mapAdapter.map;
        if (layer && layer.getLayers && map) {
          const layers = layer.getLayers();
          const refPoint = layers[0] as ReferencePointDefinition;
          const fromPosition = refPoint?.feature?.geometry.coordinates;
          if (fromPosition) {
            coordinates.push(fromPosition);
          }
        }
      }

      const line: Feature<LineString> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates
        }
      };
      ngwMap.setLayerData(refLine, line);
      // ngwMap.addGeoJsonLayer({ id: 'tets', data: line, visibility: true });
    }
    this.isLoading = false;
  }

  private _updateSelectScaleItems() {
    this.selectScaleItems = getSelectScaleItems(this.sheetScale);
  }
}
