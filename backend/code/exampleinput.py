import requests

API_URL = "http://localhost:8000"
ADMIN_SECRET = "TU_CLAVE_SECRETA"  # Cambia esto por la clave real
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "adminpass"

# 1. Crear admin
resp = requests.post(f"{API_URL}/admin/auth/register", json={
    "email": ADMIN_EMAIL,
    "password": ADMIN_PASSWORD,
    "admin_secret": ADMIN_SECRET
})
print("Admin creado:", resp.json())

# 2. Autenticarse
resp = requests.post(f"{API_URL}/admin/auth/login", json={
    "email": ADMIN_EMAIL,
    "password": ADMIN_PASSWORD
})
tokens = resp.json()
print("Tokens:", tokens)
access_token = tokens.get("access_token")

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
        "roast_level": "MEDIUM"
    }
    resp = requests.post(f"{API_URL}/admin/products/full", json={
        "product": product,
        "image_urls": [image_url]
    }, headers=headers)
    print(f"Producto {i+1} creado:", resp.json())

# 4. Crear uno más
product = {
    "name": "Cafe Extra",
    "description": "Producto extra para pruebas",
    "price_per_kg": 99,
    "currency": "EUR",
    "brand": "MarcaExtra",
    "origin": "Brasil",
    "roast_level": "DARK"
}
resp = requests.post(f"{API_URL}/admin/products/full", json={
    "product": product,
    "image_urls": [image_url]
}, headers=headers)
extra_product = resp.json()
print("Producto extra creado:", extra_product)
extra_id = extra_product.get("id")

# 5. Editar el producto extra
update = {
    "name": "Cafe Extra Editado",
    "description": "Descripción editada",
    "price_per_kg": 88,
    "currency": "USD",
    "brand": "MarcaEditada",
    "origin": "Perú",
    "roast_level": "LIGHT"
}
resp = requests.put(f"{API_URL}/admin/products/{extra_id}", json=update, headers=headers)
print("Producto extra editado:", resp.json())

# 6. Borrar el producto extra
resp = requests.delete(f"{API_URL}/admin/products/{extra_id}", headers=headers)
print("Producto extra borrado:", resp.json())
