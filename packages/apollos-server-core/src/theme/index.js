import { themeSchema } from '@apollosproject/data-schema';
// import randomColor from 'randomcolor';

import colorScalarType from './colorScalarType';

export { themeSchema as schema };

export const resolver = {
  Theme: {
    type: () => null, // todo: infer theme type from data
    colors: () => {
      // colors: (seed) => {
      // todo: don't generate a random theme :)
      // const baseColors = randomColor({ seed, count: 2, luminosity: 'bright' });
      // return {
      // primary: baseColors[0],
      // secondary: baseColors[1],
      // screen: randomColor({
      // seed,
      // hue: baseColors[0],
      // luminosity: 'dark',
      // }),
      // paper: randomColor({
      // seed,
      // hue: baseColors[1],
      // luminosity: 'dark',
      // }),
      // alert: randomColor({
      // seed,
      // hue: 'red',
      // }),
      // };
      return null;
    },
  },
  Color: colorScalarType,
};
