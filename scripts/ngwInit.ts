import { readFile, writeFile, existsSync } from 'fs';
import prompts from 'prompts';
import { promisify } from 'util';
import chalk from 'chalk';
import NgwConnector from '@nextgis/ngw-connector';
import { LesConfig } from '../config';

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const configPath = './config_local.json';

let config: Partial<LesConfig> = {};
let connector: NgwConnector;

async function setup() {
  await loadExistConfig();
  await setNgwUrl();
}

async function loadExistConfig() {
  try {
    if (existsSync(configPath)) {
      const existConfig = await readFileAsync(configPath);
      config = { ...config, ...existConfig };
    }
  } catch (err) {
    chalk.red(err);
  }
}

async function setNgwUrl() {
  const response = await prompts({
    type: 'text',
    name: 'baseUrl',
    initial: config.baseUrl,
    validate: async (input: string) => {
      const data = await fetch(input);
      return data.status === 200
        ? true
        : `Unable to get response from '${input}'`;
    },

    message: 'Enter the NGW instance url'
  });

  config.baseUrl = response.baseUrl;
}

setup();
