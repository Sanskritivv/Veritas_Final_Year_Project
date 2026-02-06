from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.aml import TransactionCreate, Transaction as TransactionSchema, AMLAlert as AMLAlertSchema
from app.models.transaction import Transaction
from app.models.aml_alert import AMLAlert
from app.services.aml_engine import AMLEngine

router = APIRouter()

@router.post("/transactions", response_model=List[AMLAlertSchema])
def process_transaction(
    *,
    db: Session = Depends(get_db),
    transaction_in: TransactionCreate,
    current_user_id: int = 1 # Mock
) -> Any:
    # Create transaction
    transaction = Transaction(
        user_id=current_user_id,
        amount=transaction_in.amount,
        currency=transaction_in.currency,
        recipient_account=transaction_in.recipient_account,
        recipient_bank=transaction_in.recipient_bank,
        country=transaction_in.country
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    # Check for AML alerts
    alerts_data = AMLEngine.check_transaction(transaction_in)
    
    created_alerts = []
    for alert_data in alerts_data:
        alert = AMLAlert(
            transaction_id=transaction.id,
            severity=alert_data["severity"],
            reason=alert_data["reason"],
            status="OPEN"
        )
        db.add(alert)
        db.commit()
        db.refresh(alert)
        created_alerts.append(alert)
        
    return created_alerts

@router.get("/alerts", response_model=List[AMLAlertSchema])
def read_alerts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> Any:
    alerts = db.query(AMLAlert).offset(skip).limit(limit).all()
    return alerts

@router.get("/alerts/{alert_id}", response_model=AMLAlertSchema)
def read_alert(
    alert_id: int,
    db: Session = Depends(get_db),
) -> Any:
    alert = db.query(AMLAlert).filter(AMLAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert
