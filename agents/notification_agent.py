import requests
import smtplib
from email.mime.text import MIMEText
from ..config import settings

def send_slack_notification(incident_id):
    if settings.slack_webhook_url:
        message = {"text": f"New deforestation incident detected: {incident_id}. View at http://localhost:3000/incident/{incident_id}"}
        requests.post(settings.slack_webhook_url, json=message)

def send_telegram_notification(incident_id):
    if settings.telegram_bot_token:
        # Telegram API call
        url = f"https://api.telegram.org/bot{settings.telegram_bot_token}/sendMessage"
        data = {"chat_id": "@your_channel", "text": f"New incident: {incident_id}"}
        requests.post(url, data=data)

def send_email_notification(incident_id):
    if settings.email_smtp_server:
        msg = MIMEText(f"New incident report: {incident_id}")
        msg['Subject'] = "ForestGuard Incident Alert"
        msg['From'] = settings.email_username
        msg['To'] = "admin@forestguard.com"

        server = smtplib.SMTP(settings.email_smtp_server)
        server.login(settings.email_username, settings.email_password)
        server.sendmail(settings.email_username, "admin@forestguard.com", msg.as_string())
        server.quit()

def run_notification_agent(incident_id, channels):
    for channel in channels:
        if channel == "slack":
            send_slack_notification(incident_id)
        elif channel == "telegram":
            send_telegram_notification(incident_id)
        elif channel == "email":
            send_email_notification(incident_id)
    return {"status": "notifications sent"}