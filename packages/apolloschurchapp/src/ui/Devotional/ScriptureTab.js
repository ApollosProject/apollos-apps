import React from 'react';
import { ScrollView } from 'react-native';
import PaddedView from 'apolloschurchapp/src/ui/PaddedView';
import { H2 } from 'apolloschurchapp/src/ui/typography';
import Scripture from 'apolloschurchapp/src/ui/Scripture';

const ScriptureTab = ({
  scripture
}) => console.log("scripture = ", scripture) || (
  <ScrollView>
    <PaddedView>
      <Scripture references={scripture} />
    </PaddedView>
  </ScrollView>
)

export default ScriptureTab;
