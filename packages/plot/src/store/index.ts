import Vuex from 'vuex';
import { Plot } from './plot';

// @ts-ignore
const strict = process.env.NODE_ENV !== 'production';

export interface PlotState {
  plot: Plot;
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<PlotState>({ strict });
