import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Report, HealthIntelligence, User
from services.ai_service import generate_health_intelligence
import json

report_bp = Blueprint('report', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@report_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_report():
    if 'file' not in request.files:
        return jsonify({"msg": "No file part"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"msg": "No selected file"}), 400
        
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Read file for AI
        with open(filepath, 'rb') as f:
            file_data = f.read()
        
        mime_type = file.mimetype or 'application/pdf'
        
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        # Save to DB
        new_report = Report(user_id=user_id, filename=filename, raw_text="Extracted via Gemini Multimodal.")
        db.session.add(new_report)
        db.session.flush() # To get the report ID
        
        # Generate Intelligence
        user_data = {
            "age": user.age,
            "gender": user.gender,
            "health_goals": user.health_goals,
            "lifestyle_habits": user.lifestyle_habits
        }
        ai_data = generate_health_intelligence(user_data, file_data=file_data, mime_type=mime_type)
        
        intelligence = HealthIntelligence(
            report_id=new_report.id,
            ai_health_score=ai_data.get('ai_health_score', 0),
            risk_radar_data=json.dumps(ai_data.get('risk_radar_data', {})),
            health_narrative=ai_data.get('health_narrative', ''),
            preventive_recommendations=json.dumps(ai_data.get('preventive_recommendations', [])),
            risk_categories=json.dumps(ai_data.get('risk_categories', []))
        )
        db.session.add(intelligence)
        db.session.commit()
        
        return jsonify({
            "msg": "Report uploaded and analyzed successfully",
            "report_id": new_report.id
        }), 201
        
    return jsonify({"msg": "File type not allowed"}), 400

@report_bp.route('/', methods=['GET'])
@jwt_required()
def get_reports():
    user_id = get_jwt_identity()
    reports = Report.query.filter_by(user_id=user_id).order_by(Report.upload_date.desc()).all()
    
    result = []
    for r in reports:
        result.append({
            "id": r.id,
            "filename": r.filename,
            "upload_date": r.upload_date.isoformat()
        })
        
    return jsonify(result), 200
