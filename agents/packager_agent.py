from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
import os

def run_packager_agent(incident_data, agent_transcripts, images=[]):
    os.makedirs("reports", exist_ok=True)
    filename = f"reports/incident_{incident_data['id']}.pdf"
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter

    c.drawString(100, height - 50, f"Incident Report: {incident_data['id']}")
    c.drawString(100, height - 70, f"Carbon Estimate: {incident_data['carbon_estimate']} kg CO2")
    c.drawString(100, height - 90, f"Status: {incident_data.get('status', 'processed')}")

    y = height - 120
    c.drawString(100, y, "Agent Transcripts:")
    y -= 20
    for transcript in agent_transcripts:
        c.drawString(120, y, f"{transcript['agent_name']}: {transcript['transcript_text'][:100]}...")
        y -= 20
        if y < 100:
            c.showPage()
            y = height - 50

    # Add images if available
    for img in images[:2]:  # Limit to 2 images
        img_path = img['url'] if img['url'].startswith('/') else f"uploads/{img['url']}"
        if os.path.exists(img_path):
            try:
                c.drawImage(ImageReader(img_path), 100, y - 200, width=200, height=150)
                y -= 220
            except:
                pass

    c.save()
    return filename