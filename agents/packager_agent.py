from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

def run_packager_agent(incident_data, agent_transcripts):
    filename = f"incident_{incident_data['id']}.pdf"
    c = canvas.Canvas(filename, pagesize=letter)
    c.drawString(100, 750, f"Incident Report: {incident_data['id']}")
    c.drawString(100, 730, f"Carbon Estimate: {incident_data['carbon_estimate']}")
    # Add more content
    c.save()
    return filename