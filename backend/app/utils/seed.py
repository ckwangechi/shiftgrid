from datetime import datetime, timedelta

from backend.app import create_app, db
from backend.app.models import (
    User,
    SkillTag,
    EventLocation,
    Shift,
    UserPreference,
)

app = create_app()

with app.app_context():
    print("Clearing existing data...")

    # Delete child tables first
    Shift.query.delete()
    UserPreference.query.delete()
    User.query.delete()
    SkillTag.query.delete()
    EventLocation.query.delete()

    db.session.commit()

    print("Creating Skill Tags...")

    first_aid = SkillTag(name="First Aid")
    logistics = SkillTag(name="Logistics")
    registration = SkillTag(name="Registration")
    photography = SkillTag(name="Photography")

    db.session.add_all([
        first_aid,
        logistics,
        registration,
        photography
    ])

    print("Creating Event Locations...")

    stadium = EventLocation(
        name="Nairobi National Stadium",
        address="Langata Road, Nairobi",
        coordinates="-1.3090,36.8148",
        capacity=5000
    )

    convention = EventLocation(
        name="KICC",
        address="Harambee Avenue, Nairobi",
        coordinates="-1.2864,36.8172",
        capacity=2000
    )

    db.session.add_all([stadium, convention])

    print("Creating Users...")

    alice = User(
        full_name="Alice Wanjiku",
        email="alice@example.com",
        phone="0711111111",
        password_hash="password123",
        role="volunteer"
    )

    brian = User(
        full_name="Brian Otieno",
        email="brian@example.com",
        phone="0722222222",
        password_hash="password123",
        role="volunteer"
    )

    admin = User(
        full_name="Admin User",
        email="admin@example.com",
        phone="0733333333",
        password_hash="admin123",
        role="admin"
    )

    db.session.add_all([
        alice,
        brian,
        admin
    ])

    db.session.flush()

    print("Assigning Skills...")

    alice.skills.extend([
        first_aid,
        registration
    ])

    brian.skills.extend([
        logistics,
        photography
    ])

    admin.skills.extend([
        first_aid,
        logistics,
        registration,
        photography
    ])

    print("Creating User Preferences...")

    pref1 = UserPreference(
        user=alice,
        preferred_locations="Nairobi National Stadium",
        preferred_times="Morning",
        preferred_event_types="Sports",
        notifications_enabled=True
    )

    pref2 = UserPreference(
        user=brian,
        preferred_locations="KICC",
        preferred_times="Evening",
        preferred_event_types="Conference",
        notifications_enabled=True
    )

    db.session.add_all([
        pref1,
        pref2
    ])

    print("Creating Shifts...")

    shift1 = Shift(
        title="Registration Desk",
        description="Assist visitors at registration.",
        start_time=datetime.now() + timedelta(days=1),
        end_time=datetime.now() + timedelta(days=1, hours=4),
        max_volunteers=8,
        required_skill="Registration",
        location=stadium,
        claimed_by=alice
    )

    shift2 = Shift(
        title="Equipment Setup",
        description="Set up equipment before event.",
        start_time=datetime.now() + timedelta(days=2),
        end_time=datetime.now() + timedelta(days=2, hours=5),
        max_volunteers=6,
        required_skill="Logistics",
        location=convention,
        claimed_by=brian
    )

    db.session.add_all([
        shift1,
        shift2
    ])

    db.session.commit()

    print("=" * 50)
    print("Database seeded successfully!")
    print("=" * 50)

    print(f"Users: {User.query.count()}")
    print(f"Skills: {SkillTag.query.count()}")
    print(f"Locations: {EventLocation.query.count()}")
    print(f"Shifts: {Shift.query.count()}")
    print(f"Preferences: {UserPreference.query.count()}")