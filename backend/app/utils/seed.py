from datetime import datetime, timedelta

from backend.app import create_app, db
from backend.app.extensions import bcrypt
from backend.app.models import (
    User,
    SkillTag,
    EventLocation,
    Shift,
    UserPreference,
    PasswordResetToken,
    user_skills,
)

app = create_app()

with app.app_context():
    print("Clearing existing data...")

    db.session.execute(user_skills.delete())
    Shift.query.delete()
    UserPreference.query.delete()
    PasswordResetToken.query.delete()
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
        city="Nairobi",
        coordinates="-1.3090,36.8148",
        capacity=5000
    )

    convention = EventLocation(
        name="KICC",
        address="Harambee Avenue, Nairobi",
        city="Nairobi",
        coordinates="-1.2864,36.8172",
        capacity=2000
    )

    db.session.add_all([stadium, convention])

    print("Creating Users...")

    alice = User(
        username="alice",
        full_name="Alice Wanjiku",
        email="alice@example.com",
        phone="0711111111",
        password_hash=bcrypt.generate_password_hash("password123").decode("utf-8"),
        role="volunteer"
    )

    brian = User(
        username="brian",
        full_name="Brian Otieno",
        email="brian@example.com",
        phone="0722222222",
        password_hash=bcrypt.generate_password_hash("password123").decode("utf-8"),
        role="volunteer"
    )

    admin = User(
        username="admin",
        full_name="Gadontune Admin",
        email="gadontune@gmail.admin.com",
        phone="0733333333",
        password_hash=bcrypt.generate_password_hash("admin123").decode("utf-8"),
        role="admin"
    )

    job_creator = User(
        username="creator",
        full_name="Job Creator",
        email="creator@example.com",
        phone="0744444444",
        password_hash=bcrypt.generate_password_hash("creator123").decode("utf-8"),
        role="job_creator"
    )

    db.session.add_all([
        alice,
        brian,
        admin,
        job_creator
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

    job_creator.skills.extend([
        first_aid,
        logistics,
        registration,
        photography
    ])

    print("Creating User Preferences...")

    pref1 = UserPreference(
        user=alice,
        preferred_location="Nairobi National Stadium",
        preferred_shift_time="Morning",
        preferred_event_type="Sports",
        notifications_enabled=True
    )

    pref2 = UserPreference(
        user=brian,
        preferred_location="KICC",
        preferred_shift_time="Evening",
        preferred_event_type="Conference",
        notifications_enabled=True
    )

    db.session.add_all([
        pref1,
        pref2
    ])

    print("Creating Shifts...")

    shift1 = Shift(
        title="Registration Desk",
        role_title="Registration Desk",
        description="Assist visitors at registration.",
        company="Nairobi Marathon 2026",
        pay=1500,
        status="Claimed",
        start_time=datetime.now() + timedelta(days=1),
        end_time=datetime.now() + timedelta(days=1, hours=4),
        max_volunteers=8,
        required_skill="Registration",
        location=stadium,
        claimed_by=alice,
        created_by=job_creator.id,
    )

    shift2 = Shift(
        title="Equipment Setup",
        role_title="Equipment Setup",
        description="Set up equipment before event.",
        company="Tech Summit Kenya",
        pay=2000,
        status="Claimed",
        start_time=datetime.now() + timedelta(days=2),
        end_time=datetime.now() + timedelta(days=2, hours=5),
        max_volunteers=6,
        required_skill="Logistics",
        location=convention,
        claimed_by=brian,
        created_by=job_creator.id,
    )

    shift3 = Shift(
        title="First Aid Support",
        role_title="First Aid Support",
        description="Provide first aid during the marathon.",
        company="Nairobi Marathon 2026",
        pay=1800,
        status="Open",
        start_time=datetime.now() + timedelta(days=3),
        end_time=datetime.now() + timedelta(days=3, hours=6),
        max_volunteers=10,
        required_skill="First Aid",
        location=stadium,
        created_by=job_creator.id,
    )

    shift4 = Shift(
        title="Event Photography",
        role_title="Event Photography",
        description="Capture key moments of the summit.",
        company="Tech Summit Kenya",
        pay=2500,
        status="Open",
        start_time=datetime.now() + timedelta(days=5),
        end_time=datetime.now() + timedelta(days=5, hours=4),
        max_volunteers=3,
        required_skill="Photography",
        location=convention,
        created_by=job_creator.id,
    )

    shift5 = Shift(
        title="Stage Crew",
        role_title="Stage Crew",
        description="Help with stage setup and sound.",
        company="Nairobi Festival",
        pay=1200,
        status="Open",
        start_time=datetime.now() + timedelta(days=7),
        end_time=datetime.now() + timedelta(days=7, hours=5),
        max_volunteers=12,
        required_skill="Logistics",
        location=stadium,
        created_by=job_creator.id,
    )

    shift6 = Shift(
        title="Guest Registration",
        role_title="Guest Registration",
        description="Check in guests at the conference.",
        company="Tech Summit Kenya",
        pay=1600,
        status="Open",
        start_time=datetime.now() + timedelta(days=10),
        end_time=datetime.now() + timedelta(days=10, hours=3),
        max_volunteers=6,
        required_skill="Registration",
        location=convention,
        created_by=job_creator.id,
    )

    db.session.add_all([
        shift1,
        shift2,
        shift3,
        shift4,
        shift5,
        shift6
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