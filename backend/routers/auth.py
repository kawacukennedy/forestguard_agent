from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..config import settings
import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
import random
import string

router = APIRouter()

SECRET_KEY = settings.secret_key
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def generate_referral_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

@router.post("/login")
async def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register")
async def register(name: str, email: str, password: str, builder_id: str, somnia_wallet_address: str, db: Session = Depends(get_db)):
    hashed_password = get_password_hash(password)
    referral_code = generate_referral_code()
    user = User(name=name, email=email, hashed_password=hashed_password, builder_id=builder_id, somnia_wallet_address=somnia_wallet_address, referral_code=referral_code)
    db.add(user)
    db.commit()
    return {"message": "User registered", "referral_code": referral_code}

@router.get("/me")
async def get_current_user(db: Session = Depends(get_db), token: str = Depends(lambda: None)):  # Mock auth
    # In real, decode token
    user = db.query(User).first()  # Mock
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user.id, "name": user.name, "email": user.email, "referral_code": user.referral_code}