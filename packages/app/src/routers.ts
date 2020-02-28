import VueRouter, { RouteConfig } from 'vue-router';

import config from '../../../config';

import MainPage from './components/MainPage/MainPage.vue';
import CatlogList from './components/CatalogList/CatalogList.vue';
import Login from './components/Login/Login.vue';
import { appModule } from './store/app/app';

const catalog: RouteConfig[] = [];

appModule.catalog.forEach(x => {
  x.actions.forEach(y => {
    const _config: RouteConfig = {
      path: '' + x.id + '/' + y.name,
      name: x.id + '_' + y.name,
      meta: { title: ` ${y.title} | ${x.title} | ${config.title}` },
      component: y.componentFactory
    };
    if (y.router) {
      if (y.router.path) {
        _config.path += y.router.path;
      }
      if (y.router.props) {
        _config.props = y.router.props;
      }
    }
    catalog.push(_config);
  });
});

const router = new VueRouter({
  mode: 'history',
  base: './',
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: { title: `вход | ${config.title}` },
      component: Login,
      props: true
    },
    {
      path: '/',
      component: MainPage,
      children: [
        { path: '', meta: { title: config.title }, component: CatlogList },
        ...catalog
      ]
    },
    {
      path: '*',
      meta: { title: config.title },
      redirect: '/'
    }
  ]
});

router.beforeEach((to, from, next) => {
  const user = appModule.user;
  if (!user) {
    if (to.path !== '/login') {
      next({
        path: '/login',
        query: {
          next: to.fullPath
        }
      });
    } else {
      next();
    }
  } else {
    const arr: string | string[] | undefined = to.name && to.name.split('_');
    if (Array.isArray(arr) && arr[0] && arr[1]) {
      const [catalogItemId, actionName] = arr;
      appModule.setActiveCatalogAction({ actionName, catalogItemId });
    } else {
      appModule.setActiveCatalogAction();
    }
    next();
  }
});

export default router;
