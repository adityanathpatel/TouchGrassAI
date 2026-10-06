import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, MapPin, StopCircle, ArrowUpRight } from 'lucide-react';

export default function OutdoorMode() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [adventure, setAdventure] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('touchgrass_adventures') || '[]');
    const adv = stored.find(a => a.id === id);
    if (adv) setAdventure(adv);
  }, [id]);

  if (!adventure) return <div className="screen" style={{ background: '#000' }}>Not found.</div>;

  const currentMission = adventure.missions?.[0] || { title: "Explore the area", description: "" };

  return (
    <div className="screen" style={{ background: '#000', color: '#fff' }}>
      
      {/* Absolute Minimalism - Just pure info */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px', justifyContent: 'space-between' }}>
        
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
            <div>
              <span className="text-muted" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Mission</span>
              <h1 style={{ fontSize: '2.5rem', lineHeight: 1.1, marginTop: '8px' }}>{currentMission.title}</h1>
            </div>
            <button onClick={() => navigate(`/progress/${id}`)} className="glass" style={{ padding: '12px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none' }}>
              <ArrowUpRight size={24} color="#fff" />
            </button>
          </div>

          <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '90%' }}>
            {currentMission.description}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <span style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1 }}>0.5</span>
            <span className="text-muted" style={{ fontSize: '1.2rem', marginLeft: '8px' }}>/ {adventure.distance_km.toFixed(1)} km</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '2rem', fontWeight: '800', lineHeight: 1 }}>12</span>
            <span className="text-muted" style={{ fontSize: '1.2rem', display: 'block' }}>min</span>
          </div>
        </div>

      </div>

      <div style={{ padding: '24px', display: 'flex', gap: '16px', background: 'linear-gradient(to top, rgba(0,0,0,1) 50%, transparent)' }}>
        <button 
          className="btn-secondary" 
          style={{ flex: 1, background: '#1c1c1e', border: 'none', padding: '24px 0', borderRadius: '24px' }} 
          onClick={() => navigate(`/observation/${id}`)}
        >
          <Camera size={28} style={{ margin: '0 auto 8px', color: '#fff' }} />
          <span style={{ color: '#8e8e93', fontSize: '0.9rem' }}>Observe</span>
        </button>
        
        <button 
          className="btn-secondary" 
          style={{ flex: 1, background: '#1c1c1e', border: 'none', padding: '24px 0', borderRadius: '24px' }} 
          onClick={() => navigate(`/route-map/${id}`)}
        >
          <MapPin size={28} style={{ margin: '0 auto 8px', color: '#fff' }} />
          <span style={{ color: '#8e8e93', fontSize: '0.9rem' }}>Map</span>
        </button>
      </div>

      <div style={{ padding: '0 24px 32px' }}>
        <button 
          className="btn-primary" 
          onClick={() => navigate(`/finish/${id}`)} 
          style={{ background: '#fff', color: '#000', boxShadow: 'none' }}
        >
          <StopCircle size={20} /> Finish Adventure
        </button>
      </div>

    </div>
  );
}
