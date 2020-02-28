import { Vue, Component } from 'vue-property-decorator';

export interface SnackbarOptions {
  timeout?: number;
  color?: 'success' | 'info' | 'error';
}

const OPTIONS: SnackbarOptions = {
  timeout: 4000,
  color: 'info'
};

@Component({ name: 'snackbar-component' })
export default class Snackbar extends Vue {
  text = '';
  options: SnackbarOptions = OPTIONS;

  snackbar = false;

  open(text: string, options?: SnackbarOptions) {
    this.text = text;
    this.options = { ...OPTIONS, ...options };
    this.snackbar = true;
  }
}
