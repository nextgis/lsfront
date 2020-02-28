import { Component, Mixins } from 'vue-property-decorator';
import ConfirmDialog, {
  ConfirmDialogOptions
} from '../ConfirmDialog/ConfirmDialog';
// import ConfirmDialog from '../ConfirmDialog/ConfirmDialog.vue';

export interface SelectFileDialogOptions extends ConfirmDialogOptions {
  /**
   * @example .doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document
   */
  accept?: string;
}

@Component({ name: 'select-file-dialog-component' })
export default class SelectFileDialog extends Mixins<
  ConfirmDialog<SelectFileDialogOptions, File | null>
>(ConfirmDialog) {
  file: File | null = null;
  message = 'Вы действительно хотите выполнить это действие';
  title = 'Выбор файла';

  options: SelectFileDialogOptions = {
    color: 'primary',
    width: 500,
    zIndex: 200,
    acceptText: 'Выбрать',
    rejectText: 'Отменить',
    rejectBtn: true
  };

  onResolve() {
    return this.file;
  }
}
