const express = require('express');
const connectDB = require('./src/config/db');
const OrganizationRouter = require('./src/routes/Organization');
const PackagesRouter = require('./src/routes/Organization');
const UserRegistration = require('./src/routes/auth')
const UserLogin = require('./src/routes/auth');

const startServer = async () => {
  const app = express();
  app.use(express.json());

  await connectDB();

  // REST API routes
  app.use('/registerorganization', OrganizationRouter);
  app.use('/registerpackage', PackagesRouter);
  app.use('/api/auth', UserRegistration);
  app.use('/login', UserLogin);

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
  });
};

startServer();






























// const express = require('express');
// const { ApolloServer } = require('apollo-server-express');
// const typeDefs = require('./src/schema/userSchema');
// const resolvers = require('./src/resolvers/userResolvers');
// const connectDB = require('./src/config/db');
// const CustomerRouter = require('./src/routes/CustomerUser');
// const StudentRouter = require('./src/routes/Student');
// const OrganizationRouter = require('./src/routes/Organization')
// const PackagesRouter = require('./src/routes/Organization')

// const startServer = async () => {
//   const app = express();

//   app.use(express.json());

//   await connectDB();

//   app.use('/api/customer', CustomerRouter);
//   app.use('/api/registerStudent', StudentRouter );
//   app.use('/api/addorganization', OrganizationRouter);
//   app.use('/api/registerPackages', PackagesRouter);
//   app.use('/api/getOrganizations', OrganizationRouter);
//   app.use('/api/getPackages', PackagesRouter)

//   const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//   });

//   await server.start();
//   server.applyMiddleware({ app });

//   const PORT = process.env.PORT || 4000;
//   app.listen(PORT, () => {
//     console.log(`🚀 Dear Reuben Server ready at http://localhost:${PORT}${server.graphqlPath}`);
//   });
// };

// startServer();
