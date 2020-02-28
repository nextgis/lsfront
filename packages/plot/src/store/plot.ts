import { Module, Action, getModule } from 'vuex-module-decorators';
import { connector } from '@veles/common';
import store from './index';
import { FeatureItemToNgw } from '@nextgis/ngw-connector';
import NgwKit from '@nextgis/ngw-kit';
import {
  PlotProperties,
  TurnPointProperties,
  TurnPointType
} from '../interfaces';
import { getPointsFromPolygon } from '../utils/getPointsFromPolygon';
import { Point, Feature, Polygon } from 'geojson';
import { ResourceStore, PatchOptions } from '@nextgis/vuex-ngw';

type KeyName = 'plot' | 'turnpoint' | 'plotwebmap';

@Module({ dynamic: true, store, name: 'plot' })
export class Plot extends ResourceStore<PlotProperties, Polygon> {
  keynames: { [key in KeyName]: string } = {
    plot: 'plot',
    turnpoint: 'turnpoint',
    plotwebmap: 'plotwebmap'
  };

  get connector() {
    return connector;
  }

  keyname = 'plot';

  foreignResources = {
    turnpoint: { relationField: 'plotid' },
    plotwebmap: {}
  };

  turnPointIdField = 'idpnt';

  lookupTableResourceGroupId = 46;

  events = {
    onNewItem: async (opt: PatchOptions) => {
      const fid = opt.fid;
      if (fid) {
        await this._updateTurnPoints({
          item: opt.item,
          fid,
          refPoint: opt.refPoint
        });
      }
    },
    onBeforeDelete: async (opt: { fid: number }) => {
      this._deleteTurnPoints({ plotId: opt.fid });
    }
  };

  @Action({ commit: '' })
  private async _updateTurnPoints(opt: Required<PatchOptions>) {
    await this._deleteTurnPoints({ plotId: opt.fid, excludeType: [] }); // 0, 2
    await this._savePlotTurnPoints(opt);
  }

  @Action({ commit: '' })
  private async _savePlotTurnPoints(opt: Required<PatchOptions>) {
    const resources = await this.getResources();
    const id = resources.turnpoint;

    const { prepareGeomToNgw } = await import(
      '../../../../nextgisweb_frontend/packages/vuex-ngw/src/utils/prepareGeomToNgw'
    );
    const polygon = opt.item.geometry as Polygon;
    const points = getPointsFromPolygon(polygon);

    const prepareNgwItem = (
      fields: Partial<TurnPointProperties>,
      coordinates: number[]
    ) => {
      const feature: Feature<Point> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates
        }
      };
      return {
        fields: { plotid: opt.fid, ...fields },
        geom: prepareGeomToNgw(feature)
      };
    };

    const data: Partial<
      FeatureItemToNgw<Partial<TurnPointProperties>>
    >[] = points.map((coordinates, i) => {
      return prepareNgwItem(
        {
          idpnt: i + 1,
          type: 1
        },
        coordinates
      );
    });
    if (opt.refPoint) {
      const refPoint = prepareNgwItem(
        { idpnt: 0, type: 0 },
        opt.refPoint.geometry.coordinates
      );
      data.push(refPoint);
    }

    return await connector.patch(
      'feature_layer.feature.collection',
      { data },
      { id }
    );
  }

  @Action({ commit: '' })
  private async _deleteTurnPoints(opt: {
    plotId: number;
    excludeType?: TurnPointType[];
  }) {
    const resources = await this.getResources();
    const features = await NgwKit.utils.getNgwLayerFeatures({
      connector,
      resourceId: resources.turnpoint,
      filters: [
        [this.foreignResources.turnpoint.relationField, 'eq', opt.plotId]
      ]
    });
    const promises: Promise<any>[] = [];
    features.features.forEach(x => {
      const type =
        x.properties && x.properties.type !== undefined
          ? x.properties.type
          : undefined;
      const exclude = opt.excludeType && opt.excludeType.indexOf(type) !== -1;
      if (!exclude) {
        promises.push(
          connector.delete('feature_layer.feature.item', null, {
            id: resources.turnpoint,
            fid: Number(x.id)
          })
        );
      }
    });
    await Promise.all(promises);
  }
}

export const plotModule = getModule(Plot);
