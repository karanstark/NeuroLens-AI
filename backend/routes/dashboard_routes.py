import json
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Report, HealthIntelligence

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/data', methods=['GET'])
@jwt_required()
def get_dashboard_data():
    user_id = get_jwt_identity()
    
    # Get latest report and intelligence
    latest_report = Report.query.filter_by(user_id=user_id).order_by(Report.upload_date.desc()).first()
    
    if not latest_report:
        return jsonify({
            "status": "no_data",
            "msg": "Upload a report to see your dashboard."
        }), 200
        
    intelligence = HealthIntelligence.query.filter_by(report_id=latest_report.id).first()
    
    if not intelligence:
        return jsonify({"msg": "Analysis pending"}), 202
        
    data = {
        "status": "success",
        "ai_health_score": intelligence.ai_health_score,
        "health_narrative": intelligence.health_narrative,
        "risk_radar": json.loads(intelligence.risk_radar_data),
        "preventive_recommendations": json.loads(intelligence.preventive_recommendations),
        "risk_categories": json.loads(intelligence.risk_categories),
        "last_upload": latest_report.upload_date.isoformat()
    }
    
    return jsonify(data), 200
