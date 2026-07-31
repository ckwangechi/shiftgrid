from flask import Blueprint, request

from backend.app.extensions import db
from backend.app.models import EventLocation, Shift
from backend.app.utils import ok, fail, role_required
location_bp = Blueprint("locations", __name__, url_prefix="/api/locations")


def _location_to_dict(loc):
    return {
        "id": loc.id,
        "name": loc.name,
        "address": loc.address,
        "city": loc.city,
        "capacity": loc.capacity,
        "notes": loc.notes,
        "distance": None,
        "shiftCount": len(loc.shifts),
    }


@location_bp.route("/stats", methods=["GET"])
def location_stats():
    locations = _job_creator_locations()
    open_shifts = Shift.query.filter(
        Shift.user_id.is_(None),
        Shift.created_by.isnot(None),
    ).count()
    cities = {loc.city for loc in locations if loc.city}
    cities.add("Nairobi")

    return ok({
        "total": len(locations),
        "openShifts": open_shifts,
        "cities": len(cities),
        "nearby": len(locations),
    })


def _job_creator_locations():
    location_ids = db.session.query(Shift.location_id).filter(
        Shift.created_by.isnot(None)
    ).distinct()
    return EventLocation.query.filter(EventLocation.id.in_(location_ids)).all()


@location_bp.route("/create", methods=["POST"])
@role_required("admin", "job_creator")
def create_location():
    data = request.get_json(silent=True) or {}
    if not data.get("name"):
        return fail("name is required", 400)

    location = EventLocation(
        name=data["name"],
        address=data.get("address"),
        city=data.get("city"),
        capacity=data.get("capacity"),
        notes=data.get("notes"),
    )
    db.session.add(location)
    db.session.commit()

    return ok(_location_to_dict(location), 201)


@location_bp.route("", methods=["GET"])
def list_locations():
    locations = _job_creator_locations()
    return ok([_location_to_dict(l) for l in locations])


@location_bp.route("/<int:location_id>/update", methods=["PUT"])
@role_required("admin", "job_creator")
def update_location(location_id):
    location = EventLocation.query.get(location_id)
    if not location:
        return fail("location not found", 404)

    data = request.get_json(silent=True) or {}
    for field in ("name", "address", "city", "capacity", "notes"):
        if field in data:
            setattr(location, field, data[field])

    db.session.commit()
    return ok(_location_to_dict(location))


@location_bp.route("/<int:location_id>/delete", methods=["DELETE"])
@role_required("admin", "job_creator")
def delete_location(location_id):
    location = EventLocation.query.get(location_id)
    if not location:
        return fail("location not found", 404)

    db.session.delete(location)
    db.session.commit()
    return ok({"message": "location deleted"})
