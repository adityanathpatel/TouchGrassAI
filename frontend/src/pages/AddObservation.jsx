import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, Mic, MapPin, Check } from 'lucide-react';

export default function AddObservation() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('Nature');

  const saveObservation = () => {
    // Mock save
    alert('Observation saved locally!');
    navigate(`/outdoor/${id}`);
  };

  return (
    <div className="screen">
      <div className="nav-bar">
        <button onClick={() => navigate(-1)}><ArrowLeft size={24} color="var(--text-primary)" /></button>
        <span className="nav-title">Observe</span>
        <div style={{ width: 24 }}></div>
      </div>

      <div className="animate-fade-in" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn-secondary" style={{ flex: 1, padding: '32px 0', borderStyle: 'dashed' }} onClick={() => navigate(`/camera/${id}`)}>
            <Camera size={32} color="var(--text-secondary)" style={{ margin: '0 auto 12px' }} />
            <span style={{ fontSize: '0.9rem' }}>Add Photo</span>
          </button>
        </div>

        <div className="card glass" style={{ padding: '16px' }}>
          <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-secondary)' }}>Category</label>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
            {['Nature', 'Bird', 'Plant', 'Weather', 'Object'].map(cat => (
              <button 
                key={cat}
                className="btn-secondary"
                style={{ 
                  padding: '8px 16px', flexShrink: 0,
                  background: category === cat ? 'rgba(74, 222, 128, 0.15)' : '',
                  borderColor: category === cat ? 'var(--primary)' : 'var(--border-color)',
                  color: category === cat ? 'var(--primary)' : ''
                }}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="card glass" style={{ padding: '0', overflow: 'hidden' }}>
          <textarea 
            className="input-field" 
            style={{ border: 'none', height: '120px', resize: 'none', background: 'transparent' }} 
            placeholder="Describe what you see..."
            value={note}
            onChange={e => setNote(e.target.value)}
          />
          <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mic size={18} /> <span style={{ fontSize: '0.9rem' }}>Voice Note</span>
            </button>
            <span className="text-muted" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12}/> Tagged</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        <button className="btn-primary" onClick={saveObservation}>
          <Check size={20} /> Save Observation
        </button>
      </div>
    </div>
  );
}
