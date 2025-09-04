from fastapi import FastAPI, Body, Request, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
import models,schemas,crud,auth
from database import engine, SessionLocal
from typing import Optional
import os
import dotenv

dotenv.load_dotenv()
ADMIN_CREATION_SECRET = os.getenv("ADMIN_CREATION_SECRET")

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

@app.get("/health", tags=["Health Check"])
def health_check():
    return {"status": "healthy"}


# Admin Auth Routes
@app.post("/admin/auth/register", tags=["Admin Auth"], response_model=schemas.Admin)
async def register_admin(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    email = data.get("email")
    password = data.get("password")
    admin_secret = data.get("admin_secret")
    if not email or not password:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Email y password son requeridos")
    if admin_secret != ADMIN_CREATION_SECRET:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No autorizado")
    # evitar duplicados
    if auth.get_admin_by_email(db, email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email ya registrado")
    admin = schemas.AdminCreate(email=email, password=password)
    return auth.create_admin(db, admin)

@app.post("/admin/auth/login", tags=["Admin Auth"])
def admin_login (credentials: schemas.AdminLogin, db: Session = Depends(get_db)):
    return auth.auth_admin(credentials, db)

@app.post("/admin/auth/refresh", tags=["Admin Auth"])
def admin_refresh(refresh_token: str, db: Session = Depends(get_db)):
    return auth.refresh_access_token(refresh_token)

@app.post("/admin/products", tags=["Admin Products"], response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db, product)

@app.put("/admin/products/{product_id}", tags=["Admin Products"], response_model=schemas.Product)
def update_product(product_id: int, product: schemas.ProductUpdate, db: Session = Depends(get_db)):
    return crud.update_product(db, product_id, product)

@app.post("/admin/products/{product_id}/images", tags=["Admin Products"], response_model=schemas.ProductImage)
def create_product_image(product_id: int, image: schemas.ProductImageCreate, db: Session = Depends(get_db)):
    return crud.create_product_image(db, image, product_id)


@app.post("/admin/products/full", tags=["Admin Products"], response_model=schemas.Product)
def create_product_with_images(
    product: schemas.ProductCreate = Body(...),
    image_urls: list[str] = Body(default_factory=list),
    db: Session = Depends(get_db)
    ):
    # 1. Crea el producto
    new_product = crud.create_product(db, product)
    # 2. Asocia las imágenes
    for url in image_urls:
        crud.create_product_image(db, schemas.ProductImageCreate(image_url=url, alt_text=None), new_product.id) # type: ignore
    return new_product

@app.delete("/admin/products/{product_id}", tags=["Admin Products"], status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    crud.delete_product(db, product_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# Product Routes
@app.get("/products", tags=["Products"], response_model=list[schemas.Product])
def get_products(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_products(db, skip=skip, limit=limit)

@app.get("/products/{product_id}", tags=["Products"], response_model=Optional[schemas.Product])
def get_product(product_id: int, db: Session = Depends(get_db)):
    return crud.get_product(db, product_id)

@app.get("/products/{product_id}/images", tags=["Products"], response_model=list[schemas.ProductImage])
def get_product_images(product_id: int, db: Session = Depends(get_db)):
    return crud.get_product_images(db, product_id)

# ProductImg Routes