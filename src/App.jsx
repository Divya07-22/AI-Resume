import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import PremiumLayout from './components/layout/PremiumLayout';
import StepPage from './pages/rb/StepPage';
import ProofPage from './pages/rb/ProofPage';
import './styles/design-system.css';

const STEPS = [
  { id: '01', title: 'Problem Statement', path: '/rb/01-problem' },
  { id: '02', title: 'Market Analysis', path: '/rb/02-market' },
  { id: '03', title: 'Architecture Design', path: '/rb/03-architecture' },
  { id: '04', title: 'High Level Design', path: '/rb/04-hld' },
  { id: '05', title: 'Low Level Design', path: '/rb/05-lld' },
  { id: '06', title: 'Build Track', path: '/rb/06-build' },
  { id: '07', title: 'Testing Phase', path: '/rb/07-test' },
  { id: '08', title: 'Shipment', path: '/rb/08-ship' },
];

const GatedRoute = ({ children, stepIndex }) => {
  // Check if all previous steps are completed
  for (let i = 0; i < stepIndex; i++) {
    const prevStepId = STEPS[i].id;
    if (!localStorage.getItem(`rb_step_${prevStepId}_artifact`)) {
      return <Navigate to={STEPS[i].path} replace />;
    }
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/rb/01-problem" replace />} />

        {STEPS.map((step, index) => (
          <Route
            key={step.id}
            path={step.path}
            element={
              <GatedRoute stepIndex={index}>
                <PremiumLayout currentStep={index + 1} totalSteps={8}>
                  <StepPage step={step} />
                </PremiumLayout>
              </GatedRoute>
            }
          />
        ))}

        <Route
          path="/rb/proof"
          element={
            <GatedRoute stepIndex={8}>
              <PremiumLayout currentStep={8} totalSteps={8}>
                <ProofPage />
              </PremiumLayout>
            </GatedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
