from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.loan import LoanCreate, Loan as LoanSchema
from app.models.loan import Loan
from app.services.underwriting import UnderwritingService

router = APIRouter()

@router.post("/apply", response_model=LoanSchema)
def apply_for_loan(
    *,
    db: Session = Depends(get_db),
    loan_in: LoanCreate,
    current_user_id: int = 1 # Mock user ID since we aren't enforcing auth on every endpoint for MVP simplicity unless requested, but let's assume valid user.
) -> Any:
    # Evaluate loan
    decision = UnderwritingService.evaluate_loan(loan_in)
    
    loan = Loan(
        user_id=current_user_id,
        amount=loan_in.amount,
        term_months=loan_in.term_months,
        purpose=loan_in.purpose,
        monthly_income=loan_in.monthly_income,
        employment_status=loan_in.employment_status,
        credit_score=loan_in.credit_score,
        status=decision["status"],
        rejection_reason=decision["rejection_reason"]
    )
    db.add(loan)
    db.commit()
    db.refresh(loan)
    return loan

@router.get("/{loan_id}", response_model=LoanSchema)
def read_loan(
    loan_id: int,
    db: Session = Depends(get_db),
) -> Any:
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    return loan

@router.get("/", response_model=List[LoanSchema])
def read_loans(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> Any:
    loans = db.query(Loan).offset(skip).limit(limit).all()
    return loans
