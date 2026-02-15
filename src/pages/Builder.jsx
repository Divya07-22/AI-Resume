import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Database, Award, Lightbulb, CheckCircle2 } from 'lucide-react';

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

    // Hydrate from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('resumeBuilderData');
        if (saved) {
            try {
                setResumeData(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse saved data");
            }
        }
    }, []);

    // Autosave and calculate score
    useEffect(() => {
        localStorage.setItem('resumeBuilderData', JSON.stringify(resumeData));
        calculateATSScore(resumeData);
    }, [resumeData]);

    const calculateATSScore = (data) => {
        let currentScore = 0;
        const currentSuggestions = [];

        // 1. Summary (40-120 words)
        const summaryWords = data.summary.trim() ? data.summary.trim().split(/\s+/).length : 0;
        if (summaryWords >= 40 && summaryWords <= 120) {
            currentScore += 15;
        } else if (data.summary.trim()) {
            currentSuggestions.push("Write a stronger summary (target 40–120 words).");
        } else {
            currentSuggestions.push("Add a professional summary.");
        }

        // 2. Projects (at least 2)
        if (data.projects.length >= 2) {
            currentScore += 10;
        } else {
            currentSuggestions.push("Add at least 2 projects to showcase your skills.");
        }

        // 3. Experience (at least 1)
        if (data.experience.length >= 1) {
            currentScore += 10;
        } else {
            currentSuggestions.push("Add at least 1 work experience entry.");
        }

        // 4. Skills (at least 8)
        const skillsCount = data.skills ? data.skills.split(',').filter(s => s.trim().length > 0).length : 0;
        if (skillsCount >= 8) {
            currentScore += 10;
        } else {
            currentSuggestions.push("Add more skills (target 8+ keywords).");
        }

        // 5. Links
        if (data.links.github || data.links.linkedin) {
            currentScore += 10;
        } else {
            currentSuggestions.push("Add GitHub or LinkedIn links for proof.");
        }

        // 6. Measurable Impact (numbers)
        const hasNumbers = [...data.experience, ...data.projects].some(item =>
            /[0-9]/.test(item.description) || /%|X|k|M/i.test(item.description)
        );
        if (hasNumbers) {
            currentScore += 15;
        } else {
            currentSuggestions.push("Add measurable impact (numbers/%) in your bullet points.");
        }

        // 7. Education Complete
        const isEduComplete = data.education.length > 0 && data.education.every(edu => edu.school && edu.degree && edu.year);
        if (isEduComplete) {
            currentScore += 10;
        } else {
            currentSuggestions.push("Complete all fields in the Education section.");
        }

        setScore(Math.min(currentScore, 100));
        setSuggestions(currentSuggestions.slice(0, 3)); // Max 3 suggestions
    };

    const loadSampleData = () => {
        const sample = {
            personal: {
                name: 'Divya Sharma',
                email: 'divya.sharma@example.com',
                phone: '+91 98765 43210',
                location: 'Bangalore, India'
            },
            summary: 'Passionate and results-driven Full Stack Developer with 2+ years of experience in building scalable web applications. Expert in React, Node.js, and cloud architecture, focusing on performance optimization and writing 100% clean, maintainable code for diverse enterprise solutions.',
            education: [
                { school: 'KodNest Institute', degree: 'Full Stack Web Development', year: '2025' }
            ],
            experience: [
                { company: 'Tech Solutions', role: 'Frontend Intern', duration: 'June 2024 - Dec 2024', description: 'Developed 10+ responsive UI components reducing load time by 30%. Worked on user engagement features using React.' }
            ],
            projects: [
                { title: 'AI Resume Builder', tech: 'React, Vite', description: 'Built a premium resume platform with 100/100 deterministic scoring.' },
                { title: 'E-commerce API', tech: 'Node.js, MongoDB', description: 'Architected a backend system handling 5k+ requests per minute.' }
            ],
            skills: 'React, JavaScript, CSS, HTML, Node.js, Git, SQL, MongoDB, AWS, Docker',
            links: { github: 'https://github.com/Divya07-22', linkedin: 'https://linkedin.com/in/divyasharma' }
        };
        setResumeData(sample);
    };

    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        setResumeData(prev => ({
            ...prev,
            personal: { ...prev.personal, [name]: value }
        }));
    };

    const addItem = (section) => {
        const item = section === 'education' ? { school: '', degree: '', year: '' } :
            section === 'experience' ? { company: '', role: '', duration: '', description: '' } :
                { title: '', tech: '', description: '' };
        setResumeData(prev => ({
            ...prev,
            [section]: [...prev[section], item]
        }));
    };

    const updateItem = (section, index, field, value) => {
        const updated = [...resumeData[section]];
        updated[index][field] = value;
        setResumeData(prev => ({ ...prev, [section]: updated }));
    };

    const removeItem = (section, index) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="builder-container">
            {/* Scrollable Form Column */}
            <div className="form-column">
                {/* ATS Score Header */}
                <div className="score-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Award size={18} color="var(--accent)" /> ATS Readiness Score
                        </span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent)' }}>{score}/100</span>
                    </div>
                    <div className="score-meter-bg">
                        <div className="score-meter-fill" style={{ width: `${score}%` }}></div>
                    </div>

                    {suggestions.length > 0 && (
                        <div className="suggestions-list">
                            {suggestions.map((s, i) => (
                                <div key={i} className="suggestion-item">
                                    <Lightbulb size={14} className="suggestion-bullet" />
                                    <span>{s}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {score === 100 && (
                        <div className="suggestion-item" style={{ color: 'var(--success)', fontWeight: 600 }}>
                            <CheckCircle2 size={14} /> Resume is ATS optimized!
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)' }}>Resume Content</h2>
                    <button className="btn-ghost" onClick={loadSampleData} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Database size={16} /> Load Sample Data
                    </button>
                </div>

                {/* Form Sections */}
                <section className="form-section">
                    <h3>Personal Info</h3>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input className="input-field" name="name" value={resumeData.personal.name} onChange={handlePersonalChange} placeholder="John Doe" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="input-group">
                            <label>Email</label>
                            <input className="input-field" name="email" value={resumeData.personal.email} onChange={handlePersonalChange} placeholder="john@example.com" />
                        </div>
                        <div className="input-group">
                            <label>Phone</label>
                            <input className="input-field" name="phone" value={resumeData.personal.phone} onChange={handlePersonalChange} placeholder="+91 ..." />
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Location</label>
                        <input className="input-field" name="location" value={resumeData.personal.location} onChange={handlePersonalChange} placeholder="City, Country" />
                    </div>
                </section>

                <section className="form-section">
                    <h3>Professional Summary</h3>
                    <textarea
                        className="input-field"
                        style={{ height: '100px', resize: 'vertical' }}
                        value={resumeData.summary}
                        onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                        placeholder="Briefly describe your career goals and expertise..."
                    />
                </section>

                <section className="form-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3>Education</h3>
                        <button className="btn-ghost" onClick={() => addItem('education')}><Plus size={16} /></button>
                    </div>
                    {resumeData.education.map((edu, index) => (
                        <div key={index} style={{ marginBottom: '20px', padding: '16px', border: '1px solid var(--border)', borderRadius: '4px' }}>
                            <div className="input-group"><input className="input-field" value={edu.school} onChange={(e) => updateItem('education', index, 'school', e.target.value)} placeholder="University / School" /></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <input className="input-field" value={edu.degree} onChange={(e) => updateItem('education', index, 'degree', e.target.value)} placeholder="Degree" />
                                <input className="input-field" value={edu.year} onChange={(e) => updateItem('education', index, 'year', e.target.value)} placeholder="Year" />
                            </div>
                            <button className="btn-ghost" onClick={() => removeItem('education', index)} style={{ marginTop: '8px', color: 'var(--error)' }}><Trash2 size={16} /></button>
                        </div>
                    ))}
                </section>

                <section className="form-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3>Experience</h3>
                        <button className="btn-ghost" onClick={() => addItem('experience')}><Plus size={16} /></button>
                    </div>
                    {resumeData.experience.map((exp, index) => (
                        <div key={index} style={{ marginBottom: '20px', padding: '16px', border: '1px solid var(--border)', borderRadius: '4px' }}>
                            <div className="input-group"><input className="input-field" value={exp.company} onChange={(e) => updateItem('experience', index, 'company', e.target.value)} placeholder="Company" /></div>
                            <div className="input-group"><input className="input-field" value={exp.role} onChange={(e) => updateItem('experience', index, 'role', e.target.value)} placeholder="Role" /></div>
                            <div className="input-group"><input className="input-field" value={exp.duration} onChange={(e) => updateItem('experience', index, 'duration', e.target.value)} placeholder="Duration" /></div>
                            <textarea className="input-field" value={exp.description} onChange={(e) => updateItem('experience', index, 'description', e.target.value)} placeholder="Key achievements..." />
                            <button className="btn-ghost" onClick={() => removeItem('experience', index)} style={{ marginTop: '8px', color: 'var(--error)' }}><Trash2 size={16} /></button>
                        </div>
                    ))}
                </section>

                <section className="form-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3>Projects</h3>
                        <button className="btn-ghost" onClick={() => addItem('projects')}><Plus size={16} /></button>
                    </div>
                    {resumeData.projects.map((proj, index) => (
                        <div key={index} style={{ marginBottom: '20px', padding: '16px', border: '1px solid var(--border)', borderRadius: '4px' }}>
                            <div className="input-group"><input className="input-field" value={proj.title} onChange={(e) => updateItem('projects', index, 'title', e.target.value)} placeholder="Project Title" /></div>
                            <div className="input-group"><input className="input-field" value={proj.tech} onChange={(e) => updateItem('projects', index, 'tech', e.target.value)} placeholder="Technologies" /></div>
                            <textarea className="input-field" value={proj.description} onChange={(e) => updateItem('projects', index, 'description', e.target.value)} placeholder="Description..." />
                            <button className="btn-ghost" onClick={() => removeItem('projects', index)} style={{ marginTop: '8px', color: 'var(--error)' }}><Trash2 size={16} /></button>
                        </div>
                    ))}
                </section>

                <section className="form-section">
                    <h3>Skills</h3>
                    <input
                        className="input-field"
                        value={resumeData.skills}
                        onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })}
                        placeholder="React, JavaScript, Node.js..."
                    />
                </section>

                <section className="form-section">
                    <h3>Links</h3>
                    <div className="input-group"><label>GitHub</label><input className="input-field" value={resumeData.links.github} onChange={(e) => setResumeData({ ...resumeData, links: { ...resumeData.links, github: e.target.value } })} /></div>
                    <div className="input-group"><label>LinkedIn</label><input className="input-field" value={resumeData.links.linkedin} onChange={(e) => setResumeData({ ...resumeData, links: { ...resumeData.links, linkedin: e.target.value } })} /></div>
                </section>
            </div>

            {/* Real Live Preview Column */}
            <div className="preview-column">
                <div className="resume-paper" style={{ transform: 'scale(0.8)', transformOrigin: 'top center' }}>
                    {/* Header */}
                    <div className="resume-header">
                        <h1 className="resume-name">{resumeData.personal.name || 'Your Name'}</h1>
                        <div className="resume-contact">
                            {resumeData.personal.email} {resumeData.personal.phone && ` • ${resumeData.personal.phone}`}
                        </div>
                        <div className="resume-contact">
                            {resumeData.personal.location}
                        </div>
                        <div className="resume-contact" style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                            {resumeData.links.github && `GitHub: ${resumeData.links.github}`}
                            {resumeData.links.github && resumeData.links.linkedin && ` • `}
                            {resumeData.links.linkedin && `LinkedIn: ${resumeData.links.linkedin}`}
                        </div>
                    </div>

                    {/* Sections based on content existence */}
                    {resumeData.summary && (
                        <div className="resume-section">
                            <div className="resume-section-title">Summary</div>
                            <p style={{ fontSize: '0.95rem' }}>{resumeData.summary}</p>
                        </div>
                    )}

                    {resumeData.experience.length > 0 && (
                        <div className="resume-section">
                            <div className="resume-section-title">Experience</div>
                            {resumeData.experience.map((exp, i) => (
                                <div key={i} style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                                        <span>{exp.company}</span>
                                        <span>{exp.duration}</span>
                                    </div>
                                    <div style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>{exp.role}</div>
                                    <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {resumeData.education.length > 0 && (
                        <div className="resume-section">
                            <div className="resume-section-title">Education</div>
                            {resumeData.education.map((edu, i) => (
                                <div key={i} style={{ marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                                        <span>{edu.school}</span>
                                        <span>{edu.year}</span>
                                    </div>
                                    <div style={{ fontSize: '0.9rem' }}>{edu.degree}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {resumeData.projects.length > 0 && (
                        <div className="resume-section">
                            <div className="resume-section-title">Projects</div>
                            {resumeData.projects.map((proj, i) => (
                                <div key={i} style={{ marginBottom: '8px' }}>
                                    <div style={{ fontWeight: 700 }}>{proj.title} <span style={{ fontWeight: 400, color: '#666', fontSize: '0.85rem' }}>— {proj.tech}</span></div>
                                    <p style={{ fontSize: '0.9rem' }}>{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {resumeData.skills && (
                        <div className="resume-section">
                            <div className="resume-section-title">Skills</div>
                            <p style={{ fontSize: '0.95rem' }}>{resumeData.skills}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Builder;
