import { Component } from 'vue-property-decorator';
import { Polygon } from 'geojson';
import { LoadingComponent } from '@veles/common/src/components/LoadingComponent';
import { ResourceList } from '@veles/common/src/components/ResourceList';

import { reportsModule } from '../../store/reports/reports';
import { ThirdAnnexProperties } from '../../store/interfaces';

@Component({
  components: { LoadingComponent }
})
export default class extends ResourceList<ThirdAnnexProperties, Polygon> {
  exclude = ['data'];

  get module() {
    return reportsModule;
  }
}
