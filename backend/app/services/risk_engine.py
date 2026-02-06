from app.schemas.risk import RiskProfileRequest, RiskScore

class RiskEngine:
    @staticmethod
    def calculate_risk_score(profile: RiskProfileRequest) -> RiskScore:
        score = 100
        factors = []
        
        # Rule 1: Age Factor (Younger/Older might be higher risk depending on context, keeping simple)
        if profile.age < 21:
            score -= 10
            factors.append("Age under 21")
        
        # Rule 2: Asset/Liability Ratio
        if profile.total_liabilities > 0:
            ratio = profile.total_assets / profile.total_liabilities
            if ratio < 1.0:
                score -= 30
                factors.append("Liabilities exceed assets")
            elif ratio < 2.0:
                score -= 10
                factors.append("Low asset coverage")

        # Rule 3: Dependents
        if profile.dependents > 3:
            score -= 5
            factors.append("High number of dependents")

        # Normalize score
        score = max(0, min(100, score))

        # Determine level
        if score >= 80:
            risk_level = "LOW"
        elif score >= 50:
            risk_level = "MEDIUM"
        else:
            risk_level = "HIGH"

        return RiskScore(score=score, risk_level=risk_level, factors=factors)
