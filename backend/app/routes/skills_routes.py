from flask import Blueprint, request

from flask_jwt_extended import jwt_required, get_jwt_identity

from backend.app.extensions import db
from backend.app.models import SkillTag, User
from backend.app.utils import ok, fail

skills_bp = Blueprint("skills", __name__, url_prefix="/api/skills")


def get_or_create_skills(names):
    if not names:
        return []

    existing = SkillTag.query.filter(SkillTag.name.in_(names)).all()
    existing_names = {s.name for s in existing}

    for name in names:
        if name not in existing_names:
            db.session.add(SkillTag(name=name))

    db.session.flush()

    return SkillTag.query.filter(SkillTag.name.in_(names)).all()


@skills_bp.route("", methods=["GET"])
def list_skills():
    skills = SkillTag.query.order_by(SkillTag.name).all()
    return ok([
        {
            "id": s.id,
            "name": s.name,
            "description": s.description,
        }
        for s in skills
    ])


@skills_bp.route("/new", methods=["GET"])
@jwt_required()
def new_skills():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return fail("user not found", 404)

    user_skill_ids = {s.id for s in user.skills}

    new_skills = [
        {
            "id": s.id,
            "name": s.name,
            "description": s.description,
        }
        for s in SkillTag.query.order_by(SkillTag.name)
        if s.id not in user_skill_ids
    ]

    return ok(new_skills)


@skills_bp.route("/<int:skill_id>/register", methods=["POST"])
@jwt_required()
def register_skill(skill_id):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return fail("user not found", 404)

    tag = SkillTag.query.get(skill_id)
    if not tag:
        return fail("skill not found", 404)

    if tag in user.skills:
        return ok({"message": "skill already registered"})

    user.skills.append(tag)
    db.session.commit()

    return ok({"message": "skill registered"})


@skills_bp.route("", methods=["POST"])
def create_skill():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    if not name:
        return fail("name is required", 400)

    tag = SkillTag.query.filter_by(name=name).first()
    if not tag:
        tag = SkillTag(name=name, description=data.get("description"))
        db.session.add(tag)
        db.session.commit()
    else:
        db.session.commit()

    return ok({"id": tag.id, "name": tag.name})
