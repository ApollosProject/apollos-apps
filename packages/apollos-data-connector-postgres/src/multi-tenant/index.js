import { sequelize } from '@apollosproject/data-connector-postgres';

export const contextMiddleware = async ({ req, context: ctx }) => {
  let church;
  const churchHeader = req.headers['x-church'];
  if (churchHeader) {
    church = await sequelize.models.church.findOne({
      where: { slug: churchHeader },
    });
    if (!church) throw new Error(`"${churchHeader}" not a valid church slug!`);
  } else {
    const route = req.headers.host;
    church = await sequelize.models.church.findOne({
      include: {
        model: sequelize.models.churchRoute,
        where: { routeName: route },
      },
    });

    if (!church) throw new Error(`"${route}" not a valid church route!`);
  }

  return {
    ...ctx,
    church,
  };
};
