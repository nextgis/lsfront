export interface LesConfig {
  baseUrl?: string;
  title?: string;
}

let config = {
  title: 'NextGIS Лес',
  // title: 'ВЕЛЕС'
  // baseUrl: document.location.protocol + '//veles-prim.nextgis.com'
  baseUrl: 'https://veles-prim.nextgis.com'
};

try {
  const localConfig = require('./config_local.json');
  config = { ...config, ...localConfig };
} catch (er) {
  // throw new Error('');
}

export default config;
