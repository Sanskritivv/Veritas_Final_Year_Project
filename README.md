# Veritas Final Year Project

This is a full-stack fintech dashboard featuring Loan Underwriting, Risk Profiling, and AML Monitoring.

## Project Structure

- `frontend/`: Next.js Web Application
- `backend/`: FastAPI Backend Service

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python 3.10+

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:3000`.

### Running the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The backend API will start at `http://127.0.0.1:8000`.
Docs available at `http://127.0.0.1:8000/docs`.

## Documentation

See [docs/architecture.md](docs/architecture.md) for more details.
