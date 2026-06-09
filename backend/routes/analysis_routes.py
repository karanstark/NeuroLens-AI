from flask import Blueprint, request, jsonify
import random
import json
import math
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
    try:
        stability = float(results.get("stability", 85.0))
    except (ValueError, TypeError):
        stability = 85.0
        
    trend = results.get("trend", "stable")
    
    # Try to extract a baseline from inputs if provided
    base_val = 70.0
    if inputs:
        # Just grab the first numeric value we find as a seed
        for val in inputs.values():
            try:
                num = float(val)
                if num > 0:
                    base_val = min(100.0, max(10.0, num))
                    break
            except (ValueError, TypeError):
                continue
                
    volatility = max(2.0, (100.0 - stability) / 2.0)
    
    for i in range(12):
        # Different patterns for different icons
        if not icon_type:
            val = base_val + random.uniform(-volatility, volatility)
        elif 'Neural' in icon_type:
            # Oscillation with high frequency
            val = base_val + (math.sin(i) * volatility * 2) + random.uniform(-2, 2)
        elif 'Genetic' in icon_type:
            # High stability, rare spikes
            val = base_val + random.uniform(-1, 1)
            if i in [3, 8]: # Sudden genetic marker variance
                val += random.uniform(10, 25) * (1 if random.random() > 0.5 else -1)
        elif 'Vitals' in icon_type:
            # Classic heartbeat rhythm
            val = base_val + (15 if i % 3 == 1 else (-10 if i % 3 == 2 else 0)) + random.uniform(-volatility/2, volatility/2)
        elif 'Metabolic' in icon_type:
            # Slow waves (like glucose curves after meals)
            val = base_val + (math.cos(i/2.0) * volatility * 1.5)
        elif 'Predictive' in icon_type:
            # Clear upward/downward exponential trend
            modifier = (i * i * 0.5) if trend == 'upward' else (-i * i * 0.5) if trend == 'downward' else 0
            val = base_val + modifier + random.uniform(-volatility, volatility)
        elif 'Prevention' in icon_type:
            # Improving trend over time (prevention working)
            val = base_val + (i * 2.5) + random.uniform(-volatility, volatility)
        else: # Smart Diagnosis or others
            # General trend
            trend_modifier = i * (3 if trend == 'upward' else -3 if trend == 'downward' else 0)
            val = base_val + trend_modifier + random.uniform(-volatility, volatility)
            
        results["graph_data"].append({
            "name": f"T{i+1}",
            "value": round(max(5.0, min(100.0, val)), 1),
            "baseline": round(base_val + random.uniform(-2, 2), 1)
        })
        
    return jsonify(results)
