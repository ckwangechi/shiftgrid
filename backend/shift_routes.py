"""
shift_routes.py — Person B ownership

Endpoints (per the project spec doc):
    POST   /api/shifts/create          (admin)
    GET    /api/shifts                 (public)
    PUT    /api/shifts/<id>/update     (admin)
    DELETE /api/shifts/<id>/delete     (admin)
    POST   /api/shifts/<id>/claim      (any authenticated user)

NOTE on frontend mismatch: shiftsService.js/browseService.js in the
current frontend zip call additional paths not in the spec doc —
GET /shifts/my, GET /shifts/my/stats, GET /shifts/browse,
POST /shifts/<id>/release — and ShiftCard.jsx expects fields
(title, event, pay, slots) that don't exist on the agreed Shift model.
None of that is implemented here; it needs a team decision (schema
change + spec update) before it's built, since it's Person A's model
that would have to change. See the alignment notes for full detail.
"""

from datetime import datetime

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import Shift, User, EventLocation
from utils import ok, fail, role_required

shift_bp = Blueprint("shifts", __name__, url_prefix="/api/shifts")


def _parse_dt(value):
    """Parses ISO-8601 strings (e.g. '2026-08-01T09:00:00') into datetime."""
    return datetime.fromisoformat(value)


def _shift_to_dict(shift):
    return {
        "id": shift.id,
        "role_title": shift.role_title,
        "required_skill": shift.required_skill,
        "start_time": shift.start_time.isoformat(),
        "end_time": shift.end_time.isoformat(),
        "location_id": shift.location_id,
        "user_id": shift.user_id,
        "claimed": shift.user_id is not None,
    }


# ------------------------------------------------------------------ create
@shift_bp.route("/create", methods=["POST"])
@role_required("admin")
def create_shift():
    data = request.get_json(silent=True) or {}
    required_fields = ["role_title", "required_skill", "start_time", "end_time", "location_id"]
    missing = [f for f in required_fields if not data.get(f)]
    if missing:
        return fail(f"missing fields: {', '.join(missing)}", 400)

    if not EventLocation.query.get(data["location_id"]):
        return fail("location not found", 404)

    try:
        start_time = _parse_dt(data["start_time"])
        end_time = _parse_dt(data["end_time"])
    except ValueError:
        return fail("start_time/end_time must be ISO-8601 datetimes", 400)

    if end_time <= start_time:
        return fail("end_time must be after start_time", 400)

    shift = Shift(
        role_title=data["role_title"],
        required_skill=data["required_skill"],
        start_time=start_time,
        end_time=end_time,
        location_id=data["location_id"],
    )
    db.session.add(shift)
    db.session.commit()

    return ok(_shift_to_dict(shift), 201)


# --------------------------------------------------------------------- list
@shift_bp.route("", methods=["GET"])
def list_shifts():
    shifts = Shift.query.order_by(Shift.start_time).all()
    return ok([_shift_to_dict(s) for s in shifts])


# ------------------------------------------------------------------ update
@shift_bp.route("/<int:shift_id>/update", methods=["PUT"])
@role_required("admin")
def update_shift(shift_id):
    shift = Shift.query.get(shift_id)
    if not shift:
        return fail("shift not found", 404)

    data = request.get_json(silent=True) or {}

    if "role_title" in data:
        shift.role_title = data["role_title"]
    if "required_skill" in data:
        shift.required_skill = data["required_skill"]
    if "location_id" in data:
        if not EventLocation.query.get(data["location_id"]):
            return fail("location not found", 404)
        shift.location_id = data["location_id"]

    try:
        if "start_time" in data:
            shift.start_time = _parse_dt(data["start_time"])
        if "end_time" in data:
            shift.end_time = _parse_dt(data["end_time"])
    except ValueError:
        return fail("start_time/end_time must be ISO-8601 datetimes", 400)

    if shift.end_time <= shift.start_time:
        return fail("end_time must be after start_time", 400)

    db.session.commit()
    return ok(_shift_to_dict(shift))


# ------------------------------------------------------------------ delete
@shift_bp.route("/<int:shift_id>/delete", methods=["DELETE"])
@role_required("admin")
def delete_shift(shift_id):
    shift = Shift.query.get(shift_id)
    if not shift:
        return fail("shift not found", 404)

    db.session.delete(shift)
    db.session.commit()
    return ok({"message": "shift deleted"})


# ------------------------------------------------------------------- claim
@shift_bp.route("/<int:shift_id>/claim", methods=["POST"])
@jwt_required()
def claim_shift(shift_id):
    user_id = int(get_jwt_identity())
    shift = Shift.query.get(shift_id)
    if not shift:
        return fail("shift not found", 404)

    if shift.user_id is not None:
        return fail("shift already claimed", 409)

    user = User.query.get(user_id)

    # 1. Skill-gated claiming: reject if the volunteer doesn't hold the
    #    required verified skill for this shift.
    user_skill_names = {s.name for s in user.skills}
    if shift.required_skill not in user_skill_names:
        return fail(f"missing required skill: {shift.required_skill}", 403)

    # 2. Collision detection: reject if this shift's time window overlaps
    #    any shift the user has already claimed. Standard interval overlap
    #    check: two ranges overlap iff startA < endB AND endA > startB.
    overlap = Shift.query.filter(
        Shift.user_id == user_id,
        Shift.id != shift.id,
        Shift.start_time < shift.end_time,
        Shift.end_time > shift.start_time,
    ).first()

    if overlap:
        return fail(
            "time conflict with an existing claimed shift",
            409,
            conflicting_shift_id=overlap.id,
        )

    # 3. Valid claim.
    shift.user_id = user_id
    db.session.commit()

    return ok({"message": "shift claimed", "shift": _shift_to_dict(shift)})