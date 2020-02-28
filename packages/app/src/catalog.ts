import { CatalogItem, CatalogItemActionName } from './store/app/interfaces';

import './images/forest-fire.png';
import './images/plot.png';
import './images/landsat.jpg';
import './images/poly2explication.png';

import { AsyncComponentFactory } from 'vue/types/options';
import { LoadingComponent } from '@veles/common';

const catalogItemActionNames: Record<CatalogItemActionName, string> = {
  edit: 'Редактировать',
  create: 'Создать',
  list: 'Список',
  open: 'Открыть',
  map: 'Карта'
};

export const catalog: CatalogItem[] = [
  {
    type: 'report',
    id: 'plot',
    title: 'Лесосеки',
    description: 'база данных лесосек',
    color: '#0091EA',
    info: 'Ведение базы данных лесосек',
    actions: [
      {
        name: 'list',
        component: async () => {
          const PlotListComponent = await import(
            '../../plot/src/components/List/PlotList.vue'
          );
          return PlotListComponent;
        }
      },
      {
        name: 'map',
        component: async () => {
          const PlotMap = await import(
            '../../plot/src/components/Map/PlotMap.vue'
          );
          return PlotMap;
        },
        router: { props: { mode: 'show' } }
      },
      {
        name: 'create',
        component: async () => {
          const PlotMap = await import(
            '../../plot/src/components/Map/PlotMap.vue'
          );
          return PlotMap;
        },
        router: { props: { mode: 'edit' } }
      },
      {
        name: 'edit',
        hidden: true,
        router: { path: '/:lesid', props: true },
        component: async () => {
          const PlotMap = await import(
            '../../plot/src/components/Map/PlotMap.vue'
          );
          return PlotMap;
        }
      }
    ]
  },
  {
    type: 'report',
    id: 'annex3',
    title: 'Приложение №3',
    description: 'к лесной декларации',
    info: 'Создание Приложений 3',
    color: '#827717',
    actions: [
      {
        name: 'list',
        component: async () => {
          const ThirdAnnexList = await import(
            '../../annex/src/components/ThirdAnnexList/ThirdAnnexList.vue'
          );
          return ThirdAnnexList;
        }
      },
      {
        name: 'create',
        title: 'Сформировать',
        component: async () => {
          const ThirdAnnex = await import(
            '../../annex/src/components/ThirdAnnex/ThirdAnnex.vue'
          );
          return ThirdAnnex;
        }
      },
      {
        name: 'edit',
        hidden: true,
        router: { path: '/:id', props: true },
        component: async () => {
          const ThirdAnnex = await import(
            '../../annex/src/components/ThirdAnnex/ThirdAnnex.vue'
          );
          return ThirdAnnex;
        }
      }
    ]
  },
  {
    type: 'report',
    id: 'annex4',
    title: 'Приложение №4',
    description: 'к лесной декларации',
    info: 'Создание Приложений 4',
    color: '#388E3C',
    actions: [
      {
        name: 'list',
        component: async () => {
          const List = await import(
            '../../annex/src/components/FourthAnnexList/FourthAnnexList.vue'
          );
          return List;
        }
      },
      {
        name: 'create',
        component: async () => {
          const ActionMap = await import(
            '../../annex/src/components/FourthAnnex/FourthAnnex.vue'
          );
          return ActionMap;
        }
      },
      {
        name: 'edit',
        hidden: true,
        router: { path: '/:id', props: true },
        component: async () => {
          const ActionMap = await import(
            '../../annex/src/components/FourthAnnex/FourthAnnex.vue'
          );
          return ActionMap;
        }
      }
    ]
  },
  {
    type: 'report',
    // id: 'usage-recovery-reports',
    id: 'reports',
    title: 'Отчеты',
    color: '#901dad',
    info: 'Создание отчетов об использовании/восстановлении лесов',
    description: 'Отчеты об использовании/ восстановлении лесов',
    actions: [
      {
        name: 'list',
        component: async () => {
          const List = await import(
            '../../annex/src/components/ReportsList/ReportsList.vue'
          );
          return List;
        }
      },
      {
        name: 'create',
        component: async () => {
          const ActionMap = await import(
            '../../annex/src/components/Reports/Reports.vue'
          );
          return ActionMap;
        }
      },
      {
        name: 'edit',
        hidden: true,
        router: { path: '/:id', props: true },
        component: async () => {
          const ActionMap = await import(
            '../../annex/src/components/Reports/Reports.vue'
          );
          return ActionMap;
        }
      }
    ]
  },
  {
    type: 'tools',
    id: 'fires',
    title: 'Пожары на территории',
    info: 'Интерактивная карта пожарной ситуации территории',
    src: 'forest-fire.png',
    color: '#FF6D00',
    actions: [
      {
        name: 'open',
        component: async () => {
          const { FireMap } = await import('@veles/fires');
          return FireMap;
        }
      }
    ]
  },
  {
    type: 'tools',
    id: 'download_and_prepare_l8_s2',
    title: 'Скачать спутниковые данные',
    info:
      'Инструмент заказа и получения обработанных данных Landsat 8/Sentinel 2',
    src: 'landsat.jpg',
    color: '#1b1b3f',
    actions: [
      {
        name: 'open',
        link: 'https://toolbox.nextgis.com/operation/download_and_prepare_l8_s2'
      }
    ]
  },
  // {
  //   type: 'tools',
  //   id: 'poly2explication',
  //   title: 'Экспликация отвода',
  //   info:
  //     'Инструмент создаёт отчёт в формате Excel (xlsx) для полигона-лесосеки и привязочной линии',
  //   color: 'rgb(169, 74, 71)',
  //   src: 'poly2explication.png',
  //   actions: [
  //     {
  //       name: 'open',
  //       link: 'https://toolbox.nextgis.com/operation/poly2explication'
  //     }
  //   ]
  // },
  {
    type: 'tools',
    id: 'plot-selec',
    title: 'Выборка лесосек',
    info: 'Интерактивная карта лесосек',
    src: 'plot.png',
    color: '#595d48',
    actions: [
      {
        name: 'list',
        component: async () => {
          const PlotListComponent = await import(
            '../../plot/src/components/List/PlotList.vue'
          );
          return PlotListComponent;
        }
      },
      {
        name: 'map',
        component: async () => {
          const PlotMap = await import(
            '../../plot/src/components/Map/PlotMap.vue'
          );
          return PlotMap;
        },
        router: { props: { mode: 'show' } }
      }
    ]
  },
  {
    type: 'tools',
    id: 'overview',
    title: 'Обзорная карта',
    info: '',
    // src: '',
    color: '#263238',
    actions: [
      {
        name: 'open',
        component: async () => {
          const { Overview } = await import('@veles/overview');
          return Overview;
        }
      }
    ]
  }
  // {
  //   type: 'tools',
  //   id: 'rent',
  //   title: 'Договоры аренды',
  //   actions: [
  //     {
  //       name: 'open',
  //       component: async () => {
  //         const { PlotListComponent } = await import('@veles/plot');
  //         return PlotListComponent;
  //       }
  //     }
  //   ]
  // }
];

catalog.forEach(x => {
  if (x.actions) {
    x.actions.forEach(y => {
      y.title = catalogItemActionNames[y.name];
      const component = y.component;
      if (component) {
        const asyncComponent: AsyncComponentFactory = () => ({
          component: component(),
          loading: LoadingComponent,
          // error: ErrorComponent,
          delay: 10
          // timeout: 3000
        });
        y.componentFactory = asyncComponent;
      } else if (y.link) {
        //
      }
    });
  }
});
