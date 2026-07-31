from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from backend.app.extensions import db
from backend.app.models import UserPreference, User
from backend.app.utils import ok, fail

preferences_bp = Blueprint("preferences", __name__, url_prefix="/api/preferences")


@preferences_bp.route("", methods=["GET"])
@jwt_required()
def get_preferences():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return fail("user not found", 404)

    pref = user.preferences
    if not pref:
        return fail("preferences not found", 404)

    return ok({
        "preferred_location": pref.preferred_location,
        "preferred_shift_time": pref.preferred_shift_time,
        "preferred_event_type": pref.preferred_event_type,
    })


@preferences_bp.route("", methods=["PUT"])
@jwt_required()
def update_preferences():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return fail("user not found", 404)

    data = request.get_json(silent=True) or {}
    pref = user.preferences

    if not pref:
        pref = UserPreference(user_id=user_id)
        db.session.add(pref)

    if "preferred_location" in data:
        pref.preferred_location = data["preferred_location"]
    if "preferred_shift_time" in data:
        pref.preferred_shift_time = data["preferred_shift_time"]
    if "preferred_event_type" in data:
        pref.preferred_event_type = data["preferred_event_type"]

    db.session.commit()

    return ok({
        "preferred_location": pref.preferred_location,
        "preferred_shift_time": pref.preferred_shift_time,
        "preferred_event_type": pref.preferred_event_type,
    })