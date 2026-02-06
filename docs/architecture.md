# Project Architecture

## Overview
This project is a fintech dashboard composed of a Next.js frontend and a FastAPI backend.

## Structure
- **frontend/**: Next.js application (TypeScript, TailwindCSS).
- **backend/**: FastAPI application (Python, SQLAlchemy).
- **docs/**: Project documentation.

## Frontend
Built with Next.js 14+ (App Router).
- **Framework**: Next.js
- **Styling**: TailwindCSS
- **State**: React Server Components + Client Hooks

## Backend
Built with FastAPI.
- **Framework**: FastAPI
- **Database**: PostgreSQL (Production) / SQLite (Dev)
- **ORM**: SQLAlchemy
- **Auth**: JWT (OAuth2PasswordBearer)

## Communication
The frontend communicates with the backend via REST API calls. 
- API Base URL: `http://localhost:8000/api/v1` (Default)
