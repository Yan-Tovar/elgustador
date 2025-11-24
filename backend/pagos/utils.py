# pagos/utils.py
import os
import requests
from django.conf import settings

def verify_paypal_order(order_id):
    """
    Verifica una orden o captura de PayPal usando la API v2.
    Funciona para SANDBOX o LIVE dependiendo de PAYPAL_API_BASE.
    """
    client_id = getattr(settings, "PAYPAL_CLIENT_ID", None)
    secret = getattr(settings, "PAYPAL_SECRET", None)
    base_url = getattr(settings, "PAYPAL_API_BASE", "https://api-m.sandbox.paypal.com")

    if not client_id or not secret:
        return None

    # ------------------------------
    # 1. Obtener access token
    # ------------------------------
    token_url = f"{base_url}/v1/oauth2/token"

    try:
        auth = requests.post(
            token_url,
            auth=(client_id, secret),
            data={"grant_type": "client_credentials"},
            timeout=10,
        )
        auth.raise_for_status()
        token = auth.json()["access_token"]

        # ------------------------------
        # 2. Obtener captura u orden
        # ------------------------------
        # OJO: aquí debes verificar CAPTURE, NO ORDER,
        # porque en tu frontend usas capture.id
        details_url = f"{base_url}/v2/payments/captures/{order_id}"

        resp = requests.get(
            details_url,
            headers={"Authorization": f"Bearer {token}"},
            timeout=10,
        )
        resp.raise_for_status()

        return resp.json()

    except Exception as e:
        return None
