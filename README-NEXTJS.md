# Wedding Invitation - Next.js Migration

Este proyecto ha sido migrado de Create React App a Next.js para mejorar el rendimiento, SEO y facilitar el despliegue.

## 🚀 Cambios Realizados

### Frontend
- ✅ Migrado de React Router a Next.js routing basado en archivos
- ✅ Configurada internacionalización con Next.js i18n
- ✅ Convertidos estilos CSS para compatibilidad con Next.js
- ✅ Mantenidos todos los contextos y funcionalidades existentes

### Backend
- ✅ API endpoints migrados a Next.js API Routes (sin servidor Express separado)
- ✅ Mantenida conexión con PostgreSQL
- ✅ Centralizada gestión de base de datos en `/lib/db.js`
- ✅ Eliminado servidor Express (ya no necesario)

## 📦 Instalación

```bash
# Instalar dependencias
npm install
# o
yarn install
```

## 🔧 Configuración

Configura tu URL de PostgreSQL en `.env.local`:
```
POSTGRES_URL=your_postgresql_connection_string_here
```

## 🏃‍♂️ Ejecución

### Desarrollo
```bash
# Ejecutar Next.js (incluye frontend + API routes)
npm run dev
```

### Producción
```bash
# Build del proyecto
npm run build

# Ejecutar en producción
npm start
```

## 📁 Estructura del Proyecto

```
├── pages/                 # Páginas de Next.js
│   ├── _app.js           # Configuración global de la app
│   ├── _document.js      # Customización del HTML document
│   ├── index.js          # Página principal (antigua InvitePage)
│   └── api/              # API Routes
│       ├── health.js     # Endpoint de health check
│       └── test-db.js    # Test de conexión a BD
├── lib/
│   └── db.js             # Utilidad para conexión a PostgreSQL
├── src/                  # Código fuente
│   ├── components/       # Componentes React reutilizables
│   ├── contexts/         # Contextos de React
│   ├── locales/          # Archivos de internacionalización
│   └── assets/           # Imágenes y recursos estáticos
└── public/               # Archivos públicos estáticos
```

## 🔄 API Endpoints

- `GET /api/health` - Health check del servidor
- `GET /api/test-db` - Test de conexión a PostgreSQL

## ⚡ Ventajas de Next.js

1. **SEO Mejorado**: Server-side rendering y pre-rendering
2. **Performance**: Optimización automática de imágenes y código
3. **API Routes**: Backend integrado sin servidor separado
4. **Deploy Fácil**: Compatible con Vercel, Netlify, etc.
5. **Routing**: Sistema de routing basado en archivos más intuitivo

## 🔧 Próximos Pasos Sugeridos

1. **Optimizar Imágenes**: Usar `next/image` para optimización automática
2. **SSG/SSR**: Implementar Static Generation o Server-side Rendering según necesidades
3. **Bundle Analysis**: Analizar el bundle con `@next/bundle-analyzer`
4. **Deploy**: Configurar deployment en Vercel o plataforma preferida

## 📝 Notas de Migración

- Los componentes existentes se mantienen sin cambios
- La internacionalización funciona igual que antes
- Todas las funcionalidades de Google Maps se mantienen
- **Servidor Express eliminado** - Todo se maneja con Next.js API Routes 