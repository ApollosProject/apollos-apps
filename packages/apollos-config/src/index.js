import dataSource, { fetchChurchConfig } from './data-source';
import Config from './config';

const config = new Config();

export { config as default, dataSource, fetchChurchConfig, Config };
