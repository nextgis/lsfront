import {
  Component,
  Mixins,
  Prop,
  PropSync,
  Watch
} from 'vue-property-decorator';
import ThirdAnnexList from '../ThirdAnnexList/ThirdAnnexList';
import { LoadingComponent } from '@veles/common';
import { ResourceStoreItem } from '@nextgis/ngw-connector';

@Component({
  components: { LoadingComponent }
})
export default class extends Mixins(ThirdAnnexList) {
  @Prop({ type: Boolean, default: true }) singleSelect!: boolean;
  @Prop({ type: Array }) annex3ids!: number[];
  @PropSync('selected', { type: Array }) syncedSelected!: ResourceStoreItem[];

  showActions = false;

  mounted() {
    if (this.items) {
      this.setSelectedById();
    }
  }

  @Watch('items')
  @Watch('annex3ids')
  setSelectedById() {
    if (this.annex3ids) {
      this.syncedSelected = this.items.filter(
        x => this.annex3ids.indexOf(x.id) !== -1
      );
    }
  }
}
