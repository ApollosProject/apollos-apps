import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useQuery } from '@apollo/client';
import { useTheme, Paragraph, H4, H6, Icon } from '@apollosproject/ui-kit';
import GET_EVENT from './getEvent';

const EventInfoItem = ({ icon, title, subtitle }) => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Icon
        style={styles.icon}
        fill={theme.colors.text.tertiary}
        size={theme.sizing.baseUnit * 1.5}
        name={icon}
      />
      <View style={styles.textContainer}>
        <H4 bold>{title}</H4>
        <H6 style={styles.h6(theme)}>{subtitle}</H6>
      </View>
    </View>
  );
};

EventInfoItem.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

const EventDetailsConnected = ({ nodeId }) => {
  const { data } = useQuery(GET_EVENT, {
    variables: { eventId: nodeId },
    fetchPolicy: 'cache-and-network',
  });
  const event = data?.node;

  return event && event.__typename === 'Event' ? (
    <Paragraph>
      {event.start ? (
        <EventInfoItem
          icon={'time'}
          title={moment(event.start).format('ddd, MMMM Do, YYYY')}
          subtitle={`${moment(event.start).format('LT')} — ${moment(
            event.end
          ).format('LT')}`}
        />
      ) : null}
      {event.location ? (
        <EventInfoItem icon={'pin'} title={event.location} />
      ) : null}
    </Paragraph>
  ) : null;
};

EventDetailsConnected.propTypes = {
  nodeId: PropTypes.string,
};

const styles = StyleSheet.create({
  container: { marginBottom: 24, flexDirection: 'row' },
  textContainer: { flexDirection: 'column' },
  icon: {
    marginRight: 8,
  },
  h6: ({ colors, sizing }) => ({
    color: colors.text.tertiary,
    fontSize: sizing.baseUnit * 0.875,
    marginTop: sizing.baseUnit / 4,
  }),
});

export default EventDetailsConnected;
