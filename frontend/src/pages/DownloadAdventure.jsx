import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Download, CheckCircle, WifiOff } from 'lucide-react';

export default function DownloadAdventure() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => navigate(`/offline/${id}`), 500);
          return 100;
        }
        return p + 10;
      });
    }, 150);
    return () => clearInterval(timer);
  }, [id, navigate]);

  return (
    <div className="screen" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="animate-fade-in" style={{ textAlign: 'center' }}>
        {progress < 100 ? (
          <Download size={64} color="var(--primary)" style={{ marginBottom: '24px', opacity: 0.8 }} className="animate-pulse" />
        ) : (
          <CheckCircle size={64} color="var(--primary)" style={{ marginBottom: '24px' }} />
        )}
        <h2 style={{ marginBottom: '16px' }}>{progress < 100 ? 'Packing Adventure...' : 'Ready to go!'}</h2>
        
        <div style={{ width: '80vw', maxWidth: '300px', height: '6px', background: 'var(--surface-light)', borderRadius: '10px', overflow: 'hidden', margin: '0 auto 24px' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.2s' }}></div>
        </div>

        <p className="text-muted" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <WifiOff size={16} /> Saving maps and missions for offline use.
        </p>
      </div>
    </div>
  );
}
