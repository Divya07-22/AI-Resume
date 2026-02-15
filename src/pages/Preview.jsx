import React, { useEffect, useState } from 'react';

const Preview = () => {
    const [resumeData, setResumeData] = useState(null);
    const [template, setTemplate] = useState('Classic');

    useEffect(() => {
        const savedData = localStorage.getItem('resumeBuilderData');
        if (savedData) {
            setResumeData(JSON.parse(savedData));
        }

        const savedTemplate = localStorage.getItem('resumeTemplateChoice');
        if (savedTemplate) setTemplate(savedTemplate);
    }, []);

    if (!resumeData) {
        return (
            <div className="workspace" style={{ textAlign: 'center', paddingTop: '100px' }}>
                <h2 style={{ color: 'var(--text-secondary)' }}>No resume data found. Start building!</h2>
            </div>
        );
    }

    return (
        <div className="preview-container" style={{ padding: 'var(--spacing-xl)', background: '#EAEAEA', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Template Tab Info in Preview */}
            <div style={{ marginBottom: '24px', background: 'white', padding: '8px 24px', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                Viewing in {template} Mode
            </div>

            <div className={`resume-paper template-${template.toLowerCase()}`} style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
                {/* Header */}
                <div className="resume-header">
                    <h1 className="resume-name" style={{ color: '#000', letterSpacing: '-0.02em' }}>
                        {resumeData.personal.name || 'Your Name'}
                    </h1>
                    <div className="resume-contact" style={{ color: '#333' }}>
                        {resumeData.personal.email} {resumeData.personal.phone && ` • ${resumeData.personal.phone}`}
                    </div>
                    <div className="resume-contact" style={{ color: '#333' }}>
                        {resumeData.personal.location}
                        {resumeData.links.github && ` • GitHub: ${resumeData.links.github}`}
                        {resumeData.links.linkedin && ` • LinkedIn: ${resumeData.links.linkedin}`}
                    </div>
                </div>

                {/* Summary */}
                {resumeData.summary && (
                    <div className="resume-section">
                        <div className="resume-section-title">Summary</div>
                        <p style={{ fontSize: '1rem', color: '#111' }}>{resumeData.summary}</p>
                    </div>
                )}

                {/* Experience */}
                {resumeData.experience.length > 0 && (
                    <div className="resume-section">
                        <div className="resume-section-title">Experience</div>
                        {resumeData.experience.map((exp, i) => (
                            <div key={i} style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.05rem' }}>
                                    <span>{exp.company}</span>
                                    <span>{exp.duration}</span>
                                </div>
                                <div style={{ fontStyle: 'italic', marginBottom: '4px' }}>{exp.role}</div>
                                <p style={{ fontSize: '0.95rem', color: '#222' }}>{exp.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Education */}
                {resumeData.education.length > 0 && (
                    <div className="resume-section">
                        <div className="resume-section-title">Education</div>
                        {resumeData.education.map((edu, i) => (
                            <div key={i} style={{ marginBottom: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                                    <span>{edu.school}</span>
                                    <span>{edu.year}</span>
                                </div>
                                <div>{edu.degree}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Projects */}
                {resumeData.projects.length > 0 && (
                    <div className="resume-section">
                        <div className="resume-section-title">Projects</div>
                        {resumeData.projects.map((proj, i) => (
                            <div key={i} style={{ marginBottom: '12px' }}>
                                <div style={{ fontWeight: 700 }}>{proj.title} <span style={{ fontWeight: 400, color: '#555', fontSize: '0.85rem' }}> — {proj.tech}</span></div>
                                <p style={{ fontSize: '0.95rem' }}>{proj.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Skills */}
                {resumeData.skills && (
                    <div className="resume-section">
                        <div className="resume-section-title">Skills</div>
                        <p style={{ fontSize: '1rem' }}>{resumeData.skills}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Preview;
