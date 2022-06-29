describe('landing screen', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should launch', async () => {
    await expect(
      element(by.text('Already have an account? Log in →'))
    ).toBeVisible();
  });
});
