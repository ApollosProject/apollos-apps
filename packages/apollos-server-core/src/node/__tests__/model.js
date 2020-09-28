import { set, reset } from 'graphql-parse-resolve-info';
import casual from 'casual';
import Node, { createGlobalId, parseGlobalId } from '../model';

const schema = { getTypeMap: () => ({}) };

describe('Node', () => {
  it('`createGlobalId` should take two arguments and return a string', () => {
    const id = casual.word;
    const type = casual.word;

    expect(typeof createGlobalId(id, type)).toEqual('string');
  });

  it('`createGlobalId` should be decodeable by `parseGlobalId`', () => {
    const id = casual.word;
    const __type = casual.word;
    const globalId = createGlobalId(id, __type);

    expect(parseGlobalId(globalId)).toEqual({
      __type,
      id,
    });
  });

  it('`parseGlobalId` should take a global id and return the type and id', () => {
    const id = casual.word;
    const __type = casual.word;
    const globalId = createGlobalId(id, __type);

    expect(parseGlobalId(globalId)).toEqual({
      __type,
      id,
    });
  });

  it('`parseGlobalId` should throw an error if ID is invalid', () => {
    expect(() => parseGlobalId('blah-blah')).toThrow();
  });

  it('Node class should parse an encoded id to get the type to resolve', async () => {
    const id = casual.word;
    const __type = 'Test';
    const globalId = createGlobalId(id, __type);

    const dataSources = {
      Test: {
        getFromId(_id) {
          expect(_id).toEqual(id);
          return {};
        },
      },
    };

    const node = new Node();
    await node.get(globalId, dataSources, { schema });
  });

  it("Node class should throw error if it can't find a matching model", async () => {
    const id = casual.word;
    const __type = 'NoModel';
    const globalId = createGlobalId(id, __type);

    const node = new Node({});
    expect(
      node.get(globalId, {}, { schema })
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('Node class should throw error if model does not have getFromId', async () => {
    const id = casual.word;
    const __type = 'Test';
    const globalId = createGlobalId(id, __type);

    const dataSources = {
      Test: {},
    };

    const node = new Node(dataSources);

    expect(
      node.get(globalId, dataSources, { schema })
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it("Node class doesn't assign __type if model returns falsey", async () => {
    const id = casual.word;
    const __type = 'Test';
    const globalId = createGlobalId(id, __type);

    const dataSources = {
      Test: {
        getFromId() {
          return '';
        },
      },
    };

    const node = new Node(dataSources);
    const record = await node.get(globalId, dataSources, { schema });
    expect(record).not.toHaveProperty('__type');
  });

  it('Node class should return data from the models interface `getFromId` method', async () => {
    const id = casual.word;
    const __type = 'Test';
    const globalId = createGlobalId(id, __type);
    const data = {
      test: casual.word,
    };

    const dataSources = {
      TestInterface: {
        getFromId() {
          return Promise.resolve(data);
        },
      },
    };

    const schemaWithInterfaces = {
      getTypeMap: () => ({
        Test: {
          astNode: {
            interfaces: [
              { name: { value: 'Node' } },
              { name: { value: 'SomethingElse' } },
              { name: { value: 'TestInterface' } },
            ],
          },
        },
      }),
    };

    const node = new Node();
    const result = await node.get(globalId, dataSources, {
      schema: schemaWithInterfaces,
    });

    expect(result.test).toEqual(data.test);
  });

  it('Node class should return data from the models `getFromId` method', async () => {
    const id = casual.word;
    const __type = 'Test';
    const globalId = createGlobalId(id, __type);
    const data = {
      test: casual.word,
    };

    const dataSources = {
      Test: {
        getFromId() {
          return Promise.resolve(data);
        },
      },
    };

    const node = new Node();
    const result = await node.get(globalId, dataSources, { schema });

    expect(result.test).toEqual(data.test);
  });

  it('Node class should return just the id if we are only asking for id', async () => {
    const id = '123';
    const __type = 'Test';
    const globalId = createGlobalId(id, __type);

    set({
      fieldsByTypeName: {
        ContentItem: {
          id: { name: 'id' },
        },
      },
    });

    const dataSources = {
      Test: {
        getFromId: jest.fn(),
      },
    };

    const node = new Node();
    const result = await node.get(globalId, dataSources, { schema });

    expect(result).toMatchSnapshot();
    expect(dataSources.Test.getFromId.mock.calls).toMatchSnapshot();
    reset();
  });

  it("Node class should return just the id in it's unencoded state", async () => {
    const id = '123';
    const __type = 'Test';
    const globalId = createGlobalId(id, __type);

    set({
      fieldsByTypeName: {
        ContentItem: {
          id: { name: 'id' },
        },
      },
    });

    const dataSources = {
      Test: {
        getFromId: jest.fn(),
      },
    };

    const node = new Node();
    const result = await node.get(globalId, dataSources, { schema });

    expect(result.id).toBe(id);
    reset();
  });

  it('Node class should call getFromId the id if we are asking for more than id', async () => {
    const id = '456';
    const __type = 'Test';
    const globalId = createGlobalId(id, __type);

    set({
      fieldsByTypeName: {
        ContentItem: {
          id: { name: 'id' },
          title: { name: 'title' },
        },
      },
    });

    const dataSources = {
      Test: {
        getFromId: jest.fn(),
      },
    };

    const node = new Node();
    const result = await node.get(globalId, dataSources, { schema });

    expect(result).toMatchSnapshot();
    expect(dataSources.Test.getFromId.mock.calls).toMatchSnapshot();
    reset();
  });

  it('Node class should attach the __type to the resulting data', async () => {
    const id = casual.word;
    const __type = 'Test';
    const globalId = createGlobalId(id, __type);
    const data = {
      test: casual.word,
    };

    const dataSources = {
      Test: {
        getFromId() {
          return Promise.resolve(data);
        },
      },
    };

    const node = new Node();
    const result = await node.get(globalId, dataSources, { schema });

    expect(result.__type).toEqual(__type);
  });
});
