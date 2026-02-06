from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    recipient_account = Column(String, nullable=False)
    recipient_bank = Column(String, nullable=False)
    country = Column(String, nullable=False) # For AML checks
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
