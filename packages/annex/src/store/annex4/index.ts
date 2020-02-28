import Vuex from 'vuex';
import { FourthAnnexStore } from './annex4';

// @ts-ignore
const strict = process.env.NODE_ENV !== 'production';

export interface FourthAnnexState {
  annex4: FourthAnnexStore;
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<FourthAnnexState>({ strict });
