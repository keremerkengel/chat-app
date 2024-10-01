
const { gql } = require('apollo-server');

const typeDefs = gql`
  type Message {
    id: ID!
    text: String!
    createdAt: String!
  }

  type Query {
    messages: [Message!]!
  }

  type Mutation {
    sendMessage(text: String!): Message!
  }

  type Subscription {
    newMessage: Message!
  }
`;

module.exports = typeDefs;
