from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(120), nullable=True)
    
    # Onboarding details
    age = db.Column(db.Integer, nullable=True)
    gender = db.Column(db.String(20), nullable=True)
    health_goals = db.Column(db.Text, nullable=True)
    family_history = db.Column(db.Text, nullable=True)
    lifestyle_habits = db.Column(db.Text, nullable=True)
    
    reports = db.relationship('Report', backref='user', lazy=True)
    
class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    raw_text = db.Column(db.Text, nullable=True) # Extracted text
    
    intelligence = db.relationship('HealthIntelligence', backref='report', uselist=False, lazy=True)

class HealthIntelligence(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(db.Integer, db.ForeignKey('report.id'), nullable=False)
    
    ai_health_score = db.Column(db.Integer, nullable=False)
    risk_radar_data = db.Column(db.Text, nullable=False) # JSON string of radar metrics
    health_narrative = db.Column(db.Text, nullable=False)
    preventive_recommendations = db.Column(db.Text, nullable=False) # JSON list
    risk_categories = db.Column(db.Text, nullable=False) # JSON list of risks
