from backend.app import db
from backend.app.models.models import User, SkillTag, EventLocation, Shift
from datetime import datetime, timedelta

def seed_data():
    # Create some Skill Tags
    skills = ["First Aid", "Driving", "Cooking", "Security", "Event Setup", "Photography"]
    for skill_name in skills:
        if not SkillTag.query.filter_by(name=skill_name).first():
            skill = SkillTag(name=skill_name)
            db.session.add(skill)

    db.session.commit()
    print("✅ Seed data added successfully!")

if __name__ == "__main__":
    from backend.app import create_app
    app = create_app()
    with app.app_context():
        seed_data()