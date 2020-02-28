import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class LoadingComponent extends Vue {
  @Prop({ type: String }) text!: string;
}
