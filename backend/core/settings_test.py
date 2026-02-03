"""
Django settings for running tests (pytest or manage.py test).
Uses SQLite in-memory so tests run without PostgreSQL.
"""
from .settings import *  # noqa: F401, F403

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}
