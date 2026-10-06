import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, User, MapPin, ShieldCheck, TreePine } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ name: '', activities: [], fitness: 'moderate' });

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else finishOnboarding();
  };

  const finishOnboarding = () => {
    localStorage.setItem('touchgrass_user', JSON.stringify(data));
    navigate('/');
  };

  return (
    <div className="screen">
      <div className="nav-bar" style={{ background: 'transparent', border: 'none' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ width: '24px', height: '4px', borderRadius: '2px', background: i <= step ? 'var(--primary)' : 'var(--surface-light)', transition: 'background 0.3s' }}></div>
          ))}
        </div>
        <button onClick={finishOnboarding} className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Skip</button>
      </div>

      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {step === 1 && (
          <div className="animate-fade-in">
            <TreePine size={48} color="var(--primary)" style={{ marginBottom: '24px' }} />
            <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Welcome to TouchGrass</h1>
            <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '40px' }}>Let's personalize your outdoor experience.</p>
            
            <div className="card glass">
              <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-secondary)' }}>What should we call you?</label>
              <div style={{ position: 'relative' }}>
                <User size={20} style={{ position: 'absolute', top: '16px', left: '16px', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ paddingLeft: '48px', background: 'rgba(0,0,0,0.4)' }} 
                  placeholder="Name or nickname"
                  value={data.name}
                  onChange={e => setData({...data, name: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Your Interests</h1>
            <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '40px' }}>What activities do you enjoy?</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {['Walking', 'Hiking', 'Running', 'Cycling', 'Photography', 'Nature'].map(act => (
                <button 
                  key={act}
                  className="btn-secondary"
                  style={{ 
                    padding: '16px', 
                    borderRadius: '16px',
                    background: data.activities.includes(act) ? 'rgba(74, 222, 128, 0.15)' : 'var(--surface-light)',
                    borderColor: data.activities.includes(act) ? 'var(--primary)' : 'var(--border-color)',
                    color: data.activities.includes(act) ? 'var(--primary)' : 'var(--text-primary)'
                  }}
                  onClick={() => {
                    const acts = data.activities.includes(act) 
                      ? data.activities.filter(a => a !== act)
                      : [...data.activities, act];
                    setData({...data, activities: acts});
                  }}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Location & Privacy</h1>
            <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '40px' }}>To generate accurate routes.</p>
            
            <div className="card glass" style={{ textAlign: 'center', padding: '40px 24px' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(74, 222, 128, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <ShieldCheck size={40} color="var(--primary)" />
              </div>
              <h3 style={{ marginBottom: '12px', fontSize: '1.4rem' }}>Privacy First</h3>
              <p className="text-muted" style={{ fontSize: '1rem', marginBottom: '32px' }}>
                We need your location to find nearby adventures, but we never upload it to our servers. Everything stays on your device.
              </p>
              <button className="btn-secondary" style={{ border: '1px solid var(--primary)', color: 'var(--primary)' }}>
                <MapPin size={20} /> Allow Location Access
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '24px' }}>
        <button className="btn-primary" onClick={nextStep}>
          {step === 3 ? "Let's Go!" : "Continue"} <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
