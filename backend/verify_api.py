import requests
import json

BASE_URL = "http://127.0.0.1:8002"

def test_api():
    print("Testing Backend APIs...")

    # 1. Register
    print("\n[POST] /auth/register")
    register_payload = {
        "email": "test_qa@example.com",
        "password": "qa_password123",
        "full_name": "QA Tester"
    }
    try:
        r = requests.post(f"{BASE_URL}/auth/register", json=register_payload)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text}")
    except Exception as e:
        print(f"Failed to connect: {e}")
        return

    # 2. Login
    print("\n[POST] /auth/login")
    login_payload = {
        "username": "test_qa@example.com",
        "password": "qa_password123"
    }
    token = None
    try:
        r = requests.post(f"{BASE_URL}/auth/login", data=login_payload)
        print(f"Status: {r.status_code}")
        if r.status_code == 200:
            token = r.json().get("access_token")
            print("Login Successful, Token retrieved.")
        else:
            print(f"Login Failed: {r.text}")
    except Exception as e:
        print(f"Failed: {e}")

    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    # 3. Apply for Loan
    print("\n[POST] /loans/apply")
    loan_payload = {
        "amount": 50000,
        "term_months": 24,
        "purpose": "Business Expansion",
        "monthly_income": 8000,
        "employment_status": "SELF_EMPLOYED",
        "credit_score": 720
    }
    try:
        r = requests.post(f"{BASE_URL}/loans/apply", json=loan_payload, headers=headers)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text}")
    except Exception as e:
         print(f"Failed: {e}")

    # 4. Risk Profile
    print("\n[POST] /risk/profile")
    risk_payload = {
        "user_id": 1,
        "age": 30,
        "total_assets": 100000,
        "total_liabilities": 20000,
        "dependents": 1
    }
    try:
        r = requests.post(f"{BASE_URL}/risk/profile", json=risk_payload)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text}")
    except Exception as e:
         print(f"Failed: {e}")

    # 5. AML Transaction
    print("\n[POST] /aml/transactions")
    aml_payload = {
        "amount": 15000,
        "currency": "USD",
        "recipient_account": "ACC123",
        "recipient_bank": "EvilBank",
        "country": "North Korea" # Should trigger alert
    }
    try:
        r = requests.post(f"{BASE_URL}/aml/transactions", json=aml_payload, headers=headers)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text}")
    except Exception as e:
         print(f"Failed: {e}")

if __name__ == "__main__":
    test_api()
