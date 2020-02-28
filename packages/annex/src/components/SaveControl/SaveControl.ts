import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import {
  mdiContentSave,
  mdiCamera,
  mdiDelete,
  mdiToolbox,
  mdiClose
} from '@mdi/js';

@Component
export default class extends Vue {
  @Prop({ type: String }) exportClass!: string;
  @Prop({ type: String, default: 'top' }) direction!: string;
  @Prop({ type: String, default: 'annex' }) fileName!: string;
  @Prop({ type: Boolean, default: false }) fling!: boolean;
  @Prop({ type: Boolean, default: true }) hover!: boolean;
  @Prop({ type: Boolean, default: false }) top!: boolean;
  @Prop({ type: Boolean, default: true }) right!: boolean;
  @Prop({ type: Boolean, default: true }) bottom!: boolean;
  @Prop({ type: Boolean, default: false }) left!: boolean;
  @Prop({ type: String, default: 'slide-y-reverse-transition' })
  transition!: string;

  fab = false;

  svg = {
    save: mdiContentSave,
    image: mdiCamera,
    remove: mdiDelete,
    tools: mdiToolbox,
    close: mdiClose
  };

  @Emit()
  save() {
    return true;
  }

  @Emit()
  image() {
    this._saveImage();

    return true;
  }

  @Emit()
  remove() {
    return true;
  }

  private async _saveImage() {
    const nodes = Array.from(
      document.getElementsByClassName(this.exportClass)
    ) as HTMLElement[];

    nodes.forEach(x => this._hideNoPrintElements(x));
    // const { toBlob } = await import('html-to-image');
    const html2canvas = (await import('html2canvas')).default;

    // const items: Blob[] = [];
    const items: HTMLCanvasElement[] = [];
    try {
      for (const node of nodes) {
        if (node) {
          const canvas = await html2canvas(node, {
            scale: 2
            // width: 804,
            // height: 1133
          });
          if (canvas) {
            items.push(canvas);
          }
        }
      }
      if (items.length > 1) {
        this._exportZip(items);
      } else {
        this._exportToJpeg(items[0]);
      }
    } catch (error) {
      console.error('oops, something went wrong!', error);
    }

    nodes.forEach(x => this._showNoPrintElements(x));
  }

  private _hideNoPrintElements(node: HTMLElement) {
    const zoomControls = node.querySelector(
      '.ol-zoom.ol-unselectable.ol-control'
    ) as HTMLElement;
    if (zoomControls) {
      zoomControls.style.display = 'none';
    }
  }

  private _showNoPrintElements(node: HTMLElement) {
    const zoomControls = node.querySelector(
      '.ol-zoom.ol-unselectable.ol-control'
    ) as HTMLElement;
    if (zoomControls) {
      zoomControls.style.display = 'block';
    }
  }

  private async _exportZip(canvasList: HTMLCanvasElement[]) {
    const JSZip = await import('jszip');
    const zip = JSZip.default();
    const blobs: Blob[] = [];
    const promises = canvasList.map(x => {
      return new Promise((resolve, reject) => {
        x.toBlob(b => {
          if (b) {
            blobs.push(b);
          }
          resolve();
        });
      });
    });
    await Promise.all(promises);
    blobs.forEach((x, i) => {
      zip.file(i + 1 + '.png', x, { base64: true });
    });
    try {
      const blob = await zip.generateAsync({ type: 'blob' });
      const { saveAs } = await import('file-saver');
      saveAs(blob, this.fileName + '.zip');
    } catch (er) {
      console.log(er);
    }
  }

  private _exportToJpeg(canvas: HTMLCanvasElement, name?: string) {
    const dataUrl = canvas.toDataURL('image/jpeg');
    // const urlCreator = window.URL || window.webkitURL;
    // const dataUrl = urlCreator.createObjectURL(blob);

    name = name ?? this.fileName;
    const link = document.createElement('a');
    link.download = name + '.jpg';
    link.href = dataUrl;
    link.click();
  }
}
