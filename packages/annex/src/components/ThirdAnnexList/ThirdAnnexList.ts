import { Component } from 'vue-property-decorator';
import { Polygon } from 'geojson';
import { LoadingComponent } from '@veles/common/src/components/LoadingComponent';
import { ResourceList } from '@veles/common/src/components/ResourceList';

import { thirdAnnexModule } from '../../store/annex3/annex3';
import { ThirdAnnexProperties } from '../../store/interfaces';

@Component({
  components: { LoadingComponent }
})
export default class extends ResourceList<ThirdAnnexProperties, Polygon> {
  get module() {
    return thirdAnnexModule;
  }
}
