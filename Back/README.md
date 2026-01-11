<<<<<<< HEAD
# Frontend - Angular 19

## Configuración del Backend

La aplicación está configurada para conectarse a un backend local en:
```
http://localhost:3000/api
```

### Cambiar la URL del Backend

Edita el archivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api' // Cambia aquí tu URL
};
```

Para producción, edita `src/environments/environment.prod.ts`.

### Endpoints Esperados

El backend debe exponer los siguientes endpoints:

#### Productos
- `GET /productos?page=1&limit=10&search=` - Listar productos
- `GET /productos/:id` - Obtener un producto
- `POST /productos` - Crear producto
- `PUT /productos/:id` - Actualizar producto
- `DELETE /productos/:id` - Eliminar producto

#### Autenticación (Mock)
Actualmente la autenticación es simulada en el frontend. Para integrar autenticación real:
1. Actualiza `src/app/core/services/auth.service.ts`
2. Implementa endpoints de login/logout en tu backend
3. Maneja tokens JWT si es necesario

## Desarrollo

```bash
npm install
npm start
```

La aplicación se ejecutará en `http://localhost:4200`

## Estructura del Proyecto

```
src/app/
├── core/              # Servicios, modelos, guards
│   ├── guards/
│   ├── models/
│   └── services/
├── features/          # Módulos de funcionalidad
│   ├── auth/
│   └── products/
├── layout/            # Componentes de layout
└── shared/            # Componentes compartidos
```

## Docker

```bash
docker build -t frontend-app .
docker run -p 80:80 frontend-app
=======
# Backend - API Gestión de Productos

Esta es una API REST simple para la gestión de productos, construida con Node.js, Express, Sequelize y MySQL.

## Requisitos

- Node.js (v18+)
- MySQL
- Docker (Opcional)

## Configuración

1. Clonar el repositorio.
2. Copiar `.env` y ajustar las variables de entorno si es necesario.
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=product_db
   DB_DIALECT=mysql
   ```
3. Instalar dependencias:
   ```bash
   npm install
   ```

## Ejecución

### Modo Desarrollo
```bash
npm run dev
```
(Asegúrate de tener MySQL corriendo y la base de datos `product_db` creada, o que el usuario tenga permisos para crearla).

### Con Docker
```bash
docker-compose up --build
```

## Validar Funcionalidad

La API tiene los siguientes endpoints:

- `GET /api/productos`: Listar productos (params: `page`, `limit`, `nombre`, `categoria`).
- `GET /api/productos/:id`: Obtener un producto.
- `POST /api/productos`: Crear un producto (body: `nombre`, `precio`, `categoria`).
- `PUT /api/productos/:id`: Actualizar un producto.
- `DELETE /api/productos/:id`: Eliminar un producto (soft delete).

Puedes usar Postman o cURL para probar.

Ejemplo cURL crear:
```bash
curl -X POST http://localhost:3000/api/productos -H "Content-Type: application/json" -d '{"nombre": "Laptop", "precio": 1500, "categoria": "Electronica"}'
>>>>>>> ffd5fbf (Initial commit: Backend con Arquitectura Limpia, JWT Auth y Categorías)
```
