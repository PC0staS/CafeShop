import os
import requests
import dotenv

dotenv.load_dotenv()

API_URL = os.getenv("API_URL", "http://localhost:8000")
ADMIN_SECRET = os.getenv("ADMIN_CREATION_SECRET", "")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@example.com")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "adminpass")

def print_json_or_text(prefix: str, resp: requests.Response):
    try:
        print(prefix, resp.json())
    except Exception:
        print(prefix, f"status={resp.status_code}", "text=", resp.text)

# 1. Crear admin
register_payload = {
    "email": ADMIN_EMAIL,
    "password": ADMIN_PASSWORD,
    "admin_secret": ADMIN_SECRET,
}
resp = requests.post(f"{API_URL}/admin/auth/register", json=register_payload)
print_json_or_text("Admin creado:", resp)

# Si no hay secret configurado o es incorrecto, continuamos con login por si ya existe el admin

# 2. Autenticarse
resp = requests.post(
    f"{API_URL}/admin/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
)
try:
    tokens = resp.json()
except Exception:
    print("Login fallido:", f"status={resp.status_code}", "text=", resp.text)
    raise SystemExit(1)

print("Tokens:", tokens)
access_token = tokens.get("access_token")
if not access_token:
    print("No se obtuvo access_token. Deteniendo.")
    raise SystemExit(1)

headers = {"Authorization": f"Bearer {access_token}"}

# 3. Añadir 30 productos de ejemplo
image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/1200px-A_small_cup_of_coffee.JPG"
for i in range(30):
    product = {
        "name": f"Cafe Ejemplo {i+1}",
        "description": f"Descripción del producto {i+1}",
        "price_per_kg": 10 + i,
        "currency": "EUR",
        "brand": "MarcaEjemplo",
        "origin": "Colombia",
        # Debe coincidir con los valores del Enum en models: "Light", "Medium-Light", "Medium", "Medium-Dark", "Dark"
        "roast_level": "Medium",
    }
    resp = requests.post(
        f"{API_URL}/admin/products/full",
        json={"product": product, "image_urls": [image_url]},
        headers=headers,
    )
    print_json_or_text(f"Producto {i+1} creado:", resp)

# 4. Crear uno más
product = {
    "name": "Cafe Extra",
    "description": "Producto extra para pruebas",
    "price_per_kg": 99,
    "currency": "EUR",
    "brand": "MarcaExtra",
    "origin": "Brasil",
    "roast_level": "Dark",
}
resp = requests.post(
    f"{API_URL}/admin/products/full",
    json={"product": product, "image_urls": [image_url]},
    headers=headers,
)
try:
    extra_product = resp.json()
except Exception:
    print("Error creando producto extra:", f"status={resp.status_code}", "text=", resp.text)
    raise SystemExit(1)

print("Producto extra creado:", extra_product)
extra_id = extra_product.get("id")
if not extra_id:
    print("No se obtuvo id del producto extra. Deteniendo.")
    raise SystemExit(1)

# 5. Editar el producto extra
update = {
    "name": "Cafe Extra Editado",
    "description": "Descripción editada",
    "price_per_kg": 88,
    "currency": "USD",
    "brand": "MarcaEditada",
    "origin": "Perú",
    "roast_level": "Light",
}
resp = requests.put(f"{API_URL}/admin/products/{extra_id}", json=update, headers=headers)
print_json_or_text("Producto extra editado:", resp)

# 6. Borrar el producto extra
resp = requests.delete(f"{API_URL}/admin/products/{extra_id}", headers=headers)
print_json_or_text("Producto extra borrado:", resp)
