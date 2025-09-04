import datetime
import os
from typing import Optional, Dict
import bcrypt
import jwt
import dotenv
import schemas,models
from sqlalchemy.orm import Session
 # Make sure to import your Admin model from the correct module

dotenv.load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "")
REFRESH_SECRET = os.getenv("REFRESH_SECRET", "")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))

def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.datetime.now() + (expires_delta or datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict, expires_delta: Optional[datetime.timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.datetime.now() + (expires_delta or datetime.timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, REFRESH_SECRET, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[Dict]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def decode_refresh_token(token: str) -> Optional[Dict]:
    try:
        payload = jwt.decode(token, REFRESH_SECRET, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def refresh_access_token(refresh_token: str) -> Optional[str]:
    payload = decode_refresh_token(refresh_token)
    if payload:
        user_id = payload.get("sub")
        if user_id:
            new_access_token = create_access_token({"sub": user_id})
            return new_access_token
    return None

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if isinstance(hashed_password, str):
        hashed_password_bytes = hashed_password.encode('utf-8')
    else:
        hashed_password_bytes = hashed_password
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password_bytes)

def hash_password(plain_password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(plain_password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def create_admin(db: Session, admin: schemas.AdminCreate):
    hashed_password = hash_password(admin.password)
    db_admin = models.Admin(email=admin.email, hashed_password=hashed_password)
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin

def get_admin(db: Session, admin_id: int):
    return db.query(models.Admin).filter(models.Admin.id == admin_id).first()

def get_admin_by_email(db: Session, email: str):
    return db.query(models.Admin).filter(models.Admin.email == email).first()

def auth_admin(credentials: schemas.AdminLogin, db: Session):
    admin = get_admin_by_email(db, credentials.email)
    if not admin:
        return {"error": "Invalid credentials"}

    adminpass = getattr(admin, "hashed_password", None)
    if not adminpass:
        return {"error": "Invalid credentials"}
    
    verified_password = verify_password(credentials.password, adminpass)

    if not verified_password:
        return {"error": "Invalid credentials"}
    
    access_token = create_access_token({"sub": str(admin.id)})
    refresh_token = create_refresh_token({"sub": str(admin.id)})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }
