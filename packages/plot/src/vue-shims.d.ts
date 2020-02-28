import { Framework } from 'vuetify';
import { SelectFileDialog, ConfirmDialog } from '@veles/common';
import Router from 'vue-router';
import Vue from 'vue';

declare module '*.vue' {
  export default Vue;
}

declare module 'vue/types/vue' {
  export interface Vue {
    $vuetify: Framework;
    $router: Router;
    $confirm: ConfirmDialog;
    $file: SelectFileDialog;
  }
}
