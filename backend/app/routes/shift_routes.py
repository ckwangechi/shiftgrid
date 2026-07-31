from datetime import datetime

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from backend.app.extensions import db
from backend.app.models import Shift, User, EventLocation
from backend.app.utils import ok, fail, role_required
from backend.app.routes.skills_routes import get_or_create_skills

shift_bp = Blueprint("shifts", __name__, url_prefix="/api/shifts")


def _parse_dt(value):
    return datetime.fromisoformat(value)


def _fmt_date(dt):
    return dt.strftime("%b %d, %Y") if dt else None


def _fmt_time(dt):
    return dt.strftime("%I:%M %p") if dt else None


def _shift_to_dict(shift):
    return {
        "id": shift.id,
        "title": shift.title or shift.role_title,
        "role": shift.role_title or shift.title,
        "event": shift.title or shift.role_title,
        "role_title": shift.role_title,
        "required_skill": shift.required_skill,
        "skill": shift.required_skill,
        "company": shift.company or "ShiftGrid",
        "location_id": shift.location_id,
        "location": shift.location.name if shift.location else "—",
        "user_id": shift.user_id,
        "created_by": shift.created_by,
        "claimed": shift.user_id is not None,
        "status": "Claimed" if shift.user_id else (shift.status or "Open"),
        "date": _fmt_date(shift.start_time),
        "displayDate": _fmt_date(shift.start_time),
        "time": _fmt_time(shift.start_time),
        "pay": shift.pay,
        "slots": shift.max_volunteers,
        "description": shift.description,
    }


@shift_bp.route("/browse", methods=["GET"])
def browse_shifts():
    args = request.args

    query = Shift.query.filter(
        Shift.user_id.is_(None),
        Shift.created_by.isnot(None),
        Shift.start_time >= datetime.utcnow(),
    )

    search = args.get("search", "").strip().lower()
    location = args.get("location", "").strip().lower()
    category = args.get("category", "").strip().lower()
    date = args.get("date", "").strip()

    if search:
        query = query.filter(
            (Shift.title.ilike(f"%{search}%"))
            | (Shift.role_title.ilike(f"%{search}%"))
            | (Shift.required_skill.ilike(f"%{search}%"))
        )

    if location:
        query = query.join(EventLocation).filter(EventLocation.name.ilike(f"%{location}%"))

    if category:
        query = query.filter(Shift.required_skill.ilike(f"%{category}%"))

    if date:
        query = query.filter(Shift.start_time >= datetime.fromisoformat(date))

    shifts = query.order_by(Shift.start_time).all()
    return ok([_shift_to_dict(s) for s in shifts])


@shift_bp.route("/my", methods=["GET"])
@jwt_required()
def my_shifts():
    user_id = int(get_jwt_identity())
    shifts = Shift.query.filter(Shift.user_id == user_id).order_by(Shift.start_time).all()
    return ok([_shift_to_dict(s) for s in shifts])


@shift_bp.route("/my/stats", methods=["GET"])
@jwt_required()
def my_shifts_stats():
    user_id = int(get_jwt_identity())

    open_shifts = Shift.query.filter(Shift.user_id.is_(None)).count()
    my_shifts = Shift.query.filter(Shift.user_id == user_id).count()
    completed = Shift.query.filter(
        Shift.user_id == user_id,
        Shift.end_time < datetime.utcnow(),
    ).count()
    locations = EventLocation.query.count()

    return ok({
        "openShifts": open_shifts,
        "myShifts": my_shifts,
        "completed": completed,
        "locations": locations,
    })


@shift_bp.route("/created", methods=["GET"])
@jwt_required()
def created_shifts():
    user_id = int(get_jwt_identity())
    shifts = Shift.query.filter(Shift.created_by == user_id).order_by(Shift.start_time).all()
    return ok([_shift_to_dict(s) for s in shifts])


