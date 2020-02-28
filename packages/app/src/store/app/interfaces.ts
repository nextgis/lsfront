import { AsyncComponentFactory } from 'vue/types/options';
import { Credentials } from '@nextgis/ngw-connector';
export interface Auth {
  login: string;
}

export interface ActiveCatalogItem {
  item: CatalogItem;
  action: CatalogItemAction;
}

export type CatalogItemType = 'report' | 'tools';
export type CatalogItemActionName = 'open' | 'list' | 'edit' | 'create' | 'map';

export interface User {
  auth: Credentials;
}

export interface CatalogItemActionBase {
  name: CatalogItemActionName;
  title?: string;
  hidden?: boolean;
}

export interface CatalogItemAction extends CatalogItemActionBase {
  router?: { props?: boolean | Record<string, any>; path?: string };
  component?: () => any;
  componentFactory?: AsyncComponentFactory;
  link?: string;
}

export interface CatalogItem {
  id: string;
  title: string;
  type: CatalogItemType;
  src?: string;
  description?: string;
  color?: string;
  info?: string;
  actions: CatalogItemAction[];
}
