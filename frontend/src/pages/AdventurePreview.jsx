import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Map as MapIcon, Download, Clock, Zap, Target, ShieldAlert, CheckSquare } from 'lucide-react';
import { api } from '../lib/api';

export default function AdventurePreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  
  const [adventure, setAdventure] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      api.getAdventure(id)
        .then(data => {
          setAdventure(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  const handleDownload = () => {
    const stored = JSON.parse(localStorage.getItem('touchgrass_adventures') || '[]');
    if (!stored.find(a => a.id === adventure.id)) {
      stored.push(adventure);
      localStorage.setItem('touchgrass_adventures', JSON.stringify(stored));
    }
    navigate(`/download/${adventure.id}`);
  };

  if (loading) return <div className="screen" style={{ justifyContent: 'center', alignItems: 'center' }}><span className="animate-pulse">Consulting Maps...</span></div>;
  if (!adventure) return <div className="screen" style={{ justifyContent: 'center', alignItems: 'center' }}>Adventure not found.</div>;

  return (
    <div className="screen" style={{ padding: 0 }}>
      {/* Route Preview Map Placeholder */}
      <div className="map-placeholder" style={{ height: '220px', position: 'relative' }} onClick={() => navigate(`/route-map/${adventure.id}`)}>
        <div style={{ position: 'absolute', top: 20, left: 20 }}>
          <button onClick={() => navigate(-1)} className="glass" style={{ padding: 12, borderRadius: '50%' }}>
            <ArrowLeft color="#fff" size={24} />
          </button>
        </div>
        <div className="glass" style={{ position: 'absolute', bottom: 16, right: 16, padding: '8px 16px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
          <MapIcon size={16} /> Expand Map
        </div>
      </div>
      
      <div className="animate-fade-in" style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', lineHeight: 1.1 }}>{adventure.title}</h1>
        <p className="text-muted" style={{ marginBottom: '24px', fontSize: '1.05rem' }}>{adventure.description}</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '32px' }}>
          <div className="glass" style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', borderRadius: '16px' }}>
            <Clock size={20} color="var(--primary)" />
            <strong style={{ fontSize: '1.1rem' }}>{adventure.duration_minutes}m</strong>
          </div>
          <div className="glass" style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', borderRadius: '16px' }}>
            <MapIcon size={20} color="var(--primary)" />
            <strong style={{ fontSize: '1.1rem' }}>{adventure.distance_km.toFixed(1)}km</strong>
          </div>
          <div className="glass" style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', borderRadius: '16px' }}>
            <Zap size={20} color="var(--primary)" />
            <strong style={{ fontSize: '1.1rem' }}>{adventure.difficulty}</strong>
          </div>
        </div>

        <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
          <Target size={20} color="var(--primary)" /> Mission
        </h3>
        <div className="card glass" style={{ marginBottom: '24px', padding: 0 }}>
          {adventure.missions?.map((m, i) => (
            <div key={i} style={{ padding: '16px', borderBottom: i < adventure.missions.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
              <strong style={{ display: 'block', marginBottom: '4px' }}>{m.title}</strong>
              <span className="text-muted" style={{ fontSize: '0.9rem' }}>{m.description}</span>
            </div>
          ))}
        </div>

        <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
          <CheckSquare size={20} color="var(--primary)" /> Checklist
        </h3>
        <div className="card glass" style={{ marginBottom: '32px' }}>
          <ul className="text-muted" style={{ paddingLeft: '24px' }}>
            {adventure.checklist?.map((c, i) => <li key={i} style={{ marginBottom: '8px' }}>{c}</li>)}
          </ul>
        </div>
      </div>

      <div style={{ padding: '20px 24px', background: 'var(--bg-color)', borderTop: '1px solid var(--border-color)' }}>
        <button className="btn-primary" onClick={handleDownload}>
          <Download size={20} /> Download Adventure Pack
        </button>
      </div>
    </div>
  );
}
