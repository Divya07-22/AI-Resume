import React, { useEffect, useState } from 'react';
import { Printer, Copy, AlertTriangle, CheckCircle2, Github, ExternalLink, Download, Trophy, Lightbulb } from 'lucide-react';

const THEMES = [
    { name: 'Teal', color: 'hsl(168, 60%, 40%)' },
    { name: 'Navy', color: 'hsl(220, 60%, 35%)' },
    { name: 'Burgundy', color: 'hsl(345, 60%, 35%)' },
    { name: 'Forest', color: 'hsl(150, 50%, 30%)' },
    { name: 'Charcoal', color: 'hsl(0, 0%, 25%)' }
];

const ACTION_VERBS = ['built', 'led', 'designed', 'improved', 'developed', 'created', 'optimized', 'automated', 'implemented'];

const Preview = () => {
    const [resumeData, setResumeData] = useState(null);
    const [template, setTemplate] = useState('Classic');
    const [themeColor, setThemeColor] = useState(THEMES[0].color);
    const [isCopying, setIsCopying] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [validation, setValidation] = useState({ isValid: true, errors: [] });
    const [score, setScore] = useState(0);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const savedData = localStorage.getItem('resumeBuilderData');
        if (savedData) {
            const data = JSON.parse(savedData);
            if (typeof data.skills === 'string') {
                data.skills = { technical: data.skills.split(',').filter(Boolean), soft: [], tools: [] };
            }
            setResumeData(data);
            validateResume(data);
            calculateScore(data);
        }

        const savedTemplate = localStorage.getItem('resumeTemplateChoice');
        if (savedTemplate) setTemplate(savedTemplate);

        const savedTheme = localStorage.getItem('resumeThemeChoice');
        if (savedTheme) setThemeColor(savedTheme);
    }, []);

    const calculateScore = (data) => {
        let s = 0;
        const sugs = [];

        // Rules
        if (data.personal.name) s += 10; else sugs.push({ text: "Add your full name", points: 10 });
        if (data.personal.email) s += 10; else sugs.push({ text: "Add a professional email", points: 10 });
        if (data.summary?.length > 50) s += 10; else sugs.push({ text: "Write a summary (>50 chars)", points: 10 });

        const hasBullets = data.experience?.some(e => e.description.includes('•') || e.description.includes('-'));
        if (hasBullets) s += 15; else sugs.push({ text: "Use bullet points in experience", points: 15 });

        if (data.education?.length > 0) s += 10; else sugs.push({ text: "Add education history", points: 10 });

        const skillCount = (data.skills?.technical?.length || 0) + (data.skills?.soft?.length || 0) + (data.skills?.tools?.length || 0);
        if (skillCount >= 5) s += 10; else sugs.push({ text: "Add at least 5 skills", points: 10 });

        if (data.projects?.length > 0) s += 10; else sugs.push({ text: "Add at least 1 project", points: 10 });

        if (data.personal.phone) s += 5; else sugs.push({ text: "Add phone number", points: 5 });
        if (data.links?.linkedin) s += 5; else sugs.push({ text: "Add LinkedIn profile", points: 5 });
        if (data.links?.github) s += 5; else sugs.push({ text: "Add GitHub profile", points: 5 });

        const hasVerbs = ACTION_VERBS.some(v => data.summary?.toLowerCase().includes(v));
        if (hasVerbs) s += 10; else sugs.push({ text: "Use action verbs in summary", points: 10 });

        setScore(s);
        setSuggestions(sugs.slice(0, 3)); // Show top 3
    };

    const validateResume = (data) => {
        const errors = [];
        if (!data.personal.name) errors.push("Missing Name");
        if ((data.experience?.length || 0) === 0 && (data.projects?.length || 0) === 0) {
            errors.push("No experience or projects added");
        }
        setValidation({ isValid: errors.length === 0, errors });
    };

    const handleTemplateChange = (t) => {
        setTemplate(t);
        localStorage.setItem('resumeTemplateChoice', t);
    };

    const handleThemeChange = (color) => {
        setThemeColor(color);
        localStorage.setItem('resumeThemeChoice', color);
    };

    const triggerPdfDownload = () => {
        window.print();
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleCopyAsText = () => {
        if (!resumeData) return;
        setIsCopying(true);
        const text = `
${resumeData.personal.name}
${resumeData.personal.email} | ${resumeData.personal.phone}

SKILLS
Technical: ${resumeData.skills?.technical?.join(', ')}
Soft: ${resumeData.skills?.soft?.join(', ')}
Tools: ${resumeData.skills?.tools?.join(', ')}

EXPERIENCE
${resumeData.experience?.map(exp => `${exp.company} - ${exp.role}\n• ${exp.description}`).join('\n\n')}

PROJECTS
${resumeData.projects?.map(proj => `${proj.title}\n${proj.description}\nTech: ${proj.techStack?.join(', ')}`).join('\n\n')}
        `.trim();

        navigator.clipboard.writeText(text).then(() => {
            setTimeout(() => setIsCopying(false), 2000);
        });
    };

    if (!resumeData) return <div className="workspace">No data found.</div>;

    const themeStyles = { '--theme-accent': themeColor };
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const getScoreColor = () => {
        if (score <= 40) return '#ef4444';
        if (score <= 70) return '#f59e0b';
        return '#10b981';
    };

    const getScoreStatus = () => {
        if (score <= 40) return 'Needs Work';
        if (score <= 70) return 'Getting There';
        return 'Strong Resume';
    };

    return (
        <div className="preview-container" style={{ padding: '40px', background: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>

            {/* ATS Scoring Panel */}
            <div className="ats-panel">
                <div className="score-circle-wrapper">
                    <svg className="score-circle-svg" viewBox="0 0 120 120">
                        <circle className="score-circle-bg" cx="60" cy="60" r={radius} />
                        <circle
                            className="score-circle-fill"
                            cx="60" cy="60" r={radius}
                            style={{
                                strokeDasharray: circumference,
                                strokeDashoffset: offset,
                                stroke: getScoreColor()
                            }}
                        />
                    </svg>
                    <div className="score-value">
                        <span>{score}</span>
                        <span className="score-label">ATS Score</span>
                    </div>
                </div>

                <div className="suggestions-container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span className="ats-status-badge" style={{ background: `${getScoreColor()}15`, color: getScoreColor() }}>
                            {getScoreStatus()}
                        </span>
                    </div>
                    {suggestions.length > 0 && (
                        <>
                            <div className="suggestions-title"><Lightbulb size={14} /> Improvement Tips</div>
                            {suggestions.map((s, i) => (
                                <div key={i} className="suggestion-card">
                                    <span className="suggestion-points">+{s.points}</span>
                                    <span>{s.text}</span>
                                </div>
                            ))}
                        </>
                    )}
                    {suggestions.length === 0 && (
                        <div style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckCircle2 size={18} /> Perfect Score! Your resume is highly optimized.
                        </div>
                    )}
                </div>
            </div>

            {/* Customization Bar */}
            <div className="customization-bar">
                <div className="picker-group">
                    <span className="picker-label">Select Template</span>
                    <div className="template-picker">
                        {['Classic', 'Modern', 'Minimal'].map(t => (
                            <div key={t} className={`template-card ${template === t ? 'active' : ''}`} onClick={() => handleTemplateChange(t)}>
                                <div className="template-sketch">
                                    <div style={{ height: '8px', width: '60%', background: '#ddd' }}></div>
                                    {t === 'Modern' ? (
                                        <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
                                            <div style={{ width: '30%', background: '#eee' }}></div>
                                            <div style={{ width: '70%', background: 'white', border: '1px solid #eee' }}></div>
                                        </div>
                                    ) : (
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <div style={{ height: '4px', width: '100%', background: '#eee' }}></div>
                                            <div style={{ height: '4px', width: '90%', background: '#eee' }}></div>
                                            <div style={{ height: '4px', width: '100%', background: '#eee' }}></div>
                                        </div>
                                    )}
                                </div>
                                <div style={{ padding: '8px', fontSize: '0.75rem', fontWeight: 600, textAlign: 'center', background: 'white', borderTop: '1px solid #eee' }}>{t}</div>
                                {template === t && <CheckCircle2 className="checkmark" size={14} style={{ position: 'absolute', top: 5, right: 5, color: '#3B82F6' }} />}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="picker-group">
                    <span className="picker-label">Accent Color</span>
                    <div className="theme-picker">
                        {THEMES.map(t => (
                            <div
                                key={t.name}
                                className={`color-circle ${themeColor === t.color ? 'active' : ''}`}
                                style={{ background: t.color }}
                                onClick={() => handleThemeChange(t.color)}
                            />
                        ))}
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', display: 'flex', gap: '12px' }}>
                    <button className="btn-primary" onClick={triggerPdfDownload} style={{ background: themeColor, display: 'flex', alignItems: 'center', gap: '8px', border: 'none' }}>
                        <Download size={18} /> Download PDF
                    </button>
                    <button className="btn-ghost" onClick={handleCopyAsText} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white' }}>
                        {isCopying ? <CheckCircle2 size={18} color="var(--success)" /> : <Copy size={18} />}
                        {isCopying ? 'Copied!' : 'Copy as Text'}
                    </button>
                </div>
            </div>

            {/* Error/Warning Banner */}
            {!validation.isValid && (
                <div className="warning-banner" style={{ marginBottom: '24px' }}>
                    <AlertTriangle size={18} />
                    <span>Incomplete Profile: <strong>{validation.errors.join(", ")}</strong></span>
                </div>
            )}

            {/* Final Resume Render */}
            <div
                className={`resume-paper template-${template.toLowerCase()}`}
                style={{ ...themeStyles }}
            >
                {template === 'Modern' ? (
                    <div className="template-modern">
                        <aside className="modern-sidebar">
                            <div className="resume-header" style={{ textAlign: 'left', marginBottom: '40px' }}>
                                <h1 className="resume-name" style={{ fontSize: '2rem' }}>{resumeData.personal.name}</h1>
                                <div style={{ fontSize: '0.8rem', opacity: 0.9, lineHeight: 1.6 }}>
                                    <div>{resumeData.personal.email}</div>
                                    <div>{resumeData.personal.phone}</div>
                                    <div>{resumeData.personal.location}</div>
                                </div>
                            </div>

                            <div className="resume-section">
                                <div className="resume-section-title" style={{ color: 'white', borderBottomColor: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>Skills</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {resumeData.skills?.technical?.length > 0 && (
                                        <div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', marginBottom: '4px' }}>Technical</div>
                                            <div style={{ fontSize: '0.85rem' }}>{resumeData.skills.technical.join(', ')}</div>
                                        </div>
                                    )}
                                    {resumeData.skills?.soft?.length > 0 && (
                                        <div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', marginBottom: '4px' }}>Soft</div>
                                            <div style={{ fontSize: '0.85rem' }}>{resumeData.skills.soft.join(', ')}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </aside>
                        <main className="modern-main">
                            {resumeData.summary && (
                                <section className="resume-section">
                                    <div className="resume-section-title">Summary</div>
                                    <p style={{ fontSize: '0.9rem', color: '#333' }}>{resumeData.summary}</p>
                                </section>
                            )}

                            {resumeData.experience?.length > 0 && (
                                <section className="resume-section">
                                    <div className="resume-section-title">Experience</div>
                                    {resumeData.experience.map((exp, i) => (
                                        <div key={i} style={{ marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.95rem' }}>
                                                <span>{exp.company}</span>
                                                <span style={{ fontWeight: 400, color: '#666' }}>{exp.duration}</span>
                                            </div>
                                            <div style={{ fontStyle: 'italic', color: themeColor, fontSize: '0.9rem', marginBottom: '4px' }}>{exp.role}</div>
                                            <p style={{ fontSize: '0.9rem', color: '#444' }}>• {exp.description}</p>
                                        </div>
                                    ))}
                                </section>
                            )}

                            {resumeData.projects?.length > 0 && (
                                <section className="resume-section">
                                    <div className="resume-section-title">Projects</div>
                                    {resumeData.projects.map((proj, i) => (
                                        <div key={i} style={{ marginBottom: '16px' }}>
                                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{proj.title}</div>
                                            <p style={{ fontSize: '0.9rem', color: '#444' }}>• {proj.description}</p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                                                {proj.techStack?.map(t => <span key={t} style={{ fontSize: '0.7rem', padding: '1px 6px', border: '1px solid #ddd', borderRadius: '4px' }}>{t}</span>)}
                                            </div>
                                        </div>
                                    ))}
                                </section>
                            )}
                        </main>
                    </div>
                ) : (
                    <div className="classic-layout" style={{ padding: '60px' }}>
                        <div className="resume-header">
                            <h1 className="resume-name" style={{ color: template === 'Minimal' ? '#111' : themeColor }}>{resumeData.personal.name}</h1>
                            <div className="resume-contact" style={{ gap: '16px' }}>
                                <span>{resumeData.personal.email}</span>
                                <span>{resumeData.personal.phone}</span>
                                <span>{resumeData.personal.location}</span>
                            </div>
                        </div>

                        {resumeData.summary && (
                            <section className="resume-section" style={{ marginBottom: '24px' }}>
                                <div className="resume-section-title" style={{ color: themeColor, borderBottomColor: template === 'Minimal' ? 'transparent' : themeColor }}>Summary</div>
                                <p style={{ fontSize: '0.95rem' }}>{resumeData.summary}</p>
                            </section>
                        )}

                        <section className="resume-section" style={{ marginBottom: '24px' }}>
                            <div className="resume-section-title" style={{ color: themeColor, borderBottomColor: template === 'Minimal' ? 'transparent' : themeColor }}>Skills</div>
                            <div style={{ fontSize: '0.95rem' }}>
                                <strong>Technical:</strong> {resumeData.skills?.technical?.join(', ')}
                                {resumeData.skills?.soft?.length > 0 && <div style={{ marginTop: '4px' }}><strong>Soft:</strong> {resumeData.skills.soft.join(', ')}</div>}
                            </div>
                        </section>

                        {resumeData.experience?.length > 0 && (
                            <section className="resume-section" style={{ marginBottom: '24px' }}>
                                <div className="resume-section-title" style={{ color: themeColor, borderBottomColor: template === 'Minimal' ? 'transparent' : themeColor }}>Experience</div>
                                {resumeData.experience.map((exp, i) => (
                                    <div key={i} style={{ marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                                            <span>{exp.company}</span>
                                            <span style={{ fontWeight: 400 }}>{exp.duration}</span>
                                        </div>
                                        <div style={{ fontStyle: 'italic', marginBottom: '4px' }}>{exp.role}</div>
                                        <p style={{ fontSize: '0.95rem' }}>• {exp.description}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </div>
                )}
            </div>

            {showToast && (
                <div className="toast-notification">
                    <CheckCircle2 size={18} color="#4ade80" />
                    <span>PDF export ready! Check your downloads.</span>
                </div>
            )}
        </div>
    );
};

export default Preview;
