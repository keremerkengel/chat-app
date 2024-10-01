
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const { RedisPubSub } = require('graphql-redis-subscriptions');
const Redis = require('ioredis');
const typeDefs = require('./schemas/typeDefs');
const resolvers = require('./resolvers');

const pubsub = new RedisPubSub({
  publisher: new Redis(),
  subscriber: new Redis()
});

mongoose.connect('mongodb://localhost:27017/chatApp', { useNewUrlParser: true, useUnifiedTopology: true });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ pubsub }),
  subscriptions: {
    onConnect: () => console.log('Connected to websocket')
  }
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});
