from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..config import settings
import jwt
from datetime import datetime, timedelta

router = APIRouter()

SECRET_KEY = settings.secret_key
ALGORITHM = "HS256"

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/login")
async def login(email: str, password: str, db: Session = Depends(get_db)):
    # Placeholder: Check Builder ID
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register")
async def register(name: str, email: str, builder_id: str, db: Session = Depends(get_db)):
    user = User(name=name, email=email, builder_id=builder_id)
    db.add(user)
    db.commit()
    return {"message": "User registered"}