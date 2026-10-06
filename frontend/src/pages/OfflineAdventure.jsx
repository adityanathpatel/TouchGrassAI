import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle, Smartphone } from 'lucide-react';

export default function OfflineAdventure() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [adventure, setAdventure] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('touchgrass_adventures') || '[]');
    const adv = stored.find(a => a.id === id);
    if (adv) setAdventure(adv);
  }, [id]);

  if (!adventure) return <div className="screen" style={{ justifyContent: 'center', alignItems: 'center' }}>Not found locally.</div>;

  return (
    <div className="screen">
      <div className="nav-bar" style={{ border: 'none', background: 'transparent' }}>
        <button onClick={() => navigate('/')} className="glass" style={{ padding: 12, borderRadius: '50%' }}><ArrowLeft size={24} color="var(--text-primary)" /></button>
        <span className="nav-title">Ready</span>
        <div style={{ width: 48 }}></div>
      </div>

      <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
        
        <div style={{ position: 'relative', width: 120, height: 120, marginBottom: '32px' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(74, 222, 128, 0.1)', animation: 'pulse 2s infinite' }}></div>
          <div style={{ position: 'absolute', inset: '10px', borderRadius: '50%', background: 'rgba(74, 222, 128, 0.2)' }}></div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Smartphone size={48} color="var(--primary)" />
            <CheckCircle size={24} color="var(--bg-color)" fill="var(--primary)" style={{ position: 'absolute', bottom: 24, right: 24 }} />
          </div>
        </div>

        <h1 style={{ marginBottom: '16px', fontSize: '2.5rem', lineHeight: 1.1 }}>Adventure Downloaded</h1>
        
        <p className="text-muted" style={{ fontSize: '1.1rem', maxWidth: '85%', lineHeight: 1.6 }}>
          You can safely go offline now. The map, route, and your personalized missions are stored locally on your device.
        </p>
      </div>

      <div style={{ padding: '24px', background: 'var(--bg-color)', borderTop: '1px solid var(--border-color)' }}>
        <button className="btn-primary" onClick={() => navigate(`/outdoor/${id}`)}>
          <Play size={24} fill="#000" /> Start Adventure
        </button>
      </div>
    </div>
  );
}
