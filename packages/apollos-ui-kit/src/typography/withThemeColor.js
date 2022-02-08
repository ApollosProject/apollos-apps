import styled from '../styled';

const withThemeColor = styled(
  ({
    theme,
    primary,
    secondary,
    tertiary,
    quaternary,
    placeholder,
    action,
    centered,
  }) => ({
    ...(action ? { color: theme.colors.text.action } : {}),
    ...(placeholder ? { color: theme.colors.text.placeholder } : {}),
    ...(quaternary ? { color: theme.colors.text.quaternary } : {}),
    ...(tertiary ? { color: theme.colors.text.tertiary } : {}),
    ...(secondary ? { color: theme.colors.text.secondary } : {}),
    ...(primary ? { color: theme.colors.text.primary } : {}),
    ...(centered ? { textAlign: 'center' } : {}),
  })
);

export default withThemeColor;
