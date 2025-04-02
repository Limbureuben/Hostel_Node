const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Book {
    id: ID!
    name: String!
    email: String!
    phonenumber: String!
    gender: String!
    residence: String!
  }

  input BookInput {
    name: String!
    email: String!
    phonenumber: String!
    gender: String!
    residence: String!
  }

  
`