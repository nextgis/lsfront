import { connector } from '../../../common/src/ngw/connector';
import { FireMapOptions } from '../interfaces';

const config: FireMapOptions = {
  timedelta: 24,
  mapOptions: {
    // bounds: [45, 46, 47, 49],
    // baseUrl: document.location.protocol + '//clear-horizon.nextgis.com',
    connector,
    qmsId: 2550,
    // auth: {
    //   login: 'developer',
    //   password: 'developer123'
    // },
    resources: [
      {
        resourceId: 19,
        fit: true,
        adapterOptions: { visibility: false }
      }
    ]
  },
  // basemaps: [{ qmsId: 487 }, { qmsId: 1135 }],
  fires: [
    {
      resourceId: 15,
      id: 'MODIS',
      color: 'red'
    },
    {
      resourceId: 17,
      id: 'VIIRS',
      color: 'orange'
    }
  ]
};

export default config;
