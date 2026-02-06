from pydantic import BaseModel
from typing import List

class RiskProfileRequest(BaseModel):
    user_id: int
    age: int
    total_assets: float
    total_liabilities: float
    dependents: int

class RiskScore(BaseModel):
    score: int # 0-100
    risk_level: str # LOW, MEDIUM, HIGH
    factors: List[str]
