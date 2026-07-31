import secrets
from datetime import datetime, timedelta

from flask import Blueprint, request, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from backend.app.extensions import db, bcrypt
from backend.app.models import User, SkillTag, UserPreference, PasswordResetToken
from backend.app.utils import ok, fail
from backend.app.routes.skills_routes import get_or_create_skills

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return fail("username, email and password are required", 400)

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return fail("username or email already in use", 409)

    user = User(
        username=username,
        full_name=data.get("full_name", username),
        email=email,
        password_hash=bcrypt.generate_password_hash(password).decode("utf-8"),
        role=data.get("role") if data.get("role") in ("volunteer", "job_creator", "admin") else "volunteer",
    )
    db.session.add(user)
    db.session.flush()

    skill_names = data.get("skills", [])
    if skill_names:
        user.skills.extend(get_or_create_skills(skill_names))

    db.session.add(UserPreference(user_id=user.id))

    db.session.commit()

    return ok({"user_id": user.id, "message": "registered"}, 201)


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email")
    password = data.get("password", "")

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return fail("invalid email or password", 401)

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role},
    )

    return ok({
        "access_token": access_token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
        },
    })


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return fail("user not found", 404)

    pref = user.preferences

    return ok({
        "id": user.id,
        "username": user.username,
        "name": user.full_name or user.username,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "skills": [s.name for s in user.skills],
        "preferences": {
            "preferred_location": pref.preferred_location if pref else None,
            "preferred_shift_time": pref.preferred_shift_time if pref else None,
            "preferred_event_type": pref.preferred_event_type if pref else None,
        } if pref else None,
    })


@auth_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_me():
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return fail("user not found", 404)

    data = request.get_json(silent=True) or {}

    if data.get("name"):
        user.full_name = data["name"]

    if data.get("email") and data["email"] != user.email:
        existing = User.query.filter(
            User.email == data["email"],
            User.id != user.id,
        ).first()
        if existing:
            return fail("email already in use", 409)
        user.email = data["email"]

    if data.get("role"):
        user.role = data["role"]

    if data.get("skills") is not None:
        user.skills = get_or_create_skills(data["skills"])

    db.session.commit()

    return ok({"message": "profile updated"})


@auth_bp.route("/password", methods=["PUT"])
@jwt_required()
def change_password():
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return fail("user not found", 404)

    data = request.get_json(silent=True) or {}
    current_password = data.get("currentPassword") or data.get("current_password")
    new_password = data.get("newPassword") or data.get("new_password")

    if not current_password or not new_password:
        return fail("currentPassword and newPassword are required", 400)

    if not bcrypt.check_password_hash(user.password_hash, current_password):
        return fail("current password is incorrect", 401)

    user.password_hash = bcrypt.generate_password_hash(new_password).decode("utf-8")
    db.session.commit()

    return ok({"message": "password updated"})


@auth_bp.route("/preferences", methods=["GET"])
@jwt_required()
def get_preferences():
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return fail("user not found", 404)

    pref = user.preferences
    if not pref:
        return ok({
            "preferredLocations": [],
            "preferredTimes": [],
            "preferredEventTypes": [],
            "emailNotifications": True,
            "shiftReminders": True,
            "weeklySummary": False,
            "darkMode": False,
            "language": "en",
            "timezone": "UTC",
        })

    return ok({
        "preferredLocations": [pref.preferred_location] if pref.preferred_location else [],
        "preferredTimes": [pref.preferred_shift_time] if pref.preferred_shift_time else [],
        "preferredEventTypes": [pref.preferred_event_type] if pref.preferred_event_type else [],
        "emailNotifications": pref.email_notifications,
        "shiftReminders": pref.shift_reminders,
        "weeklySummary": pref.weekly_summary,
        "darkMode": pref.dark_mode,
        "language": pref.language,
        "timezone": pref.timezone,
    })


@auth_bp.route("/preferences", methods=["PUT"])
@jwt_required()
def update_preferences():
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return fail("user not found", 404)

    data = request.get_json(silent=True) or {}

    pref = user.preferences
    if not pref:
        pref = UserPreference(user_id=user.id)
        db.session.add(pref)

    if data.get("preferredLocations"):
        pref.preferred_location = data["preferredLocations"][0]
    if data.get("preferredTimes"):
        pref.preferred_shift_time = data["preferredTimes"][0]
    if data.get("preferredEventTypes"):
        pref.preferred_event_type = data["preferredEventTypes"][0]

    for key, attr in {
        "emailNotifications": "email_notifications",
        "shiftReminders": "shift_reminders",
        "weeklySummary": "weekly_summary",
        "darkMode": "dark_mode",
    }.items():
        if key in data:
            setattr(pref, attr, bool(data[key]))

    if data.get("language"):
        pref.language = data["language"]
    if data.get("timezone"):
        pref.timezone = data["timezone"]

    db.session.commit()

    return ok({"message": "preferences updated"})


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json(silent=True) or {}
    email = data.get("email")

    if not email:
        return fail("email is required", 400)

    user = User.query.filter_by(email=email).first()

    if user:
        token_string = secrets.token_urlsafe(32)
        reset_token = PasswordResetToken(
            token=token_string,
            user_id=user.id,
            expires_at=datetime.utcnow() + timedelta(minutes=30),
        )
        db.session.add(reset_token)
        db.session.commit()

        current_app.logger.info(f"Password reset token for {email}: {token_string}")

        if current_app.config.get("DEBUG"):
            return ok({
                "message": "reset token generated (dev mode)",
                "token": token_string,
            })

    return ok({"message": "if that email exists, a reset link has been sent"})


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json(silent=True) or {}
    token_string = data.get("token")
    new_password = data.get("password") or data.get("new_password")

    if not token_string or not new_password:
        return fail("token and password are required", 400)

    reset_token = PasswordResetToken.query.filter_by(
        token=token_string
    ).first()

    if not reset_token or reset_token.expires_at < datetime.utcnow():
        return fail("invalid or expired token", 400)

    user = User.query.get(reset_token.user_id)
    if not user:
        return fail("user not found", 404)

    user.password_hash = bcrypt.generate_password_hash(new_password).decode("utf-8")
    db.session.delete(reset_token)
    db.session.commit()

    return ok({"message": "password updated"})