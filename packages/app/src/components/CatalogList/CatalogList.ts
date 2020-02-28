import { Vue, Component } from 'vue-property-decorator';
import CatalogCard from '../CatalogCard/CatalogCard.vue';
import { appModule } from '../../store/app/app';

@Component({
  components: { CatalogCard }
})
export default class CatalogList extends Vue {
  get catalog() {
    return [
      {
        title: 'Объекты инвентаризации и отчетность',
        cards: appModule.reports
      },
      { title: 'Вспомогательные инструменты', cards: appModule.tools }
    ];
  }
}
