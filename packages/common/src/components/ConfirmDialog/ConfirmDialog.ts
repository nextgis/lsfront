import { Vue, Component } from 'vue-property-decorator';

export interface ConfirmDialogOptions {
  color?: string;
  width?: number;
  zIndex?: number;
  acceptText?: string;
  rejectText?: string;
  rejectBtn?: boolean;
}

type Resolve<RR> = (value?: RR | PromiseLike<RR> | undefined) => void;
type Reject = (reason?: any) => void;

@Component({ name: 'confirm-dialog-component' })
export default class ConfirmDialog<
  O extends ConfirmDialogOptions = ConfirmDialogOptions,
  R extends any = boolean
> extends Vue {
  dialog = false;
  resolve: Resolve<R> | null = null;
  reject: Reject | null = null;
  message = 'Вы действительно хотите выполнить это действие';
  title? = '';

  options: O = {
    color: 'primary',
    width: 290,
    zIndex: 200,
    acceptText: 'Выполнить',
    rejectText: 'Отменить',
    rejectBtn: true
  } as O;

  open(opt: { title?: string; message: string; options?: O }): Promise<R> {
    this.dialog = true;
    if (opt.title) {
      this.title = opt.title;
    }
    this.message = opt.message;
    this.options = { ...this.options, ...opt.options };
    return new Promise<R>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
  agree() {
    if (this.resolve) {
      this.resolve(this.onResolve());
    }
    this._clean();
    this.$emit('accept');
  }
  cancel() {
    if (this.reject) {
      this.reject(false);
    }
    this._clean();
    this.$emit('reject');
  }

  protected onResolve(): R {
    // @ts-ignore
    return true;
  }

  private _clean() {
    this.dialog = false;
    this.reject = null;
    this.resolve = null;
  }
}
