import requests
import json
def main(data):
    try:
        email = data.get("email", {})
        productId = data.get("productId", {})

        if not email or not productId:
            return {
                "error": "email and productId required"
            }, 400

        # =====================
        # STEP 1 : CREATE ORDER
        # =====================
        res_order = requests.post(
            "http://144.91.74.246:7777/api/order/create",
            json={
                "email": email,
                "productId": int(productId)
            },
            timeout=10
        )

        if res_order.status_code != 200:
            return {
                "error": "ORDER_FAILED",
                "details": res_order.text
            }, 400

        order_data = res_order.json()
        orderId = order_data["orderId"]
        amount = order_data["amount"]

        # =====================
        # STEP 2 : PAY ORDER
        # =====================
        res_pay = requests.post(
            "http://144.91.74.246:7777/api/order/pay",
            json={
                "orderId": orderId,
                "amount": amount
            },
            timeout=10
        )

        if res_pay.status_code != 200:
            return {
                "error": "PAYMENT_FAILED",
                "details": res_pay.text
            }, 400

        pay_data = res_pay.json()

        return {
            "status": "SUCCESS",
            "orderId": orderId,
            "paymentStatus": pay_data["status"]
        }, 200

    
    except Exception as e:
        print(f"Unexpected error in sendPasscode: {str(e)}")
        return {
            "errorCode": "ISE40504",
            "details": str(e)
        }, 400


# ==========================
# Execution Block
# ==========================
_locals = locals()
data = _locals.get("data", {})
response, status_code = main(data)
_locals["response"] = response
_locals["status_code"] = status_code


