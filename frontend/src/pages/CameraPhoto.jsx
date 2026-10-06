import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, Zap, RefreshCw, Check } from 'lucide-react';

export default function CameraPhoto() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [captured, setCaptured] = useState(false);

  const capture = () => {
    setCaptured(true);
  };

  const keep = () => {
    navigate(`/observation/${id}`);
  };

  return (
    <div className="screen" style={{ background: '#000', padding: 0 }}>
      <div className="nav-bar" style={{ background: 'transparent', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <button onClick={() => navigate(-1)}><ArrowLeft size={24} color="#fff" /></button>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button><Zap size={24} color="#fff" /></button>
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {!captured ? (
          <div style={{ position: 'absolute', inset: 0, background: '#161b22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b949e' }}>
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <Camera size={48} opacity={0.5} />
              Camera Viewfinder Mock
            </span>
          </div>
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '80%', height: '60%', background: '#334155', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="text-muted">Captured Photo Mock</span>
            </div>
            {/* AI Mock Identification */}
            <div className="glass animate-fade-in" style={{ position: 'absolute', bottom: '100px', left: '24px', right: '24px', padding: '16px', borderRadius: '16px', borderLeft: '4px solid var(--primary)' }}>
              <strong style={{ display: 'block', color: 'var(--primary)' }}>Possible: Holy Basil (78%)</strong>
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>AI identification can be incorrect.</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ height: '120px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 24px' }}>
        {!captured ? (
          <>
            <div style={{ width: 48 }}></div>
            <button onClick={capture} style={{ width: 72, height: 72, borderRadius: '50%', background: '#fff', border: '4px solid #ccc' }}></button>
            <div style={{ width: 48 }}></div>
          </>
        ) : (
          <>
            <button className="btn-secondary" style={{ width: 'auto', padding: '16px 32px' }} onClick={() => setCaptured(false)}>
              <RefreshCw size={20} /> Retake
            </button>
            <button className="btn-primary" style={{ width: 'auto', padding: '16px 32px' }} onClick={keep}>
              <Check size={20} /> Keep
            </button>
          </>
        )}
      </div>
    </div>
  );
}
