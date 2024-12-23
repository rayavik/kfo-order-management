import React, { useState } from 'react';
import { Card, TextField, Button, InlineStack, Text, Avatar, Spinner } from '@shopify/polaris';
import { ChatIcon } from '@shopify/polaris-icons';

const MessageList = ({ messages }) => {
  return (
    <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '1rem' }}>
      {messages.length === 0 ? (
        <Text>No messages yet.</Text>
      ) : (
        messages.map((msg, index) => (
          <Card key={index}  style={{padding:"4px"}}>
            <InlineStack gap="4">
              <Avatar size="medium" name={msg.user} />
              <div>
                <Text variant="bodyMd" weight="bold">
                  {msg.user}
                </Text>
                <Text>{msg.text}</Text>
              </div>
            </InlineStack>
          </Card>
        ))
      )}
    </div>
  );
};

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <InlineStack gap="4" direction="row" blockAlign="center">
      <TextField
        label="Type a message"
        value={message}
        onChange={(value) => setMessage(value)}
        autoComplete="off"
        placeholder="Type here..."
        style={{ flex: 1 }}
      />
     <div style={{marginTop:'2%',marginLeft:'2%'}}>
     <Button icon={ChatIcon} onClick={handleSend} primary disabled={!message.trim()}>
        Send
      </Button>
     </div>
    </InlineStack>
  );
};

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = (message) => {
    setLoading(true);
    setTimeout(() => {
      setMessages([
        ...messages,
        {
          user: 'Admin',
          text: message,
        },
      ]);
      setLoading(false);
    }, 500);
  };

  return (
    <div  style={{marginTop:'2%'}}>
      <Card >
        <MessageList messages={messages} />
        {loading ? <Spinner size="small" /> : <MessageInput onSendMessage={handleSendMessage} />}
      </Card>
    </div>
  );
};

export default ChatBox;

