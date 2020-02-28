import { mdiClose } from '@mdi/js';
import { Component, Prop, Vue, Ref } from 'vue-property-decorator';
import { NgwLayersList } from '@nextgis/vuetify-ngw-components';
import VueNgwMap from '@nextgis/vue-ngw-ol';
import NgwMap, { NgwMapOptions } from '@nextgis/ngw-map';

import { connector } from '../../../../common/src/ngw/connector';
import { LoadingComponent } from '../../../../common/src/components/LoadingComponent';

import { mapOptions } from '../../../config';

@Component({
  components: {
    VueNgwMap,
    NgwLayersList,
    LoadingComponent
  }
})
export default class extends Vue {
  @Prop({ type: Object, default: () => mapOptions }) mapOptions!: NgwMapOptions;
  @Ref('VueNgwMap') readonly vueNgwMap!: VueNgwMap;

  svg = {
    mdiClose
  };

  isLoading = true;
  layersDrawer = false;
  ngwMap: NgwMap | false = false;

  get connector() {
    return connector;
  }

  mounted() {
    this.vueNgwMap.ngwMap.onLoad().then(() => {
      // this.ngwMap = this.vueNgwMap.ngwMap;
      this.isLoading = false;
    });
  }

  updated() {
    if (this.vueNgwMap) {
      this.ngwMap = this.vueNgwMap.ngwMap;
    }
  }
}
