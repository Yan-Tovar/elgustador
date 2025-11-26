from django.core.signing import TimestampSigner, BadSignature, SignatureExpired

signer = TimestampSigner()

# Tiempo máximo que será válido el token (en segundos)
TOKEN_EXPIRATION_SECONDS = 1800  # 30 minutos

# =====================================================
#                     GENERAR TOKEN
# =====================================================
def generate_reset_token(user):
    """
    Genera un token firmado y con timestamp
    """
    signed_value = signer.sign(str(user.pk))
    return signed_value


# =====================================================
#                 VALIDAR TOKEN
# =====================================================
def validate_reset_token(token):
    """
    Valida el token firmado.
    SIEMPRE retorna una tupla: (is_valid, message)
    """
    try:
        # Verifica firma y tiempo
        signer.unsign(token, max_age=TOKEN_EXPIRATION_SECONDS)
        return (True, "Token válido")
    
    except SignatureExpired:
        return (False, "El enlace ha expirado, solicita uno nuevo.")
    
    except BadSignature:
        return (False, "Token inválido o manipulado.")
    
    except Exception:
        return (False, "Token inválido.")
