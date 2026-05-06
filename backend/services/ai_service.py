import os
import json
import google.generativeai as genai
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Configure Groq safely
try:
    groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
except Exception as e:
    print(f"Warning: Groq client failed to initialize: {e}")
    groq_client = None

def get_ai_analysis(icon_type, input_data, file_data=None, mime_type=None):
    prompt = f"""
    You are the NeuroLens AI Medical Engine. 
    Analyze the following medical input for the '{icon_type}' engine.
    {f'Manual Data: {json.dumps(input_data)}' if input_data else ''}
    {f'Document provided for direct analysis.' if file_data else ''}
    
    Provide a professional medical analysis including:
    1. A concise summary (max 2 sentences).
    2. Exactly 3 key biological insights or observations.
    3. A stability score (0-100).
    4. A projected trend direction ('upward', 'downward', or 'stable').
    5. A risk level ('low', 'medium', 'high', or 'severe').
    
    Format the response as JSON:
    {{
        "summary": "...",
        "insights": ["...", "...", "..."],
        "stability": 94.5,
        "trend": "stable",
        "risk_level": "low"
    }}
    """
    
    if file_data:
        return _call_ai_multimodal([prompt, {'mime_type': mime_type, 'data': file_data}])
    return _call_ai(prompt)

def generate_health_intelligence(user_data, report_text=None, file_data=None, mime_type=None):
    prompt = f"""
    You are the NeuroLens AI Health Twin. 
    Analyze the following medical report for a user with the given profile.
    User Profile: {json.dumps(user_data)}
    {f'Report Text: {report_text}' if report_text else 'Analyze the provided document/image directly.'}
    
    Provide health intelligence including:
    1. AI Health Score (0-100)
    2. Risk Radar Data (categories: Cardiovascular, Metabolic, Immune, Mental, Physical; score 1-10)
    3. Health Narrative (cinematic and supportive summary)
    4. 3 Preventive Recommendations
    5. Risk Categories (high impact areas)
    
    Format the response as JSON:
    {{
        "ai_health_score": 85,
        "risk_radar_data": {{ "Cardiovascular": 4, "Metabolic": 3, "Immune": 5, "Mental": 2, "Physical": 4 }},
        "health_narrative": "...",
        "preventive_recommendations": ["...", "...", "..."],
        "risk_categories": ["Category 1", "Category 2"]
    }}
    """
    
    content = [prompt]
    if file_data:
        content.append({'mime_type': mime_type, 'data': file_data})
    
    return _call_ai_multimodal(content)

def _call_ai_multimodal(content):
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(content)
        text = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(text)
    except Exception as e:
        print(f"Multimodal Gemini failed: {e}")
        # Fallback to text-only if possible or return default
        return _call_ai(content[0]) # prompt is always index 0

def _call_ai(prompt):
    # Try Gemini first
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        text = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(text)
    except Exception as e:
        print(f"Gemini failed: {e}")
        # Fallback to Groq
        if groq_client:
            try:
                chat_completion = groq_client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model="llama-3.1-8b-instant",
                    response_format={"type": "json_object"}
                )
                return json.loads(chat_completion.choices[0].message.content)
            except Exception as e2:
                print(f"Groq also failed: {e2}")
        
        # Final Fallback
        return {
            "summary": "AI processing temporarily restricted. Showing baseline biological monitoring data.",
            "insights": ["Standard biological variation detected", "Temporal trend remains within safe parameters", "Manual clinical review recommended"],
            "stability": 88.2,
            "trend": "stable",
            "risk_level": "medium",
            "ai_health_score": 75,
            "risk_radar_data": { "Cardiovascular": 5, "Metabolic": 5, "Immune": 5, "Mental": 5, "Physical": 5 },
            "health_narrative": "AI analysis is currently limited, showing standard health metrics.",
            "preventive_recommendations": ["Maintain hydration", "Regular sleep", "Active walking"],
            "risk_categories": ["Baseline"]
        }
