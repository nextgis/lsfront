import NgwConnector, { NgwConnectorOptions } from '@nextgis/ngw-connector';
import config from '../../../../config';

const ngwConnectorOptions: NgwConnectorOptions = {
  baseUrl: config.baseUrl
};

export const connector = new NgwConnector(ngwConnectorOptions);
