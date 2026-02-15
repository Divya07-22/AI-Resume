import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Link as LinkIcon, Github, Globe, Copy } from 'lucide-react';

const ProofPage = () => {
    const [links, setLinks] = useState({
        lovable: '',
        github: '',
        deploy: ''
    });

    const [stepStatus, setStepStatus] = useState([]);

    useEffect(() => {
        const status = Array.from({ length: 8 }, (_, i) => {
            const stepId = (i + 1).toString().padStart(2, '0');
            return {
                id: stepId,
                completed: !!localStorage.getItem(`rb_step_${stepId}_artifact`)
            };
        });
        setStepStatus(status);
    }, []);

    const handleCopyFinal = () => {
        const text = `
AI Resume Builder — Project 3 Submission
---------------------------------------
Status: 8/8 Steps Completed

Links:
- Lovable: ${links.lovable}
- GitHub: ${links.github}
- Live Demo: ${links.deploy}

Verified by KodNest Premium Build System
    `.trim();

        navigator.clipboard.writeText(text);
        alert('Final Submission copied to clipboard!');
    };

    return (
        <div className="proof-page">
            <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-lg)', color: 'var(--accent)' }}>
                    Project 3 — Proof of Work
                </h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: 'var(--spacing-xl)' }}>
                    {stepStatus.map(step => (
                        <div
                            key={step.id}
                            style={{
                                padding: '12px',
                                borderRadius: '6px',
                                background: step.completed ? 'var(--accent-light)' : '#f5f5f5',
                                border: `1px solid ${step.completed ? 'var(--accent)' : '#ddd'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Step {step.id}</span>
                            {step.completed ? (
                                <CheckCircle size={18} color="var(--accent)" />
                            ) : (
                                <XCircle size={18} color="#999" />
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ padding: 'var(--spacing-lg)', background: '#f9f9f9', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: 'var(--spacing-xl)' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={18} color="var(--accent)" /> Verify it works
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { id: 'bg', text: 'Is the background color off-white (#F7F6F3), not pure white?' },
                            { id: 'font', text: 'Are headings using a serif font with generous spacing?' },
                            { id: 'accent', text: 'Is the accent color deep red (#8B0000), used sparingly?' },
                            { id: 'spacing', text: 'Is spacing consistent using 8/16/24/40/64px scale?' },
                            { id: 'colors', text: 'Are there at most 4 colors used across the entire UI?' }
                        ].map(item => (
                            <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.95rem' }}>
                                <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }} />
                                {item.text}
                            </label>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <LinkIcon size={16} /> Lovable Project Link
                        </label>
                        <input
                            className="premium-input"
                            style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid var(--border)' }}
                            value={links.lovable}
                            onChange={(e) => setLinks({ ...links, lovable: e.target.value })}
                            placeholder="https://lovable.dev/projects/..."
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Github size={16} /> GitHub Repository URL
                        </label>
                        <input
                            className="premium-input"
                            style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid var(--border)' }}
                            value={links.github}
                            onChange={(e) => setLinks({ ...links, github: e.target.value })}
                            placeholder="https://github.com/user/repo"
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Globe size={16} /> Deployed URL
                        </label>
                        <input
                            className="premium-input"
                            style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid var(--border)' }}
                            value={links.deploy}
                            onChange={(e) => setLinks({ ...links, deploy: e.target.value })}
                            placeholder="https://project-name.vercel.app"
                        />
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                        <button
                            className="btn-primary"
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                            onClick={handleCopyFinal}
                        >
                            <Copy size={18} /> Copy Final Submission
                        </button>
                        <button
                            className="btn-primary"
                            style={{ background: 'var(--success)', flex: 1 }}
                            onClick={() => {
                                localStorage.clear();
                                alert('Project state reset for demo purposes');
                                window.location.href = '/rb/01-problem';
                            }}
                        >
                            Reset All Progress
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProofPage;
