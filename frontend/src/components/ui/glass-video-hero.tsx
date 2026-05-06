import React, { useState } from "react";
import { Maximize2, Minimize2, ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [fullBleed, setFullBleed] = useState(true);

  const VIDEO_URL =
    "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4";

  return (
    <section
      className={`relative w-full overflow-hidden transition-all duration-700 ease-in-out ${
        fullBleed ? "h-screen" : "py-32 lg:py-40 min-h-[70vh]"
      } bg-black`}
    >
      {/* Height Toggle */}
      <button
        onClick={() => setFullBleed(!fullBleed)}
        aria-label={fullBleed ? "Switch to fit-to-content" : "Switch to full-bleed"}
        className="absolute top-6 right-6 z-30 p-3 rounded-xl backdrop-blur-2xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        {fullBleed ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
      </button>

      {/* Video Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 max-w-7xl mx-auto">

        {/* Headline */}
        <h1 className="font-sans font-black text-white text-5xl md:text-7xl lg:text-[100px] leading-[0.95] tracking-[-0.04em] mt-10 max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          Analyze your health
          <br className="hidden lg:block" />
          instantly <em className="italic text-blue-400 font-serif">and</em> hassle-free
        </h1>

        {/* Subtext */}
        <p className="font-sans font-medium text-lg md:text-xl text-blue-100/70 mt-8 max-w-[750px] leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          NeuroLens AI transforms complex medical reports into actionable narratives. 
          Discover precision diagnostic tracking and beautiful visual timelines.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mt-12 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
          <Link 
            to="/analysis"
            className="group relative flex items-center justify-center px-10 py-5 rounded-2xl bg-white text-black font-bold text-lg hover:scale-105 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95"
          >
            Start Your Analysis
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/demo"
            className="flex items-center justify-center px-10 py-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all active:scale-95"
          >
            <Play className="mr-2 w-4 h-4 fill-white" />
            Experience Demo
          </Link>
        </div>
      </div>

      {/* Decorative Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[20%] bg-blue-600/20 blur-[120px] pointer-events-none" />
    </section>
  );
};

export { HeroSection };
