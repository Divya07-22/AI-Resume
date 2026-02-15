import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Database } from 'lucide-react';

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

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('resume_data_skeleton');
        if (saved) {
            setResumeData(JSON.parse(saved));
        }
    }, []);

    // Sync to localStorage on change
    useEffect(() => {
        localStorage.setItem('resume_data_skeleton', JSON.stringify(resumeData));
    }, [resumeData]);

    const loadSampleData = () => {
        const sample = {
            personal: {
                name: 'Divya Sharma',
                email: 'divya.sharma@example.com',
                phone: '+91 98765 43210',
                location: 'Bangalore, India'
            },
            summary: 'Passionate Full Stack Developer with experience in building scalable web applications using React and Node.js. Focused on performance optimization and clean code architecture.',
            education: [
                { school: 'KodNest Institute', degree: 'Full Stack Web Development', year: '2025' }
            ],
            experience: [
                { company: 'Tech Solutions', role: 'Frontend Intern', duration: 'June 2024 - Dec 2024', description: 'Developed 10+ responsive UI components.' }
            ],
            projects: [
                { title: 'AI Resume Builder', tech: 'React, Vite', description: 'Built a premium resume platform with live scoring.' }
            ],
            skills: 'React, JavaScript, CSS, HTML, Node.js, Git, SQL',
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)' }}>Resume Content</h2>
                    <button className="btn-ghost" onClick={loadSampleData} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Database size={16} /> Load Sample Data
                    </button>
                </div>

                {/* Personal Info */}
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

                {/* Summary */}
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

                {/* Education */}
                <section className="form-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3>Education</h3>
                        <button className="btn-ghost" onClick={() => addItem('education')}><Plus size={16} /></button>
                    </div>
                    {resumeData.education.map((edu, index) => (
                        <div key={index} style={{ marginBottom: '20px', padding: '16px', border: '1px solid var(--border)', borderRadius: '4px' }}>
                            <div className="input-group"><input className="input-field" value={edu.school} onChange={(e) => updateItem('education', index, 'school', e.target.value)} placeholder="University / School" /></div>
                            <div className="input-group"><input className="input-field" value={edu.degree} onChange={(e) => updateItem('education', index, 'degree', e.target.value)} placeholder="Degree" /></div>
                            <div className="input-group"><input className="input-field" value={edu.year} onChange={(e) => updateItem('education', index, 'year', e.target.value)} placeholder="Graduation Year" /></div>
                            <button className="btn-ghost" onClick={() => removeItem('education', index)} style={{ marginTop: '8px', color: 'var(--error)' }}><Trash2 size={16} /></button>
                        </div>
                    ))}
                </section>

                {/* Experience */}
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

                {/* Projects */}
                <section className="form-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3>Projects</h3>
                        <button className="btn-ghost" onClick={() => addItem('projects')}><Plus size={16} /></button>
                    </div>
                    {resumeData.projects.map((proj, index) => (
                        <div key={index} style={{ marginBottom: '20px', padding: '16px', border: '1px solid var(--border)', borderRadius: '4px' }}>
                            <div className="input-group"><input className="input-field" value={proj.title} onChange={(e) => updateItem('projects', index, 'title', e.target.value)} placeholder="Project Title" /></div>
                            <div className="input-group"><input className="input-field" value={proj.tech} onChange={(e) => updateItem('projects', index, 'tech', e.target.value)} placeholder="Technologies Used" /></div>
                            <textarea className="input-field" value={proj.description} onChange={(e) => updateItem('projects', index, 'description', e.target.value)} placeholder="Project description..." />
                            <button className="btn-ghost" onClick={() => removeItem('projects', index)} style={{ marginTop: '8px', color: 'var(--error)' }}><Trash2 size={16} /></button>
                        </div>
                    ))}
                </section>

                {/* Skills */}
                <section className="form-section">
                    <h3>Skills</h3>
                    <input
                        className="input-field"
                        value={resumeData.skills}
                        onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })}
                        placeholder="React, JavaScript, Node.js..."
                    />
                </section>

                {/* Links */}
                <section className="form-section">
                    <h3>Links</h3>
                    <div className="input-group"><label>GitHub</label><input className="input-field" value={resumeData.links.github} onChange={(e) => setResumeData({ ...resumeData, links: { ...resumeData.links, github: e.target.value } })} /></div>
                    <div className="input-group"><label>LinkedIn</label><input className="input-field" value={resumeData.links.linkedin} onChange={(e) => setResumeData({ ...resumeData, links: { ...resumeData.links, linkedin: e.target.value } })} /></div>
                </section>
            </div>

            {/* Live Preview Column */}
            <div className="preview-column">
                <div className="resume-paper" style={{ transform: 'scale(0.8)', transformOrigin: 'top center' }}>
                    <div className="resume-header">
                        <h1 className="resume-name">{resumeData.personal.name || 'Your Name'}</h1>
                        <div className="resume-contact">
                            {resumeData.personal.email} {resumeData.personal.phone && ` | ${resumeData.personal.phone}`}
                        </div>
                        <div className="resume-contact">
                            {resumeData.personal.location} {resumeData.links.github && ` | GitHub: ${resumeData.links.github}`}
                        </div>
                    </div>

                    <div className="resume-section">
                        <div className="resume-section-title">Summary</div>
                        <p style={{ fontSize: '0.95rem' }}>{resumeData.summary || 'Summary placeholder...'}</p>
                    </div>

                    <div className="resume-section">
                        <div className="resume-section-title">Experience</div>
                        {resumeData.experience.length > 0 ? resumeData.experience.map((exp, i) => (
                            <div key={i} style={{ marginBottom: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                                    <span>{exp.company}</span>
                                    <span>{exp.duration}</span>
                                </div>
                                <div style={{ fontStyle: 'italic' }}>{exp.role}</div>
                                <p style={{ fontSize: '0.9rem' }}>{exp.description}</p>
                            </div>
                        )) : <p>Experience placeholder...</p>}
                    </div>

                    <div className="resume-section">
                        <div className="resume-section-title">Skills</div>
                        <p style={{ fontSize: '0.95rem' }}>{resumeData.skills || 'Skills placeholder...'}</p>
                    </div>

                    <div style={{ border: '2px dashed #ddd', padding: '40px', textAlign: 'center', color: '#aaa', marginTop: 'auto' }}>
                        Structured Preview Shell
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Builder;
