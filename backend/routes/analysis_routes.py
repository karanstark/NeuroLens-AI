from flask import Blueprint, request, jsonify
import random
import json
from services.ai_service import get_ai_analysis

analysis_bp = Blueprint('analysis', __name__)

@analysis_bp.route('/analyze', methods=['POST'])
def analyze():
    # Handle both JSON and FormData
    if request.content_type.startswith('multipart/form-data'):
        icon_type = request.form.get('type')
        inputs = json.loads(request.form.get('inputs', '{}'))
        file = request.files.get('file')
        file_data = file.read() if file else None
        mime_type = file.mimetype if file else None
    else:
        data = request.json
        icon_type = data.get('type')
        inputs = data.get('inputs', {})
        file_data = None
        mime_type = None
    
    # Get real AI analysis (multimodal if file_data is present)
    if file_data:
        ai_result = get_ai_analysis(icon_type, inputs, file_data=file_data, mime_type=mime_type)
    else:
        ai_result = get_ai_analysis(icon_type, inputs)
    
    results = {
        "status": "success",
        "type": icon_type,
        "summary": ai_result.get('summary'),
        "insights": ai_result.get('insights'),
        "stability": ai_result.get('stability', 98.4),
        "trend": ai_result.get('trend', 'stable'),
        "risk_level": ai_result.get('risk_level', 'low'),
        "graph_data": []
    }
    
    # Generate graph data based on analysis context
    stability = results["stability"]
    trend = results["trend"]
    
    base_val = 70
    volatility = max(2, int((100 - stability) / 2))
    
    for i in range(12):
        # Different patterns for different icons
        if 'Neural' in icon_type:
            # Oscillation
            val = base_val + (random.randint(-volatility, volatility)) + (random.randint(-5, 5) * (i % 2))
        elif 'Genetic' in icon_type:
            # High stability, rare spikes
            val = base_val + (random.randint(-1, 1)) + (20 if random.random() > 0.9 else 0)
        elif 'Vitals' in icon_type:
            # Rhythmic
            val = 75 + (10 if i % 2 == 0 else -10) + random.randint(-volatility, volatility)
        else:
            # General trend
            trend_modifier = i * (2 if trend == 'upward' else -2 if trend == 'downward' else 0)
            val = base_val + trend_modifier + random.randint(-volatility, volatility)
            
        results["graph_data"].append({
            "name": f"T{i+1}",
            "value": max(10, min(100, val)),
            "baseline": 75 + random.randint(-2, 2)
        })
        
    return jsonify(results)
