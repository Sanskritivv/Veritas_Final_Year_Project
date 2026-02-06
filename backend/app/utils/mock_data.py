# Mock data for external services (Blacklists, Sanctions, etc.)

BLACKLISTED_COUNTRIES = ["North Korea", "Iran", "Syria"]

SUSPICIOUS_NAMES = ["Launderer", "Smuggler", "BadActor"] # Simple mocks

CREDIT_BUREAU_DATA = {
    # user_id: score. This is just a fallback if not provided in input.
    1: 750,
    2: 600,
    3: 450
}
