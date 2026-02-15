import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Database, Award, Lightbulb, CheckCircle2, Layout, Info } from 'lucide-react';

const ACTION_VERBS = ['Built', 'Developed', 'Designed', 'Implemented', 'Led', 'Improved', 'Created', 'Optimized', 'Automated'];

const Builder = () => {
    const [resumeData, setResumeData] = useState({
        personal: { name: '', email: '', phone: '', location: '' },
        summary: '',
        education: [],
        experience: [],
        projects: [],
        skills: '',
        links: { github: '', linkedin: '' }
    });

    const [score, setScore] = useState(0);
    const [suggestions, setSuggestions] = useState([]);
    const [template, setTemplate] = useState('Classic');

    // Hydrate from localStorage
    useEffect(() => {
        const savedData = localStorage.getItem('resumeBuilderData');
        if (savedData) {
            try { setResumeData(JSON.parse(savedData)); } catch (e) { }
        }
        const savedTemplate = localStorage.getItem('resumeTemplateChoice');
        if (savedTemplate) {
            setTemplate(savedTemplate);
        }
    }, []);

    // Autosave and calculate score
    useEffect(() => {
        localStorage.setItem('resumeBuilderData', JSON.stringify(resumeData));
        localStorage.setItem('resumeTemplateChoice', template);
        calculateATSScore(resumeData);
    }, [resumeData, template]);

    const calculateATSScore = (data) => {
        let currentScore = 0;
        const currentSuggestions = [];

        const summaryWords = data.summary.trim() ? data.summary.trim().split(/\s+/).length : 0;
        if (summaryWords >= 40 && summaryWords <= 120) currentScore += 15;
        else if (summaryWords < 40) currentSuggestions.push({ id: 'summary', text: "Write a stronger summary (40–120 words)." });

        if (data.projects.length >= 2) currentScore += 10;
        else currentSuggestions.push({ id: 'projects', text: "Add at least 2 projects." });

        if (data.experience.length >= 1) currentScore += 10;
        else currentSuggestions.push({ id: 'experience', text: "Add work or internship experience." });

        const skillsCount = data.skills ? data.skills.split(',').filter(s => s.trim().length > 0).length : 0;
        if (skillsCount >= 8) currentScore += 10;
        else currentSuggestions.push({ id: 'skills', text: "Add more skills (target 8+)." });

        if (data.links.github || data.links.linkedin) currentScore += 10;

        const hasNumbers = [...data.experience, ...data.projects].some(item =>
            /[0-9]/.test(item.description) || /%|X|k|M/i.test(item.description)
        );
        if (hasNumbers) currentScore += 15;
        else currentSuggestions.push({ id: 'numbers', text: "Add measurable impact (numbers) in bullets." });

        const isEduComplete = data.education.length > 0 && data.education.every(edu => edu.school && edu.degree && edu.year);
        if (isEduComplete) currentScore += 10;

        setScore(Math.min(currentScore, 100));
        setSuggestions(currentSuggestions.slice(0, 3));
    };

    const getBulletGuidance = (text) => {
        if (!text.trim()) return null;
        const firstWord = text.trim().split(' ')[0].replace(/[^a-zA-Z]/g, '');
        const startsWithVerb = ACTION_VERBS.some(v => v.toLowerCase() === firstWord.toLowerCase());
        const hasNumbers = /[0-9]|%|X|k|M/i.test(text);

        const errors = [];
        if (!startsWithVerb) errors.push("Start with a strong action verb.");
        if (!hasNumbers) errors.push("Add measurable impact (numbers).");
        return errors;
    };

    const loadSampleData = () => {
        setResumeData({
            personal: { name: 'Divya Sharma', email: 'divya.sharma@example.com', phone: '+91 98765 43210', location: 'Bangalore, India' },
            summary: 'Passionate and results-driven Full Stack Developer with 2+ years of experience in building scalable web applications. Expert in React, Node.js, and cloud architecture, focusing on performance optimization and writing 100% clean, maintainable code for diverse enterprise solutions.',
            education: [{ school: 'KodNest Institute', degree: 'Full Stack Web Development', year: '2025' }],
            experience: [{ company: 'Tech Solutions', role: 'Frontend Intern', duration: 'June 2024 - Dec 2024', description: 'Developed 10+ responsive UI components reducing load time by 30%.' }],
            projects: [
                { title: 'AI Resume Builder', tech: 'React, Vite', description: 'Built a premium resume platform with 100/100 deterministic scoring.' },
                { title: 'E-commerce API', tech: 'Node.js, MongoDB', description: 'Architected a backend system handling 5k+ requests per minute.' }
            ],
            skills: 'React, JavaScript, CSS, HTML, Node.js, Git, SQL, MongoDB, AWS, Docker',
            links: { github: 'https://github.com/Divya07-22', linkedin: 'https://linkedin.com/in/divyasharma' }
        });
    };

    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        setResumeData(prev => ({ ...prev, personal: { ...prev.personal, [name]: value } }));
    };

    const addItem = (section) => {
        const item = section === 'education' ? { school: '', degree: '', year: '' } :
            section === 'experience' ? { company: '', role: '', duration: '', description: '' } :
                { title: '', tech: '', description: '' };
        setResumeData(prev => ({ ...prev, [section]: [...prev[section], item] }));
    };

    const updateItem = (section, index, field, value) => {
        const updated = [...resumeData[section]];
        updated[index][field] = value;
        setResumeData(prev => ({ ...prev, [section]: updated }));
    };

    const removeItem = (section, index) => {
        setResumeData(prev => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));
    };

    return (
        <div className="builder-container">
            <div className="form-column">
                {/* Template Selector */}
                <div className="template-tabs">
                    {['Classic', 'Modern', 'Minimal'].map(t => (
                        <button key={t} className={`template-tab ${template === t ? 'active' : ''}`} onClick={() => setTemplate(t)}>
                            {t}
                        </button>
                    ))}
                </div>

                {/* ATS Score and Top 3 Improvements */}
                <div className="score-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Award size={18} color="var(--accent)" /> ATS Readiness Score
                        </span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent)' }}>{score}/100</span>
                    </div>
                    <div className="score-meter-bg"><div className="score-meter-fill" style={{ width: `${score}%` }}></div></div>

                    {suggestions.length > 0 && (
                        <div style={{ marginTop: '16px' }}>
                            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '8px' }}>Top 3 Improvements</h4>
                            <div className="suggestions-list">
                                {suggestions.map((s, i) => (
                                    <div key={i} className="suggestion-item">
                                        <Lightbulb size={14} className="suggestion-bullet" />
                                        <span>{s.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)' }}>Resume Content</h2>
                    <button className="btn-ghost" onClick={loadSampleData}><Database size={16} /> Load Sample Data</button>
                </div>

                {/* Form Sections */}
                <section className="form-section">
                    <h3>Personal Info</h3>
                    <input className="input-field" name="name" value={resumeData.personal.name} onChange={handlePersonalChange} placeholder="Full Name" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                        <input className="input-field" name="email" value={resumeData.personal.email} onChange={handlePersonalChange} placeholder="Email" />
                        <input className="input-field" name="phone" value={resumeData.personal.phone} onChange={handlePersonalChange} placeholder="Phone" />
                    </div>
                    <input className="input-field" style={{ marginTop: '12px' }} name="location" value={resumeData.personal.location} onChange={handlePersonalChange} placeholder="Location" />
                </section>

                <section className="form-section">
                    <h3>Summary</h3>
                    <textarea className="input-field" style={{ height: '80px' }} value={resumeData.summary} onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })} placeholder="Professional summary..." />
                </section>

                <section className="form-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><h3>Experience</h3><button className="btn-ghost" onClick={() => addItem('experience')}><Plus size={16} /></button></div>
                    {resumeData.experience.map((exp, index) => (
                        <div key={index} style={{ marginBottom: '20px', padding: '16px', border: '1px solid var(--border)', borderRadius: '4px' }}>
                            <input className="input-field" style={{ marginBottom: '8px' }} value={exp.company} onChange={(e) => updateItem('experience', index, 'company', e.target.value)} placeholder="Company" />
                            <input className="input-field" style={{ marginBottom: '8px' }} value={exp.role} onChange={(e) => updateItem('experience', index, 'role', e.target.value)} placeholder="Role" />
                            <textarea className="input-field" value={exp.description} onChange={(e) => updateItem('experience', index, 'description', e.target.value)} placeholder="Description..." />
                            {getBulletGuidance(exp.description)?.map((err, i) => (
                                <div key={i} className="guidance-inline"><Info size={12} /> {err}</div>
                            ))}
                            <button className="btn-ghost" onClick={() => removeItem('experience', index)} style={{ color: 'var(--error)', marginTop: '8px' }}><Trash2 size={16} /></button>
                        </div>
                    ))}
                </section>

                <section className="form-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><h3>Projects</h3><button className="btn-ghost" onClick={() => addItem('projects')}><Plus size={16} /></button></div>
                    {resumeData.projects.map((proj, index) => (
                        <div key={index} style={{ marginBottom: '20px', padding: '16px', border: '1px solid var(--border)', borderRadius: '4px' }}>
                            <input className="input-field" style={{ marginBottom: '8px' }} value={proj.title} onChange={(e) => updateItem('projects', index, 'title', e.target.value)} placeholder="Title" />
                            <textarea className="input-field" value={proj.description} onChange={(e) => updateItem('projects', index, 'description', e.target.value)} placeholder="Description..." />
                            {getBulletGuidance(proj.description)?.map((err, i) => (
                                <div key={i} className="guidance-inline"><Info size={12} /> {err}</div>
                            ))}
                            <button className="btn-ghost" onClick={() => removeItem('projects', index)} style={{ color: 'var(--error)', marginTop: '8px' }}><Trash2 size={16} /></button>
                        </div>
                    ))}
                </section>

                <section className="form-section"><h3>Skills</h3><input className="input-field" value={resumeData.skills} onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })} placeholder="Comma separated skills..." /></section>
            </div>

            <div className="preview-column">
                <div className={`resume-paper template-${template.toLowerCase()}`} style={{ transform: 'scale(0.75)', transformOrigin: 'top center' }}>
                    <div className="resume-header">
                        <h1 className="resume-name">{resumeData.personal.name || 'Your Name'}</h1>
                        <div className="resume-contact">{resumeData.personal.email} {resumeData.personal.phone && ` • ${resumeData.personal.phone}`}</div>
                        <div className="resume-contact">{resumeData.personal.location}</div>
                    </div>

                    {resumeData.summary && <div className="resume-section"><div className="resume-section-title">Summary</div><p style={{ fontSize: '0.9rem' }}>{resumeData.summary}</p></div>}

                    {resumeData.experience.length > 0 && (
                        <div className="resume-section">
                            <div className="resume-section-title">Experience</div>
                            {resumeData.experience.map((exp, i) => (
                                <div key={i} style={{ marginBottom: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}><span>{exp.company}</span></div>
                                    <div style={{ fontStyle: 'italic', fontSize: '0.85rem' }}>{exp.role}</div>
                                    <p style={{ fontSize: '0.85rem' }}>• {exp.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {resumeData.projects.length > 0 && (
                        <div className="resume-section">
                            <div className="resume-section-title">Projects</div>
                            {resumeData.projects.map((proj, i) => (
                                <div key={i} style={{ marginBottom: '8px' }}><div style={{ fontWeight: 700 }}>{proj.title}</div><p style={{ fontSize: '0.85rem' }}>• {proj.description}</p></div>
                            ))}
                        </div>
                    )}

                    {resumeData.skills && <div className="resume-section"><div className="resume-section-title">Skills</div><p style={{ fontSize: '0.9rem' }}>{resumeData.skills}</p></div>}
                </div>
            </div>
        </div>
    );
};

export default Builder;
