import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Upload, Layout, PieChart, Bell, Settings, 
  Search, LogOut, ChevronRight, AlertCircle, CheckCircle2, 
  Sparkles, ShieldCheck, Clock, TrendingUp
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import RiskRadar from '../../components/RiskRadar';
import dashboardService from '../../services/dashboard';
import authService from '../../services/auth';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await dashboardService.getDashboardData();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      await dashboardService.uploadReport(file);
      await fetchData();
    } catch (err) {
      alert("Upload failed. Make sure backend is running.");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <Activity className="absolute inset-0 m-auto text-primary animate-pulse" size={24} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 p-6 flex flex-col gap-8">
        <Link to="/" className="flex items-center gap-2 mb-4">
          <Activity className="text-primary" size={28} />
          <span className="text-xl font-bold">NeuroLens AI</span>
        </Link>
        
        <nav className="flex-1 space-y-2">
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-white/5'}`} onClick={() => setActiveTab('overview')}>
            <Layout size={20} /> Overview
          </button>
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'reports' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-white/5'}`} onClick={() => setActiveTab('reports')}>
            <PieChart size={20} /> Reports
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5">
            <Bell size={20} /> Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5">
            <Settings size={20} /> Settings
          </button>
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold">Health Intelligence</h1>
            <p className="text-slate-400">Welcome back, Health Twin is analyzing your latest data.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="text" placeholder="Search insights..." className="bg-slate-900 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:border-primary/50" />
            </div>
            <label className="cursor-pointer">
              <input type="file" className="hidden" onChange={handleFileUpload} />
              <Button variant="primary" size="md" className={isUploading ? 'opacity-50 cursor-not-allowed' : ''} disabled={isUploading}>
                {isUploading ? 'Scanning...' : <><Upload size={18} /> Upload Report</>}
              </Button>
            </label>
          </div>
        </header>

        {data?.status === 'no_data' ? (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 animate-pulse">
              <Activity size={48} />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Intelligence Found</h2>
            <p className="text-slate-400 max-w-sm mb-8">Upload your first medical report to generate your Health Twin AI and start receiving intelligence.</p>
            <label className="cursor-pointer">
               <input type="file" className="hidden" onChange={handleFileUpload} />
               <Button variant="primary" size="lg">Upload My First Report</Button>
            </label>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Row: Score & Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="flex flex-col items-center justify-center text-center p-10">
                <div className="relative w-48 h-48 mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                    <motion.circle 
                      cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
                      strokeDasharray={552.92}
                      initial={{ strokeDashoffset: 552.92 }}
                      animate={{ strokeDashoffset: 552.92 - (552.92 * (data?.ai_health_score || 0)) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="text-primary"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold">{data?.ai_health_score}</span>
                    <span className="text-xs text-slate-500 uppercase tracking-widest">Health Score</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                  <TrendingUp size={16} /> +5% from last month
                </div>
              </Card>

              <Card className="lg:col-span-2 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <PieChart size={20} className="text-primary" /> Risk Radar
                  </h3>
                  <div className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded">Real-time mapping</div>
                </div>
                <div className="flex-1">
                  <RiskRadar data={data?.risk_radar} />
                </div>
              </Card>
            </div>

            {/* Middle Row: AI Narrative */}
            <Card className="relative overflow-hidden border-primary/20">
              <div className="absolute top-0 right-0 p-4">
                <Sparkles className="text-primary animate-pulse" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Brain className="text-primary" size={24} /> Health Twin Narrative
              </h3>
              <p className="text-lg text-slate-300 leading-relaxed italic">
                "{data?.health_narrative}"
              </p>
            </Card>

            {/* Bottom Row: Insights & Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ShieldCheck size={20} className="text-green-400" /> Preventive Recommendations
                </h3>
                {data?.preventive_recommendations?.map((rec, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="p-4 flex items-center gap-4 hover:bg-white/5 border-transparent hover:border-white/10" hover={false}>
                      <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center text-green-400 shrink-0">
                        <CheckCircle2 size={16} />
                      </div>
                      <span className="text-sm text-slate-300">{rec}</span>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertCircle size={20} className="text-amber-400" /> Key Insights & Risks
                </h3>
                {data?.risk_categories?.map((risk, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="p-4 flex items-center justify-between hover:bg-white/5 border-transparent hover:border-white/10" hover={false}>
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400">
                          <AlertCircle size={16} />
                        </div>
                        <span className="text-sm text-slate-300">{risk}</span>
                      </div>
                      <ChevronRight size={16} className="text-slate-600" />
                    </Card>
                  </motion.div>
                ))}
                
                <Card className="p-4 bg-primary/5 border-primary/10 flex items-center gap-4" hover={false}>
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Last Analysis</p>
                    <p className="text-sm text-slate-300">{new Date(data?.last_upload).toLocaleString()}</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
