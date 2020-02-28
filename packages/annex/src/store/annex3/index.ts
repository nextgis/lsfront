import Vuex from 'vuex';
import { ThirdAnnexStore } from './annex3';

// @ts-ignore
const strict = process.env.NODE_ENV !== 'production';

export interface ThirdAnnexState {
  annex3: ThirdAnnexStore;
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<ThirdAnnexState>({ strict });
