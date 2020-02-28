import { Component, Vue, Prop } from 'vue-property-decorator';
import { AnnexInputAttribution } from '../../interfaces';

@Component
export default class extends Vue {
  @Prop({ type: Array, default: () => [] })
  inputAttributions!: AnnexInputAttribution[];
}
