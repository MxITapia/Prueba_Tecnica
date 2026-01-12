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
```
