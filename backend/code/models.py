import datetime
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy import Enum as SqlEnum
from enum import Enum

from database import Base

class RoastLevel(str, Enum):
    LIGHT = "Light"
    MEDIUM_LIGHT = "Medium-Light"
    MEDIUM = "Medium"
    MEDIUM_DARK = "Medium-Dark"
    DARK = "Dark"

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    description = Column(String(255))
    price_per_kg = Column(Integer)
    is_active = Column(Boolean, default=True)
    currency = Column(String(3), default="EUR")
    brand = Column(String(100), default="Unknown")
    origin = Column(String(100))  # País, ej: "Etiopía"
    roast_level = Column(SqlEnum(RoastLevel), default=RoastLevel.MEDIUM)
    created_at = Column(DateTime, default=datetime.datetime.now)
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")

class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String(255), nullable=False)
    alt_text = Column(String(100), nullable=True)
    is_main = Column(Boolean, default=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    product = relationship("Product", back_populates="images")

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(100), nullable=False)