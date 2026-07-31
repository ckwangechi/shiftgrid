from flask import Flask, request
from flask_migrate import Migrate

from backend.app.extensions import db, migrate as _migrate, jwt, cors


def create_app():
    app = Flask(__name__, static_folder='/home/gadontune/shiftgrid/frontend/dist', static_url_path='')

    app.config.from_object("backend.app.config.Config")

    db.init_app(app)
    _migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app)

    from backend.app.models import (
        User,
        SkillTag,
        EventLocation,
        Shift,
        PasswordResetToken,
        UserPreference,
    )

    from backend.app.routes.auth_routes import auth_bp
    from backend.app.routes.shift_routes import shift_bp
    from backend.app.routes.location_routes import location_bp
    from backend.app.routes.preferences_routes import preferences_bp
    from backend.app.routes.dashboard_routes import dashboard_bp
    from backend.app.routes.admin_routes import admin_bp
    from backend.app.routes.skills_routes import skills_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(shift_bp)
    app.register_blueprint(location_bp)
    app.register_blueprint(preferences_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(skills_bp)

    with app.app_context():
        db.create_all()

    @app.route('/')
    def serve_frontend():
        return app.send_static_file('index.html')

    @app.errorhandler(404)
    def spa_not_found(e):
        from flask import request
        if request.path.startswith('/api'):
            return {'message': 'Not found'}, 404
        return app.send_static_file('index.html')

    return app