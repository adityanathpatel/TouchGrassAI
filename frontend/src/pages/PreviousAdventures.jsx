import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Target } from 'lucide-react';

export default function PreviousAdventures() {
  const navigate = useNavigate();
  const [adventures, setAdventures] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('touchgrass_adventures') || '[]');
    setAdventures(stored);
  }, []);

  return (
    <div className="screen">
      <div className="nav-bar">
        <button onClick={() => navigate('/')}><ArrowLeft size={24} color="var(--text-primary)" /></button>
        <span className="nav-title">My Adventures</span>
        <div style={{ width: 24 }}></div>
      </div>

      <div style={{ padding: '24px', flex: 1 }}>
        {adventures.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '40px' }} className="text-muted">
            <BookOpen size={48} opacity={0.3} style={{ margin: '0 auto 16px' }} />
            <p>You haven't completed any adventures yet.</p>
            <button className="btn-primary" style={{ marginTop: '24px' }} onClick={() => navigate('/create')}>Go Outside</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {adventures.map((adv, i) => (
              <div key={i} className="card glass" style={{ cursor: 'pointer', padding: '20px' }} onClick={() => navigate(`/journal/${adv.id}`)}>
                <h3 style={{ marginBottom: '8px', fontSize: '1.2rem' }}>{adv.title}</h3>
                <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={16} /> {adv.duration_minutes}m</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Target size={16} /> {adv.missions?.length || 0} missions</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
