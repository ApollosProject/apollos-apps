import React, { PureComponent } from 'react';
import { TableView, Divider } from '@apollosproject/ui-kit';
import { WebBrowserConsumer } from '../ui/WebBrowser';
import ChangeLivestream from './ChangeLivestream';
import TouchableCell from './TouchableCell';

export default class TestingControlPanel extends PureComponent {
  static navigationOptions = () => ({
    title: 'Testing Control Panel',
  });

  render() {
    return (
      <TableView>
        <ChangeLivestream />
        <Divider />
        <WebBrowserConsumer>
          {(openUrl) => (
            <TouchableCell
              handlePress={() =>
                openUrl(
                  'https://www.whatismybrowser.com/detect/what-http-headers-is-my-browser-sending'
                )
              }
              iconName="share"
              cellText={`Open Web Browser With User Cookie`}
            />
          )}
        </WebBrowserConsumer>
        <TouchableCell
          handlePress={() => this.props.navigation.navigate('Onboarding')}
          iconName="Avatar"
          cellText={`Launch Onboarding`}
        />
      </TableView>
    );
  }
}
