import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Activity, MapPin, Save } from 'lucide-react';

export default function Preferences() {
  const navigate = useNavigate();
  const [data, setData] = useState({ name: '', activities: [], fitness: 'moderate' });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('touchgrass_user') || '{"name":"","activities":[]}');
    setData(user);
  }, []);

  const save = () => {
    localStorage.setItem('touchgrass_user', JSON.stringify(data));
    navigate('/settings');
  };

  return (
    <div className="screen">
      <div className="nav-bar">
        <button onClick={() => navigate('/settings')}><ArrowLeft size={24} color="var(--text-primary)" /></button>
        <span className="nav-title">My Preferences</span>
        <div style={{ width: 24 }}></div>
      </div>
      
      <div className="animate-fade-in" style={{ padding: '24px', flex: 1 }}>
        <div className="card glass">
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Nickname</label>
          <div style={{ position: 'relative' }}>
            <User size={20} style={{ position: 'absolute', top: '16px', left: '16px', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="input-field" 
              style={{ paddingLeft: '48px' }} 
              value={data.name}
              onChange={e => setData({...data, name: e.target.value})}
            />
          </div>
        </div>

        <div className="card glass delay-1">
          <label style={{ display: 'block', marginBottom: '16px', color: 'var(--text-secondary)' }}>Preferred Activities</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {['Walking', 'Hiking', 'Running', 'Cycling', 'Photography', 'Nature'].map(act => (
              <button 
                key={act}
                className="btn-secondary"
                style={{ 
                  background: data.activities.includes(act) ? 'rgba(74, 222, 128, 0.15)' : '',
                  borderColor: data.activities.includes(act) ? 'var(--primary)' : 'var(--border-color)',
                  color: data.activities.includes(act) ? 'var(--primary)' : ''
                }}
                onClick={() => {
                  const acts = data.activities.includes(act) 
                    ? data.activities.filter(a => a !== act)
                    : [...data.activities, act];
                  setData({...data, activities: acts});
                }}
              >
                {act}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        <button className="btn-primary" onClick={save}>
          <Save size={20} /> Save Preferences
        </button>
      </div>
    </div>
  );
}
