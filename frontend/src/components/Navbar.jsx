import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import Button from './ui/Button';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-card px-6 py-3 border-white/5">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30">
            <Activity className="text-primary" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            NeuroLens AI
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#demo" className="hover:text-primary transition-colors">Live Preview</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="glass" size="sm">Login</Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
