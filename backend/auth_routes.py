"""
auth_routes.py — Person B ownership

Endpoints:
    POST /api/auth/register
    POST /api/auth/login
    GET  /api/auth/me           (protected)
    POST /api/auth/forgot-password
    POST /api/auth/reset-password

Response envelope: see the docstring at the top of utils.py. Every route
here returns via ok()/fail() so the body always comes back as
{"data": ...} on success or {"message": ...} on failure, matching what
shared/services/api.js and its callers (AuthContext, ForgotPasswordPage,
ResetPasswordPage) expect.
"""

import secrets
from datetime import datetime, timedelta

from flask import Blueprint, request, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from extensions import db, bcrypt
from models import User, SkillTag, UserPreference, PasswordResetToken
from utils import ok, fail

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


# ---------------------------------------------------------------- register
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

    # Role is never taken from the request body — admins are created directly
    # in the DB / seed script, never via public self-registration.
    user = User(
        username=username,
        email=email,
        password_hash=bcrypt.generate_password_hash(password).decode("utf-8"),
        role="volunteer",
    )
    db.session.add(user)
    db.session.flush()  # assigns user.id before commit, needed for the FK rows below

    # Optional: declare skills at signup, e.g. {"skills": ["First Aid", "Security"]}
    # RegisterPage.jsx currently sends skill display names as strings, matching this.
    skill_names = data.get("skills", [])
    if skill_names:
        matched_skills = SkillTag.query.filter(SkillTag.name.in_(skill_names)).all()
        user.skills.extend(matched_skills)

    # Always create an (initially empty) preference row so PUT /api/preferences
    # can be a simple update instead of having to handle "doesn't exist yet".
    db.session.add(UserPreference(user_id=user.id))

    db.session.commit()

    return ok({"user_id": user.id, "message": "registered"}, 201)


# ------------------------------------------------------------------- login
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email")
    password = data.get("password", "")

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return fail("invalid email or password", 401)

    # identity must be a string for flask-jwt-extended; role goes in as a claim
    # so protected routes can check it without a DB hit (see utils.role_required)
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


# --------------------------------------------------------------------- me
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return fail("user not found", 404)

    pref = user.preference

    return ok({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "skills": [
            {"id": s.id, "name": s.name, "difficulty_level": s.difficulty_level}
            for s in user.skills
        ],
        "preferences": {
            "preferred_location": pref.preferred_location if pref else None,
            "preferred_shift_time": pref.preferred_shift_time if pref else None,
            "preferred_event_type": pref.preferred_event_type if pref else None,
        } if pref else None,
    })


# --------------------------------------------------------- forgot-password
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json(silent=True) or {}
    email = data.get("email")

    if not email:
        return fail("email is required", 400)

    user = User.query.filter_by(email=email).first()

    # Always respond 200 regardless of whether the email exists, so the
    # endpoint can't be used to enumerate registered accounts.
    if user:
        token_string = secrets.token_urlsafe(32)
        reset_token = PasswordResetToken(
            email=email,
            token_string=token_string,
            expires_at=datetime.utcnow() + timedelta(minutes=30),
            is_used=False,
        )
        db.session.add(reset_token)
        db.session.commit()

        # In production this token would be emailed, not returned/logged.
        current_app.logger.info(f"Password reset token for {email}: {token_string}")

        # DEV CONVENIENCE ONLY: return the token directly so it's testable
        # from Postman/the ResetPasswordPage form without wiring up real
        # email sending. Remove/guard this behind an env flag before any
        # real deployment.
        if current_app.config.get("DEBUG"):
            return ok({
                "message": "reset token generated (dev mode)",
                "token": token_string,
            })

    return ok({"message": "if that email exists, a reset link has been sent"})


# ---------------------------------------------------------- reset-password
@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json(silent=True) or {}
    token_string = data.get("token")
    # ResetPasswordPage.jsx currently posts {token, password}. Accept both
    # "password" and "new_password" so this works regardless of which
    # naming the frontend settles on.
    new_password = data.get("password") or data.get("new_password")

    if not token_string or not new_password:
        return fail("token and password are required", 400)

    reset_token = PasswordResetToken.query.filter_by(
        token_string=token_string, is_used=False
    ).first()

    if not reset_token or reset_token.expires_at < datetime.utcnow():
        return fail("invalid or expired token", 400)

    user = User.query.filter_by(email=reset_token.email).first()
    if not user:
        return fail("user not found", 404)

    user.password_hash = bcrypt.generate_password_hash(new_password).decode("utf-8")
    reset_token.is_used = True
    db.session.commit()

    return ok({"message": "password updated"})