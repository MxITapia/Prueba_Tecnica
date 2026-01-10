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
```
