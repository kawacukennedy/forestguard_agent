import cv2
import torch
from torchvision import transforms
from .model import load_model

model = load_model()

def preprocess_image(image_path):
    image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    transform = transforms.Compose([
        transforms.ToPILImage(),
        transforms.Resize((256, 256)),
        transforms.ToTensor()
    ])
    return transform(image).unsqueeze(0)

def detect_deforestation(image_path):
    input_tensor = preprocess_image(image_path)
    with torch.no_grad():
        output = model(input_tensor)
    # Post-process to get polygons (simplified)
    mask = (output > 0.5).float()
    # Extract polygons (placeholder)
    polygons = [{"coordinates": [[0,0], [100,0], [100,100], [0,100]]}]  # Dummy
    confidence = 0.85
    return polygons, confidence, "Deforestation detected"