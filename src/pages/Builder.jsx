import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Database, Award, Lightbulb, CheckCircle2, Layout, Info, X, Sparkles, ChevronDown, ChevronUp, ExternalLink, Github, Linkedin } from 'lucide-react';

const ACTION_VERBS = ['Built', 'Developed', 'Designed', 'Implemented', 'Led', 'Improved', 'Created', 'Optimized', 'Automated'];

// Reuseable Tag Input Component
const TagInput = ({ tags, onAdd, onRemove, placeholder }) => {
    const [input, setInput] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            onAdd(input.trim());
            setInput('');
        }
    };

    return (
        <div className="tag-input-wrapper">
            {tags.map((tag, idx) => (
                <span key={idx} className="tag-pill">
                    {tag}
                    <span className="tag-remove" onClick={() => onRemove(idx)}><X size={14} /></span>
                </span>
            ))}
            <input
                className="tag-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder || "Type and press Enter..."}
            />
        </div>
    );
};

const Builder = () => {
    const [resumeData, setResumeData] = useState({
        personal: { name: '', email: '', phone: '', location: '' },
        summary: '',
        education: [],
        experience: [],
        projects: [],
        skills: { technical: [], soft: [], tools: [] },
        links: { github: '', linkedin: '' }
    });

    const [score, setScore] = useState(0);
    const [suggestions, setSuggestions] = useState([]);
    const [template, setTemplate] = useState('Classic');
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [expandedProjects, setExpandedProjects] = useState({});

    // Hydrate from localStorage
    useEffect(() => {
        const savedData = localStorage.getItem('resumeBuilderData');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Migration logic for old skills structure
                if (typeof parsed.skills === 'string') {
                    const oldSkills = parsed.skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
                    parsed.skills = { technical: oldSkills, soft: [], tools: [] };
                }
                setResumeData(parsed);
            } catch (e) { }
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
        if (!data) return;
        let s = 0;
        const sugs = [];

        // Rules
        if (data.personal?.name) s += 10; else sugs.push({ id: 'name', text: "Add your full name (+10)" });
        if (data.personal?.email) s += 10; else sugs.push({ id: 'email', text: "Add a professional email (+10)" });
        if (data.summary?.length > 50) s += 10; else sugs.push({ id: 'summary', text: "Write a summary >50 chars (+10)" });

        const hasBullets = data.experience?.some(e => e.description?.includes('•') || e.description?.includes('-') || e.description?.includes('\n'));
        if (hasBullets) s += 15; else sugs.push({ id: 'bullets', text: "Use bullet points in experience (+15)" });

        if (data.education?.length > 0) s += 10; else sugs.push({ id: 'edu', text: "Add education history (+10)" });

        const skillCount = (data.skills?.technical?.length || 0) + (data.skills?.soft?.length || 0) + (data.skills?.tools?.length || 0);
        if (skillCount >= 5) s += 10; else sugs.push({ id: 'skills', text: "Add at least 5 skills (+10)" });

        if (data.projects?.length > 0) s += 10; else sugs.push({ id: 'proj', text: "Add at least 1 project (+10)" });

        if (data.personal?.phone) s += 5; else sugs.push({ id: 'phone', text: "Add phone number (+5)" });
        if (data.links?.linkedin) s += 5; else sugs.push({ id: 'li', text: "Add LinkedIn (+5)" });
        if (data.links?.github) s += 5; else sugs.push({ id: 'gh', text: "Add GitHub (+5)" });

        const hasVerbs = ACTION_VERBS.some(v => data.summary?.toLowerCase().includes(v.toLowerCase()));
        if (hasVerbs) s += 10; else sugs.push({ id: 'verbs', text: "Use action verbs in summary (+10)" });

        setScore(s);
        setSuggestions(sugs.slice(0, 3));
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

    const suggestSkills = () => {
        setIsSuggesting(true);
        setTimeout(() => {
            setResumeData(prev => ({
                ...prev,
                skills: {
                    technical: Array.from(new Set([...prev.skills.technical, "TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"])),
                    soft: Array.from(new Set([...prev.skills.soft, "Team Leadership", "Problem Solving"])),
                    tools: Array.from(new Set([...prev.skills.tools, "Git", "Docker", "AWS"]))
                }
            }));
            setIsSuggesting(false);
        }, 1000);
    };

    const handleSkillAdd = (category, tag) => {
        if (resumeData.skills[category].includes(tag)) return;
        setResumeData(prev => ({
            ...prev,
            skills: { ...prev.skills, [category]: [...prev.skills[category], tag] }
        }));
    };

    const handleSkillRemove = (category, index) => {
        setResumeData(prev => ({
            ...prev,
            skills: { ...prev.skills, [category]: prev.skills[category].filter((_, i) => i !== index) }
        }));
    };

    const toggleProject = (index) => {
        setExpandedProjects(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const addItem = (section) => {
        const item = section === 'education' ? { school: '', degree: '', year: '' } :
            section === 'experience' ? { company: '', role: '', duration: '', description: '' } :
                { title: '', description: '', techStack: [], liveUrl: '', githubUrl: '' };
        setResumeData(prev => ({ ...prev, [section]: [...prev[section], item] }));
        if (section === 'projects') {
            setExpandedProjects(prev => ({ ...prev, [resumeData.projects.length]: true }));
        }
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
                </div>

                {/* Form Sections */}
                <section className="form-section">
                    <h3>Personal Info</h3>
                    <input className="input-field" name="name" value={resumeData.personal.name} onChange={(e) => setResumeData(prev => ({ ...prev, personal: { ...prev.personal, name: e.target.value } }))} placeholder="Full Name" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                        <input className="input-field" value={resumeData.personal.email} onChange={(e) => setResumeData(prev => ({ ...prev, personal: { ...prev.personal, email: e.target.value } }))} placeholder="Email" />
                        <input className="input-field" value={resumeData.personal.phone} onChange={(e) => setResumeData(prev => ({ ...prev, personal: { ...prev.personal, phone: e.target.value } }))} placeholder="Phone" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                        <div className="input-with-icon" style={{ position: 'relative' }}>
                            <Linkedin size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#666' }} />
                            <input className="input-field" style={{ paddingLeft: '32px' }} value={resumeData.links.linkedin} onChange={(e) => setResumeData(prev => ({ ...prev, links: { ...prev.links, linkedin: e.target.value } }))} placeholder="LinkedIn URL" />
                        </div>
                        <div className="input-with-icon" style={{ position: 'relative' }}>
                            <Github size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#666' }} />
                            <input className="input-field" style={{ paddingLeft: '32px' }} value={resumeData.links.github} onChange={(e) => setResumeData(prev => ({ ...prev, links: { ...prev.links, github: e.target.value } }))} placeholder="GitHub URL" />
                        </div>
                    </div>
                </section>

                <section className="form-section">
                    <h3>Summary</h3>
                    <textarea className="input-field" style={{ height: '80px' }} value={resumeData.summary} onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })} placeholder="Professional summary..." />
                </section>

                {/* Education Section */}
                <section className="form-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><h3>Education</h3><button className="btn-ghost" onClick={() => addItem('education')}><Plus size={16} /></button></div>
                    {resumeData.education.map((edu, index) => (
                        <div key={index} style={{ marginBottom: '16px', padding: '16px', border: '1px solid var(--border)', borderRadius: '4px', background: '#fcfcfc' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '8px' }}>
                                <input className="input-field" value={edu.school} onChange={(e) => updateItem('education', index, 'school', e.target.value)} placeholder="University / School" />
                                <input className="input-field" value={edu.year} onChange={(e) => updateItem('education', index, 'year', e.target.value)} placeholder="Year (e.g. 2024)" />
                            </div>
                            <input className="input-field" value={edu.degree} onChange={(e) => updateItem('education', index, 'degree', e.target.value)} placeholder="Degree (e.g. B.Tech CS)" />
                            <button className="btn-ghost" onClick={() => removeItem('education', index)} style={{ color: 'var(--error)', marginTop: '8px' }}><Trash2 size={16} /></button>
                        </div>
                    ))}
                </section>

                {/* Advanced Skills Section */}
                <section className="form-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3>Skills</h3>
                        <button className="btn-spark" onClick={suggestSkills} disabled={isSuggesting}>
                            <Sparkles size={16} /> {isSuggesting ? 'Analyzing...' : 'Suggest Skills'}
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                Technical Skills ({resumeData.skills.technical.length})
                            </label>
                            <TagInput
                                tags={resumeData.skills.technical}
                                onAdd={(tag) => handleSkillAdd('technical', tag)}
                                onRemove={(idx) => handleSkillRemove('technical', idx)}
                                placeholder="Add tech skills..."
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                Soft Skills ({resumeData.skills.soft.length})
                            </label>
                            <TagInput
                                tags={resumeData.skills.soft}
                                onAdd={(tag) => handleSkillAdd('soft', tag)}
                                onRemove={(idx) => handleSkillRemove('soft', idx)}
                                placeholder="Add soft skills..."
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                Tools & Technologies ({resumeData.skills.tools.length})
                            </label>
                            <TagInput
                                tags={resumeData.skills.tools}
                                onAdd={(tag) => handleSkillAdd('tools', tag)}
                                onRemove={(idx) => handleSkillRemove('tools', idx)}
                                placeholder="Add tools..."
                            />
                        </div>
                    </div>
                </section>

                {/* Experience Section */}
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

                {/* Advanced Projects Section */}
                <section className="form-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3>Projects</h3>
                        <button className="btn-ghost" onClick={() => addItem('projects')}><Plus size={16} /> Add Project</button>
                    </div>
                    {resumeData.projects.map((proj, index) => (
                        <div key={index} className="project-card-ui">
                            <div className="project-card-header" onClick={() => toggleProject(index)}>
                                <span style={{ fontWeight: 600 }}>{proj.title || "New Project"}</span>
                                {expandedProjects[index] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </div>
                            {expandedProjects[index] && (
                                <div className="project-card-body">
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <input className="input-field" value={proj.title} onChange={(e) => updateItem('projects', index, 'title', e.target.value)} placeholder="Project Title" />
                                        <div>
                                            <textarea
                                                className="input-field"
                                                style={{ height: '80px' }}
                                                value={proj.description}
                                                onChange={(e) => e.target.value.length <= 200 && updateItem('projects', index, 'description', e.target.value)}
                                                placeholder="Description..."
                                            />
                                            <small className={`char-counter ${proj.description.length >= 200 ? 'limit' : ''}`}>
                                                {proj.description.length}/200
                                            </small>
                                            {getBulletGuidance(proj.description)?.map((err, i) => (
                                                <div key={i} className="guidance-inline"><Info size={12} /> {err}</div>
                                            ))}
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Tech Stack</label>
                                            <TagInput
                                                tags={proj.techStack || []}
                                                onAdd={(tag) => updateItem('projects', index, 'techStack', [...(proj.techStack || []), tag])}
                                                onRemove={(idx) => updateItem('projects', index, 'techStack', proj.techStack.filter((_, i) => i !== idx))}
                                                placeholder="Add technology..."
                                            />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                            <input className="input-field" value={proj.liveUrl || ''} onChange={(e) => updateItem('projects', index, 'liveUrl', e.target.value)} placeholder="Live URL (Optional)" />
                                            <input className="input-field" value={proj.githubUrl || ''} onChange={(e) => updateItem('projects', index, 'githubUrl', e.target.value)} placeholder="GitHub URL (Optional)" />
                                        </div>
                                        <button className="btn-ghost" onClick={() => removeItem('projects', index)} style={{ color: 'var(--error)', alignSelf: 'flex-start' }}><Trash2 size={16} /> Delete Project</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </section>
            </div>

            <div className="preview-column">
                <div className={`resume-paper template-${template.toLowerCase()}`} style={{ transform: 'scale(0.75)', transformOrigin: 'top center' }}>
                    <div className="resume-header">
                        <h1 className="resume-name">{resumeData.personal.name || 'Your Name'}</h1>
                        <div className="resume-contact">{resumeData.personal.email} {resumeData.personal.phone && ` • ${resumeData.personal.phone}`}</div>
                        {(resumeData.links.linkedin || resumeData.links.github) && (
                            <div className="resume-contact" style={{ marginTop: '4px', gap: '16px' }}>
                                {resumeData.links.linkedin && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Linkedin size={12} /> <span style={{ fontSize: '0.85rem' }}>{resumeData.links.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
                                    </span>
                                )}
                                {resumeData.links.github && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Github size={12} /> <span style={{ fontSize: '0.85rem' }}>{resumeData.links.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {resumeData.summary && <div className="resume-section"><div className="resume-section-title">Summary</div><p style={{ fontSize: '0.85rem' }}>{resumeData.summary}</p></div>}

                    {resumeData.education.length > 0 && (
                        <div className="resume-section">
                            <div className="resume-section-title">Education</div>
                            {resumeData.education.map((edu, i) => (
                                <div key={i} style={{ marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.9rem' }}>
                                        <span>{edu.school}</span>
                                        <span>{edu.year}</span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>{edu.degree}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {resumeData.experience.length > 0 && (
                        <div className="resume-section">
                            <div className="resume-section-title">Experience</div>
                            {resumeData.experience.map((exp, i) => (
                                <div key={i} style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.9rem' }}>
                                        <span>{exp.company}</span>
                                        <span style={{ fontSize: '0.8rem', color: '#666' }}>{exp.duration}</span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '2px' }}>{exp.role}</div>
                                    <p style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Technical Skills */}
                    {resumeData.skills.technical.length > 0 && (
                        <div className="resume-section">
                            <div className="resume-section-title">Technical Skills</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {resumeData.skills.technical.map((s, i) => (
                                    <span key={i} className="preview-pill">{s}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Soft Skills */}
                    {resumeData.skills.soft.length > 0 && (
                        <div className="resume-section">
                            <div className="resume-section-title">Soft Skills</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {resumeData.skills.soft.map((s, i) => (
                                    <span key={i} className="preview-pill">{s}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tools */}
                    {resumeData.skills.tools.length > 0 && (
                        <div className="resume-section">
                            <div className="resume-section-title">Tools & Technologies</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {resumeData.skills.tools.map((s, i) => (
                                    <span key={i} className="preview-pill">{s}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Project Cards in Preview */}
                    {resumeData.projects.length > 0 && (
                        <div className="resume-section">
                            <div className="resume-section-title">Projects</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {resumeData.projects.map((proj, i) => (
                                    <div key={i} style={{ padding: '10px', border: '1px solid #eee', borderRadius: '4px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{proj.title}</span>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" style={{ color: '#666' }}><Github size={14} /></a>}
                                                {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" style={{ color: '#666' }}><ExternalLink size={14} /></a>}
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '0.8rem', marginBottom: '8px' }}>{proj.description}</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                            {proj.techStack?.map((tech, ti) => (
                                                <span key={ti} style={{ fontSize: '0.7rem', padding: '1px 6px', border: '1px solid #ddd', borderRadius: '3px', color: '#555' }}>{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Builder;
