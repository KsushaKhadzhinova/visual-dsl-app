export const isEmpty = (value) => {
  return !value || value.trim() === '';
};

export const validateRequired = (value, fieldName = 'Поле') => {
  if (isEmpty(value)) {
    return `${fieldName} не может быть пустым`;
  }
  return '';
};

export const validateMaxLength = (value, maxLength, fieldName = 'Поле') => {
  if (value.length > maxLength) {
    return `${fieldName} не может быть больше ${maxLength} символов`;
  }
  return '';
};

export const validateMinLength = (value, minLength, fieldName = 'Поле') => {
  if (value.trim().length < minLength) {
    return `${fieldName} должно содержать минимум ${minLength} символов`;
  }
  return '';
};

export const validateField = (value, options = {}) => {
  const {
    required = false,
    maxLength = 100,
    minLength = 0,
    fieldName = 'Поле',
    pattern = null,
    customValidator = null
  } = options;

  if (required && isEmpty(value)) {
    return `${fieldName} обязательно`;
  }

  if (value && value.length > maxLength) {
    return `${fieldName} не может быть больше ${maxLength} символов`;
  }

  if (value && value.trim().length < minLength) {
    return `${fieldName} должно содержать минимум ${minLength} символов`;
  }

  if (pattern && value && !pattern.test(value)) {
    return `${fieldName} содержит недопустимые символы`;
  }

  if (customValidator) {
    return customValidator(value);
  }

  return '';
};

export const validateForm = (formData, validationRules) => {
  const errors = {};

  Object.keys(validationRules).forEach((fieldName) => {
    const error = validateField(formData[fieldName], validationRules[fieldName]);
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
};

export const hasErrors = (errors) => {
  return Object.values(errors).some((error) => error !== '');
};