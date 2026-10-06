import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Share2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { api } from '../lib/api';

export default function Journal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [adventure, setAdventure] = useState(null);
  const [journal, setJournal] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('touchgrass_adventures') || '[]');
    const adv = stored.find(a => a.id === id);
    if (adv) {
      setAdventure(adv);
      setJournal({
        title: `Reflections on ${adv.title}`,
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
        summary: "A refreshing walk outside, completely disconnected from notifications.",
        content: `Today's ${adv.duration_minutes}-minute adventure took me across ${adv.distance_km.toFixed(1)}km of the local neighborhood. I managed to fulfill the mission "${adv.missions[0]?.title || 'exploring'}", discovering quiet details I usually walk past while looking at my phone. It felt great to simply observe the world.`,
        highlights: ["Found a unique leaf pattern", "3.8 km completed", "Undistracted nature time"],
        next: "Next time, try a slightly longer route through the local park!"
      });
    }
  }, [id]);

  if (!journal) return <div className="screen"></div>;

  return (
    <div className="screen" style={{ background: '#f5f5f4' }}> {/* Light scrapbook background */}
      <div className="nav-bar" style={{ background: 'transparent', backdropFilter: 'none', color: '#1c1917', border: 'none' }}>
        <button onClick={() => navigate('/')}><ArrowLeft size={24} color="#1c1917" /></button>
        <span className="nav-title" style={{ color: '#1c1917' }}>Journal</span>
        <button onClick={() => alert("Sharing...")}><Share2 size={24} color="#1c1917" /></button>
      </div>

      <div className="animate-fade-in" style={{ flex: 1, padding: '24px', paddingBottom: '80px' }}>
        <div className="scrapbook-card">
          <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', width: '40px', height: '20px', background: 'rgba(255,255,255,0.5)', border: '1px solid #ccc', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transform: 'translateX(-50%) rotate(-3deg)' }}></div>
          
          <span style={{ display: 'block', fontSize: '0.9rem', color: '#78716c', marginBottom: '8px', fontFamily: 'var(--font-sans)', fontStyle: 'italic' }}>
            {journal.date}
          </span>
          <h1 className="scrapbook-title">{journal.title}</h1>
          
          <div style={{ width: '100%', height: '200px', background: '#e7e5e4', margin: '24px 0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '8px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transform: 'rotate(2deg)' }}>
            <span style={{ color: '#a8a29e', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <ImageIcon size={32} />
              Photo 1 Mock
            </span>
          </div>

          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', color: '#44403c', lineHeight: 1.8, marginBottom: '24px' }}>
            {journal.content}
          </p>

          <div style={{ padding: '16px', background: '#f5f5f4', borderRadius: '8px', marginBottom: '24px' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#292524' }}>
              <Sparkles size={18} color="var(--primary-dark)" /> Highlights
            </strong>
            <ul style={{ paddingLeft: '24px', color: '#57534e' }}>
              {journal.highlights.map((h, i) => <li key={i} style={{ marginBottom: '8px' }}>{h}</li>)}
            </ul>
          </div>

          <div style={{ fontStyle: 'italic', color: '#78716c', textAlign: 'center', borderTop: '1px dashed #d6d3d1', paddingTop: '16px' }}>
            {journal.next}
          </div>
        </div>
      </div>
    </div>
  );
}
