from pydantic import BaseModel

class ProductBase(BaseModel):
    name: str
    description: str
    price_per_kg: float
    currency: str
    brand: str
    origin: str
    roast_level: str

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        orm_mode = True

class ProductImageBase(BaseModel):
    image_url: str
    alt_text: str | None
    is_main: bool | None

class ProductImageCreate(ProductImageBase):
    pass

class ProductImageUpdate(ProductImageBase):
    pass

class ProductImage(ProductImageBase):
    id: int

    class Config:
        orm_mode = True


# Base para modelos de Admin en la base de datos
class AdminBase(BaseModel):
    email: str
    hashed_password: str

# Para login: solo email y password en texto plano
class AdminLogin(BaseModel):
    email: str
    password: str


# Para crear un admin: solo email y password
class AdminCreate(BaseModel):
    email: str
    password: str

class AdminUpdate(AdminBase):
    pass

class Admin(AdminBase):
    id: int

    class Config:
        orm_mode = True

