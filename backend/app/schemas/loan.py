from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class LoanBase(BaseModel):
    amount: float = Field(..., gt=0, description="Loan amount requested")
    term_months: int = Field(..., gt=0, description="Loan term in months")
    purpose: Optional[str] = None
    monthly_income: float = Field(..., gt=0, description="Monthly income of applicant")
    employment_status: str = Field(..., description="EMPLOYED, SELF_EMPLOYED, UNEMPLOYED")
    credit_score: int = Field(..., ge=300, le=850, description="Credit score (300-850)")

class LoanCreate(LoanBase):
    pass

class Loan(LoanBase):
    id: int
    user_id: int
    status: str
    rejection_reason: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
