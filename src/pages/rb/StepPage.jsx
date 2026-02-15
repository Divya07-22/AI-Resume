import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';

const StepPage = ({ step }) => {
    const navigate = useNavigate();
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        const checkCompletion = () => {
            const completed = !!localStorage.getItem(`rb_step_${step.id}_artifact`);
            setIsCompleted(completed);
        };
        checkCompletion();
        window.addEventListener('storage', checkCompletion);
        return () => window.removeEventListener('storage', checkCompletion);
    }, [step.id]);

    const handleNext = () => {
        const currentNum = parseInt(step.id);
        if (currentNum < 8) {
            const nextId = (currentNum + 1).toString().padStart(2, '0');
            navigate(`/rb/${nextId}`);
        } else {
            navigate('/rb/proof');
        }
    };

    return (
        <div className="step-page">
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)', color: 'var(--accent)' }}>
                    {step.id}. {step.title}
                </h1>

                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
                    This is the implementation of step {step.id} for the AI Resume Builder project.
                    Follow the instructions in the build panel to generate the required artifact.
                </p>

                <div style={{ background: '#f9f9f9', padding: 'var(--spacing-lg)', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
                    <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Task Requirements:</h4>
                    <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <li>Review the problem statement for AI Resume Builder.</li>
                        <li>Initialize the project structure in Lovable.</li>
                        <li>Take a screenshot of the initial build and upload it as an artifact.</li>
                    </ul>
                </div>

                <div style={{ marginTop: 'var(--spacing-xl)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        className="btn-primary"
                        disabled={!isCompleted}
                        onClick={handleNext}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        Next Step <ArrowRight size={18} />
                    </button>
                </div>

                {!isCompleted && (
                    <p style={{ marginTop: '12px', textAlign: 'right', fontSize: '0.85rem', color: 'var(--error)' }}>
                        * Complete artifact upload in Build Panel to unlock next step.
                    </p>
                )}
            </div>
        </div>
    );
};

export default StepPage;
