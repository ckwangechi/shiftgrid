from datetime import datetime, timedelta

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from backend.app.extensions import db
from backend.app.models import Shift, EventLocation, User
from backend.app.utils import ok, fail, role_required

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


def _fmt_date(dt):
    return dt.strftime("%b %d, %Y") if dt else None


@admin_bp.route("/stats", methods=["GET"])
@role_required("admin")
def admin_stats():
    users = User.query.count()
    volunteers = User.query.filter_by(role="volunteer").count()
    job_creators = User.query.filter_by(role="job_creator").count()
    admins = User.query.filter_by(role="admin").count()

    total_shifts = Shift.query.count()
    open_shifts = Shift.query.filter(Shift.user_id.is_(None)).count()
    claimed_shifts = Shift.query.filter(Shift.user_id.isnot(None)).count()
    locations = EventLocation.query.count()

    recent_shifts = Shift.query.order_by(Shift.start_time.desc()).limit(5).all()
    recent_users = User.query.order_by(User.created_at.desc()).limit(5).all()

    return ok({
        "totalUsers": users,
        "volunteers": volunteers,
        "jobCreators": job_creators,
        "admins": admins,
        "totalShifts": total_shifts,
        "openShifts": open_shifts,
        "claimedShifts": claimed_shifts,
        "locations": locations,
        "recentShifts": [
            {
                "id": s.id,
                "title": s.title or s.role_title,
                "location": s.location.name if s.location else "—",
                "date": _fmt_date(s.start_time),
                "status": "Claimed" if s.user_id else (s.status or "Open"),
            }
            for s in recent_shifts
        ],
        "recentUsers": [
            {
                "id": u.id,
                "name": u.full_name or u.username,
                "email": u.email,
                "role": u.role,
            }
            for u in recent_users
        ],
    })


@admin_bp.route("/shifts", methods=["GET"])
@role_required("admin")
def list_shifts():
    shifts = Shift.query.order_by(Shift.start_time.desc()).all()
    return ok([
        {
            "id": s.id,
            "title": s.title or s.role_title,
            "location": s.location.name if s.location else "—",
            "date": _fmt_date(s.start_time),
            "status": s.status or ("Claimed" if s.user_id else "Open"),
        }
        for s in shifts
    ])


@admin_bp.route("/shifts/<int:shift_id>", methods=["PUT"])
@role_required("admin")
def update_shift(shift_id):
    shift = Shift.query.get(shift_id)
    if not shift:
        return fail("shift not found", 404)

    data = request.get_json(silent=True) or {}
    if "status" in data:
        shift.status = data["status"]

    db.session.commit()
    return ok({"message": "shift updated"})


@admin_bp.route("/shifts/<int:shift_id>", methods=["DELETE"])
@role_required("admin")
def delete_shift(shift_id):
    shift = Shift.query.get(shift_id)
    if not shift:
        return fail("shift not found", 404)

    db.session.delete(shift)
    db.session.commit()
    return ok({"message": "shift deleted"})


@admin_bp.route("/locations", methods=["GET"])
@role_required("admin")
def list_locations():
    locations = EventLocation.query.order_by(EventLocation.name).all()
    return ok([
        {
            "id": loc.id,
            "name": loc.name,
            "address": loc.address,
        }
        for loc in locations
    ])


@admin_bp.route("/locations", methods=["POST"])
@role_required("admin")
def create_location():
    data = request.get_json(silent=True) or {}
    if not data.get("name"):
        return fail("name is required", 400)

    location = EventLocation(
        name=data["name"],
        address=data.get("address"),
        city=data.get("city"),
    )
    db.session.add(location)
    db.session.commit()

    return ok({
        "id": location.id,
        "name": location.name,
        "address": location.address,
    }, 201)


@admin_bp.route("/locations/<int:location_id>", methods=["PUT"])
@role_required("admin")
def update_location(location_id):
    location = EventLocation.query.get(location_id)
    if not location:
        return fail("location not found", 404)

    data = request.get_json(silent=True) or {}
    if "name" in data:
        location.name = data["name"]
    if "address" in data:
        location.address = data["address"]
    if "city" in data:
        location.city = data["city"]
    if "capacity" in data:
        location.capacity = data["capacity"]
    if "notes" in data:
        location.notes = data["notes"]

    db.session.commit()
    return ok({"message": "location updated"})


@admin_bp.route("/locations/<int:location_id>", methods=["DELETE"])
@role_required("admin")
def delete_location(location_id):
    location = EventLocation.query.get(location_id)
    if not location:
        return fail("location not found", 404)

    db.session.delete(location)
    db.session.commit()
    return ok({"message": "location deleted"})


@admin_bp.route("/users", methods=["GET"])
@role_required("admin")
def list_users():
    users = User.query.order_by(User.username).all()
    return ok([
        {
            "id": u.id,
            "name": u.full_name or u.username,
            "email": u.email,
            "role": u.role,
        }
        for u in users
    ])


@admin_bp.route("/users/<int:user_id>", methods=["PUT"])
@role_required("admin")
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return fail("user not found", 404)

    data = request.get_json(silent=True) or {}
    if "role" in data:
        if data["role"] not in ("volunteer", "job_creator", "admin"):
            return fail("invalid role", 400)
        user.role = data["role"]

    db.session.commit()
    return ok({"message": "user updated"})


@admin_bp.route("/users/<int:user_id>", methods=["DELETE"])
@role_required("admin")
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return fail("user not found", 404)

    if user.role == "admin":
        return fail("cannot delete an admin account", 400)

    db.session.delete(user)
    db.session.commit()
    return ok({"message": "user deleted"})
