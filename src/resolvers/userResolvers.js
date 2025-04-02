const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server-express');
const { validateSignUpInput, validateLoginInput } = require('../utils/auth');
require('dotenv').config();
const User = require('../models/User');

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

module.exports = {
    Mutation: {
        async signUp(_, { signUpInput }) {
            const { name, email, password, confirmPassword } = signUpInput;
            const { valid, errors } = validateSignUpInput(name, email, password, confirmPassword);

            if (!valid) {
                throw new UserInputError('Validation Errors', { errors });
            }

            // Check if the email is already registered
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw new UserInputError('Email is already in use', { errors: { email: 'Email is already registered' } });
            }

            // Check if passwords match
            if (password !== confirmPassword) {
                throw new UserInputError('Passwords do not match', { errors: { password: 'Passwords must match' } });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 12);

            // Create a new user
            const newUser = await User.create({
                name,
                email,
                password: hashedPassword
            });

            // Generate JWT token
            const token = generateToken(newUser);

            return {
                ...newUser.dataValues,
                token
            };
        },
  
      async login(_, { email, password }) {
        // Validate input
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
  
        if (!user) {
          throw new Error('User not found');
        }
  
        // Check if password matches
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          throw new Error('Invalid email or password');
        }
  
        const token = generateToken(user);
  
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          token
        };
      },

     
    }
  };
  
  