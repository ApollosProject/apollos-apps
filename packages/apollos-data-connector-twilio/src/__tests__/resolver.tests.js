import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';
import * as Sms from '../index';

const { getContext } = createTestHelpers({ Sms });
let context;

describe('OneSignal', () => {
  beforeEach(() => {
    context = getContext();
  });

  it('constructs with Twilio', () => {
    expect(context.dataSources.Sms).toMatchSnapshot();
  });

  it('sends an sms passing along args', () => {
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
