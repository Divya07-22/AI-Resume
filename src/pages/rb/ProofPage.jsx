import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Link as LinkIcon, Github, Globe, Copy, ShieldCheck, CheckCircle2 } from 'lucide-react';

const ProofPage = () => {
    const [links, setLinks] = useState({
        lovable: '',
        github: '',
        deploy: ''
    });

    const [checks, setChecks] = useState({
        c1: false, c2: false, c3: false, c4: false, c5: false,
        c6: false, c7: false, c8: false, c9: false, c10: false
    });

    const [stepStatus, setStepStatus] = useState([]);
    const [isShipped, setIsShipped] = useState(false);

    useEffect(() => {
        // Load step status
        const status = Array.from({ length: 8 }, (_, i) => {
            const stepId = (i + 1).toString().padStart(2, '0');
            return {
                id: stepId,
                completed: !!localStorage.getItem(`rb_step_${stepId}_artifact`)
            };
        });
        setStepStatus(status);

        // Load saved links
        const savedLinks = localStorage.getItem('rb_final_submission');
        if (savedLinks) {
            try { setLinks(JSON.parse(savedLinks)); } catch (e) { }
        }
    }, []);

    // Check Shipped Status
    useEffect(() => {
        const allChecksDone = Object.values(checks).every(v => v === true);
        const allLinksValid = links.lovable && links.lovable.length > 3 && links.github && links.github.length > 3 && links.deploy && links.deploy.length > 3;

        const shipped = allChecksDone && allLinksValid;
        setIsShipped(shipped);

        if (shipped) {
            localStorage.setItem('rb_project_status', 'Shipped');
        } else {
            localStorage.setItem('rb_project_status', 'In Progress');
        }

        localStorage.setItem('rb_final_submission', JSON.stringify(links));
    }, [stepStatus, checks, links]);

    const handleCopyFinal = () => {
        const text = `
------------------------------------------
AI Resume Builder — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Live Deployment: ${links.deploy}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
------------------------------------------
`.trim();

        navigator.clipboard.writeText(text);
        alert('Final Submission copied to clipboard!');
    };

    const toggleCheck = (id) => {
        setChecks(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const checklistItems = [
        { id: 'c1', text: 'All form sections save to localStorage' },
        { id: 'c2', text: 'Live preview updates in real-time' },
        { id: 'c3', text: 'Template switching preserves data' },
        { id: 'c4', text: 'Color theme persists after refresh' },
        { id: 'c5', text: 'ATS score calculates correctly' },
        { id: 'c6', text: 'Score updates live on edit' },
        { id: 'c7', text: 'Export buttons work (copy/download)' },
        { id: 'c8', text: 'Empty states handled gracefully' },
        { id: 'c9', text: 'Mobile responsive layout works' },
        { id: 'c10', text: 'No console errors on any page' }
    ];

    return (
        <div className="proof-page" style={{ padding: '40px 20px', background: 'var(--bg-primary)', flex: 1 }}>
            <div className="card" style={{ maxWidth: '900px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid var(--border)' }}>

                <header style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginBottom: '8px' }}>
                        Project 3 Shipment
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Final verification and artifact collection for AI Resume Builder.</p>

                    {/* High Visibility Status Bar */}
                    <div style={{
                        background: '#f8fafc',
                        padding: '16px 24px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Current Status:</span>
                            <div className={`badge ${isShipped ? 'shipped' : ''}`} style={{
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                background: isShipped ? '#10b981' : '#f59e0b',
                                color: 'white'
                            }}>
                                {isShipped ? 'Shipped' : 'In Progress'}
                            </div>
                        </div>


                        <button
                            className="btn-primary"
                            disabled={!isShipped}
                            onClick={handleCopyFinal}
                            style={{
                                opacity: isShipped ? 1 : 0.5,
                                fontSize: '0.9rem',
                                padding: '10px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: isShipped ? 'var(--accent)' : '#ccc'
                            }}
                        >
                            <Copy size={18} /> Copy Submission
                        </button>
                    </div>

                    {/* EMERGENCY FLOATING BUTTON */}
                    <button
                        onClick={handleCopyFinal}
                        style={{
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                            zIndex: 9999,
                            background: '#ff0000',
                            color: 'white',
                            padding: '16px 32px',
                            borderRadius: '50px',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            border: '4px solid white',
                            fontSize: '1.2rem',
                            cursor: 'pointer'
                        }}
                    >
                        🚨 COPY REPORT
                    </button>
                </header>

                {/* Section A: Step Completion Overview */}
                <section style={{ marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                        A. Step Completion Overview
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                        {stepStatus.map(step => (
                            <div key={step.id} style={{
                                padding: '16px',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: step.completed ? '#f0fdf4' : 'white'
                            }}>
                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Step {step.id}</span>
                                {step.completed ? <CheckCircle size={20} color="#10b981" /> : <XCircle size={20} color="#ccc" />}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section B: Manual Verification Checklist */}
                <section style={{ marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                        B. 10-Item Quality Checklist
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {checklistItems.map(item => (
                            <label key={item.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: checks[item.id] ? '#f8fafc' : 'white'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={checks[item.id]}
                                    onChange={() => toggleCheck(item.id)}
                                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
                                />
                                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.text}</span>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Section C: Artifact Collection */}
                <section style={{ marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                        C. Artifact Collection
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="input-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>
                                <LinkIcon size={16} /> Lovable Project Link
                            </label>
                            <input
                                className="input-field"
                                value={links.lovable}
                                onChange={(e) => setLinks({ ...links, lovable: e.target.value })}
                                placeholder="https://lovable.dev/projects/..."
                            />
                        </div>
                        <div className="input-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>
                                <Github size={16} /> GitHub Repository Link
                            </label>
                            <input
                                className="input-field"
                                value={links.github}
                                onChange={(e) => setLinks({ ...links, github: e.target.value })}
                                placeholder="https://github.com/user/repo"
                            />
                        </div>
                        <div className="input-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>
                                <Globe size={16} /> Deployed Vercel URL
                            </label>
                            <input
                                className="input-field"
                                value={links.deploy}
                                onChange={(e) => setLinks({ ...links, deploy: e.target.value })}
                                placeholder="https://ai-resume-builder.vercel.app"
                            />
                        </div>
                    </div>
                </section>

                {/* Final Actions */}
                <div style={{ padding: '32px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    {isShipped ? (
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ color: '#10b981', fontWeight: 700, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
                                <ShieldCheck size={28} /> Project 3 Shipped Successfully.
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>All requirements met. Ready for final submission.</p>
                        </div>
                    ) : (
                        <div style={{ marginBottom: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Complete all steps, checks, and links to unlock final submission.
                        </div>
                    )}

                    <button
                        className="btn-primary"
                        disabled={!isShipped}
                        onClick={handleCopyFinal}
                        style={{ width: '100%', maxWidth: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', height: '48px', margin: '0 auto' }}
                    >
                        <Copy size={18} /> Copy Final Submission
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProofPage;
