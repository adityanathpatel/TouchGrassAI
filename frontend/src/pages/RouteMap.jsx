import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Map as MapIcon, Download, Clock, MapPin, Target, ShieldAlert } from 'lucide-react';

export default function RouteMap() {
  const navigate = useNavigate();
  // We'll just show the static/interactive map placeholder here.
  return (
    <div className="screen" style={{ padding: 0 }}>
      <div className="nav-bar" style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)', border: 'none', zIndex: 10 }}>
        <button onClick={() => navigate(-1)}><ArrowLeft size={24} color="#fff" /></button>
        <span className="nav-title" style={{ color: '#fff' }}>Route Overview</span>
        <div style={{ width: 24 }}></div>
      </div>
      
      {/* Full screen map */}
      <div className="map-placeholder" style={{ flex: 1 }}>
        <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
          <div className="glass" style={{ padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '1.2rem' }}>Suburban Nature Hunt</strong>
              <span className="text-muted">3.8 km • Circular Route</span>
            </div>
            <div style={{ background: 'var(--primary)', color: '#000', padding: '8px 16px', borderRadius: '100px', fontWeight: 'bold' }}>
              60m
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
