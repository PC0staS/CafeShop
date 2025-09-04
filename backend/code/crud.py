from sqlalchemy.orm import Session
import models, schemas

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_products(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Product).offset(skip).limit(limit).all()

def update_product(db: Session, product_id: int, product: schemas.ProductUpdate):
    db_product = get_product(db, product_id)
    if db_product:
        for key, value in product.model_dump().items():
            setattr(db_product, key, value)
        db.commit()
        db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = get_product(db, product_id)
    if db_product:
        db.delete(db_product)
        db.commit()
    return db_product

def get_product_images(db: Session, product_id: int):
    return db.query(models.ProductImage).filter(models.ProductImage.product_id == product_id).all()

def create_product_image(db: Session, image: schemas.ProductImageCreate, product_id: int):
    db_image = models.ProductImage(**image.model_dump(), product_id=product_id)
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

def update_product_image(db: Session, image_id: int, image: schemas.ProductImageUpdate):
    db_image = db.query(models.ProductImage).filter(models.ProductImage.id == image_id).first()
    if db_image:
        for key, value in image.model_dump().items():
            setattr(db_image, key, value)
        db.commit()
        db.refresh(db_image)
    return db_image

def delete_product_image(db: Session, image_id: int):
    db_image = db.query(models.ProductImage).filter(models.ProductImage.id == image_id).first()
    if db_image:
        db.delete(db_image)
        db.commit()
    return db_image



