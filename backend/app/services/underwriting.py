from app.schemas.loan import LoanCreate

class UnderwritingService:
    @staticmethod
    def evaluate_loan(application: LoanCreate) -> dict:
        reasons = []
        status = "APPROVED"

        # Rule 1: Credit Score Threshold
        if application.credit_score < 600:
            status = "REJECTED"
            reasons.append("Credit score too low (< 600)")

        # Rule 2: Debt-to-Income Ratio (Proxy: Loan Amount vs Income)
        # Simple rule: Loan amount shouldn't exceed 12x monthly income (roughly 1 year salary)
        if application.amount > (application.monthly_income * 12):
             status = "REJECTED"
             reasons.append("Loan amount exceeds 12x monthly income")

        # Rule 3: Employment Status
        if application.employment_status == "UNEMPLOYED":
            status = "REJECTED"
            reasons.append("Applicant is unemployed")

        return {
            "status": status,
            "rejection_reason": "; ".join(reasons) if reasons else None
        }
