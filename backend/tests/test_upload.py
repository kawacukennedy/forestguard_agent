import pytest
from fastapi.testclient import TestClient
from ..main import app
from ..database import SessionLocal, engine
from ..models import Base

client = TestClient(app)

@pytest.fixture(scope="module")
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_upload_endpoint(setup_database):
    files = [("files", ("test.jpg", b"fake image data", "image/jpeg"))]
    response = client.post("/api/upload", files=files, data={"location": "Test Location", "description": "Test"})
    assert response.status_code == 200
    assert "incident_id" in response.json()