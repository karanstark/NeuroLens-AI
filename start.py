import subprocess
import time
import os
import sys

def run_backend():
    print("Starting Backend...")
    # Using the venv python to run app.py
    # Using the directory of the script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, "backend")
    venv_python = os.path.join(backend_dir, "venv", "Scripts", "python.exe")
    if not os.path.exists(venv_python):
        venv_python = "python" # fallback
    
    return subprocess.Popen([venv_python, "app.py"], cwd=backend_dir)

def run_frontend():
    print("Starting Frontend...")
    base_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(base_dir, "frontend")
    return subprocess.Popen(["npm", "run", "dev"], cwd=frontend_dir, shell=True)

if __name__ == "__main__":
    try:
        backend_proc = run_backend()
        time.sleep(2)
        frontend_proc = run_frontend()
        
        print("\nNeuroLens AI is launching!")
        print("Backend: http://localhost:5000")
        print("Frontend: http://localhost:5200")
        print("\nPress Ctrl+C to stop both servers.")
        
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nShutting down...")
        backend_proc.terminate()
        frontend_proc.terminate()
