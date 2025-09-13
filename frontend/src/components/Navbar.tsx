import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="container">
        <h1 onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          DatingLife
        </h1>
        <div className="nav-links">
          <a href="/dashboard">Discover</a>
          <a href="/matches">My Matches</a>
          <a href="/messages">Messages</a>
          <a href="/profile">Profile</a>
          <button 
            className="btn" 
            onClick={handleLogout}
            style={{ background: 'none', border: '1px solid white', padding: '5px 15px' }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;