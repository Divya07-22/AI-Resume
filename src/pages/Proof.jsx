import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

const Proof = () => {
    return (
        <div className="workspace" style={{ width: '100%', padding: 'var(--spacing-xl)' }}>
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: 'var(--spacing-xxl)' }}>
                <ShieldCheck size={64} color="var(--accent)" style={{ marginBottom: 'var(--spacing-lg)' }} />
                <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>Proof of Authenticity</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
                    This section is a placeholder for project artifacts, build logs, and verification reports.
                </p>

                <div style={{ background: 'var(--bg-primary)', padding: 'var(--spacing-lg)', borderRadius: '8px', textAlign: 'left', border: '1px dashed var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-sm)', fontWeight: 600 }}>
                        <Info size={18} /> Artifact Information
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#555' }}>
                        Future iterations will include cryptographic signatures of the build process and automated quality score certificates.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Proof;
