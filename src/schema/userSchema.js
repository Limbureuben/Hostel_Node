const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    token: String!
  }

  input SignUpInput {
    name: String!
    email: String!
    password: String!
    confirmPassword: String!
  }

  type Query {
    _empty: String
  }

  type Mutation {
    signUp(signUpInput: SignUpInput): User!
    login(email: String!, password: String!): User!
  }
`;

module.exports = typeDefs;
