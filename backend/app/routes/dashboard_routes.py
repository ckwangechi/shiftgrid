from datetime import datetime, timedelta

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from backend.app.extensions import db
from backend.app.models import Shift, EventLocation, User, SkillTag
from backend.app.utils import ok

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")


def _fmt_date(dt):
    return dt.strftime("%b %d, %Y") if dt else None


def _fmt_time(dt):
    return dt.strftime("%I:%M %p") if dt else None


def _time_bucket(dt):
    hour = dt.hour
    if hour < 12:
        return "Morning"
    if hour < 17:
        return "Afternoon"
    if hour < 21:
        return "Evening"
    return "Night"


def _matching_shift_ids(user):
    skill_names = {s.name for s in user.skills}
    pref = user.preferences

    pref_location = pref.preferred_location if pref else None
    pref_time = pref.preferred_shift_time if pref else None
    pref_event = pref.preferred_event_type if pref else None
    has_prefs = any([pref_location, pref_time, pref_event])

    now = datetime.utcnow()

    shifts = Shift.query.filter(
        Shift.created_by.isnot(None),
        Shift.user_id.is_(None),
        Shift.start_time >= now,
    ).all()

    matched = []
    for s in shifts:
        if skill_names and s.required_skill not in skill_names:
            continue

        if has_prefs:
            hits_pref = False
            if pref_location and s.location and s.location.name == pref_location:
                hits_pref = True
            if pref_time and _time_bucket(s.start_time) == pref_time:
                hits_pref = True
            if pref_event:
                haystack = f"{s.title or ''} {s.company or ''} {s.required_skill or ''}".lower()
                if pref_event.lower() in haystack:
                    hits_pref = True
            if not hits_pref:
                continue

        matched.append(s.id)
    return set(matched)


@dashboard_bp.route("/stats", methods=["GET"])
@jwt_required()
def stats():
    user = User.query.get(int(get_jwt_identity()))
    matching = _matching_shift_ids(user)

    total_shifts = len(matching)
    open_shifts = Shift.query.filter(
        Shift.user_id.is_(None),
        Shift.id.in_(matching or [-1]),
    ).count()
    my_shifts = Shift.query.filter(Shift.user_id == user.id).count()
    locations = EventLocation.query.filter(
        EventLocation.id.in_(
            db.session.query(Shift.location_id).filter(Shift.id.in_(matching or [-1]))
        )
    ).count()

    return ok([
        {
            "id": 1,
            "title": "Total Shifts",
            "value": total_shifts,
            "change": "For you",
            "icon": "CalendarClock",
            "color": "from-blue-600 to-cyan-500",
        },
        {
            "id": 2,
            "title": "Open Shifts",
            "value": open_shifts,
            "change": "Available",
            "icon": "Briefcase",
            "color": "from-violet-600 to-indigo-500",
        },
        {
            "id": 3,
            "title": "My Shifts",
            "value": my_shifts,
            "change": "Claimed",
            "icon": "Clock3",
            "color": "from-emerald-600 to-green-500",
        },
        {
            "id": 4,
            "title": "Locations",
            "value": locations,
            "change": "Matched",
            "icon": "MapPin",
            "color": "from-orange-500 to-red-500",
        },
    ])


@dashboard_bp.route("/weekly-analytics", methods=["GET"])
@jwt_required()
def weekly_analytics():
    user = User.query.get(int(get_jwt_identity()))
    matching = _matching_shift_ids(user)

    now = datetime.utcnow()
    week_start = now - timedelta(days=now.weekday())

    week_shifts = Shift.query.filter(
        Shift.start_time >= week_start,
        Shift.id.in_(matching or [-1]),
    ).count()

    chart_data = []
    for i in range(7):
        day = week_start + timedelta(days=i)
        day_end = day + timedelta(days=1)
        count = Shift.query.filter(
            Shift.start_time >= day,
            Shift.start_time < day_end,
            Shift.id.in_(matching or [-1]),
        ).count()
        chart_data.append({
            "day": day.strftime("%a"),
            "shifts": count,
        })

    total = len(matching)
    completion_rate = f"{round(week_shifts / total * 100)}%" if total else "0%"

    return ok({
        "totalShifts": week_shifts,
        "completionRate": completion_rate,
        "avgPerDay": round(week_shifts / 7, 1),
        "chartData": chart_data,
    })


