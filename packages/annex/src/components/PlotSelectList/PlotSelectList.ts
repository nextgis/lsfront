import {
  Component,
  Mixins,
  Prop,
  PropSync,
  Watch
} from 'vue-property-decorator';
import { ResourceStoreItem } from '@nextgis/ngw-connector';
import { PlotList } from '@veles/plot/src/components/List';
import { LoadingComponent } from '@veles/common/src/components/LoadingComponent';

@Component({
  components: { LoadingComponent }
})
export default class PlotMap extends Mixins(PlotList) {
  @Prop({ type: Boolean, default: false }) singleSelect!: boolean;
  @Prop({ type: Array }) lesids!: number[];
  @PropSync('selected', { type: Array }) syncedSelected!: ResourceStoreItem[];

  showActions = false;

  mounted() {
    if (this.items) {
      this.setSelectedById();
    }
  }

  @Watch('lesids')
  @Watch('items')
  setSelectedById() {
    if (this.lesids && this.items.length) {
      this.syncedSelected = this.items.filter(
        x => this.lesids.indexOf(x.id) !== -1
      );
    }
  }
}
