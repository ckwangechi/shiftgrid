"""
Shared extension instances.

Kept in their own module (rather than inside app.py) so that models.py,
auth_routes.py, shift_routes.py, and location_routes.py can all import
`db`, `jwt`, `bcrypt` without causing circular imports.
"""

from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()
cors = CORS()