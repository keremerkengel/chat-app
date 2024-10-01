
const Message = require('../models/Message');

const resolvers = {
  Query: {
    messages: async () => await Message.find()
  },
  Mutation: {
    sendMessage: async (_, { text }, { pubsub }) => {
      const message = new Message({ text });
      await message.save();
      pubsub.publish('NEW_MESSAGE', { newMessage: message });
      return message;
    }
  },
  Subscription: {
    newMessage: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_MESSAGE')
    }
  }
};

module.exports = resolvers;
