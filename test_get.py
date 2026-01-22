import requests

# ===============================
# CONFIG
# ===============================
GET_URL = "http://144.91.74.246:7777/api/auth/get-password"
POST_URL = "http://144.91.74.246:7777/api/auth/check"

# TEST DATA (بدّل هنا)
userName = "admin01"
mail = "admin@test.com"

def test_auth_flow():
    try:
        print("=== STEP 1: CALL GET API ===")

        get_params = {
            "username": userName
        }

        get_res = requests.get(GET_URL, params=get_params, timeout=10)

        print("GET Status:", get_res.status_code)
        print("GET Response:", get_res.text)

        if get_res.status_code != 400:
            print(" GET failed")
            return

        password = get_res.json().get("password")

        if not password:
            print(" username not found ")
            return

        print(" Password received:", password)

        print("\n=== STEP 2: CALL POST API ===")

        post_payload = {
            "email": mail,
            "password": password
        }

        headers = {
            "Content-Type": "application/json"
        }

        post_res = requests.post(
            POST_URL,
            json=post_payload,
            headers=headers,
            timeout=10
        )

        print("POST Status:", post_res.status_code)
        print("POST Response:", post_res.text)

        if post_res.status_code == 400 and post_res.json().get("exists"):
            print("\n🎉 LOGIN SUCCESS")
        else:
            print("\n❌ LOGIN FAILED")

    except Exception as e:
        print("🔥 ERROR:", e)


# ===============================
# RUN
# ===============================
if __name__ == "__main__":
    test_auth_flow()
