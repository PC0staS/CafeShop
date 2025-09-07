# ☕ CafeShop - Sistema de Gestión de Café

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Python](https://img.shields.io/badge/Python-3.13+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.116+-teal.svg)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://docker.com)

Un sistema completo de gestión de productos de café desarrollado con tecnologías modernas de desarrollo web. Este proyecto incluye una API REST robusta, una interfaz de administración intuitiva y un frontend responsive para la presentación de productos.

## 🎥 Demo y Capturas

### 🔧 Funcionalidades Principales
- **💾 Gestión CRUD completa** - Crear, leer, actualizar y eliminar productos
- **🖼️ Sistema de imágenes** - Subida y gestión de múltiples imágenes por producto
- **👨‍💼 Panel de administración** - Dashboard moderno con autenticación JWT
- **🔒 Seguridad robusta** - Autenticación, autorización y validación de datos
- **📱 Diseño responsive** - Optimizado para dispositivos móviles y desktop
- **🚀 Deploy con Docker** - Configuración completa con docker-compose

### ☕ Características Específicas del Negocio
- **🌱 Niveles de tueste** - Light, Medium-Light, Medium, Medium-Dark, Dark
- **🌍 Origen geográfico** - Trazabilidad del país de origen
- **💰 Sistema de precios** - Gestión flexible de precios por kilogramo
- **🏷️ Organización por marcas** - Clasificación de productos por marca
- **✅ Control de estado** - Activación/desactivación de productos

## 🛠️ Stack Tecnológico

### Backend
- **FastAPI** - Framework web moderno y rápido para Python
- **SQLAlchemy** - ORM para manejo de base de datos
- **PostgreSQL** - Base de datos relacional robusta
- **JWT (PyJWT)** - Autenticación y autorización
- **Pydantic** - Validación de datos y schemas
- **Docker** - Contenerización para fácil despliegue

### Frontend
- **Next.js 15** - Framework de React con SSR
- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework de CSS utilitario
- **View Transitions** - Transiciones suaves entre páginas

### Base de Datos
- **PostgreSQL 16** - Base de datos principal
- **Esquemas relacionales** - Productos, imágenes y administradores

## ⚡ Inicio Rápido

```bash
# 1. Clonar el repositorio
git clone https://github.com/PC0staS/CafeShop.git
cd CafeShop

# 2. Verificar prerrequisitos
./setup-check.sh

# 3. Configurar backend
cd backend/code
cp .env.example .env
# Editar .env con tus configuraciones

# 4. Levantar servicios con Docker
docker-compose up --build

# 5. En otra terminal, configurar frontend
cd ../../frontend
npm install --legacy-peer-deps
npm run dev
```

🎉 **¡Listo!** Visita http://localhost:3000 para ver la aplicación.

## 📁 Estructura del Proyecto

```
CafeShop/
├── backend/
│   └── code/
│       ├── main.py              # Aplicación principal FastAPI
│       ├── models.py            # Modelos de SQLAlchemy
│       ├── schemas.py           # Schemas de Pydantic
│       ├── crud.py              # Operaciones CRUD
│       ├── auth.py              # Sistema de autenticación
│       ├── database.py          # Configuración de base de datos
│       ├── requirements.txt     # Dependencias de Python
│       ├── dockerfile           # Imagen Docker del backend
│       ├── docker-compose.yml   # Orquestación de servicios
│       └── wait-for-it.sh       # Script de espera para DB
├── frontend/
│   ├── app/
│   │   ├── admin/              # Panel de administración
│   │   ├── api/                # API routes de Next.js
│   │   ├── componentes/        # Componentes React
│   │   ├── lib/                # Utilidades y tipos
│   │   ├── products/           # Páginas de productos
│   │   ├── layout.tsx          # Layout principal
│   │   └── page.tsx            # Página de inicio
│   ├── package.json            # Dependencias de Node.js
│   ├── tsconfig.json           # Configuración TypeScript
│   └── next.config.ts          # Configuración Next.js
└── README.md                   # Este archivo
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Docker y Docker Compose
- Node.js 18+ (para desarrollo local del frontend)
- Python 3.13+ (para desarrollo local del backend)

> **Nota**: El frontend utiliza React 19 con Next.js 15, lo que puede requerir `--legacy-peer-deps` para la instalación de dependencias.

### Verificación Rápida
Puedes ejecutar el script de verificación para comprobar tu entorno:
```bash
./setup-check.sh
```

### 🐳 Opción 1: Instalación con Docker (Recomendada)

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/PC0staS/CafeShop.git
   cd CafeShop
   ```

2. **Configurar variables de entorno**
   ```bash
   cd backend/code
   cp .env.example .env  # Crear y configurar el archivo .env
   ```

   Configurar las siguientes variables en `.env`:
   ```env
   DB_URL=postgresql://root:tu_password@db:5432/cafeshop_db
   POSTGRES_PASSWORD=tu_password_segura
   ADMIN_CREATION_SECRET=tu_secreto_para_crear_admins
   JWT_SECRET=tu_jwt_secreto
   ```

3. **Levantar los servicios**
   ```bash
   docker-compose up --build
   ```

4. **Configurar el frontend**
   ```bash
   cd ../../frontend
   npm install --legacy-peer-deps
   npm run dev
   ```

### 💻 Opción 2: Instalación Local

#### Backend
1. **Configurar el entorno Python**
   ```bash
   cd backend/code
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Configurar PostgreSQL local**
   - Instalar PostgreSQL
   - Crear base de datos: `cafeshop_db`
   - Configurar variables de entorno

3. **Ejecutar el backend**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

#### Frontend
1. **Instalar dependencias**
   ```bash
   cd frontend
   npm install --legacy-peer-deps
   ```

2. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

## 🌐 Acceso a la Aplicación

- **Frontend Principal**: http://localhost:3000
- **Panel de Administración**: http://localhost:3000/admin
- **API Backend**: http://localhost:8000
- **Documentación API**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 📚 Documentación de la API

### Endpoints Principales

#### Productos Públicos
- `GET /products` - Listar productos (con paginación)
- `GET /products/{id}` - Obtener producto específico
- `GET /products/{id}/images` - Obtener imágenes de producto

#### Administración (Requiere autenticación)
- `POST /admin/auth/register` - Registrar administrador
- `POST /admin/auth/login` - Iniciar sesión
- `POST /admin/auth/refresh` - Renovar token

#### Gestión de Productos (Admin)
- `POST /admin/products` - Crear producto
- `PUT /admin/products/{id}` - Actualizar producto
- `DELETE /admin/products/{id}` - Eliminar producto
- `POST /admin/products/full` - Crear producto con imágenes

### Schemas de Datos

#### Producto
```json
{
  "id": 1,
  "name": "Café Colombiano Premium",
  "description": "Café de origen colombiano con notas frutales",
  "price_per_kg": 2500,
  "currency": "EUR",
  "brand": "Coffee Masters",
  "origin": "Colombia",
  "roast_level": "Medium",
  "is_active": true,
  "images": [...]
}
```

## 🔧 Desarrollo

### Comandos Útiles

#### Backend
```bash
# Ejecutar con recarga automática
uvicorn main:app --reload

# Ejecutar tests (si están configurados)
pytest

# Verificar tipos con mypy
mypy .
```

#### Frontend
```bash
# Desarrollo con Turbopack
npm run dev

# Build de producción
npm run build

# Linting
npm run lint

# Iniciar servidor de producción
npm start
```

#### Docker
```bash
# Construir y levantar servicios
docker-compose up --build

# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down

# Limpiar volúmenes
docker-compose down -v
```

## 🔧 Solución de Problemas

### Problemas Comunes

#### Error en npm install
```bash
# Si tienes problemas con dependencias de React 19
npm install --legacy-peer-deps --force
```

#### Error de conexión a base de datos
```bash
# Verificar que PostgreSQL esté ejecutándose
docker-compose ps

# Revisar logs de la base de datos
docker-compose logs db
```

#### Puerto ya en uso
```bash
# Para encontrar y terminar procesos en puertos específicos
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:8000 | xargs kill -9  # Backend
```

#### Problemas de permisos Docker
```bash
# En Linux, agregar usuario al grupo docker
sudo usermod -aG docker $USER
# Luego reiniciar sesión
```

## 📱 Características de la Interfaz

### Panel de Administración
- **Dashboard intuitivo** con vista de cards de productos
- **Modales de edición** para actualización rápida
- **Gestión de imágenes** con preview
- **Autenticación segura** con JWT
- **Logout automático** por seguridad

### Frontend Público
- **Landing page atractiva** con información del negocio
- **Catálogo de productos** con filtros y búsqueda
- **Diseño responsive** para móviles y desktop
- **Transiciones suaves** entre páginas
- **Optimización de imágenes** con Next.js

## 🔒 Seguridad

- **Autenticación JWT** con tokens de acceso y refresh
- **Validación de datos** con Pydantic schemas
- **Sanitización de inputs** en frontend y backend
- **CORS configurado** para producción
- **Variables de entorno** para datos sensibles
- **Hashing de contraseñas** con bcrypt

## 🚀 Despliegue en Producción

### Variables de Entorno Requeridas
```env
DB_URL=postgresql://usuario:password@host:puerto/database
POSTGRES_PASSWORD=password_segura
ADMIN_CREATION_SECRET=secreto_muy_seguro
JWT_SECRET=jwt_secreto_muy_largo
ALLOWED_ORIGINS=https://tu-dominio.com
```

### Consideraciones de Producción
- Usar PostgreSQL administrado (AWS RDS, Google Cloud SQL, etc.)
- Configurar HTTPS con certificados SSL
- Implementar rate limiting en la API
- Configurar logs centralizados
- Implementar monitoreo de aplicación
- Usar CDN para assets estáticos

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Pablo Costas**
- GitHub: [@PC0staS](https://github.com/PC0staS)
- Email: pablocostasnieto@gmail.com

## 🔄 Estado del Proyecto

Este proyecto está en desarrollo activo. Consulta el archivo `frontend/todo.md` para ver las características planificadas.

### Próximas Características
- Sistema de carrito de compras
- Integración de pagos
- Sistema de usuarios finales
- Notificaciones en tiempo real
- Análisis y reportes de ventas

---

⭐ Si te gusta este proyecto, ¡no olvides darle una estrella en GitHub!