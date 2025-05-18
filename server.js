const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./src/schema/userSchema');
const resolvers = require('./src/resolvers/userResolvers');
const connectDB = require('./src/config/db');
const CustomerRouter = require('./src/routes/CustomerUser');
const StudentRouter = require('./src/routes/Student');

const startServer = async () => {
  const app = express();

  app.use(express.json());

  await connectDB();

  app.use('/api/customer', CustomerRouter);


  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Dear Reuben Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer();