@dashboard_bp.route("/upcoming-shifts", methods=["GET"])
@jwt_required()
def upcoming_shifts():
    user_id = int(get_jwt_identity())
    shifts = Shift.query.filter(
        Shift.user_id == user_id,
        Shift.start_time >= datetime.utcnow(),
    ).order_by(Shift.start_time).limit(10).all()

    return ok([
        {
            "id": s.id,
            "role": s.role_title or s.title,
            "location": s.location.name if s.location else "—",
            "date": _fmt_date(s.start_time),
            "time": _fmt_time(s.start_time),
            "status": "Claimed" if s.user_id else "Pending",
        }
        for s in shifts
    ])


@dashboard_bp.route("/notifications", methods=["GET"])
@jwt_required()
def notifications():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    my_shifts = Shift.query.filter(Shift.user_id == user_id).count()
    matching = _matching_shift_ids(user)
    open_shifts = len(matching)

    my_skill_ids = {s.id for s in user.skills} if user.skills else set()
    new_skills_count = SkillTag.query.filter(
        ~SkillTag.id.in_(my_skill_ids)
    ).count()

    items = []

    if my_shifts:
        items.append({
            "id": 1,
            "icon": "CheckCircle2",
            "color": "bg-green-500",
            "title": "Shifts Confirmed",
            "time": "Now",
            "message": f"You currently have {my_shifts} shift(s) confirmed.",
            "link": "/shifts",
        })

    if new_skills_count:
        items.append({
            "id": 2,
            "icon": "Sparkles",
            "color": "bg-blue-500",
            "title": "New Skills Available",
            "time": "Now",
            "message": f"{new_skills_count} new skill(s) you can add to your profile to claim matching shifts.",
            "link": "/new-skills",
        })

    if open_shifts:
        items.append({
            "id": 3,
            "icon": "CalendarClock",
            "color": "bg-blue-500",
            "title": "New Shifts For You",
            "time": "Today",
            "message": f"{open_shifts} shift(s) match your skills and preferences.",
            "link": "/browse-shifts",
        })

    items.append({
        "id": 4,
        "icon": "ShieldCheck",
        "color": "bg-purple-500",
        "title": "Complete Your Profile",
        "time": "Today",
        "message": "Keep your skills and preferences updated for better matches.",
        "link": "/profile",
    })

    items.append({
        "id": 5,
        "icon": "MapPin",
        "color": "bg-orange-500",
        "title": "Explore Locations",
        "time": "Today",
        "message": "Browse venues hosting job creator shifts near you.",
        "link": "/locations",
    })

    return ok(items)


@dashboard_bp.route("/recommended-shifts", methods=["GET"])
@jwt_required()
def recommended_shifts():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    matching = _matching_shift_ids(user)

    candidates = Shift.query.filter(
        Shift.user_id.is_(None),
        Shift.id.in_(matching or [-1]),
        Shift.start_time >= datetime.utcnow(),
    ).order_by(Shift.start_time).limit(10).all()

    pref_location = user.preferences.preferred_location if user.preferences else None
    pref_time = user.preferences.preferred_shift_time if user.preferences else None

    def score(s):
        val = 0
        if pref_location and s.location and s.location.name == pref_location:
            val += 2
        if pref_time and _time_bucket(s.start_time) == pref_time:
            val += 1
        return val

    candidates.sort(key=score, reverse=True)

    colors = [
        "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
        "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
    ]

    return ok([
        {
            "id": s.id,
            "title": s.title or s.role_title,
            "location": s.location.name if s.location else "—",
            "time": _fmt_time(s.start_time),
            "color": colors[i % len(colors)],
            "match": "98%" if score(s) >= 2 else "85%",
        }
        for i, s in enumerate(candidates[:6])
    ])


@dashboard_bp.route("/recent-activity", methods=["GET"])
@jwt_required()
def recent_activity():
    user_id = int(get_jwt_identity())
    my_shifts = Shift.query.filter(Shift.user_id == user_id).all()

    activities = []

    for i, s in enumerate(my_shifts[:5]):
        activities.append({
            "id": s.id,
            "icon": "CalendarClock",
            "color": "bg-orange-500",
            "title": "Shift Claimed",
            "time": s.start_time.strftime("%b %d") if s.start_time else "—",
            "description": f"You claimed {s.title or s.role_title} at {s.location.name if s.location else 'a venue'}.",
        })

    if not activities:
        activities.append({
            "id": 1,
            "icon": "MapPin",
            "color": "bg-blue-500",
            "title": "Welcome to ShiftGrid",
            "time": "Today",
            "description": "Browse available shifts and claim one to get started.",
        })

    return ok(activities)
