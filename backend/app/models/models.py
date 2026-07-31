from datetime import datetime
from backend.app import db
from sqlalchemy.orm import relationship

# Many-to-Many association table for User <-> SkillTag
user_skills = db.Table('user_skills',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('skill_tag_id', db.Integer, db.ForeignKey('skill_tag.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(80), unique=True, nullable=False)

    full_name = db.Column(db.String(120), nullable=False)

    email = db.Column(db.String(120), unique=True, nullable=False)

    phone = db.Column(db.String(20))

    password_hash = db.Column(db.String(255), nullable=False)

    role = db.Column(
        db.String(20),
        default="volunteer"
    )

    is_approved = db.Column(
        db.Boolean,
        default=True
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    skills = relationship(
        "SkillTag",
        secondary=user_skills,
        backref="users"
    )

    preferences = relationship(
        "UserPreference",
        uselist=False,
        back_populates="user"
    )

    password_resets = relationship(
        "PasswordResetToken",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    claimed_shifts = relationship(
        "Shift",
        foreign_keys="Shift.user_id",
        back_populates="claimed_by",
    )

class SkillTag(db.Model):
    __tablename__ = "skill_tag"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(
        db.String(80),
        unique=True,
        nullable=False
    )

    description = db.Column(db.String(255))

    difficulty_level = db.Column(db.String(20))

class EventLocation(db.Model):
    __tablename__ = "event_location"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(120), nullable=False)

    address = db.Column(db.Text)

    city = db.Column(db.String(80))

    coordinates = db.Column(db.String(50))

    capacity = db.Column(db.Integer)

    notes = db.Column(db.Text)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    shifts = relationship(
        "Shift",
        back_populates="location"
    )
class Shift(db.Model):
    __tablename__ = "shift"

    id = db.Column(db.Integer, primary_key=True)

    role_title = db.Column(db.String(120), nullable=False)

    title = db.Column(db.String(120), nullable=True)

    description = db.Column(db.Text)

    company = db.Column(db.String(120))

    pay = db.Column(db.Integer)

    status = db.Column(db.String(20), default="Open")

    start_time = db.Column(
        db.DateTime,
        nullable=False
    )

    end_time = db.Column(
        db.DateTime,
        nullable=False
    )

    max_volunteers = db.Column(
        db.Integer,
        default=10
    )

    required_skill = db.Column(db.String(80))

    location_id = db.Column(
        db.Integer,
        db.ForeignKey("event_location.id")
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=True
    )

    created_by = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=True
    )

    location = relationship(
        "EventLocation",
        back_populates="shifts"
    )

    claimed_by = relationship(
        "User",
        foreign_keys=[user_id],
        back_populates="claimed_shifts",
    )

    creator = relationship(
        "User",
        foreign_keys=[created_by],
    )

class PasswordResetToken(db.Model):
    __tablename__ = "password_reset_token"

    id = db.Column(db.Integer, primary_key=True)

    token = db.Column(
        db.String(255),
        unique=True,
        nullable=False
    )

    expires_at = db.Column(
        db.DateTime,
        nullable=False
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    user = relationship(
        "User",
        back_populates="password_resets"
    )

class UserPreference(db.Model):
    __tablename__ = "user_preference"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        unique=True,
        nullable=False
    )

    preferred_location = db.Column(db.String(120))

    preferred_shift_time = db.Column(db.String(50))

    preferred_event_type = db.Column(db.String(80))

    notifications_enabled = db.Column(
        db.Boolean,
        default=True
    )

    email_notifications = db.Column(db.Boolean, default=True)

    shift_reminders = db.Column(db.Boolean, default=True)

    weekly_summary = db.Column(db.Boolean, default=False)

    dark_mode = db.Column(db.Boolean, default=False)

    language = db.Column(db.String(20), default="en")

    timezone = db.Column(db.String(50), default="UTC")

    user = relationship(
        "User",
        back_populates="preferences"
    )