import { Vue, Component, Watch } from 'vue-property-decorator';
import { mdiLogout, mdiHome, mdiAccount, mdiChevronDown } from '@mdi/js';
import { appModule } from '../../store/app/app';
import { CatalogItemAction } from '../../store/app/interfaces';
import UserPopoverMenu from '../../components/UserPopoverMenu/UserPopoverMenu.vue';

@Component({ components: { UserPopoverMenu } })
export default class MainPage extends Vue {
  svg = {
    mdiLogout,
    mdiHome,
    mdiAccount,
    mdiChevronDown
  };

  defColor = this.$vuetify.theme.themes.dark.primary;

  get appName() {
    return appModule.appName;
  }
  get auth() {
    return appModule.appName;
  }
  get activeCatalog() {
    return appModule.activeCatalog;
  }
  get color() {
    return (
      (this.activeCatalog &&
        this.activeCatalog.item &&
        this.activeCatalog.item.color) ||
      this.defColor
    );
  }

  beforeMount() {
    this.changePrimaryColor();
  }

  @Watch('color')
  changePrimaryColor() {
    this.$vuetify.theme.themes.dark.primary = this.color;
  }

  goTo(item: CatalogItemAction) {
    if (this.activeCatalog) {
      this.$router.push({
        path: '/' + this.activeCatalog.item.id + '/' + item.name
      });
    }
  }

  getAnotherActions(action: string) {
    return (
      this.activeCatalog &&
      this.activeCatalog.item.actions.filter(
        x => x.title !== action && !x.hidden
      )
    );
  }

  logout() {
    // ignore
  }
}
