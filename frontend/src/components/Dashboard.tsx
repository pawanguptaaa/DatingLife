import React, { useState, useEffect } from 'react';
import { User } from '../types/User';
import { userAPI, matchAPI } from '../services/api';

const Dashboard: React.FC = () => {
  const [potentialMatches, setPotentialMatches] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPotentialMatches();
  }, []);

  const loadPotentialMatches = async () => {
    try {
      const response = await userAPI.getPotentialMatches();
      setPotentialMatches(response.data);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    const currentUser = potentialMatches[currentIndex];
    if (!currentUser) return;

    try {
      const response = await matchAPI.likeUser(currentUser.id);
      setMessage(response.data.message);
      nextUser();
    } catch (error) {
      console.error('Error liking user:', error);
    }
  };

  const handleReject = async () => {
    const currentUser = potentialMatches[currentIndex];
    if (!currentUser) return;

    try {
      await matchAPI.rejectUser(currentUser.id);
      nextUser();
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const nextUser = () => {
    if (currentIndex < potentialMatches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      loadPotentialMatches();
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return <div className="container">Loading potential matches...</div>;
  }

  if (potentialMatches.length === 0 || currentIndex >= potentialMatches.length) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', marginTop: '100px' }}>
          <h2>No more potential matches!</h2>
          <p>Check back later for new people to connect with.</p>
          <button className="btn" onClick={loadPotentialMatches}>
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const currentUser = potentialMatches[currentIndex];

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Discover People</h1>
      
      {message && (
        <div className="alert alert-success" style={{ textAlign: 'center' }}>
          {message}
        </div>
      )}

      <div className="profile-card">
        <img
          src={currentUser.profileImageUrl || '/default-avatar.png'}
          alt={`${currentUser.firstName} ${currentUser.lastName}`}
          className="profile-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/default-avatar.png';
          }}
        />
        
        <h2>{currentUser.firstName} {currentUser.lastName}</h2>
        {currentUser.birthDate && (
          <p style={{ fontSize: '18px', color: '#666' }}>
            Age: {calculateAge(currentUser.birthDate)}
          </p>
        )}
        
        <div style={{ marginBottom: '20px' }}>
          {currentUser.jobTitle && (
            <p><strong>Job:</strong> {currentUser.jobTitle}</p>
          )}
          {currentUser.department && (
            <p><strong>Department:</strong> {currentUser.department}</p>
          )}
          {currentUser.bio && (
            <p style={{ fontStyle: 'italic', marginTop: '15px' }}>
              "{currentUser.bio}"
            </p>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button className="btn btn-danger" onClick={handleReject}>
            ❌ Pass
          </button>
          <button className="btn btn-success" onClick={handleLike}>
            ❤️ Like
          </button>
        </div>
        
        <p style={{ marginTop: '20px', color: '#666' }}>
          {currentIndex + 1} of {potentialMatches.length}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;