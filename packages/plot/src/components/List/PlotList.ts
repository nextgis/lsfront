import { Component, Prop } from 'vue-property-decorator';
import { LoadingComponent } from '@veles/common/src/components/LoadingComponent';
import { ResourceList } from '@veles/common/src/components/ResourceList';
import { plotModule, Plot } from '../../store/plot';

@Component({
  components: { LoadingComponent }
})
export default class extends ResourceList {
  @Prop({ type: Object, default: () => plotModule }) module!: Plot;
}
