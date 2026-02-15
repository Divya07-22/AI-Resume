import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="workspace" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="home-hero">
                <h1 className="hero-headline">
                    Build a Resume That <span style={{ color: 'var(--accent)' }}>Gets Read.</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xl)', maxWidth: '600px', margin: '0 auto var(--spacing-xl)' }}>
                    Stop fighting with templates. Focus on your impact. We'll handle the premium typography and ATS-friendly structure.
                </p>
                <button
                    className="btn-primary"
                    style={{ padding: '16px 40px', fontSize: '1.1rem', borderRadius: '50px' }}
                    onClick={() => navigate('/builder')}
                >
                    Start Building
                </button>
            </div>
        </div>
    );
};

export default Home;
