import { Vue, Component, Watch } from 'vue-property-decorator';
import { mdiAccount, mdiLock } from '@mdi/js';
import { Credentials } from '@nextgis/ngw-connector';
import { appModule } from '../../store/app/app';

@Component<Login>({})
export default class Login extends Vue {
  next!: string;

  svg = {
    mdiAccount,
    mdiLock
  };
  isLoading = false;
  isError = false;
  auth: Credentials = { login: '', password: '' };

  get appName() {
    return appModule.appName;
  }

  get isValid() {
    return this.auth.login && this.auth.password;
  }

  get user() {
    return appModule.user;
  }

  beforeMount() {
    const next = this.$route.query.next as string;
    if (next) {
      this.next = next;
    }
    if (this.user) {
      this.goNext();
    }
  }

  @Watch('user')
  goNext() {
    const path = this.next || '/';
    this.$router.push({ path, query: {} });
  }

  async login() {
    this.isError = false;
    this.isLoading = true;
    try {
      await appModule.login(this.auth);
    } catch (er) {
      //
    } finally {
      this.isLoading = false;
    }
    this.isError = !this.user;
  }
}
