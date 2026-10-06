import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Book, Settings, TreePine } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        
        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ 
            width: 96, height: 96, borderRadius: '50%', background: 'rgba(74, 222, 128, 0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
            border: '1px solid rgba(74, 222, 128, 0.2)'
          }}>
            <TreePine size={48} color="var(--primary)" />
          </div>
          <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '8px' }}>TouchGrass AI</h1>
          <p className="text-muted" style={{ fontSize: '1.2rem', fontWeight: 500 }}>Plan less. Explore more.</p>
        </div>

        <div className="animate-fade-in delay-1" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', fontWeight: 600 }}>Ready to touch grass?</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button className="btn-primary" onClick={() => navigate('/create')}>
              <Compass size={24} /> Create Adventure
            </button>
            <button className="btn-secondary" onClick={() => navigate('/previous')}>
              <Book size={20} /> Previous Adventures
            </button>
          </div>
        </div>

      </div>

      <div className="animate-fade-in delay-2" style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
        <button className="btn-icon" onClick={() => navigate('/settings')}>
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
}
