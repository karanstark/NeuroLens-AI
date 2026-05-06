import os
import sys

# Add backend directory to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app import app

# For Vercel, the handler should be named 'app'
# This allows 'app' to be imported from 'api.index'