@shift_bp.route("/create", methods=["POST"])
@role_required("admin", "job_creator")
def create_shift():
    data = request.get_json(silent=True) or {}
    required_fields = ["role_title", "required_skill", "start_time", "end_time"]
    missing = [f for f in required_fields if not data.get(f)]
    if missing:
        return fail(f"missing fields: {', '.join(missing)}", 400)

    location_id = data.get("location_id")
    location_name = data.get("location")

    if not location_id and not location_name:
        return fail("location or location_id is required", 400)

    if location_name and not location_id:
        existing_loc = EventLocation.query.filter_by(name=location_name).first()
        if existing_loc:
            location_id = existing_loc.id
        else:
            new_loc = EventLocation(name=location_name)
            db.session.add(new_loc)
            db.session.flush()
            location_id = new_loc.id

    if not EventLocation.query.get(location_id):
        return fail("location not found", 404)

    try:
        start_time = _parse_dt(data["start_time"])
        end_time = _parse_dt(data["end_time"])
    except ValueError:
        return fail("start_time/end_time must be ISO-8601 datetimes", 400)

    if end_time <= start_time:
        return fail("end_time must be after start_time", 400)

    if data.get("required_skill"):
        get_or_create_skills([data["required_skill"]])

    shift = Shift(
        role_title=data["role_title"],
        required_skill=data["required_skill"],
        start_time=start_time,
        end_time=end_time,
        location_id=location_id,
        title=data.get("title") or data["role_title"],
        description=data.get("description"),
        company=data.get("company"),
        pay=data.get("pay"),
        status=data.get("status", "Open"),
        max_volunteers=data.get("max_volunteers") or data.get("slots", 10),
        created_by=int(get_jwt_identity()),
    )
    db.session.add(shift)
    db.session.commit()

    return ok(_shift_to_dict(shift), 201)


@shift_bp.route("", methods=["GET"])
def list_shifts():
    shifts = Shift.query.order_by(Shift.start_time).all()
    return ok([_shift_to_dict(s) for s in shifts])


@shift_bp.route("/<int:shift_id>/update", methods=["PUT"])
@role_required("admin", "job_creator")
def update_shift(shift_id):
    shift = Shift.query.get(shift_id)
    if not shift:
        return fail("shift not found", 404)

    data = request.get_json(silent=True) or {}

    if "role_title" in data:
        shift.role_title = data["role_title"]
    if "required_skill" in data:
        if data["required_skill"]:
            get_or_create_skills([data["required_skill"]])
        shift.required_skill = data["required_skill"]
    if "location_id" in data:
        if not EventLocation.query.get(data["location_id"]):
            return fail("location not found", 404)
        shift.location_id = data["location_id"]
    if "location" in data and not data.get("location_id"):
        loc_name = data["location"]
        if loc_name:
            existing_loc = EventLocation.query.filter_by(name=loc_name).first()
            if existing_loc:
                shift.location_id = existing_loc.id
            else:
                new_loc = EventLocation(name=loc_name)
                db.session.add(new_loc)
                db.session.flush()
                shift.location_id = new_loc.id

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


@shift_bp.route("/<int:shift_id>/delete", methods=["DELETE"])
@role_required("admin", "job_creator")
def delete_shift(shift_id):
    shift = Shift.query.get(shift_id)
    if not shift:
        return fail("shift not found", 404)

    db.session.delete(shift)
    db.session.commit()
    return ok({"message": "shift deleted"})


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

    user_skill_names = {s.name for s in user.skills}
    if shift.required_skill not in user_skill_names:
        return fail(f"missing required skill: {shift.required_skill}", 403)

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

    shift.user_id = user_id
    shift.status = "Claimed"
    db.session.commit()

    return ok({"message": "shift claimed", "shift": _shift_to_dict(shift)})


@shift_bp.route("/<int:shift_id>/release", methods=["POST"])
@jwt_required()
def release_shift(shift_id):
    user_id = int(get_jwt_identity())
    shift = Shift.query.get(shift_id)
    if not shift:
        return fail("shift not found", 404)

    if shift.user_id != user_id:
        return fail("you have not claimed this shift", 403)

    shift.user_id = None
    shift.status = "Open"
    db.session.commit()

    return ok({"message": "shift released", "shift": _shift_to_dict(shift)})