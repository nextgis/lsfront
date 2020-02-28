import { Component, Vue, Model, Watch, Emit } from 'vue-property-decorator';
import { getSelectScaleItems } from '../../utils/utils';

@Component
export default class extends Vue {
  @Model('change', { type: Number }) readonly activeScale!: number;

  scale: number | false = false;
  selectScaleItems: { text: string; value: number }[] = [];

  @Watch('activeScale')
  onChangeScale() {
    this._updateSelectScaleItems();
  }

  @Watch('scale')
  @Emit('change')
  onLocalScaleChange(val: number) {
    return val;
  }

  private _updateSelectScaleItems() {
    this.scale = this.activeScale;
    this.selectScaleItems = getSelectScaleItems(this.activeScale);
  }
}
