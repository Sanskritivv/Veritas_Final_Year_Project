from typing import Any
from fastapi import APIRouter
from app.schemas.risk import RiskProfileRequest, RiskScore
from app.services.risk_engine import RiskEngine

router = APIRouter()

@router.post("/profile", response_model=RiskScore)
def calculate_risk_profile(
    *,
    risk_in: RiskProfileRequest
) -> Any:
    return RiskEngine.calculate_risk_score(risk_in)

@router.get("/{user_id}", response_model=RiskScore)
def get_user_risk_profile(
    user_id: int
) -> Any:
    # For MVP, we'll just mock a response or calculate it on the fly if we had persisted data.
    # Since the prompt asked for "Generate a risk score", the POST is the main driver.
    # The GET might retrieve a stored one, but for now we can return a dummy.
    return RiskScore(score=75, risk_level="MEDIUM", factors=["Mock Data"])
