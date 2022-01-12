import { dataSource as ConfigDataSource } from '@apollosproject/config';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';
import * as Sms from '../index';

const { getContext } = createTestHelpers({
  Config: { dataSource: ConfigDataSource },
  Sms,
});
let context;

describe('Twilio', () => {
  beforeEach(async () => {
    context = await getContext(
      { req: { headers: { 'x-church': 'apollos_demo' } } },
      { church: { slug: 'apollos_demo' } }
    );
  });

  it('constructs with Twilio', async () => {
    expect(context.dataSources.Sms).toMatchSnapshot();
  });

  it('sends an sms passing along args', async () => {
    const mockCreate = jest.fn();
    context.dataSources.Sms.twilio.messages.create = mockCreate;
    context.dataSources.Sms.sendSms({
      body: "Here's a cool body",
      to: '5133061126',
      additionalData: 'something else',
    });
    expect(mockCreate.mock.calls).toMatchSnapshot();
  });
});
