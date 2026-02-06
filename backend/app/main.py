from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import auth, loans, risk, aml
from app.core.database import Base, engine

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(loans.router, prefix="/loans", tags=["loans"])
app.include_router(risk.router, prefix="/risk", tags=["risk"])
app.include_router(aml.router, prefix="/aml", tags=["aml"])

@app.get("/")
def root():
    return {"message": "Welcome to the Fintech Dashboard API"}
