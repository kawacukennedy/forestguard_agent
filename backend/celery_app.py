from celery import Celery
from .config import settings

celery_app = Celery(
    "forestguard",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0"
)

celery_app.conf.update(
    result_expires=3600,
)