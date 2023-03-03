export const Formik = ({ children, initialValues }) =>
  children({
    setFieldValue: () => null,
    handleSubmit: () => null,
    values: initialValues,
    isSubmitting: false,
    isValid: true,
    touched: {},
    errors: {},
  });
