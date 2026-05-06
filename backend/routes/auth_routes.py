from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already exists"}), 400
        
    hashed_password = generate_password_hash(password)
    new_user = User(email=email, password_hash=hashed_password, name=name)
    
    db.session.add(new_user)
    db.session.commit()
    
    access_token = create_access_token(identity=new_user.id)
    return jsonify({"msg": "User created", "access_token": access_token, "user": {"id": new_user.id, "name": new_user.name, "email": new_user.email}}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"msg": "Bad email or password"}), 401
        
    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token, "user": {"id": user.id, "name": user.name, "email": user.email}}), 200

@auth_bp.route('/onboard', methods=['POST'])
@jwt_required()
def onboard():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
        
    data = request.json
    user.age = data.get('age', user.age)
    user.gender = data.get('gender', user.gender)
    user.health_goals = data.get('health_goals', user.health_goals)
    user.family_history = data.get('family_history', user.family_history)
    user.lifestyle_habits = data.get('lifestyle_habits', user.lifestyle_habits)
    
    db.session.commit()
    return jsonify({"msg": "Onboarding completed successfully"}), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
        
    return jsonify({
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "age": user.age,
        "gender": user.gender,
        "health_goals": user.health_goals
    }), 200
