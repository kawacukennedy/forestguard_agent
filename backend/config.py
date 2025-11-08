import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./forestguard.db")
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key")
    aws_access_key_id: str = os.getenv("AWS_ACCESS_KEY_ID")
    aws_secret_access_key: str = os.getenv("AWS_SECRET_ACCESS_KEY")
    s3_bucket: str = os.getenv("S3_BUCKET", "forestguard-bucket")
    slack_webhook_url: str = os.getenv("SLACK_WEBHOOK_URL")
    telegram_bot_token: str = os.getenv("TELEGRAM_BOT_TOKEN")
    email_smtp_server: str = os.getenv("EMAIL_SMTP_SERVER")
    email_username: str = os.getenv("EMAIL_USERNAME")
    email_password: str = os.getenv("EMAIL_PASSWORD")

settings = Settings()