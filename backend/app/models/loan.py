from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float, nullable=False)
    term_months = Column(Integer, nullable=False)
    purpose = Column(String, nullable=True)
    status = Column(String, default="PENDING")  # APPROVED, REJECTED, PENDING
    rejection_reason = Column(String, nullable=True)
    
    # Financial fields for underwriting
    monthly_income = Column(Float, nullable=False)
    employment_status = Column(String, nullable=False) # EMPLOYED, SELF_EMPLOYED, UNEMPLOYED
    credit_score = Column(Integer, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
