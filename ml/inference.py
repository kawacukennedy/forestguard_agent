import cv2
import torch
import numpy as np
from torchvision import transforms
from .model import load_model
from shapely.geometry import Polygon

model = load_model()

def preprocess_image(image_path):
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Image not found")
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    transform = transforms.Compose([
        transforms.ToPILImage(),
        transforms.Resize((256, 256)),
        transforms.ToTensor()
    ])
    return transform(image).unsqueeze(0), image.shape[:2]  # Return original size

def detect_deforestation(image_path):
    input_tensor, orig_size = preprocess_image(image_path)
    with torch.no_grad():
        output = model(input_tensor)
    # Post-process
    mask = (output > 0.5).float().squeeze().numpy()
    mask = cv2.resize(mask, (orig_size[1], orig_size[0]), interpolation=cv2.INTER_NEAREST)
    mask = (mask * 255).astype(np.uint8)

    # Find contours
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    polygons = []
    for cnt in contours:
        if cv2.contourArea(cnt) > 100:  # Filter small areas
            poly = cnt.reshape(-1, 2).tolist()
            polygons.append({"coordinates": poly})

    confidence = 0.85 if polygons else 0.0
    rationale = f"Detected {len(polygons)} deforestation areas"
    return polygons, confidence, rationale