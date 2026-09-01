@echo off
echo ==========================================
echo Starting ABPSSP Website...
echo ==========================================

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed or not in your PATH. Please install Python 3 to run this project.
    pause
    exit /b
)

:: Create virtual environment if it doesn't exist
if not exist venv\Scripts\python.exe (
    echo Creating virtual environment...
    python -m venv venv
)

:: Install Flask (it will use cache if already installed)
echo Checking dependencies...
venv\Scripts\python.exe -m pip install flask >nul 2>&1

:: Open the browser
echo Opening website in your default browser...
start http://127.0.0.1:5000

:: Run the Flask application
echo Starting the server... Press Ctrl+C to stop.
venv\Scripts\python.exe app.py

pause
