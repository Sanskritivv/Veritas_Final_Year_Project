from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class AMLAlert(Base):
    __tablename__ = "aml_alerts"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(Integer, ForeignKey("transactions.id"))
    severity = Column(String, nullable=False) # HIGH, MEDIUM, LOW
    reason = Column(String, nullable=False)
    status = Column(String, default="OPEN") # OPEN, CLOSED, INVESTIGATING
    created_at = Column(DateTime(timezone=True), server_default=func.now())
