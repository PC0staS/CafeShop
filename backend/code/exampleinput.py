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

# 3. Añadir 10 productos de ejemplo con datos reales y variados
import random
descriptions = [
    "Café de especialidad con notas a chocolate y frutos secos. Cultivado en las montañas de Colombia a más de 1800 metros de altitud. Proceso lavado, cuerpo medio y acidez brillante. Ideal para espresso y métodos filtrados.",
    "Granos seleccionados de Etiopía, región Yirgacheffe. Aroma floral intenso, sabor a cítricos y miel. Tueste medio claro para resaltar la complejidad de la taza. Perfecto para Chemex y V60.",
    "Blend exclusivo de Brasil y Guatemala, con perfil dulce y baja acidez. Notas a nuez, caramelo y cacao. Recomendado para cafeteras automáticas y moka.",
    "Café orgánico de Perú, cultivado por cooperativas locales. Sabor suave, con matices a frutas rojas y vainilla. Proceso natural, tueste medio oscuro.",
    "Microlote de Costa Rica, variedad Geisha. Sabor exótico, cuerpo sedoso y acidez delicada. Notas a jazmín y bergamota. Edición limitada.",
    "Café robusta de Vietnam, ideal para preparar café fuerte y con mucha crema. Sabor intenso y amargo, perfecto para mezclas y espresso italiano.",
    "Granos de Honduras, tueste medio, perfil balanceado. Aroma a almendra y chocolate con leche. Proceso honey, recomendado para cold brew.",
    "Café de Kenia AA, tueste claro, acidez viva y cuerpo jugoso. Sabor a grosella negra y cítricos. Ideal para métodos manuales.",
    "Café de Sumatra, Indonesia. Proceso semi-lavado, sabor terroso y especiado, cuerpo alto. Perfecto para quienes buscan intensidad.",
    "Café de México, región Chiapas. Orgánico, tueste medio, sabor suave y dulce, notas a panela y canela."
]
image_urls = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
    "https://images.unsplash.com/photo-1511920170033-f8396924c348",
    "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a",
    "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    "https://images.unsplash.com/photo-1469530464725-6085c2b7c1e6",
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
    "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac",
    "https://images.unsplash.com/photo-1519864600265-abb23847ef2c"
]
brands = ["Café del Valle", "Yirga Beans", "Brasil Blend", "Perú Orgánico", "Geisha CR", "Vietnam Strong", "Honduras Honey", "Kenia AA", "Sumatra Spice", "Chiapas Sweet"]
origins = ["Colombia", "Etiopía", "Brasil", "Perú", "Costa Rica", "Vietnam", "Honduras", "Kenia", "Indonesia", "México"]
roast_levels = ["Medium", "Light", "Medium-Dark", "Dark", "Medium-Light", "Dark", "Medium", "Light", "Medium-Dark", "Medium"]
currencies = ["EUR", "USD", "EUR", "USD", "EUR", "USD", "EUR", "USD", "EUR", "USD"]

for i in range(40):
    idx = i % 10
    product = {
        "name": brands[idx] + f" {i+1}",
        "description": descriptions[idx] + f" Lote especial #{i+1} con calidad garantizada y perfil único.",
        "price_per_kg": round(random.uniform(8, 40), 2),
        "currency": currencies[idx],
        "brand": brands[idx],
        "origin": origins[idx],
        "roast_level": roast_levels[idx],
    }
    image_payloads = [
        {"image_url": image_urls[idx], "alt_text": f"Foto principal de {brands[idx]} {i+1}", "is_main": True},
        {"image_url": image_urls[(idx+1)%10], "alt_text": f"Otra foto de {brands[idx]} {i+1}", "is_main": False},
    ]
    resp = requests.post(
        f"{API_URL}/admin/products/full",
        json={"product": product, "images": image_payloads},
        headers=headers,
    )
    print_json_or_text(f"Producto {i+1} creado:", resp)

# 4. Crear uno más con datos reales y dos imágenes
extra_product = {
    "name": "Guatemala Antigua Reserve",
    "description": "Café premium de la región Antigua, Guatemala. Sabor complejo con notas a cacao, frutas maduras y especias. Proceso lavado, tueste medio, cuerpo sedoso y acidez equilibrada. Ideal para espresso y métodos filtrados.",
    "price_per_kg": 27.5,
    "currency": "USD",
    "brand": "Antigua Reserve",
    "origin": "Guatemala",
    "roast_level": "Medium",
}
extra_images = [
    {"image_url": "https://images.unsplash.com/photo-1504674900247-0877df9cc836", "alt_text": "Foto principal Guatemala Antigua Reserve", "is_main": True},
    {"image_url": "https://images.unsplash.com/photo-1519125323398-675f0ddb6308", "alt_text": "Otra foto Guatemala Antigua Reserve", "is_main": False},
]
resp = requests.post(
    f"{API_URL}/admin/products/full",
    json={"product": extra_product, "images": extra_images},
    headers=headers,
)
try:
    extra_product_resp = resp.json()
except Exception:
    print("Error creando producto extra:", f"status={resp.status_code}", "text=", resp.text)
    raise SystemExit(1)

print("Producto extra creado:", extra_product_resp)
extra_id = extra_product_resp.get("id")
if not extra_id:
    print("No se obtuvo id del producto extra. Deteniendo.")
    raise SystemExit(1)

# 5. Editar el producto extra con datos reales
update = {
    "name": "Guatemala Antigua Edición Especial",
    "description": "Edición especial con tueste personalizado. Sabor aún más intenso, notas a chocolate negro y frutos rojos. Proceso lavado, cuerpo alto y acidez vibrante.",
    "price_per_kg": 32.0,
    "currency": "USD",
    "brand": "Antigua Especial",
    "origin": "Guatemala",
    "roast_level": "Medium-Dark",
}
resp = requests.put(f"{API_URL}/admin/products/{extra_id}", json=update, headers=headers)
print_json_or_text("Producto extra editado:", resp)

# 6. Borrar el producto extra
resp = requests.delete(f"{API_URL}/admin/products/{extra_id}", headers=headers)
print_json_or_text("Producto extra borrado:", resp)
