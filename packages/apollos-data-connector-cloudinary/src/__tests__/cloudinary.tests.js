import { dataSource as ConfigDataSource } from '@apollosproject/config';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';
import * as Cloudinary from '../index';

const { getContext } = createTestHelpers({
  Cloudinary,
  Config: { dataSource: ConfigDataSource },
});
let context;

const originalUrl =
  'https://apollosrock.newspring.cc/GetImage.ashx?guid=f54b0db0-95f5-44ad-b8f2-8bcd1b23cfdb';

describe('Cloudinary', () => {
  beforeEach(async () => {
    // set cloudinary config
    context = await getContext(
      {
        req: { headers: { 'x-church': 'apollos_demo' } },
      },
      { church: { slug: 'apollos_demo' } }
    );
  });
  it('must return the URL if CLOUDINARY_URL is not specified', () => {
    context.dataSources.Config.loadJs({
      CLOUDINARY: {
        URL: null,
      },
    });

    // eslint-disable-next-line
    const CloudinaryDataSource = new Cloudinary.dataSource();
    CloudinaryDataSource.initialize({ context });

    const url = CloudinaryDataSource.withCloudinary(originalUrl);

    expect(url).toEqual(originalUrl);
  });
  it('must return a cloudinary fetch URL if CLOUDINARY_URL is defined', () => {
    // eslint-disable-next-line
    const CloudinaryDataSource = new Cloudinary.dataSource();
    CloudinaryDataSource.initialize({ context });

    const url = CloudinaryDataSource.withCloudinary(originalUrl);

    expect(url).toEqual(
      'https://res.cloudinary.com/n07t21i7/image/fetch/c_limit,f_jpg,q_auto,w_750/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3Df54b0db0-95f5-44ad-b8f2-8bcd1b23cfdb'
    );
  });
  it('must not double parse a cloudinary url.', () => {
    // eslint-disable-next-line
    const CloudinaryDataSource = new Cloudinary.dataSource();
    CloudinaryDataSource.initialize({ context });

    const url = CloudinaryDataSource.withCloudinary(originalUrl);
    const doubledParsed = CloudinaryDataSource.withCloudinary(url);

    expect(url).toEqual(doubledParsed);
  });
});
