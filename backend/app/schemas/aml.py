from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TransactionBase(BaseModel):
    amount: float
    currency: str = "USD"
    recipient_account: str
    recipient_bank: str
    country: str

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    user_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class AMLAlert(BaseModel):
    id: int
    transaction_id: int
    severity: str
    reason: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
