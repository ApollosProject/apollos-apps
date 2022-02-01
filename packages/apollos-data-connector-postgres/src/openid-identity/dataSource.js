import fetch from 'node-fetch';
import { pickBy } from 'lodash';
import { Issuer } from 'openid-client';
import jwt from 'jsonwebtoken';
import { PostgresDataSource } from '../postgres';
import { generateToken } from '../authentication/token';

export default class OpenIdIdentity extends PostgresDataSource {
  modelName = 'openIdIdentity';

  async getProviders() {
    return [
      {
        providerType: 'rock',
        client: await this.rockClient(),
      },
    ].filter((p) => !!p.client);
  }

  async getClient({ type }) {
    const { client } = (await this.getProviders()).find(
      ({ providerType }) => providerType === type
    );
    return client;
  }

  get Config() {
    return this.context.dataSources.Config;
  }

  async rockClient() {
    const rockUrl = this.Config?.ROCK?.URL;
    const openIdSecret = this.Config?.ROCK?.OPEN_ID_SECRET;
    if (!rockUrl || !openIdSecret) {
      return null;
    }
    const openIdClient = await fetch(
      `${rockUrl}/api/AuthClients?$filter=Name eq 'Apollos'`,
      {
        headers: {
          'Authorization-Token': this.Config?.ROCK?.API_TOKEN,
        },
      }
    ).then((res) => res.json());

    const clientRecord = openIdClient[0];

    await this.findOrCreateApollosClaim();

    const issuer = await Issuer.discover(this.Config?.ROCK?.URL);

    return new issuer.Client({
      client_id: clientRecord.ClientId,
      client_secret: openIdSecret,
      redirect_uris: [clientRecord.RedirectUri],
      response_types: ['code'],
    });
  }

  async fieldsFromIdToken({ idToken }) {
    const identity = jwt.decode(idToken);
    const updateMap = pickBy(
      {
        email: identity.email,
        firstName: identity.nickname,
        lastName: identity.family_name,
        gender: (identity.gender || '').toUpperCase(),
        profile_image_url: identity.picture,
        originId: identity.rock_id,
        originType: identity.rock_id ? 'rock' : null,
      },
      (value) => !!value && value !== ''
    );

    if (identity.rock_campus_id) {
      const campus = await this.context.dataSources.Campus.getFromId(
        identity.rock_campus_id,
        null,
        { originType: 'rock' }
      );
      if (campus) updateMap.campusId = campus.id;
    }

    return updateMap;
  }

  async getCurrentPersonIdentity({ type }) {
    const currentPerson = await this.context.dataSources.Person.getCurrentPerson();
    const identity = (
      await currentPerson.getOpenIdIdentities({
        where: { providerType: type },
      })
    )?.[0];

    if (!identity) {
      return null;
    }

    const client = await this.getClient({ type });

    let userInfo;

    try {
      userInfo = await client.userinfo(identity.accessToken);
      // Token is likely expired. Let's attempt to renew.
    } catch (e) {
      console.log(e); // eslint-disable-line no-console
      const tokens = await client.refresh(identity.refreshToken);

      await identity.update({
        accessToken: tokens.access_token,
        idToken: tokens.id_token,
      });

      userInfo = await client.userinfo(tokens.access_token);
    }
    return userInfo;
  }

  async registerCode({ code, type }) {
    const currentPerson = await this.context.dataSources.Person.getCurrentPerson();

    const client = await this.getClient({ type });

    const result = await client.callback(client.redirect_uris[0], {
      code,
    });

    await currentPerson.createOpenIdIdentity({
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      idToken: result.id_token,
      providerType: type,
    });

    const updateMap = await this.fieldsFromIdToken({
      idToken: result.id_token,
    });
    await currentPerson.update(updateMap);

    return {
      success: !!result,
    };
  }

  async registerWithCode({ code, type }) {
    const client = await this.getClient({ type });

    const result = await client.callback(client.redirect_uris[0], {
      code,
    });

    const personFields = await this.fieldsFromIdToken({
      idToken: result.id_token,
    });

    const [person, created] = await this.sequelize.models.people.findOrCreate({
      where: { originId: personFields.originId, originType: type },
      defaults: {
        apollosUser: true,
        ...personFields,
      },
    });

    // If we had an existing user
    // Update their record with new details from the provider.
    if (!created) {
      await person.update(personFields);
    }

    await person.createOpenIdIdentity({
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      idToken: result.id_token,
      providerType: type,
    });

    const accessToken = generateToken({ personId: person.id });
    const refreshToken = await this.context.dataSources.RefreshToken.createToken(
      {
        personId: person.id,
      }
    );

    return {
      person,
      accessToken,
      refreshToken,
    };
  }

  // this is like a little migration so we don't have to do so much busy work in rock.
  async findOrCreateApollosClaim() {
    const rockUrl = this.Config?.ROCK?.URL;
    let scopeId = null;
    const openIdScopes = await fetch(
      `${rockUrl}/api/AuthScopes?$filter=Name eq 'apollos'`,
      {
        headers: {
          'Authorization-Token': this.Config?.ROCK?.API_TOKEN,
        },
      }
    ).then((res) => res.json());

    if (!openIdScopes.length) {
      scopeId = await fetch(`${rockUrl}/api/AuthScopes`, {
        method: 'POST',
        body: JSON.stringify({
          Name: 'apollos',
          PublicName: 'Apollos App',
          IsActive: true,
          IsSystem: false,
        }),
        headers: {
          'Authorization-Token': this.Config?.ROCK?.API_TOKEN,
          'content-type': 'application/json',
        },
      }).then((res) => res.json());
    } else {
      scopeId = openIdScopes[0].Id;
    }

    const claims = [
      {
        Value: "{{ CurrentPerson | Campus | Property:'Id' }}",
        Name: 'rock_campus_id',
        PublicName: 'Campus',
        ScopeId: scopeId,
        IsActive: true,
        IsSystem: false,
      },
      {
        Value: '{{ CurrentPerson.Id }}',
        Name: 'rock_id',
        PublicName: 'Rock ID',
        ScopeId: scopeId,
        IsActive: true,
        IsSystem: false,
      },
    ];

    await Promise.all(
      claims.map(async (claim) => {
        const foundClaims = await fetch(
          `${rockUrl}/api/AuthClaims?$filter=Name eq '${claim.Name}'`,
          {
            headers: {
              'Authorization-Token': this.Config?.ROCK?.API_TOKEN,
            },
          }
        ).then((res) => res.json());
        if (!foundClaims.length) {
          await fetch(`${rockUrl}/api/AuthClaims`, {
            method: 'POST',
            body: JSON.stringify(claim),
            headers: {
              'Authorization-Token': this.Config?.ROCK?.API_TOKEN,
              'content-type': 'application/json',
            },
          });
        }
      })
    );
  }
}
