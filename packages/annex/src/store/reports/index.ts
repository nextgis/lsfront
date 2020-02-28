import Vuex from 'vuex';
import { ReportsStore } from './reports';

// @ts-ignore
const strict = process.env.NODE_ENV !== 'production';

export interface ReportsState {
  annex3: ReportsStore;
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<ReportsState>({ strict });
