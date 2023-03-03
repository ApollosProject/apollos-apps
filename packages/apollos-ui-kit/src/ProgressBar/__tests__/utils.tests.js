import createTheme from '../../theme/createTheme';
import { progressBarHeight, createStyles, calculateWidth } from '../utils';

const theme = createTheme();

describe('ProgressBar util progressBarHeight', () => {
  it('should calculate the height of the progress bar', () => {
    const height = progressBarHeight(theme);

    expect(height).toMatchSnapshot();
  });
});

describe('ProgressBar util createStyles', () => {
  it('should create a stylesheet for the ProgressBar', () => {
    const styles = createStyles(theme);

    expect(styles).toMatchSnapshot();
  });
});

describe('ProgressBar util calculateWidth', () => {
  it('should calculate width of the progress bar', () => {
    const width = calculateWidth(50, theme);

    expect(width).toBe('50%');
  });

  it('enforces a minimum width to be the height of the progress bar', () => {
    const width = calculateWidth(0, theme);
    const height = progressBarHeight(theme);

    expect(width).toBe(height);
  });

  it('enforces a maximum width of 100%', () => {
    const width = calculateWidth(200, theme);

    expect(width).toBe('100%');
  });

  it('corrects for negative inputs', () => {
    const width = calculateWidth(-10, theme);
    const height = progressBarHeight(theme);

    expect(width).toBe(height);
  });

  it('rounds decimal inputs', () => {
    const width = calculateWidth(30.75, theme);

    expect(width).toBe(`31%`);
  });
});
