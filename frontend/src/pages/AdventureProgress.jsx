import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Target, MapPin, Camera } from 'lucide-react';
import { api } from '../lib/api';

export default function AdventureProgress() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [adventure, setAdventure] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('touchgrass_adventures') || '[]');
    const adv = stored.find(a => a.id === id);
    if (adv) setAdventure(adv);
  }, [id]);

  if (!adventure) return <div className="screen">Not found locally.</div>;

  return (
    <div className="screen">
      <div className="nav-bar">
        <button onClick={() => navigate(`/outdoor/${id}`)}><ArrowLeft size={24} color="var(--text-primary)" /></button>
        <span className="nav-title">Progress</span>
        <div style={{ width: 24 }}></div>
      </div>

      <div className="animate-fade-in" style={{ padding: '24px', flex: 1 }}>
        <h2 style={{ marginBottom: '24px' }}>{adventure.title}</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          <div className="card glass" style={{ textAlign: 'center', padding: '20px 16px' }}>
            <MapPin size={24} color="var(--primary)" style={{ margin: '0 auto 8px' }} />
            <strong style={{ fontSize: '1.5rem', display: 'block' }}>1.2</strong>
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>km walked</span>
          </div>
          <div className="card glass" style={{ textAlign: 'center', padding: '20px 16px' }}>
            <Camera size={24} color="var(--primary)" style={{ margin: '0 auto 8px' }} />
            <strong style={{ fontSize: '1.5rem', display: 'block' }}>3</strong>
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>observations</span>
          </div>
        </div>

        <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={20} color="var(--primary)" /> Missions (1/2)
        </h3>
        <div className="card glass" style={{ padding: '0' }}>
          {adventure.missions?.map((m, i) => (
            <div key={i} style={{ padding: '16px', borderBottom: i < adventure.missions.length - 1 ? '1px solid var(--border-color)' : 'none', opacity: i === 0 ? 0.5 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${i === 0 ? 'var(--primary)' : 'var(--text-secondary)'}`, background: i === 0 ? 'var(--primary)' : 'transparent' }}></div>
                <span style={{ textDecoration: i === 0 ? 'line-through' : 'none' }}>{m.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
