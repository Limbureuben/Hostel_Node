const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');
require('dotenv').config();

const authMiddleware = ({ req }) => {
  const query = req.body?.query;
  const publicRoutes = ['signUp', 'login'];

  const isPublicRoute = query ? publicRoutes.some(route => query.includes(route)) : false;

  if (isPublicRoute) {
    return {};
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new AuthenticationError('Authorization header must be provided');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError("Authentication token must be in the format 'Bearer [token]'");
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new AuthenticationError('Authentication token missing');
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user;
  } catch (err) {
    throw new AuthenticationError('Invalid or expired token');
  }
};

module.exports = authMiddleware;
