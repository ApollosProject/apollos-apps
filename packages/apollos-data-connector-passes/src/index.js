// import { Pass } from 'passkit-generator';
// import ApollosConfig from '@apollosproject/config';
import PassGenerator from './PassGenerator';
import resolver from './resolver';
import dataSource from './data-source';

export { resolver, dataSource };
export { passSchema as schema } from '@apollosproject/data-schema';

const serverMiddleware = ({ app, getContext }) => {
  app.get('/pass/:template', async (req, res) => {
    const context = getContext({ req });
    let passData;

    try {
      passData = await context.dataSources.Pass.generatePassData({
        template: req.params.template,
        includeImageDataURIs: false,
      });
    } catch (e) {
      return res.send(e.message);
    }

    const templatePath = context.dataSources.Pass.getPassPathFromTemplateName(
      req.params.template
    );
    const pass = new PassGenerator({
      model: templatePath,
    });

    // Attach pass images if provided in template
    // Note: this is not standard passkit specs. It is a convenience helper so that you can easily
    // set a dynamic thumbnail images from within the pass's json template using Lava
    const imageKeys = [
      'thumbnail',
      'thumbnail@2x',
      'icon',
      'icon@2x',
      'logo',
      'logo@2x',
    ];
    imageKeys.forEach((key) => {
      if (passData[key] && passData[key].uri) {
        const { uri } = passData[key];
        delete passData[key];
        pass.load(uri, `${key}.png`);
      }
    });

    // Hack: passkit-generator has protections built-in to keep people from overriding too much.
    // Since this is a test service, we don't care, and will let people override whatever they want:
    pass._props = passData;
    pass.shouldOverwrite = true;

    try {
      const stream = await pass.generate();
      res.set({
        'Content-type': 'application/vnd.apple.pkpass',
        'Content-disposition': `attachment; filename=${req.params.template}.pkpass`,
      });

      return stream.pipe(res);
    } catch (err) {
      res.set({
        'Content-type': 'text/html',
      });

      return res.status(500).send(err.message);
    }
  });
};

export { serverMiddleware };
