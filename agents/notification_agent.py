import requests
from ..config import settings

def send_slack_notification(incident_id):
    if settings.slack_webhook_url:
        message = {"text": f"New incident detected: {incident_id}"}
        requests.post(settings.slack_webhook_url, json=message)

def send_telegram_notification(incident_id):
    if settings.telegram_bot_token:
        # Placeholder
        pass

def send_email_notification(incident_id):
    # Placeholder
    pass

def run_notification_agent(incident_id, channels):
    for channel in channels:
        if channel == "slack":
            send_slack_notification(incident_id)
        elif channel == "telegram":
            send_telegram_notification(incident_id)
        elif channel == "email":
            send_email_notification(incident_id)
    return {"status": "notifications sent"}