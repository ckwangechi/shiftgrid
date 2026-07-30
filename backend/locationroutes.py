"""
location_routes.py — Person B ownership

Endpoints (per the project spec doc):
    POST   /api/locations/create        (admin)
    GET    /api/locations               (public)
    PUT    /api/locations/<id>/update   (admin)
    DELETE /api/locations/<id>/delete   (admin)

NOTE on frontend mismatch: locationsService.js calls GET /locations/nearby
and GET /locations/stats, and LocationsPage.jsx reads a `city` field —
none of that is in the spec doc or the EventLocation model
(name, address, capacity, notes). Not implemented here; needs a team
decision before it's built. See the alignment notes for full detail.
"""

from flask import Blueprint, request

from extensions import db
from models import EventLocation
from utils import ok, fail, role_required

location_bp = Blueprint("locations", __name__, url_prefix="/api/locations")


def _location_to_dict(loc):
    return {
        "id": loc.id,
        "name": loc.name,
        "address": loc.address,
        "capacity": loc.capacity,
        "notes": loc.notes,
    }


@location_bp.route("/create", methods=["POST"])
@role_required("admin")
def create_location():
    data = request.get_json(silent=True) or {}
    if not data.get("name"):
        return fail("name is required", 400)

    location = EventLocation(
        name=data["name"],
        address=data.get("address"),
        capacity=data.get("capacity"),
        notes=data.get("notes"),
    )
    db.session.add(location)
    db.session.commit()

    return ok(_location_to_dict(location), 201)


@location_bp.route("", methods=["GET"])
def list_locations():
    locations = EventLocation.query.order_by(EventLocation.name).all()
    return ok([_location_to_dict(l) for l in locations])


@location_bp.route("/<int:location_id>/update", methods=["PUT"])
@role_required("admin")
def update_location(location_id):
    location = EventLocation.query.get(location_id)
    if not location:
        return fail("location not found", 404)

    data = request.get_json(silent=True) or {}
    for field in ("name", "address", "capacity", "notes"):
        if field in data:
            setattr(location, field, data[field])

    db.session.commit()
    return ok(_location_to_dict(location))


@location_bp.route("/<int:location_id>/delete", methods=["DELETE"])
@role_required("admin")
def delete_location(location_id):
    location = EventLocation.query.get(location_id)
    if not location:
        return fail("location not found", 404)

    db.session.delete(location)
    db.session.commit()
    return ok({"message": "location deleted"})