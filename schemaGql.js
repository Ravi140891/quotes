import { gql } from "apollo-server";
const typeDefs = gql`
  type Query {
    users: [User]
    user(_id: ID!): User
    quotes: [Quote]
    quote(by: ID!): [Quote]
  }

  type User {
    _id: ID!
    name: String
    email: String
    password: String
    quotes: [Quote]
  }

  type Quote {
    name: String
    by: ID
  }
  type Token {
    token: String
  }
  type Mutation {
    signUpUser(userInput: InputForm!): User
    signInUser(userLogin: LoginForm!): Token
  }

  input InputForm {
    name: String!
    email: String!
    password: String!
  }
  input LoginForm {
    email: String!
    password: String!
  }
`;

export default typeDefs;
