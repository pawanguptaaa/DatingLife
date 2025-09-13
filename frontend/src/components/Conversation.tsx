import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Message, User } from '../types/User';
import { messageAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Conversation: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userId) {
      loadConversation();
      // Poll for new messages every 5 seconds
      const interval = setInterval(loadConversation, 5000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversation = async () => {
    if (!userId) return;

    try {
      const response = await messageAPI.getConversation(parseInt(userId));
      setMessages(response.data);
      
      // Get other user info from first message if available
      if (response.data.length > 0) {
        const firstMessage = response.data[0];
        const otherUserId = firstMessage.sender.id === user?.id 
          ? firstMessage.recipient 
          : firstMessage.sender;
        setOtherUser(otherUserId);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId || sending) return;

    setSending(true);
    try {
      const response = await messageAPI.sendMessage(parseInt(userId), newMessage.trim());
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
      
      // Set other user info if this is the first message
      if (!otherUser) {
        setOtherUser(response.data.recipient);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please make sure you are matched with this user.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="container">Loading conversation...</div>;
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button className="btn" onClick={() => navigate('/messages')}>
          ← Back to Messages
        </button>
        {otherUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={otherUser.profileImageUrl || '/default-avatar.png'}
              alt={`${otherUser.firstName} ${otherUser.lastName}`}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-avatar.png';
              }}
            />
            <div>
              <h2 style={{ margin: 0 }}>
                {otherUser.firstName} {otherUser.lastName}
              </h2>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                {otherUser.jobTitle && `${otherUser.jobTitle}`}
                {otherUser.department && ` • ${otherUser.department}`}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender.id === user?.id ? 'sent' : 'received'}`}
            >
              <p style={{ margin: '0 0 5px 0' }}>{message.content}</p>
              <small style={{ opacity: 0.7, fontSize: '11px' }}>
                {new Date(message.sentAt).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </small>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          className="message-input"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={sending}
        />
        <button type="submit" className="btn" disabled={sending || !newMessage.trim()}>
          {sending ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Conversation;