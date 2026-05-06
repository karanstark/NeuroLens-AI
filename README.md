# 🧠 NeuroLens AI

![NeuroLens Banner](https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070)

### Translating Medical Complexity into Human Narratives.
**Published by Karan Piramanayagam**

NeuroLens AI is a high-fidelity healthcare intelligence platform designed to bridge the gap between complex medical diagnostic data and actionable patient understanding. Using state-of-the-art Generative AI (Gemini 1.5 Flash & Llama 3.1), NeuroLens transforms clinical reports into intuitive, visual, and cinematic health narratives.

---

## ✨ Key Features

- **Health Twin AI**: Multimodal analysis of medical reports to generate a "Digital Health Twin" summary.
- **Glassmorphic UI**: A premium, state-of-the-art interface built with React and Tailwind CSS.
- **Cinematic Video Hero**: An immersive landing page experience with full-bleed video backgrounds.
- **Risk Radar**: Real-time biological stability tracking and risk-level visualization.
- **Full-Stack Performance**: Seamless integration between a Flask backend and a Vite-powered frontend.
- **Production Ready**: Optimized for deployment on Vercel with serverless function support.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, GSAP (Animations), Lucide Icons.
- **Backend**: Python 3.11, Flask, SQLite.
- **AI Intelligence**: Google Gemini 1.5 Flash, Groq (Llama 3.1 8B).
- **Deployment**: Vercel.

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- API Keys for Gemini and Groq.

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r ../requirements.txt

# Create .env file and add your keys
# GEMINI_API_KEY=your_key
# GROQ_API_KEY=your_key
# SECRET_KEY=your_secret
```

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 3. Unified Start

You can also use the root-level controller to start both services:

```bash
python start.py
```

---

## 📐 Architecture

NeuroLens follows a modern decoupled architecture:
- **/frontend**: A high-performance SPA using Vite for near-instant HMR.
- **/backend**: A RESTful Flask API handling JWT authentication and AI orchestration.
- **/api**: Serverless bridge for Vercel production deployment.

---

## 👤 Author

**Karan Piramanayagam**

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*“Track the journey, not just the data.”*
