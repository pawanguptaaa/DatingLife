import React, { useState, useEffect } from 'react';
import { Match } from '../types/User';
import { matchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Matches: React.FC = () => {
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

  const handleMessageUser = (userId: number) => {
    navigate(`/messages/${userId}`);
  };

  if (loading) {
    return <div className="container">Loading your matches...</div>;
  }

  if (matches.length === 0) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', marginTop: '100px' }}>
          <h2>No matches yet!</h2>
          <p>Keep swiping to find your perfect match.</p>
          <button className="btn" onClick={() => navigate('/dashboard')}>
            Start Discovering
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>My Matches</h1>
      
      <div className="matches-grid">
        {matches.map((match) => {
          const otherUser = getOtherUser(match);
          return (
            <div key={match.id} className="match-card">
              <img
                src={otherUser.profileImageUrl || '/default-avatar.png'}
                alt={`${otherUser.firstName} ${otherUser.lastName}`}
                className="match-avatar"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-avatar.png';
                }}
              />
              <h3>{otherUser.firstName} {otherUser.lastName}</h3>
              {otherUser.jobTitle && <p>{otherUser.jobTitle}</p>}
              {otherUser.department && <p>{otherUser.department}</p>}
              <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                Matched on {new Date(match.matchedAt || match.createdAt).toLocaleDateString()}
              </p>
              <button 
                className="btn"
                onClick={() => handleMessageUser(otherUser.id)}
                style={{ marginTop: '15px', width: '100%' }}
              >
                💬 Send Message
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Matches;