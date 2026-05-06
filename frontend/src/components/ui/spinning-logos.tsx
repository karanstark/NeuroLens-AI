"use client"

import React, { useState, useRef } from 'react';
import { 
  Stethoscope, 
  Activity, 
  HeartPulse, 
  Microscope, 
  Dna, 
  Thermometer,
  ShieldAlert,
  ChevronRight,
  BarChart3,
  Brain,
  History,
  X,
  Upload,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

interface AnalysisResult {
  status: string;
  type: string;
  summary: string;
  insights: string[];
  graph_data: any[];
}

export const SpinningLogos: React.FC = () => {
  const [selectedLogo, setSelectedLogo] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputMode, setInputMode] = useState<'manual' | 'upload'>('manual');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const radiusToCenterOfIcons = 180;
  const iconWrapperWidth = 60;
  const ringPadding = 40;

  const toRadians = (degrees: number): number => (Math.PI / 180) * degrees;

  const logos = [
    { 
      id: 'neural', 
      Icon: Brain, 
      className: 'bg-blue-600 text-white', 
      name: 'Neural Analysis', 
      fields: [
        { label: 'Alpha Frequency', unit: 'Hz', key: 'alpha' },
        { label: 'Cognitive Load', unit: '%', key: 'load' }
      ]
    },
    { 
      id: 'genetics', 
      Icon: Dna, 
      className: 'bg-purple-600 text-white', 
      name: 'Genetic Sequencing', 
      fields: [
        { label: 'Variant Frequency', unit: '%', key: 'variant' },
        { label: 'DNA Marker ID', unit: 'STR', key: 'marker' }
      ]
    },
    { 
      id: 'vitals', 
      Icon: HeartPulse, 
      className: 'bg-red-600 text-white', 
      name: 'Core Vitals', 
      fields: [
        { label: 'Heart Rate', unit: 'BPM', key: 'hr' },
        { label: 'Blood Pressure', unit: 'mmHg', key: 'bp' }
      ]
    },
    { 
      id: 'metabolic', 
      Icon: Activity, 
      className: 'bg-emerald-600 text-white', 
      name: 'Metabolic Flux', 
      fields: [
        { label: 'Glucose Level', unit: 'mg/dL', key: 'glucose' },
        { label: 'Insulin Index', unit: 'μU/mL', key: 'insulin' }
      ]
    },
    { 
      id: 'diagnosis', 
      Icon: Stethoscope, 
      className: 'bg-cyan-600 text-white', 
      name: 'Smart Diagnosis', 
      fields: [
        { label: 'Symptom Duration', unit: 'Days', key: 'duration' },
        { label: 'Pain Intensity', unit: '1-10', key: 'pain' }
      ]
    },
    { 
      id: 'predictive', 
      Icon: Thermometer, 
      className: 'bg-orange-600 text-white', 
      name: 'Predictive Trends', 
      fields: [
        { label: 'Patient Age', unit: 'Yrs', key: 'age' },
        { label: 'Vital Stability', unit: '%', key: 'stability' }
      ]
    },
    { 
      id: 'prevention', 
      Icon: ShieldAlert, 
      className: 'bg-indigo-600 text-white', 
      name: 'Risk Prevention', 
      fields: [
        { label: 'Risk Factor Count', unit: 'Qty', key: 'risks' },
        { label: 'Genomic Shield', unit: '%', key: 'shield' }
      ]
    },
  ];

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('type', selectedLogo.name);
      
      if (inputMode === 'manual') {
        formData.append('inputs', JSON.stringify(formValues));
      } else if (selectedFile) {
        formData.append('file', selectedFile);
        formData.append('inputs', JSON.stringify({ mode: 'Multimodal Document Analysis' })); // Ensure inputs is always present
      }

      const response = await fetch('/api/analysis/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Analysis failed", error);
      alert("AI analysis failed. Please check your connection or API keys.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const reset = () => {
    setSelectedLogo(null);
    setResult(null);
    setFormValues({});
    setSelectedFile(null);
    setInputMode('manual');
    setIsAnalyzing(false);
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-[#020617] p-4 md:p-8 overflow-hidden font-sans">
      
      {/* Cinematic Mesh Gradient */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
      </div>

      <AnimatePresence mode="wait">
        {!selectedLogo && !result && (
          <motion.div 
            key="logo-view"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="relative flex flex-col items-center"
          >
            <div
              style={{
                width: radiusToCenterOfIcons * 2 + iconWrapperWidth + ringPadding,
                height: radiusToCenterOfIcons * 2 + iconWrapperWidth + ringPadding,
              }}
              className="relative rounded-full bg-slate-900/40 shadow-2xl border border-white/5 backdrop-blur-md"
            >
              {/* Spinning Ring */}
              <div className="absolute inset-0 animate-spin-slow">
                {logos.map((logo, index) => {
                  const angle = (360 / logos.length) * index;
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.2, rotate: -angle }}
                      onClick={() => setSelectedLogo(logo)}
                      style={{
                        top: `calc(50% - ${iconWrapperWidth / 2}px + ${radiusToCenterOfIcons * Math.sin(toRadians(angle))}px)`,
                        left: `calc(50% - ${iconWrapperWidth / 2}px + ${radiusToCenterOfIcons * Math.cos(toRadians(angle))}px)`,
                        width: iconWrapperWidth,
                        height: iconWrapperWidth,
                      }}
                      className={cn(
                        "absolute flex items-center justify-center rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] border-2 border-white/10 animate-spin-reverse transition-all duration-300",
                        logo.className,
                        "hover:border-white hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                      )}
                      aria-label={`${logo.name} logo`}
                    >
                      <logo.Icon className="w-6 h-6" />
                    </motion.button>
                  );
                })}
              </div>

              {/* Center Logo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-slate-950/80 rounded-full w-[220px] h-[220px] flex flex-col items-center justify-center shadow-inner border border-white/10 backdrop-blur-xl">
                  <span className="text-xl sm:text-2xl font-black text-white text-center px-4 tracking-[0.1em]">
                    NEUROLENS AI
                  </span>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[9px] text-blue-400/60 uppercase tracking-[0.3em] font-black">Engine Ready</span>
                  </div>
                </div>
              </div>
            </div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 text-center"
            >
              <h2 className="text-white text-2xl font-bold tracking-tight">NeuroLens Engine</h2>
              <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto font-medium">Select a core biological engine to begin high-fidelity diagnostic analysis.</p>
            </motion.div>
          </motion.div>
        )}

        {selectedLogo && !result && (
          <motion.div 
            key="input-view"
            initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "backOut" }}
            className="w-full max-w-lg bg-slate-900/80 border border-white/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-2xl shadow-2xl relative"
          >
            <button onClick={() => setSelectedLogo(null)} className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-6 mb-10">
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg", selectedLogo.className)}>
                <selectedLogo.Icon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">{selectedLogo.name}</h2>
                <p className="text-slate-400 text-sm mt-1">Configure diagnostic parameters</p>
              </div>
            </div>

            {/* Input Mode Switcher */}
            <div className="flex bg-slate-950/50 p-1 rounded-xl border border-white/5 mb-8">
               <button 
                onClick={() => setInputMode('manual')}
                className={cn("flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all", inputMode === 'manual' ? "bg-white text-black" : "text-slate-500 hover:text-white")}
               >
                 Manual Entry
               </button>
               <button 
                onClick={() => setInputMode('upload')}
                className={cn("flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all", inputMode === 'upload' ? "bg-white text-black" : "text-slate-500 hover:text-white")}
               >
                 Upload Document
               </button>
            </div>

            <AnimatePresence mode="wait">
              {inputMode === 'manual' ? (
                <motion.div 
                  key="manual"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6 mb-10"
                >
                  {selectedLogo.fields.map((field: any) => (
                    <div key={field.key} className="space-y-2">
                      <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{field.label}</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={formValues[field.key] || ""}
                          onChange={(e) => setFormValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder="0.0"
                          className="w-full bg-slate-950 border border-white/5 rounded-xl py-4 px-6 text-xl font-mono text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 font-bold uppercase tracking-widest text-[9px]">{field.unit}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="upload"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="mb-10"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,image/*"
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "w-full h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all gap-3",
                      selectedFile ? "border-blue-500 bg-blue-500/5" : "border-white/10 hover:border-white/20 hover:bg-white/5"
                    )}
                  >
                    {selectedFile ? (
                      <>
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                          {selectedFile.type.includes('pdf') ? <FileText className="text-white w-6 h-6" /> : <ImageIcon className="text-white w-6 h-6" />}
                        </div>
                        <p className="text-white font-medium text-sm">{selectedFile.name}</p>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }} className="text-[10px] text-slate-500 hover:text-white uppercase font-bold tracking-widest">Change File</button>
                      </>
                    ) : (
                      <>
                        <Upload className="text-slate-500 w-10 h-10 mb-2" />
                        <p className="text-slate-300 font-bold tracking-tight">Drop PDF or Medical Image</p>
                        <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Max size 10MB</p>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              disabled={isAnalyzing || (inputMode === 'manual' ? Object.keys(formValues).length === 0 : !selectedFile)}
              onClick={handleStartAnalysis}
              className="w-full py-5 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-xl"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span className="uppercase tracking-widest text-xs">Injecting Biomarkers...</span>
                </div>
              ) : (
                <>
                  <span className="uppercase tracking-widest text-xs">Authorize NeuroLens Scan</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </motion.div>
        )}

        {result && (
          <motion.div 
            key="result-view"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Sidebar Results */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-8">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", logos.find(l => l.name === result.type)?.className || 'bg-blue-600')}>
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <button onClick={reset} className="text-[10px] uppercase font-bold tracking-widest text-slate-500 hover:text-white transition-colors flex items-center gap-2">
                    <History className="w-3 h-3" />
                    New Scan
                  </button>
                </div>

                <h3 className="text-white text-2xl font-bold tracking-tight mb-4">Diagnostic Result</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">{result.summary}</p>

                <div className="space-y-4">
                  {result.insights.map((insight, i) => (
                    <motion.div 
                      key={i}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + (i * 0.1) }}
                      className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <p className="text-slate-300 text-xs leading-relaxed font-medium">{insight}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Graph View */}
            <div className="lg:col-span-2 bg-slate-950/80 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Data</span>
                 </div>
              </div>

              <div className="mb-12">
                <h4 className="text-white text-lg font-bold flex items-center gap-3 mb-1">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Predictive Outcome Graph
                </h4>
                <p className="text-slate-500 text-xs uppercase tracking-[0.2em] font-bold">Temporal Biological Variations</p>
              </div>

              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.graph_data}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} 
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff', fontSize: '12px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke={
                        result.risk_level === 'high' || result.risk_level === 'severe' ? '#f43f5e' : 
                        result.risk_level === 'medium' ? '#f59e0b' : '#10b981'
                      } 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-3 gap-8">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Stability</p>
                    <p className="text-xl font-bold text-white tracking-tight">{result.stability}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Risk Level</p>
                    <p className={cn("text-xl font-bold tracking-tight capitalize", 
                      result.risk_level === 'high' || result.risk_level === 'severe' ? 'text-rose-400' : 
                      result.risk_level === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                    )}>
                      {result.risk_level}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Confidence</p>
                    <div className="flex items-center gap-2">
                       <p className="text-xl font-bold text-emerald-400 tracking-tight">
                         {result.stability > 90 ? 'High' : result.stability > 75 ? 'Mid' : 'Low'}
                       </p>
                       <Brain className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Status Bar */}
      <div className="fixed bottom-0 left-0 w-full p-4 md:p-8 flex justify-between items-center z-50 pointer-events-none">
        <div className="flex items-center gap-4 bg-slate-900/50 border border-white/5 backdrop-blur-md px-4 py-2 rounded-full pointer-events-auto">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">System Online</span>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/50 border border-white/5 backdrop-blur-md px-4 py-2 rounded-full pointer-events-auto">
           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">NeuroLens v1.0.4</span>
        </div>
      </div>
    </div>
  );
};
