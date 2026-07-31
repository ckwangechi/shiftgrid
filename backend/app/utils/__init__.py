from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt


def ok(payload, status=200):
    return jsonify({"data": payload}), status


def fail(message, status=400, **extra):
    body = {"message": message, **extra}
    return jsonify(body), status


def role_required(*roles):
    allowed = set(roles)

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get("role") not in allowed:
                return fail("admin access required", 403)
            return fn(*args, **kwargs)
        return wrapper
    return decorator