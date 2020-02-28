import { Vue, Component, Prop } from 'vue-property-decorator';
import { mdiChevronUp, mdiChevronDown } from '@mdi/js';
import { CatalogItem, CatalogItemAction } from '../../store/app/interfaces';

@Component
export default class CatalogCard extends Vue {
  @Prop() readonly card!: CatalogItem;

  svg = {
    mdiChevronUp,
    mdiChevronDown
  };

  infoShow = false;

  getCardActions() {
    return this.card.actions.filter(x => !x.hidden);
  }

  onCardActionClick(action: CatalogItemAction) {
    if (action.component) {
      this.$router.push(this.card.id + '/' + action.name);
    } else if (action.link) {
      const win = window.open(action.link, '_blank');
      if (win) {
        win.focus();
      }
    }
  }
}
