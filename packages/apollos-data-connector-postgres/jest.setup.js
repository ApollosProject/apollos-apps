import { init } from './src/postgres/index';

export default async () => {
  await init();
};
