import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, ExternalLink, Copy, Github, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const CHECKLIST_ITEMS = [
  "Global Design System implemented (Fonts, Colors, Spacing)",
  "Resume Builder functioning with 7+ sections",
  "ATS Scoring Engine providing deterministic 0-100 score",
  "Real-time Validator for missing fields",
  "PDF Export rendering correctly on A4",
  "Theme Engine switching colors globally",
  "Template Picker (Classic, Modern, Minimal) working",
  "Local Storage persistence for all data",
  "Mobile Responsiveness verified",
  "Codebase cleaned and comments added"
];

const Proof = () => {
    const [artifacts, setArtifacts] = useState({
        lovableLimit: '',
        githubUrl: '',
        deployedUrl: ''
    });
    const [checklist, setChecklist] = useState(new Array(CHECKLIST_ITEMS.length).fill(false));
    const [status, setStatus] = useState('In Progress');
    const [isCopying, setIsCopying] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('rb_proof_data');
        if (saved) {
            const data = JSON.parse(saved);
            setArtifacts(data.artifacts);
            setChecklist(data.checklist);
        }
    }, []);

    useEffect(() => {
        const allChecked = checklist.every(Boolean);
        const allArtifacts = Object.values(artifacts).every(v => v.length > 10); // Basic length check
        
        if (allChecked && allArtifacts) {
            setStatus('Shipped');
        } else {
            setStatus('In Progress');
        }

        localStorage.setItem('rb_proof_data', JSON.stringify({ artifacts, checklist }));
    }, [checklist, artifacts]);

    const handleCheck = (index) => {
        const newChecklist = [...checklist];
        newChecklist[index] = !newChecklist[index];
        setChecklist(newChecklist);
    };

    const handleCopy = () => {
        const text = `
AI Resume Builder - Final Submission
------------------------------------
Status: ${status.toUpperCase()}

Artifacts:
- Lovable: ${artifacts.lovableLimit}
- GitHub: ${artifacts.githubUrl}
- Deployed: ${artifacts.deployedUrl}

Checklist:
${CHECKLIST_ITEMS.map((item, i) => `[${checklist[i] ? 'x' : ' '}] ${item}`).join('\n')}

Verified by KodNest Premium Build System.
        `.trim();
        
        navigator.clipboard.writeText(text);
        setIsCopying(true);
        setTimeout(() => setIsCopying(false), 2000);
    };

    return (
        <div className="workspace" style={{ width: '100%', padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ background: status === 'Shipped' ? '#dcfce7' : '#f3f4f6', padding: '32px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
                    {status === 'Shipped' ? (
                        <Rocket size={48} color="#16a34a" style={{ marginBottom: '16px' }} />
                    ) : (
                        <ShieldCheck size={48} color="#6b7280" style={{ marginBottom: '16px' }} />
                    )}
                    <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: status === 'Shipped' ? '#166534' : '#1f2937' }}>
                        Project Status: {status}
                    </h1>
                    <p style={{ color: '#4b5563' }}>
                        {status === 'Shipped' ? "Congratulations! Your project is ready for submission." : "Complete the checklist and add artifacts to ship."}
                    </p>
                </div>

                <div style={{ padding: '32px' }}>
                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle2 size={18} /> Quality Checklist ({checklist.filter(Boolean).length}/{CHECKLIST_ITEMS.length})
                    </h3>
                    <div style={{ display: 'grid', gap: '12px', marginBottom: '40px' }}>
                        {CHECKLIST_ITEMS.map((item, i) => (
                            <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '8px', borderRadius: '6px', background: checklist[i] ? '#f0fdf4' : 'transparent', transition: 'background 0.2s' }}>
                                <input 
                                    type="checkbox" 
                                    checked={checklist[i]} 
                                    onChange={() => handleCheck(i)}
                                    style={{ width: '18px', height: '18px', accentColor: '#16a34a' }}
                                />
                                <span style={{ color: checklist[i] ? '#15803d' : '#374151', textDecoration: checklist[i] ? 'none' : 'none' }}>{item}</span>
                            </label>
                        ))}
                    </div>

                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ExternalLink size={18} /> Project Artifacts
                    </h3>
                    <div style={{ display: 'grid', gap: '20px', marginBottom: '40px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: '#374151' }}>Lovable Project Link</label>
                            <input 
                                className="input-field" 
                                placeholder="https://lovable.dev/..." 
                                value={artifacts.lovableLimit}
                                onChange={(e) => setArtifacts({...artifacts, lovableLimit: e.target.value})}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: '#374151' }}>GitHub Repository</label>
                            <input 
                                className="input-field" 
                                placeholder="https://github.com/..." 
                                value={artifacts.githubUrl}
                                onChange={(e) => setArtifacts({...artifacts, githubUrl: e.target.value})}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: '#374151' }}>Deployed Application URL</label>
                            <input 
                                className="input-field" 
                                placeholder="https://vercel.app/..." 
                                value={artifacts.deployedUrl}
                                onChange={(e) => setArtifacts({...artifacts, deployedUrl: e.target.value})}
                            />
                        </div>
                    </div>

                    {status === 'Shipped' && (
                        <button 
                            className="btn-primary" 
                            style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1.1rem', background: '#16a34a' }}
                            onClick={handleCopy}
                        >
                            {isCopying ? <CheckCircle2 /> : <Copy />} 
                            {isCopying ? 'Copied to Clipboard!' : 'Copy Final Submission'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Proof;
