import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

const ProductLayout = ({ children }) => {
    return (
        <div className="premium-layout">
            {/* Top Bar / Navigation */}
            <header className="top-bar">
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                    <Activity size={24} color="var(--accent)" />
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>AI Resume Builder</h2>
                </Link>

                <nav className="product-nav">
                    <NavLink to="/builder" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        Builder
                    </NavLink>
                    <NavLink to="/preview" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        Preview
                    </NavLink>
                    <NavLink to="/proof" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        Proof
                    </NavLink>
                </nav>

                <div className={`badge ${localStorage.getItem('rb_project_status') === 'Shipped' ? 'shipped' : 'in-progress'}`}>
                    {localStorage.getItem('rb_project_status') === 'Shipped' ? 'Shipped' : 'In Progress'}
                </div>
            </header>

            {/* Main Content Area */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {children}
            </main>

            {/* Proof Footer */}
            <footer className="proof-footer">
                KodNest Premium Design System — Build Track Project 3
            </footer>
        </div>
    );
};

export default ProductLayout;
