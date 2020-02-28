import { MultiPolygon } from 'geojson';
import { ResourceList } from '@veles/common/src/components/ResourceList';

import { fourthAnnexModule } from '../../store/annex4/annex4';
import { FourthAnnexProperties } from '../../store/interfaces';

export default class extends ResourceList<FourthAnnexProperties, MultiPolygon> {
  exclude = ['data'];

  get module() {
    return fourthAnnexModule;
  }
}
