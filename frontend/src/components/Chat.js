
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useSubscription, gql } from '@apollo/client';

const MESSAGES_QUERY = gql`
  query GetMessages {
    messages {
      id
      text
      createdAt
    }
  }
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($text: String!) {
    sendMessage(text: $text) {
      id
      text
      createdAt
    }
  }
`;

const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription OnNewMessage {
    newMessage {
      id
      text
      createdAt
    }
  }
`;

const Chat = () => {
  const [message, setMessage] = useState('');
  const { loading, error, data } = useQuery(MESSAGES_QUERY);
  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION);
  const { data: subscriptionData } = useSubscription(NEW_MESSAGE_SUBSCRIPTION);

  useEffect(() => {
    if (subscriptionData) {
      data.messages.push(subscriptionData.newMessage);
    }
  }, [subscriptionData, data]);

  const handleSendMessage = () => {
    sendMessage({ variables: { text: message } });
    setMessage('');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div>
        {data.messages.map((msg) => (
          <p key={msg.id}>
            {msg.text} - {new Date(parseInt(msg.createdAt)).toLocaleTimeString()}
          </p>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter a message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;
