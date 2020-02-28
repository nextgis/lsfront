import { ResourceStore } from '@nextgis/vuex-ngw';
import { connector } from '@veles/common';
import { Module, getModule } from 'vuex-module-decorators';
import { FourthAnnexProperties } from '../interfaces';
import store from './index';

type KeyName = string;

@Module({ dynamic: true, store, name: 'annex4' })
export class FourthAnnexStore extends ResourceStore<FourthAnnexProperties> {
  keynames: { [key in KeyName]: string } = {};

  get connector() {
    return connector;
  }
  // lookupTableResourceGroupId = 46;
  keyname = 'annex4';
}

export const fourthAnnexModule = getModule(FourthAnnexStore);
