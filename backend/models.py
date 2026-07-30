"""
REFERENCE ONLY — Person A owns the real models.py.

This is a working stub that matches the schema described in the project
doc (6 models, user_skills join table, UserPreference 1:1 with User).
It exists so I (Person B) can build and test auth_routes.py, shift_routes.py,
and location_routes.py against something real. Once Person A's actual
models.py is merged, this file should be deleted and replaced.
"""

from datetime import datetime
from extensions import db

# Many-to-many join table: User <-> SkillTag
user_skills = db.Table(
    "user_skills",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
    db.Column("skill_tag_id", db.Integer, db.ForeignKey("skill_tag.id"), primary_key=True),
)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="volunteer")  # 'volunteer' | 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    skills = db.relationship("SkillTag", secondary=user_skills, backref="users")
    shifts = db.relationship("Shift", backref="volunteer", foreign_keys="Shift.user_id")
    preference = db.relationship("UserPreference", backref="user", uselist=False)


class SkillTag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(255))
    difficulty_level = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class EventLocation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    address = db.Column(db.String(255))
    capacity = db.Column(db.Integer)
    notes = db.Column(db.String(255))

    shifts = db.relationship("Shift", backref="location")


class Shift(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role_title = db.Column(db.String(120), nullable=False)
    required_skill = db.Column(db.String(80), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)  # null = unclaimed
    location_id = db.Column(db.Integer, db.ForeignKey("event_location.id"), nullable=False)


class UserPreference(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), unique=True, nullable=False)
    preferred_location = db.Column(db.String(120))
    preferred_shift_time = db.Column(db.String(50))
    preferred_event_type = db.Column(db.String(80))
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class PasswordResetToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    token_string = db.Column(db.String(255), unique=True, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    is_used = db.Column(db.Boolean, default=False)