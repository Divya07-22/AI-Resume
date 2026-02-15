import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Settings, CheckCircle, ChevronRight, Activity } from 'lucide-react';

const PremiumLayout = ({ children, currentStep = 1, totalSteps = 8 }) => {
  const location = useLocation();
  const isProofPage = location.pathname.includes('/proof');

  return (
    <div className="premium-layout">
      {/* Top Bar */}
      <header className="top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Activity size={24} color="var(--accent)" />
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>AI Resume Builder</h2>
        </div>
        
        {!isProofPage && (
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            Project 3 — Step {currentStep} of {totalSteps}
          </div>
        )}
        
        <div className="badge badge-status">
          {isProofPage ? 'Final Review' : 'In Progress'}
        </div>
      </header>

      {/* Context Header */}
      <nav className="context-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <span>Projects</span>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-primary)' }}>AI Resume Builder</span>
          {!isProofPage && (
            <>
              <ChevronRight size={14} />
              <span style={{ color: 'var(--accent)' }}>Build Track</span>
            </>
          )}
        </div>
      </nav>

      {/* Main Workspace + Secondary Panel */}
      <main className="main-content">
        <section className="workspace">
          {children}
        </section>
        
        {!isProofPage && (
          <aside className="build-panel">
            <h3 style={{ fontSize: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              Build Panel
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Lovable Input</label>
              <textarea 
                placeholder="Copy this into Lovable..."
                id="lovable-copy-area"
                style={{ 
                  width: '100%', 
                  height: '150px', 
                  padding: '12px', 
                  borderRadius: '4px',
                  border: '1px solid var(--border)',
                  resize: 'none',
                  fontSize: '0.9rem'
                }}
                defaultValue={`Initialize Project 3: AI Resume Builder\nStep ${currentStep} artifact...`}
              />
              <button 
                className="btn-primary" 
                style={{ width: '100%' }}
                onClick={() => {
                  const copyText = document.getElementById('lovable-copy-area');
                  copyText.select();
                  document.execCommand('copy');
                  alert('Copied to clipboard!');
                }}
              >
                Copy Button
              </button>
            </div>

            <a 
              href="https://lovable.dev" 
              target="_blank" 
              rel="noreferrer"
              className="btn-primary" 
              style={{ 
                width: '100%', 
                textAlign: 'center', 
                textDecoration: 'none',
                background: 'var(--text-primary)' 
              }}
            >
              Build in Lovable
            </a>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle size={14} /> It Worked
                </span>
                <span style={{ color: 'var(--error)' }}>Error</span>
              </div>
              
              <button 
                className="btn-primary" 
                style={{ 
                  width: '100%', 
                  background: 'none', 
                  border: '1px solid var(--accent)', 
                  color: 'var(--accent)' 
                }}
                onClick={() => {
                  const stepId = `rb_step_${currentStep}_artifact`;
                  localStorage.setItem(stepId, 'true');
                  window.dispatchEvent(new Event('storage'));
                  alert('Screenshot/Artifact Added!');
                  window.location.reload(); // Simple way to trigger gating check
                }}
              >
                Add Screenshot
              </button>
            </div>
          </aside>
        )}
      </main>

      {/* Proof Footer */}
      <footer className="proof-footer">
        KodNest Premium Build System — Proof of Authenticity Required
      </footer>
    </div>
  );
};

export default PremiumLayout;
