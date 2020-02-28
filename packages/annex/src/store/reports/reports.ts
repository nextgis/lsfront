import { Module, getModule } from 'vuex-module-decorators';
import { connector } from '@veles/common';
import store from './index';
import { ThirdAnnexProperties } from '../interfaces';
import { ResourceStore } from '@nextgis/vuex-ngw';
import { Polygon } from 'geojson';

type KeyName = string;

@Module({ dynamic: true, store, name: 'reports' })
export class ReportsStore extends ResourceStore<ThirdAnnexProperties, Polygon> {
  keynames: { [key in KeyName]: string } = {};

  get connector() {
    return connector;
  }

  keyname = 'reports';
}

export const reportsModule = getModule(ReportsStore);
