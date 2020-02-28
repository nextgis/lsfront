import Vuex from 'vuex';
import { SatelliteStore } from './satellite';

// @ts-ignore
const strict = process.env.NODE_ENV !== 'production';

export interface SatelliteState {
  satellite: SatelliteStore;
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<SatelliteState>({ strict });
