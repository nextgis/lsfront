import '../../sheetLayout.css';

import { Component, Mixins, Prop } from 'vue-property-decorator';

import ResourceMap from '@veles/common/src/components/ResourceMapOl';
import BaseSheetLayout from '../BaseSheetLayout/BaseSheetLayout';

@Component({
  components: {
    PlotNgwMap: ResourceMap
  }
})
export default class extends Mixins(BaseSheetLayout) {
  @Prop({ type: String, default: 'annex3webmap' }) webmap!: string;
}
