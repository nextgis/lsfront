import {
  Module,
  getModule,
  VuexModule,
  Action,
  Mutation
} from 'vuex-module-decorators';
import { connector } from '@veles/common';
import store from './index';
import { ResourceItem } from '@nextgis/ngw-connector';

@Module({ dynamic: true, store, name: 'space' })
export class SatelliteStore extends VuexModule {
  items: ResourceItem[] = [];
  keyname = 'space';

  get connector() {
    return connector;
  }

  @Action({ commit: 'SET_ITEMS' })
  async getItems() {
    if (this.items.length) {
      return this.items;
    }
    return await this.connector.getResourceChildren({ keyname: this.keyname });
  }

  @Mutation
  private SET_ITEMS(items: ResourceItem[]) {
    this.items = items;
  }
}

export const module = getModule(SatelliteStore);
