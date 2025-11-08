from ..ml.inference import detect_deforestation

def run_vision_agent(image_url):
    polygons, confidence, rationale = detect_deforestation(image_url)
    return {
        "polygons": polygons,
        "confidence_score": confidence,
        "rationale": rationale
    }