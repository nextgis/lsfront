import { Component, Vue, Prop } from 'vue-property-decorator';
import { Feature, Point } from 'geojson';

import { LngLatArray, LayerDefinition } from '@nextgis/webmap';
import { ResourceAdapter } from '@nextgis/ngw-kit';

import PlotNgwMap from '@veles/common/src/components/ResourceMap';
import { distance, direction } from '../../utils/utils';

interface Geodesy {
  from: TurnPoint;
  to: TurnPoint;
  distance: string;
  direction: number;
}

interface TurnPoint {
  lngLat: LngLatArray;
  name: string;
}

@Component
export default class extends Vue {
  @Prop({ type: Object }) plotNgwMap!: PlotNgwMap;
  @Prop({ type: String, default: 'turnpoints' }) turnPointsLayerId!: string;
  @Prop({ type: String, default: 'referencepoints' })
  referencePointLayerId!: string;

  turnPointGeodesy: Geodesy[] = [];
  referencePointGeodesy: Geodesy[] | false = false;

  mounted() {
    this.$watch('plotNgwMap.layerCreated', () => {
      if ('turnPointsLayerId' in this.plotNgwMap) {
        //@ts-ignore
        this.referencePointLayerId = this.plotNgwMap.turnPointsLayerId;
      }
      this._onTurnPointLayerAdded();
    });
  }

  private async _onTurnPointLayerAdded() {
    const ngwMap = this.plotNgwMap.ngwMap;
    if (ngwMap) {
      const turnPointLayer = ngwMap.getLayer(
        this.turnPointsLayerId
      ) as ResourceAdapter<any, any, any, Feature<Point>>;
      if (turnPointLayer && turnPointLayer.getLayers) {
        const layers = turnPointLayer.getLayers();
        const turnPointGeodesy = await this._getLayersGeodesy(layers);
        this.turnPointGeodesy = turnPointGeodesy;

        this._onReferencePointLayerAdded();
      }
    }
  }

  private async _onReferencePointLayerAdded() {
    const ngwMap = this.plotNgwMap.ngwMap;
    if (ngwMap) {
      const referencePointLayer = ngwMap.getLayer(
        this.referencePointLayerId
      ) as ResourceAdapter<any, any, any, Feature<Point>>;
      if (referencePointLayer && referencePointLayer.getLayers) {
        const layers = referencePointLayer.getLayers();
        const from = this._createTurnPointDefinition('0', layers[0]);
        if (from) {
          const pair = await this._createGeodesy(
            from,
            this.turnPointGeodesy[0].from
          );

          this.referencePointGeodesy = [pair];
        }
      }
    }
  }

  private async _getLayersGeodesy(
    layers: LayerDefinition<Feature<Point>>[]
  ): Promise<Geodesy[]> {
    const geodesy: Geodesy[] = [];
    if (layers) {
      const distances: [TurnPoint, TurnPoint][] = [];

      let first: TurnPoint | undefined;
      let last: TurnPoint | undefined;

      for (let fry = 0; fry < layers.length - 1; fry++) {
        const fromId = fry;
        const toId = fry + 1;
        const from = this._createTurnPointDefinition(
          String(fromId + 1),
          layers[fromId]
        );
        const to = this._createTurnPointDefinition(
          String(toId + 1),
          layers[toId]
        );
        if (!fry) {
          first = from;
        }
        last = to;
        if (from && to) {
          distances.push([from, to]);
        }
      }

      // close
      if (first && last) {
        distances.push([last, first]);
      }

      for (const dd of distances) {
        const pair = await this._createGeodesy(dd[0], dd[1]);
        geodesy.push(pair);
      }
    }
    return geodesy;
  }

  private async _createGeodesy(from: TurnPoint, to: TurnPoint) {
    const dist = await distance(from.lngLat, to.lngLat);
    const dir = await direction(from.lngLat, to.lngLat);
    return {
      from,
      to,
      distance: (dist * 1000).toFixed(2),
      direction: Math.round(dir)
    };
  }

  private _createTurnPointDefinition(
    name: string,
    definition: LayerDefinition<Feature<Point>>
  ): TurnPoint | undefined {
    const lngLat = this._getLngLatFromLayerDefinition(definition);
    if (name && lngLat) {
      return {
        lngLat,
        name
      };
    }
  }

  private _getLngLatFromLayerDefinition(
    definition: LayerDefinition<Feature<Point>>
  ): LngLatArray | undefined {
    return definition?.feature?.geometry.coordinates as LngLatArray;
  }
}
