import { Vue, Component, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { LoadingComponent } from '@veles/common/src/components/LoadingComponent';
import { ConfirmDialogComponent } from '@veles/common/src/components/ConfirmDialog';
import { SelectFileDialogComponent } from '@veles/common/src/components/SelectFileDialog';
import { SnackbarComponent } from '@veles/common/src/components/Snackbar';
import { appModule } from '../../store/app/app';

@Component({
  components: {
    LoadingComponent,
    ConfirmDialogComponent,
    SelectFileDialogComponent,
    SnackbarComponent
  }
})
export default class App extends Vue {
  get appName() {
    return appModule.appName;
  }

  get globalLoading() {
    return appModule.globalLoading;
  }
  get globalErrorMessage() {
    return appModule.globalErrorMessage;
  }

  get loadingText() {
    return this.appName + ' загрузка...';
  }

  get user() {
    return appModule.user;
  }

  async logOut() {
    await appModule.logout();
    this.$router.push('/login');
  }

  @Watch('$route')
  changeTitle(to: Route) {
    document.title = to.meta.title || 'NextGIS LES';
  }

  mounted() {
    this.$root.$confirm = this.$refs.confirm as any;
    this.$root.$file = this.$refs.file as any;
    this.$root.$snackbar = this.$refs.snackbar as any;
  }
}
