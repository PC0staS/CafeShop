from fastapi import FastAPI

import models,schemas,crud,auth
from database import SessionLocal, engine



models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CafeShop API",
    description="API for the CafeShop application",
    version="1.0.0",
    contact={
        "name": "Pablo Costas",
        "email": "pablocostasnieto@gmail.com",
        "url": "https://github.com/PC0staS"
    }
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/health")
def health_check():
    return {"status": "healthy"}


# Admin Auth Routes

@app.post("/admin/auth/login")
def admin_login (credentials: schemas.AdminLogin, db=next(get_db())):
    return auth.auth_admin(credentials, db)

@app.post("/admin/auth/refresh")
def admin_refresh(refresh_token: str, db=next(get_db())):
    return auth.refresh_access_token(refresh_token)

# Product Routes





# ProductImg Routes