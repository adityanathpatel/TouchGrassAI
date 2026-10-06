import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trophy, Sparkles } from 'lucide-react';

export default function FinishAdventure() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [generating, setGenerating] = useState(false);

  const createJournal = () => {
    setGenerating(true);
    setTimeout(() => {
      navigate(`/journal/${id}`);
    }, 2000);
  };

  if (generating) {
    return (
      <div className="screen" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Sparkles size={48} color="var(--primary)" className="animate-fade-in" style={{ animationIterationCount: 'infinite' }} />
        <h2 style={{ marginTop: '24px', fontFamily: 'var(--font-display)' }}>Synthesizing Journal...</h2>
        <p className="text-muted" style={{ textAlign: 'center', maxWidth: '80%' }}>The local AI is reading your notes and generating a personalized story of your trip.</p>
      </div>
    );
  }

  return (
    <div className="screen" style={{ justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
      <div className="animate-fade-in" style={{ textAlign: 'center', width: '100%' }}>
        <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'rgba(74, 222, 128, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Trophy size={48} color="var(--primary)" />
        </div>
        
        <h1 style={{ marginBottom: '8px', fontSize: '2.5rem' }}>Adventure Complete!</h1>
        <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '40px' }}>You successfully disconnected.</p>
        
        <div className="card glass" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px', textAlign: 'center' }}>
          <div>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', display: 'block' }}>3.8</span>
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>km</span>
          </div>
          <div>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', display: 'block' }}>62</span>
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>minutes</span>
          </div>
          <div>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', display: 'block' }}>3</span>
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>observations</span>
          </div>
          <div>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', display: 'block' }}>2</span>
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>missions</span>
          </div>
        </div>

        <button className="btn-primary" onClick={createJournal}>
          <Sparkles size={20} /> Generate AI Journal
        </button>
      </div>
    </div>
  );
}
