import moment from 'moment';
import { Op } from 'sequelize';
import { PostgresDataSource } from '../postgres';
import { generateToken, registerToken } from './token';

class RefreshTokenDataSource extends PostgresDataSource {
  modelName = 'refreshToken';

  createToken = async ({ personId }) => {
    const existingToken = await this.model.findOne({
      where: {
        personId,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (existingToken) {
      return existingToken.jwtToken;
    }

    const tokenRecord = await this.model.create({
      personId,
      expiresAt: moment().add(400, 'day').toDate(),
      apollosType: 'RefreshToken',
    });

    const jwtToken = generateToken({ tokenId: tokenRecord.id });

    await tokenRecord.update({
      jwtToken,
    });

    return jwtToken;
  };

  getValidToken = async ({ jwtToken }) => {
    const { tokenId } = registerToken(jwtToken);
    return this.model.findOne({
      where: {
        id: tokenId,
      },
    });
  };
}

export { RefreshTokenDataSource as default };
