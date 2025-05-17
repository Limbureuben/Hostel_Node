const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server-express');
const { validateSignUpInput, validateLoginInput } = require('../utils/auth');
const User = require('../models/User');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

module.exports ={
  Mutation: {
    async signUp(_, { signUpInput }) {
      const { name, email, password, confirmPassword } = signUpInput;

      const { valid, errors } = ValidateSignUpIniput( name, email, password, confirmPassword );

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const UserExisting  = await User.findOne({ email });
      if (UserExisting) {
        throw new UserInputError('Email alredy is use', { erors: { email: 'Email is already registered'}});
      }

      if (password !== confirmPassword) {
        throw new UserInputError('Password do not match',{ errors: { confirmPassword: 'Password do bot match'}});
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        name,
        email,
        password: hashedPassword
      });
    },

    async login(_, { LoginInput }) {
      const { email, password } = LoginInput;

      const { valid, errors } = validateLoginInput(email, password);

      if (!valid) {
        throw new UserInputError('Erors', { errors });
      }

      if (!user) {
        throw new UserIbputError('User not found', { errors: { email: 'User not found'}});
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new UserInputError('Wrong credentials', { errors: { password: 'Wrong credentials'}});
      }

      const token = generateToken(user);

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        token
      };
    },
  }
};