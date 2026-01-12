# Prueba Técnica – Fullstack (Angular + Node/Express + MySQL)

Repositorio con **2 directorios principales**:

- **`Front/`** → SPA en **Angular 19** (gestión de productos + filtros, login, UI).
- **`Back/`** → API REST en **Node.js + Express** + **MySQL** (CRUD productos, categorías, auth).

>  Incluye **Dockerfile** para Front y Back.  
>  Incluye **docker-compose** para levantar **Back + MySQL** y **seed automático** (usuario demo + categorías).

---

## Requisitos

- **Node.js** (recomendado LTS) + **npm**
- **Docker Desktop** (para correr con Docker)
- (Opcional) **Postman** para probar endpoints

---

# 1) Ejecución rápida (recomendada) con Docker (Back + MySQL + Seed)

### Levantar Backend + DB + Seed
Desde la raíz del repo:

```bash
cd Back
docker compose up --build
```

Esto levanta:

- API: `http://localhost:3000`
- MySQL (acceso desde tu PC): `localhost:3307` (internamente en Docker es `db:3306`)
- **Seed automático**: crea usuario + categorías (y opcionalmente productos si tu seed los agrega).

### Credenciales Seed (demo)
- **Usuario:** `admin@vector.cl`
- **Contraseña:** `Admin10.01`

### Categorías Seed
- `Deporte`
- `Electrodomesticos`
- `Aseo`

> Si vuelves a correr el seed y ya existen, idealmente debe ser **idempotente** (no romper).

### Reset completo (borrar BD)
Si quieres reiniciar desde cero (borra el volumen de MySQL):

```bash
docker compose down -v
docker compose up --build
```

### Re-ejecutar el seed sin bajar todo
```bash
docker compose run --rm seed
```

---

# 2) Ejecutar Frontend (Angular)

En otra terminal, desde la raíz del repo:

```bash
cd Front
npm install
npm start
```

Frontend queda en:
- `http://localhost:4200`

---

# 3) Configuración Front ↔ Back

El Front está configurado para apuntar al backend en:

```
http://localhost:3000/api
```

Si necesitas cambiarlo:

### `Front/src/environments/environment.ts`
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### `Front/src/environments/environment.prod.ts`
```ts
export const environment = {
  production: true,
  apiUrl: 'http://localhost:3000/api'
};
```

---

# 4) API – Endpoints principales

Base URL:
```
http://localhost:3000/api
```

## Auth
- `POST /auth/register` → registra usuario
- `POST /auth/login` → devuelve token JWT + user

## Categorías
- `GET /categorias` → lista categorías
- `POST /categorias` → crea categoría (según tu configuración puede requerir JWT)

## Productos
- `GET /productos?page=1&limit=10&search=&categoria=` → lista con paginación y filtros
- `GET /productos/:id` → detalle
- `POST /productos` → crear (valida payload)
- `PUT /productos/:id` → actualizar
- `DELETE /productos/:id` → eliminar (soft delete opcional)

---

# 5) Probar con cURL (crear usuario + categorías)

> Si tus rutas de categorías están protegidas, primero loguea y usa el token.

## 5.1 Crear usuario `admin@vector.cl`
```bash
curl -X POST http://localhost:3000/api/auth/register   -H "Content-Type: application/json"   -d "{\"username\":\"admin@vector.cl\",\"password\":\"Admin10.01\"}"
```

## 5.2 Login (obtener token)
```bash
curl -X POST http://localhost:3000/api/auth/login   -H "Content-Type: application/json"   -d "{\"username\":\"admin@vector.cl\",\"password\":\"Admin10.01\"}"
```

## 5.3 Crear categorías (con token)
Reemplaza `TOKEN_AQUI`:

```bash
curl -X POST http://localhost:3000/api/categorias   -H "Authorization: Bearer TOKEN_AQUI"   -H "Content-Type: application/json"   -d "{\"nombre\":\"Deporte\"}"

curl -X POST http://localhost:3000/api/categorias   -H "Authorization: Bearer TOKEN_AQUI"   -H "Content-Type: application/json"   -d "{\"nombre\":\"Electrodomesticos\"}"

curl -X POST http://localhost:3000/api/categorias   -H "Authorization: Bearer TOKEN_AQUI"   -H "Content-Type: application/json"   -d "{\"nombre\":\"Aseo\"}"
```

---

# 6) Ejecución “sin Docker” (modo local)

> Útil si NO quieres Docker. En este modo, debes tener MySQL instalado localmente o usar el puerto del contenedor.

## 6.1 Usando el MySQL del contenedor (recomendado)
1) Levanta solo la DB con docker compose:

```bash
cd Back
docker compose up db -d
```

2) Ajusta tu `.env` local del backend para apuntar al puerto del contenedor desde el host:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3307
DB_USER=root
DB_PASS=root
DB_NAME=product_db
DB_DIALECT=mysql
JWT_SECRET=supersecretkey_change_in_production
```

3) Instala dependencias y corre:

```bash
npm install
npm run start
```

---

# 7) Seed “pro” (recomendado)

## ¿Borro `seed.ps1` y dejo solo `seed.js`?
**Recomendación para entrega:**  
 Deja `seed.js` como el seed oficial (**cross-platform** y usable dentro de Docker).  
 `seed.ps1` puedes **mantenerlo como opcional** (solo Windows) **o borrarlo** para evitar confusión.

Si quieres una entrega “limpia”, **quédate solo con `seed.js`**.

---

# 8) Docker (Front y Back)

## Back (API + MySQL)
En `Back/`:
- `Dockerfile` (API)
- `docker-compose.yml` (API + MySQL + seed)

```bash
cd Back
docker compose up --build
```

## Front (Angular)
En `Front/` tienes `Dockerfile`. Ejemplo genérico (puede variar según tu Dockerfile):

```bash
cd Front
docker build -t pt-front .
docker run --rm -p 4200:80 pt-front
```

> Si tu Dockerfile del Front está pensado para Nginx/80, el comando anterior aplica.  
> Si está pensado para `ng serve`, cambia el puerto según tu configuración.

---

## Estructura (alto nivel)

```
.
├── Front/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── Back/
│   ├── src/
│   ├── scripts/
│   │   ├── create_db.js
│   │   ├── seed.js
│   │   └── (opcional) seed.ps1
│   ├── Dockerfile
│   └── docker-compose.yml
└── README.md
```

---

## Cómo validar funcionalidad (checklist)

1) `docker compose up --build` dentro de `Back/`
2) Abrir `http://localhost:3000` → debe responder JSON “Welcome…”
3) Abrir `http://localhost:4200` (Front)
4) Login con:
   - `admin@vector.cl` / `Admin10.01`
5) Crear producto, listar, filtrar por categoría, editar y eliminar.

---

## Notas
- **CORS** está habilitado en el backend para permitir requests desde el Front.
- La DB se persiste en un **volume** (`db_data`). Para reiniciar: `docker compose down -v`.
