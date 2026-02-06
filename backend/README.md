# Fintech Dashboard MVP Backend

This is the backend for the Fintech Dashboard, built with FastAPI, SQLAlchemy, and Python.

## Features
- Loan Underwriting (Rule-based)
- Risk Profiling (Deterministic)
- AML Monitoring (Rule-based)
- JWT Authentication

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the application:
   ```bash
   uvicorn app.main:app --reload
   ```

3. Access the API documentation at `http://127.0.0.1:8000/docs`.
