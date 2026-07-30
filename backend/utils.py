"""
Small shared helpers for route protection and response shaping.

RESPONSE ENVELOPE — read this before adding a new route.
----------------------------------------------------------
The frontend's axios instance (shared/services/api.js) already unwraps
`response.data` in an interceptor:

    api.interceptors.response.use((response) => response.data, ...)

Every caller then does a SECOND unwrap on top of that, e.g.:

    const { data } = await api.post("/api/auth/login", ...)   // AuthContext
    const shifts = shiftsData?.data ?? []                     // ShiftsPage

That means the JSON body returned by Flask has to be shaped like
{"data": <payload>} or those destructures silently get `undefined`.
Use ok()/fail() below for every route so this stays consistent —
don't jsonify() success/error bodies by hand.
"""

from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt


def ok(payload, status=200):
    """Standard success envelope: {"data": payload}."""
    return jsonify({"data": payload}), status


def fail(message, status=400, **extra):
    """
    Standard error envelope: {"message": ...}.

    The frontend's response interceptor reads error.response.data.message
    for its generic toast text, so "message" (not "error") is the key that
    actually surfaces to the user. Extra keys (e.g. conflicting_shift_id)
    can still be passed through for callers that want more detail.
    """
    body = {"message": message, **extra}
    return jsonify(body), status


def role_required(role):
    """
    Decorator for routes that require both a valid JWT AND a specific role
    (e.g. 'admin'). Use in addition to / instead of @jwt_required().

    Usage:
        @shift_bp.route('/create', methods=['POST'])
        @role_required('admin')
        def create_shift():
            ...
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get("role") != role:
                return fail(f"{role} access required", 403)
            return fn(*args, **kwargs)
        return wrapper
    return decorator