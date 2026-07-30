"""
app.py — app factory.

This is normally Person A's territory (create_app / config), but a minimal
version is included here so Person B's routes are runnable and testable
through Postman on their own, before everything gets merged together.
"""

import os
from datetime import timedelta
from flask import Flask

from extensions import db, jwt, bcrypt, cors


def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
        "DATABASE_URL", "sqlite:///shiftgrid.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "dev-secret-change-me")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=8)
    app.config["DEBUG"] = os.environ.get("FLASK_DEBUG", "1") == "1"

    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app)

    from auth_routes import auth_bp
    from shift_routes import shift_bp
    from location_routes import location_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(shift_bp)
    app.register_blueprint(location_bp)

    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)