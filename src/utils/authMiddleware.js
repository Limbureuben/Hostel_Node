const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');
require('dotenv').config();

const authMiddleware = ({ req }) => {
  // Ensure req.body.query is defined and handle undefined gracefully
  const query = req.body?.query;  // Using optional chaining to prevent accessing undefined

  // Define public routes that don't require authentication
  const publicRoutes = ['signUp', 'login'];  // Correct mutation names

  // Check if the query contains a public route
  const isPublicRoute = query ? publicRoutes.some(route => query.includes(route)) : false;

  // If it's a public route, don't require authentication
  if (isPublicRoute) {
    return {};  // Return an empty object (no user context needed)
  }

  // For protected routes, check for the Authorization header
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
    // Verify the token
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user;  // Return the user object from the token
  } catch (err) {
    throw new AuthenticationError('Invalid or expired token');
  }
};

module.exports = authMiddleware;
