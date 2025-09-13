import React, { useState, useEffect } from 'react';
import { Match } from '../types/User';
import { matchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Messages: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const response = await matchAPI.getMyMatches();
      setMatches(response.data);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOtherUser = (match: Match) => {
    return match.user1.id === user?.id ? match.user2 : match.user1;
  };

  const handleOpenConversation = (userId: number) => {
    navigate(`/messages/${userId}`);
  };

  if (loading) {
    return <div className="container">Loading conversations...</div>;
  }

  if (matches.length === 0) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', marginTop: '100px' }}>
          <h2>No conversations yet!</h2>
          <p>Start matching with people to begin conversations.</p>
          <button className="btn" onClick={() => navigate('/dashboard')}>
            Find Matches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Messages</h1>
      
      <div className="card">
        {matches.map((match) => {
          const otherUser = getOtherUser(match);
          return (
            <div 
              key={match.id} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '15px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onClick={() => handleOpenConversation(otherUser.id)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <img
                src={otherUser.profileImageUrl || '/default-avatar.png'}
                alt={`${otherUser.firstName} ${otherUser.lastName}`}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginRight: '15px'
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-avatar.png';
                }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 5px 0' }}>
                  {otherUser.firstName} {otherUser.lastName}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                  {otherUser.jobTitle && `${otherUser.jobTitle}`}
                  {otherUser.department && ` • ${otherUser.department}`}
                </p>
                <p style={{ margin: '5px 0 0 0', color: '#999', fontSize: '12px' }}>
                  Matched on {new Date(match.matchedAt || match.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div style={{ color: '#007bff', fontSize: '20px' }}>
                →
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;