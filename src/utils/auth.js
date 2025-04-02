const validator = require('validator');

const validateSignUpInput = (name, email, password, Confirmpassword) => {
  const errors = {};

  if (validator.isEmpty(name)) {
    errors.name = 'Name must not be empty';
  }

  if (!validator.isEmail(email)) {
    errors.email = 'Email must be a valid email address';
  }

  if (validator.isEmpty(password)) {
    errors.password = 'Password must not be empty';
  } else if (!validator.isLength(password, { min: 6 })) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (password !== Confirmpassword) {
    errors.Confirmpassword = 'Passwords must match';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};

const validateLoginInput = (email, password) => {
  const errors = {};

  if (!validator.isEmail(email)) {
    errors.email = 'Email must be a valid email address';
  }

  if (validator.isEmpty(password)) {
    errors.password = 'Password must not be empty';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};

module.exports = { validateSignUpInput, validateLoginInput };
