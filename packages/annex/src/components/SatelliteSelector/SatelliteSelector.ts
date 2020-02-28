import { Component, Vue, Prop, Model, Watch } from 'vue-property-decorator';
import { LoadingComponent } from '@veles/common/src/components/LoadingComponent';
import NgwMap from '@nextgis/ngw-map';
import { ResourceItem } from '@nextgis/ngw-connector';

import { module } from '../../store/satellite/satellite';

@Component({
  components: { LoadingComponent }
})
export default class extends Vue {
  @Prop({ type: Object }) ngwMap!: NgwMap;
  @Model('change', { type: String }) readonly active!: string;

  item = '';

  get items() {
    const items = module.items.map(x => ({
      text: this._getTextFromItem(x),
      value: this._getValueFromItem(x)
    }));
    const emptyItem = { text: 'Без снимка', value: '' };
    return [emptyItem, ...items];
  }

  mounted() {
    module.getItems().then(items => {
      if (this.active) {
        const active = items.find(
          x => this._getValueFromItem(x) === this.active
        );
        if (active) {
          this.item = this._getValueFromItem(active);
        }
      }
    });
  }

  @Watch('item')
  onItemChange(val: string) {
    this.$emit('change', val);
    this._setItem();
  }

  private _setItem() {
    this.ngwMap.removeLayer('satellite');
    const active = module.items.find(
      x => this._getValueFromItem(x) === this.item
    );
    if (active) {
      this.ngwMap.addNgwLayer({
        resourceId: active.resource.id,
        id: 'satellite',
        adapterOptions: {
          order: 2,
          name: 'Спутниковый снимок',
          visibility: true
        }
      });
    }
  }

  private _getTextFromItem(item: ResourceItem) {
    const split = item.resource.display_name.split('_');
    const dateStr = split[1];
    const date = dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3');
    return date;
  }

  private _getValueFromItem(item: ResourceItem) {
    return item.resource.display_name;
  }
}
