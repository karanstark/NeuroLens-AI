import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Onboarding from './pages/Auth/Onboarding';
import Dashboard from './pages/Dashboard/Dashboard';
import ReportAnalysis from './pages/ReportAnalysis';
import InteractiveDemo from './pages/InteractiveDemo';

function App() {
  // Simple auth check (placeholder)
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="min-h-screen bg-dark">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/analysis" element={<ReportAnalysis />} />
          <Route path="/demo" element={<InteractiveDemo />} />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} 
          />
          {/* Auth routes removed as per request - will be re-added later */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
