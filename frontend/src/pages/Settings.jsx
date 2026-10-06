import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Download, Shield, Settings2, User } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to delete all local adventure data?")) {
      localStorage.clear();
      alert("Data cleared.");
      navigate('/');
    }
  };

  return (
    <div className="screen">
      <div className="nav-bar">
        <button onClick={() => navigate('/')}><ArrowLeft size={24} color="var(--text-primary)" /></button>
        <span className="nav-title">Settings</span>
        <div style={{ width: 24 }}></div>
      </div>

      <div className="animate-fade-in" style={{ padding: '24px', flex: 1 }}>
        
        <div className="card glass" style={{ marginBottom: '24px', cursor: 'pointer' }} onClick={() => navigate('/preferences')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--surface-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={24} color="var(--primary)" />
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '1.1rem' }}>My Profile</strong>
              <span className="text-muted" style={{ fontSize: '0.9rem' }}>Edit name and interests</span>
            </div>
          </div>
        </div>

        <h3 style={{ margin: '32px 0 16px', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Privacy & Data</h3>
        
        <div className="card glass" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <Shield size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ display: 'block', marginBottom: '8px' }}>Privacy First Guarantee</strong>
              <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                TouchGrass AI is designed to keep your data on your device. GPS locations are only sent to calculate routes and are never permanently stored on servers. Photos and voice notes stay local unless you explicitly share them.
              </p>
            </div>
          </div>
        </div>

        <button className="btn-secondary" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', padding: '20px', borderRadius: '16px' }} onClick={() => alert("Data exported to TouchGrass_Export.json")}>
          <span style={{ fontWeight: 600 }}>Export My Data</span>
          <Download size={20} />
        </button>

        <button className="btn-secondary" style={{ display: 'flex', justifyContent: 'space-between', color: '#f85149', borderColor: 'rgba(248, 81, 73, 0.3)', background: 'rgba(248, 81, 73, 0.05)', padding: '20px', borderRadius: '16px' }} onClick={handleClearData}>
          <span style={{ fontWeight: 600 }}>Delete All Local Data</span>
          <Trash2 size={20} />
        </button>

      </div>
    </div>
  );
}
