import withTheme from './withTheme';

const ThemeConsumer = withTheme()(({ children, theme }) => children(theme));

export default ThemeConsumer;
