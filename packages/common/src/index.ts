import { connector } from './ngw/connector';
import { LoadingComponent } from './components/LoadingComponent';
import ConfirmDialog from './components/ConfirmDialog/ConfirmDialog';
import Snackbar from './components/Snackbar/Snackbar';
import SnackbarComponent from './components/Snackbar/Snackbar.vue';
import SelectFileDialog from './components/SelectFileDialog/SelectFileDialog';
// @ts-ignore
import ConfirmDialogComponent from './components/ConfirmDialog/ConfirmDialog.vue';
// @ts-ignore
import SelectFileDialogComponent from './components/SelectFileDialog/SelectFileDialog.vue';
export * from './interfaces';

export * from './utils/getRandomColor';

export {
  connector,
  LoadingComponent,
  ConfirmDialog,
  SelectFileDialog,
  SelectFileDialogComponent,
  ConfirmDialogComponent,
  Snackbar,
  SnackbarComponent
};
