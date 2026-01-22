import requests

def main(data):
    try:
        # 1️⃣ Get input
        email = data.get("email")
        CihId = data.get("CihId")

        if not email or not CihId:
            return {
                "errorCode": "VALIDATION_ERROR",
                "message": "email and CihId are required"
            }, 400

        # =========================
        # 2️⃣ GET PASSWORD
        # =========================
        url_get_pass = "http://localhost:7777/api/auth/getpassword"

        res_get = requests.post(
            url_get_pass,
            json={"email": email, "CihId": CihId},
            timeout=10
        )
        print("STATUS:", res_get.status_code)
        print("RESPONSE:", res_get.text)

        if res_get.status_code != 200:
            return {
                "errorCode": "AUTH_GET_FAILED",
                "message": "User not found"
            }, 400

        password = res_get.json().get("password")

        if not password:
            return {
                "errorCode": "NO_PASSWORD",
                "message": "user not found"
            }, 400

        # =========================
        url_balance = "http://localhost:7777/api/account/balance"

        res_balance = requests.post(
            url_balance,
            json={"email": email, "password": password},
            timeout=10
        )

        if res_balance.status_code != 200:
            return {
                "errorCode": "FAILED",
                "message": "Authentication failed"
            }, 400

        balance = res_balance.json().get("balance")

        # =========================
        # 4️⃣ SUCCESS
        # =========================
        return {
            "status": "SUCCESS",
            "email": email,
            "balance": balance
        }, 200

    except requests.exceptions.RequestException as e:
        return {
            "errorCode": "API_CALL_FAILED",
            "message": str(e)
        }, 400

    except Exception as e:
        print(f"Unexpected error in sendPasscode: {str(e)}")
        return {
            "errorCode": "ISE40504"
        }, 400


# ========================================
# Execution Block
# ========================================
_locals = locals()
data = _locals.get("data", {})
response, status_code = main(data)
_locals["response"] = response
_locals["status_code"] = status_code


