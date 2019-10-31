const defaultData = {
  fieldsByTypeName: {
    Node: {
      id: { name: 'id' },
    },
    ContentItem: {
      title: { name: 'title' },
    },
  },
};

let returnData = defaultData;

const reset = () => {
  returnData = defaultData;
};

const set = (data) => {
  returnData = data;
};

const parseResolveInfo = () => returnData;

export { reset, set, parseResolveInfo };
