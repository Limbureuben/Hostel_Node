const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import PostgreSQL connection
const pool = require('./database');  // Import PostgreSQL pool from your 'database.js'

// Import GraphQL schema and resolvers
const resolvers = require('./src/resolvers/userResolvers');
const typeDefs = require('./src/schema/userSchema'); // Ensure it's a JS module or properly loaded

const authMiddleware = require('./src/utils/authMiddleware');

const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());  // To handle JSON requests

// Test PostgreSQL connection (optional, for debugging)
pool.connect()
  .then(() => console.log('PostgreSQL connected successfully'))
  .catch(err => console.error('PostgreSQL connection error:', err));

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => authMiddleware({ req }) // Pass auth context
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
