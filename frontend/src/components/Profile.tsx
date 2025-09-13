import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { User, Gender } from '../types/User';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio || '',
        department: user.department || '',
        jobTitle: user.jobTitle || '',
        profileImageUrl: user.profileImageUrl || '',
        interestedInGenders: user.interestedInGenders || [],
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await userAPI.updateProfile(formData);
      setMessage('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderInterestChange = (gender: Gender) => {
    setFormData(prev => ({
      ...prev,
      interestedInGenders: prev.interestedInGenders?.includes(gender)
        ? prev.interestedInGenders.filter(g => g !== gender)
        : [...(prev.interestedInGenders || []), gender]
    }));
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

  if (!user) return null;

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>My Profile</h1>
      
      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        {!editing ? (
          <div className="profile-view">
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <img
                src={user.profileImageUrl || '/default-avatar.png'}
                alt={`${user.firstName} ${user.lastName}`}
                className="profile-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-avatar.png';
                }}
              />
              <h2>{user.firstName} {user.lastName}</h2>
              <p style={{ color: '#666' }}>@{user.username}</p>
              {user.birthDate && (
                <p style={{ fontSize: '18px', color: '#666' }}>
                  Age: {calculateAge(user.birthDate)}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p><strong>Email:</strong> {user.email}</p>
              {user.jobTitle && <p><strong>Job Title:</strong> {user.jobTitle}</p>}
              {user.department && <p><strong>Department:</strong> {user.department}</p>}
              <p><strong>Gender:</strong> {user.gender}</p>
              <p><strong>Interested in:</strong> {user.interestedInGenders.join(', ')}</p>
              {user.bio && (
                <div>
                  <strong>Bio:</strong>
                  <p style={{ fontStyle: 'italic', marginTop: '5px' }}>"{user.bio}"</p>
                </div>
              )}
            </div>

            <button className="btn" onClick={() => setEditing(true)} style={{ width: '100%' }}>
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="form-control"
                value={formData.firstName || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="form-control"
                value={formData.lastName || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="jobTitle">Job Title:</label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                className="form-control"
                value={formData.jobTitle || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department:</label>
              <input
                type="text"
                id="department"
                name="department"
                className="form-control"
                value={formData.department || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="profileImageUrl">Profile Image URL:</label>
              <input
                type="url"
                id="profileImageUrl"
                name="profileImageUrl"
                className="form-control"
                value={formData.profileImageUrl || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio:</label>
              <textarea
                id="bio"
                name="bio"
                className="form-control"
                value={formData.bio || ''}
                onChange={handleChange}
                rows={3}
                maxLength={500}
              />
            </div>

            <div className="form-group">
              <label>Interested in:</label>
              {Object.values(Gender).map(gender => (
                <div key={gender} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                  <input
                    type="checkbox"
                    id={`interest-${gender}`}
                    checked={formData.interestedInGenders?.includes(gender) || false}
                    onChange={() => handleGenderInterestChange(gender)}
                  />
                  <label htmlFor={`interest-${gender}`}>{gender}</label>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn" disabled={loading} style={{ flex: 1 }}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button" 
                className="btn" 
                onClick={() => setEditing(false)}
                style={{ flex: 1, backgroundColor: '#6c757d' }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;