import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ModalView, PaddedView } from '@apollosproject/ui-kit';
import { ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScriptureItem from '@apollosproject/ui-scripture';
import GET_SCRIPTURE from './getScripture';

const ScriptureScreenConnected = ({ route, navigation }) => {
  const { reference } = route.params;
  const { data } = useQuery(GET_SCRIPTURE, {
    variables: { reference },
    fetchPolicy: 'cache-and-network',
  });
  const scriptures = data?.scriptures ?? [];
  return (
    <ModalView onClose={() => navigation.goBack()}>
      <BottomSheetModalProvider>
        <SafeAreaView>
          <ScrollView>
            <PaddedView>
              {scriptures.length > 0 ? (
                scriptures.map((ref, i) => (
                  <ScriptureItem
                    key={ref.id}
                    reference={ref.reference}
                    html={ref.html}
                    copyright={
                      // only show last copyright
                      scriptures.length - 1 === i ? ref.copyright : null
                    }
                    version={ref.version}
                  />
                ))
              ) : (
                <ActivityIndicator />
              )}
            </PaddedView>
          </ScrollView>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </ModalView>
  );
};

ScriptureScreenConnected.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      reference: PropTypes.string,
    }),
  }),
};

export default ScriptureScreenConnected;
