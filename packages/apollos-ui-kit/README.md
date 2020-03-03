# Apollos UI: Kit

This readme is a work in progress.

We believe that well written code with good test coverage should be self documenting. We recommend you check out the components your interested in. Look over their tests and stories!

---

# Styling components in Apollos

Apollos follows a custom `StyledComponents` paradigm. Below you will find examples to compare how you might style something in a typical React Native project and in an Apollos based project.

## Typical React Native style syntax ⚠️ (not used in Apollos)

```const stylesheet = createStylesheet({
  H1: {
    color: 'salmon',
    textDecoration: 'solid',
  },
  BoldH1: {
    fontWeight: 'bold',
  }
});

const YourComponent = () => (
  <H1 style={stylesheet.H1}>
    Hello <Text style={stylesheet.BoldH1}>World</Text>
  </H1>
);
```

#### Typical React Native Conditional Styling

```
const stylesheet = createStylesheet({
  Button: {
    color: 'cyan',
  }
  isTapped: {
    color: 'salmon'
  }
});

const YourComponent = () => (
  <Button style={[stylesheet.Button, isTapped ? stylesheet.isTapped : {}]}>
    Hello World
  </Button>
);
```

## ✨Apollos StyledComponents✨

#### Basic usage

```
const StyledH1 = styled({
  color: 'salmon',
  textDecoration: 'solid',
})(H1);

const Bold = styled({
  fontWeight: 'bold',
})(Text);

const YourComponent = () => (
    <>
      <StyledH1>Hello <Bold>World</Bold></H1>
      <StyledH1>Goodnight World</H1>
    </>
);
```

#### Theme Access

```
const StyledH1 = styled(({ theme }) => ({
  color: theme.colors.salmon,
}))(H1);

const YourComponent = () => (
    <StyledH1>Hello World</H1>
);
```

#### Conditional Styling/Prop Access

```
const TappableButton = styled(({ theme, isTapped }) => ({
  color: isTapped : theme.colors.salmon ? theme.colors.cyan,
}))(Button);

const YourComponent = () => (
  <TappableButton isTapped>Hello World</TappableButton>
);
```

#### Style Overrides

```
const StyledH1 = styled(({ theme }) => ({
  color: theme.colors.salmon,
}), 'StyledH1')(H1);

const YourComponent = () => (
  <StyledH1>Hello World</H1>
);

// In theme file 👇
overrides: {
  StyledH1: {
    color: 'blue',
  }
};
```
