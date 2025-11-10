import os
from pydantic import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./forestguard.db")
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key")
    aws_access_key_id: Optional[str] = os.getenv("AWS_ACCESS_KEY_ID")
    aws_secret_access_key: Optional[str] = os.getenv("AWS_SECRET_ACCESS_KEY")
    s3_bucket: str = os.getenv("S3_BUCKET", "forestguard-bucket")
    slack_webhook_url: Optional[str] = os.getenv("SLACK_WEBHOOK_URL")
    telegram_bot_token: Optional[str] = os.getenv("TELEGRAM_BOT_TOKEN")
    email_smtp_server: Optional[str] = os.getenv("EMAIL_SMTP_SERVER")
    email_username: Optional[str] = os.getenv("EMAIL_USERNAME")
    email_password: Optional[str] = os.getenv("EMAIL_PASSWORD")
    zetachain_testnet_rpc: str = os.getenv("ZETACHAIN_TESTNET_RPC", "https://zetachain-testnet.example.com")
    zetachain_private_key: Optional[str] = os.getenv("ZETACHAIN_PRIVATE_KEY")

settings = Settings()