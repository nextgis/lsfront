import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class extends Vue {
  @Prop({ type: String }) returnPath!: string;
  @Prop({ type: String, default: 'Ошибка загрузки, объект не найден' })
  readonly text!: string;

  goTo() {
    if (this.returnPath) {
      this.$router.push(this.returnPath);
    }
  }
}
