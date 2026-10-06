import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Clock, MapPin, Activity, Target } from 'lucide-react';
import { api } from '../lib/api';

export default function CreateAdventure() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    activity: 'Walking',
    duration: 30,
    difficulty: 'Moderate',
    interests: []
  });

  const toggleInterest = (i) => {
    const updated = formData.interests.includes(i) 
      ? formData.interests.filter(x => x !== i)
      : [...formData.interests, i];
    setFormData({...formData, interests: updated});
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const adventure = await api.generateAdventure({
        lat: 37.7749,
        lng: -122.4194,
        activity: formData.activity,
        duration_minutes: formData.duration,
        difficulty: formData.difficulty,
        interests: formData.interests.length ? formData.interests : ["Nature"]
      });
      navigate(`/preview/${adventure.id}`);
    } catch (e) {
      alert("AI is unavailable. Please check backend connection.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="screen" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Sparkles size={48} color="var(--primary)" className="animate-pulse" style={{ marginBottom: '24px' }} />
        <h2 className="text-gradient" style={{ marginBottom: '8px' }}>Crafting your adventure...</h2>
        <p className="text-muted">Consulting open map data and local AI.</p>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="nav-bar">
        <button onClick={() => navigate('/')}><ArrowLeft size={24} color="var(--text-primary)" /></button>
        <span className="nav-title">New Adventure</span>
        <div style={{ width: 24 }}></div>
      </div>

      <div className="animate-fade-in" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        
        <div className="card glass">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            <Activity size={18} /> Activity
          </label>
          <select 
            className="input-field" 
            style={{ appearance: 'none', background: 'rgba(0,0,0,0.4)' }}
            value={formData.activity}
            onChange={e => setFormData({...formData, activity: e.target.value})}
          >
            {['Walking', 'Hiking', 'Running', 'Cycling', 'Bird watching', 'Photography'].map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div className="card glass delay-1">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            <Clock size={18} /> Time Available
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
            {[15, 30, 60, 90, 120].map(mins => (
              <button 
                key={mins}
                className="btn-secondary"
                style={{ 
                  padding: '12px 0',
                  borderRadius: '12px',
                  background: formData.duration === mins ? 'var(--primary)' : '',
                  color: formData.duration === mins ? '#000' : '',
                  borderColor: formData.duration === mins ? 'var(--primary)' : 'var(--border-color)'
                }}
                onClick={() => setFormData({...formData, duration: mins})}
              >
                {mins}
              </button>
            ))}
          </div>
        </div>

        <div className="card glass delay-2">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            <Target size={18} /> Difficulty
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {['Beginner', 'Moderate', 'Challenging'].map(diff => (
              <button 
                key={diff}
                className="btn-secondary"
                style={{ 
                  padding: '12px 0',
                  borderRadius: '12px',
                  background: formData.difficulty === diff ? 'rgba(74, 222, 128, 0.15)' : '',
                  color: formData.difficulty === diff ? 'var(--primary)' : '',
                  borderColor: formData.difficulty === diff ? 'var(--primary)' : 'var(--border-color)'
                }}
                onClick={() => setFormData({...formData, difficulty: diff})}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
        
        <div className="card glass delay-3">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            <Sparkles size={18} /> Focus & Interests
          </label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['Nature', 'Photography', 'Birds', 'Plants', 'History', 'Fitness'].map(interest => (
              <button 
                key={interest}
                className="btn-secondary"
                style={{ 
                  flex: '1 1 calc(33% - 10px)', 
                  padding: '12px 8px',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  background: formData.interests.includes(interest) ? 'rgba(74, 222, 128, 0.15)' : '',
                  borderColor: formData.interests.includes(interest) ? 'var(--primary)' : 'var(--border-color)',
                  color: formData.interests.includes(interest) ? 'var(--primary)' : ''
                }}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 24px', background: 'var(--bg-color)', borderTop: '1px solid var(--border-color)' }}>
        <button className="btn-primary" onClick={handleGenerate}>
          <Sparkles size={20} /> Generate Route
        </button>
      </div>
    </div>
  );
}
