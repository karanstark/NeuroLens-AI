import os
import json
import base64
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Configure Groq with primary key
GROQ_KEYS = [
    os.getenv("GROQ_API_KEY"),
    os.getenv("GROQ_API_KEY_BACKUP"),
]
# Filter out None values
GROQ_KEYS = [k for k in GROQ_KEYS if k]

def _get_groq_client(key_index=0):
    """Create a Groq client with the given key index."""
    if key_index < len(GROQ_KEYS):
        return Groq(api_key=GROQ_KEYS[key_index])
    return None

def _call_groq(prompt, key_index=0):
    """Call Groq API with automatic failover to backup key."""
    client = _get_groq_client(key_index)
    if not client:
        print(f"No Groq key available at index {key_index}")
        return None
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},
            temperature=0.7,
            max_tokens=2048,
        )
        text = chat_completion.choices[0].message.content.strip()
        return json.loads(text)
    except Exception as e:
        print(f"Groq key {key_index} failed: {e}")
        # Try backup key
        if key_index + 1 < len(GROQ_KEYS):
            print(f"Failing over to Groq key {key_index + 1}...")
            return _call_groq(prompt, key_index + 1)
        return None


def get_ai_analysis(icon_type, input_data, file_data=None, mime_type=None):
    """Analyze medical input for the spinning-logos diagnostic engine."""
    prompt = f"""
    You are the NeuroLens AI Medical Engine — a futuristic, cinematic health intelligence system. 
    Analyze the following medical input for the '{icon_type}' engine.
    {'Manual Data: ' + json.dumps(input_data) if input_data else ''}
    {'A medical document/image was uploaded for analysis.' if file_data else ''}
    
    Provide a professional, intelligent medical analysis including:
    1. A concise summary (max 2 sentences, sound futuristic and premium).
    2. Exactly 3 key biological insights or observations.
    3. A stability score (0-100).
    4. A projected trend direction ('upward', 'downward', or 'stable').
    5. A risk level ('low', 'medium', 'high', or 'severe').
    
    Return ONLY valid JSON in this exact format:
    {{
        "summary": "...",
        "insights": ["...", "...", "..."],
        "stability": 94.5,
        "trend": "stable",
        "risk_level": "low"
    }}
    """
    
    result = _call_groq(prompt)
    if result:
        return result
    
    # Hardcoded fallback if all keys fail
    return _get_fallback_analysis()


def generate_health_intelligence(user_data, report_text=None, file_data=None, mime_type=None):
    """Generate full Health Twin intelligence from a medical report."""
    prompt = f"""
    You are the NeuroLens AI Health Twin — a cinematic, futuristic health intelligence persona.
    Analyze the following medical report for a user with the given profile.
    User Profile: {json.dumps(user_data)}
    {'Report Text: ' + report_text if report_text else 'No specific report text provided. Generate a general health baseline.'}
    
    Provide health intelligence including:
    1. AI Health Score (0-100)
    2. Risk Radar Data (categories: Cardiovascular, Metabolic, Immune, Mental, Physical; score 1-10)
    3. Health Narrative (cinematic, emotionally intelligent, and supportive summary — make it sound premium)
    4. 3 Preventive Recommendations
    5. Risk Categories (high impact areas)
    
    Return ONLY valid JSON in this exact format:
    {{
        "ai_health_score": 85,
        "risk_radar_data": {{ "Cardiovascular": 4, "Metabolic": 3, "Immune": 5, "Mental": 2, "Physical": 4 }},
        "health_narrative": "...",
        "preventive_recommendations": ["...", "...", "..."],
        "risk_categories": ["Category 1", "Category 2"]
    }}
    """
    
    result = _call_groq(prompt)
    if result:
        return result
    
    # Hardcoded fallback
    return _get_fallback_intelligence()


def _get_fallback_analysis():
    """Static fallback when all API keys fail."""
    return {
        "summary": "AI processing temporarily restricted. Showing baseline biological monitoring data.",
        "insights": [
            "Standard biological variation detected within expected parameters",
            "Temporal trend remains within safe operating thresholds",
            "Manual clinical review recommended for comprehensive evaluation"
        ],
        "stability": 88.2,
        "trend": "stable",
        "risk_level": "medium"
    }


def _get_fallback_intelligence():
    """Static fallback for Health Twin when all API keys fail."""
    return {
        "ai_health_score": 75,
        "risk_radar_data": {
            "Cardiovascular": 5,
            "Metabolic": 5,
            "Immune": 5,
            "Mental": 5,
            "Physical": 5
        },
        "health_narrative": "Your Health Twin is currently operating in safe mode. Core biological systems appear stable, but a full AI-powered analysis requires active API connectivity. Upload a new report to trigger a fresh scan.",
        "preventive_recommendations": [
            "Maintain consistent hydration levels",
            "Prioritize 7-8 hours of restorative sleep",
            "Incorporate 30 minutes of active movement daily"
        ],
        "risk_categories": ["Baseline Monitoring"]
    }
