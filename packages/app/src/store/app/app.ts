import {
  VuexModule,
  Module,
  Mutation,
  MutationAction,
  Action,
  getModule
} from 'vuex-module-decorators';
import { Credentials, UserInfo } from '@nextgis/ngw-connector';
import { connector } from '@veles/common';
import config from '../../../../../config';
import store from '../../store';
import { catalog } from '../../catalog';
import { CatalogItem, CatalogItemType, ActiveCatalogItem } from './interfaces';

const _storageKey = 'auth';
const _auth = localStorage.getItem(_storageKey);

@Module({ dynamic: true, store, name: 'user' })
export class App extends VuexModule {
  appName = config.title;

  user: UserInfo | null = null;

  catalog: CatalogItem[] = catalog;

  globalLoading = false;
  globalErrorMessage = '';

  activeCatalog: ActiveCatalogItem | false = false;

  private _promises: Record<string, Promise<any>> = {};

  get catalogFilter() {
    return (type: CatalogItemType) => this.catalog.filter(x => x.type === type);
  }

  get reports() {
    return this.catalogFilter('report');
  }

  get tools() {
    return this.catalogFilter('tools');
  }

  @Action({ commit: 'UPDATE_USER' })
  async login(auth: Credentials) {
    if (!this._promises.login) {
      this._promises.login = connector.login(auth);
    }
    const user = await this._promises.login;
    delete this._promises.login;
    if (user.keyname !== 'guest') {
      localStorage.setItem(_storageKey, JSON.stringify(auth));
      return connector.user;
    }
    return null;
  }

  @MutationAction({ mutate: ['user', 'globalErrorMessage'] })
  async logout() {
    await connector.logout();
    localStorage.setItem(_storageKey, '');
    return { user: null, globalErrorMessage: '' };
  }

  @Action({ commit: 'UPDATE_USER' })
  async updateUser(user: UserInfo) {
    return user && user.keyname !== 'guest' && user;
  }

  @MutationAction({ mutate: ['globalLoading'] })
  async setGlobalLoading(globalLoading: boolean) {
    return {
      globalLoading
    };
  }

  @MutationAction({ mutate: ['globalErrorMessage'] })
  async setGlobalErrorMessage(globalErrorMessage: string) {
    return {
      globalErrorMessage
    };
  }

  @Action({ commit: 'UPDATE_ACTIVE_CATALOG' })
  async setActiveCatalogAction(opt?: {
    catalogItemId: string;
    actionName: string;
  }) {
    if (opt) {
      const item = this.catalog.find(x => x.id === opt.catalogItemId);
      const action = item && item.actions.find(x => x.name === opt.actionName);

      return {
        item,
        action
      };
    } else {
      return false;
    }
  }

  @Mutation
  private UPDATE_ACTIVE_CATALOG(activeCatalog: ActiveCatalogItem) {
    this.activeCatalog = activeCatalog;
  }

  @Mutation
  private UPDATE_USER(user: UserInfo) {
    this.user = user;
  }
}

export const appModule = getModule(App);

if (_auth) {
  appModule.setGlobalLoading(true);
  connector.login(JSON.parse(_auth));

  connector.emitter.once('login', data => {
    if (connector.user) {
      appModule.updateUser(connector.user);
      appModule.setGlobalLoading(false);
    }
  });
  connector.emitter.once('login:error', data => {
    console.log(data);
    appModule.setGlobalLoading(false);
    appModule.setGlobalErrorMessage(
      'Невозможно выполнить вход в систему. Ошибка сервера.'
    );
  });
}
