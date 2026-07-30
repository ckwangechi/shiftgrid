from datetime import datetime
from backend.app import db
from sqlalchemy.orm import relationship

# Many-to-Many association table for User <-> SkillTag
user_skills = db.Table('user_skills',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('skill_tag_id', db.Integer, db.ForeignKey('skill_tag.id'), primary_key=True)
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='volunteer')  # volunteer or admin
    is_approved = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    skills = relationship('SkillTag', secondary=user_skills, backref=db.backref('users', lazy='dynamic'))
    preferences = relationship('UserPreference', uselist=False, back_populates='user')
    password_resets = relationship('PasswordResetToken', back_populates='user', cascade="all, delete-orphan")
    claimed_shifts = relationship('Shift', back_populates='claimed_by')

class SkillTag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)   # e.g. First Aid, Driving

class EventLocation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    address = db.Column(db.Text)
    coordinates = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    shifts = relationship('Shift', back_populates='location')

class Shift(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    max_volunteers = db.Column(db.Integer, default=10)
    location_id = db.Column(db.Integer, db.ForeignKey('event_location.id'))
    claimed_by_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    location = relationship('EventLocation', back_populates='shifts')
    claimed_by = relationship('User', back_populates='claimed_shifts')

class PasswordResetToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(255), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = relationship('User', back_populates='password_resets')

class UserPreference(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)
    
    preferred_locations = db.Column(db.Text)   # Can be JSON string
    preferred_times = db.Column(db.Text)
    preferred_event_types = db.Column(db.Text)
    
    user = relationship('User', back_populates='preferences')