from app.schemas.aml import TransactionCreate
from app.utils.mock_data import BLACKLISTED_COUNTRIES

class AMLEngine:
    @staticmethod
    def check_transaction(transaction: TransactionCreate) -> dict:
        alerts = []
        
        # Rule 1: High Value Transaction
        if transaction.amount > 10000:
            alerts.append({
                "severity": "MEDIUM",
                "reason": "High value transaction (> $10,000)"
            })
        
        # Rule 2: Blacklisted Country
        if transaction.country in BLACKLISTED_COUNTRIES:
            alerts.append({
                "severity": "HIGH",
                "reason": f"Transaction involving blacklisted country: {transaction.country}"
            })

        # Rule 3: Very High Value
        if transaction.amount > 100000:
             alerts.append({
                "severity": "HIGH",
                "reason": "Very high value transaction (> $100,000)"
            })
            
        return alerts
