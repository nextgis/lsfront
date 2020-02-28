import { Framework } from 'vuetify';
import { SelectFileDialog } from './components/SelectFileDialog';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Snackbar } from './components/Snackbar';
import Router from 'vue-router';
import Vue from 'vue';
import { NgwLayerOptions } from '@nextgis/ngw-kit';
import ResourceMap from './components/ResourceMap/ResourceMap';

export interface AppVue extends Vue {
  $vuetify: Framework;
  $router: Router;
  $confirm: ConfirmDialog;
  $file: SelectFileDialog;
  $snackbar: Snackbar;
}

export type GetLayersOptionsCb = (opt: ResourceMap) => NgwLayerOptions;
