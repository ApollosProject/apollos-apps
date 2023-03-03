import { StyleSheet } from 'react-native';

export const HeaderComponentStyles = StyleSheet.create({
  container: (theme) => ({
    paddingBottom: theme.sizing.baseUnit * 0.75,
    marginBottom: theme.sizing.baseUnit,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.text.quaternary,
  }),
  title: (theme) => ({
    fontSize: theme.helpers.rem(0.875),
    lineHeight: theme.helpers.verticalRhythm(0.875),
    fontFamily: theme.typography.sans.medium.default,
    color: theme.colors.text.primary,
    paddingHorizontal: theme.sizing.baseUnit,
  }),
});

export const ListStyles = StyleSheet.create({
  container: (theme) => ({
    paddingVertical: theme.sizing.baseUnit,
  }),
});

export const ListItemStyles = StyleSheet.create({
  container: (theme) => ({
    flex: 1,
    paddingHorizontal: theme.sizing.baseUnit,
    paddingVertical: theme.sizing.baseUnit * 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  }),
  avatar: (theme) => ({
    marginRight: theme.sizing.baseUnit,
  }),
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  button: (theme) => ({
    paddingHorizontal: theme.sizing.baseUnit * 0.65,
    height: theme.sizing.baseUnit * 1.75,
    borderRadius: theme.sizing.baseUnit * 0.5,
    marginLeft: theme.sizing.baseUnit * 0.5,
  }),
  content: (theme, hideBorder) => ({
    flex: 1,
    height: '102%', // hack to get the bottom border to appear outside of the frame
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: hideBorder ? 0 : StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.text.quaternary,
    marginLeft: theme.sizing.baseUnit * 0.5,
  }),
  accessoryLabel: (theme) => ({
    color: theme.colors.secondary,
    opacity: 0.5,
  }),
});
