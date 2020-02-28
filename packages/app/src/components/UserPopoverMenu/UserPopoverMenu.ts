import { Vue, Component } from 'vue-property-decorator';
import { mdiAccount, mdiExitToApp } from '@mdi/js';
import { appModule } from '../../store/app/app';

@Component
export default class UserPopoverMenu extends Vue {
  svg = {
    mdiAccount,
    mdiExitToApp
  };

  get user() {
    return appModule.user;
  }

  menu = false;
  async logOut() {
    await appModule.logout();
    this.$router.push('/login');
  }
}
