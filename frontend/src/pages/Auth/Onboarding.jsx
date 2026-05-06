import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, ArrowLeft, Heart, User, Target, Clipboard } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import authService from '../../services/auth';

const steps = [
  { 
    id: 'basic', 
    title: 'The Basics', 
    icon: User,
    fields: ['age', 'gender'] 
  },
  { 
    id: 'goals', 
    title: 'Health Goals', 
    icon: Target,
    fields: ['health_goals'] 
  },
  { 
    id: 'history', 
    title: 'Medical History', 
    icon: Clipboard,
    fields: ['family_history', 'lifestyle_habits'] 
  }
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    health_goals: '',
    family_history: '',
    lifestyle_habits: ''
  });
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      await authService.onboard(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-dark neural-bg">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Activity className="text-primary" size={24} />
            <span className="text-xl font-bold">NeuroLens AI</span>
          </div>
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1.5 w-8 rounded-full transition-colors ${idx <= currentStep ? 'bg-primary' : 'bg-slate-800'}`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <StepIcon size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
                  <p className="text-slate-400">Step {currentStep + 1} of 3</p>
                </div>
              </div>

              <div className="space-y-6">
                {currentStep === 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">Age</label>
                      <input 
                        type="number"
                        className="w-full bg-slate-900 border border-white/5 rounded-xl p-3 text-white"
                        placeholder="e.g. 28"
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">Gender</label>
                      <select 
                        className="w-full bg-slate-900 border border-white/5 rounded-xl p-3 text-white"
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      >
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">What are your health goals?</label>
                    <textarea 
                      className="w-full h-32 bg-slate-900 border border-white/5 rounded-xl p-4 text-white resize-none"
                      placeholder="e.g. Reduce cholesterol, improve energy levels..."
                      value={formData.health_goals}
                      onChange={(e) => setFormData({...formData, health_goals: e.target.value})}
                    />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">Family Medical History</label>
                      <textarea 
                        className="w-full h-24 bg-slate-900 border border-white/5 rounded-xl p-4 text-white resize-none"
                        placeholder="e.g. History of heart disease, diabetes..."
                        value={formData.family_history}
                        onChange={(e) => setFormData({...formData, family_history: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">Lifestyle Habits</label>
                      <textarea 
                        className="w-full h-24 bg-slate-900 border border-white/5 rounded-xl p-4 text-white resize-none"
                        placeholder="e.g. Sedentary job, 3 cups coffee/day, occasional smoker..."
                        value={formData.lifestyle_habits}
                        onChange={(e) => setFormData({...formData, lifestyle_habits: e.target.value})}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-12">
                <button 
                  onClick={handleBack}
                  className={`flex items-center gap-2 text-slate-400 hover:text-white transition-colors ${currentStep === 0 ? 'invisible' : ''}`}
                >
                  <ArrowLeft size={18} /> Back
                </button>
                <Button onClick={handleNext} className="min-w-[140px]">
                  {currentStep === steps.length - 1 ? 'Complete Profile' : 'Continue'} <ArrowRight size={18} />
                </Button>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
