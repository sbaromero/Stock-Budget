# Sistema de Presupuestos y Stock - Versión Completa

## 🚀 Características Implementadas

### ✅ Backend con Node.js y Express
- **Almacenamiento en archivos TXT del lado del servidor**
- API REST completa para productos, clientes y presupuestos
- Subida y gestión de logos de empresa
- Validación de datos y manejo de errores

### ✅ Material Design
- Interfaz moderna basada en Material Design
- Componentes responsivos y accesibles
- Iconos de Material Icons
- Tipografía Roboto

### ✅ Exportación a PDF
- Generación automática de PDFs con jsPDF
- Inclusión del logo de la empresa en el membrete
- Formato profesional con datos del cliente
- Descarga automática del archivo

### ✅ Gestión de Logo
- Subida de imagen del logo de la empresa
- Vista previa en tiempo real
- Integración automática en los PDFs
- Soporte para múltiples formatos (JPG, PNG, GIF, SVG)

## 📁 Estructura del Proyecto

```
Stock&Budget/
├── server.js                 # Servidor Express
├── package.json              # Dependencias del proyecto
├── public/                   # Archivos del frontend
│   ├── index.html           # Página principal
│   ├── productos.html       # Gestión de productos
│   ├── clientes.html        # Gestión de clientes
│   ├── presupuestos.html    # Creación de presupuestos
│   ├── styles.css           # Estilos Material Design
│   ├── api.js               # Funciones de API
│   └── script.js            # Lógica principal
├── data/                    # Archivos TXT con datos
│   ├── productos.txt        # Datos de productos
│   ├── clientes.txt         # Datos de clientes
│   └── presupuestos.txt     # Datos de presupuestos
└── uploads/                 # Logos de empresa
    └── logo-empresa.*       # Logo actual
```

## 🛠️ Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar el servidor
```bash
npm start
```

### 3. Para desarrollo (con auto-reload)
```bash
npm run dev
```

### 4. Abrir en el navegador
```
http://localhost:3000
```

## 📋 Funcionalidades del Sistema

### 🏠 Página Principal
- Dashboard con estadísticas en tiempo real
- Navegación intuitiva a todas las secciones
- Configuración del logo de empresa
- Diseño Material Design responsive

### 📦 Gestión de Productos
- **Campos**: nombre, marca, precio, tamaño, peso, cantidad
- **Validación**: campos obligatorios y tipos de datos
- **Funciones**: agregar, eliminar, listar productos
- **Stock**: control y alertas de stock bajo
- **Persistencia**: datos guardados en `data/productos.txt`

### 👥 Gestión de Clientes
- **Campos**: nombre, email, teléfono, dirección
- **Validación**: email válido y campos obligatorios
- **Funciones**: agregar, eliminar, listar clientes
- **Persistencia**: datos guardados en `data/clientes.txt`

### 📋 Creación de Presupuestos
- **Selección de cliente** de la base de datos
- **Agregado de productos** con control de stock
- **Cálculo automático** de subtotales y total
- **Validaciones** de stock disponible
- **Actualización automática** del inventario
- **Exportación a PDF** con logo de empresa
- **Persistencia**: datos guardados en `data/presupuestos.txt`

### 🖼️ Gestión de Logo
- **Subida de archivos** con validación de formato
- **Vista previa** en tiempo real
- **Integración automática** en PDFs
- **Formatos soportados**: JPG, PNG, GIF, SVG
- **Límite de tamaño**: 5MB

### 📄 Exportación a PDF
- **Membrete profesional** con logo de empresa
- **Datos completos** del cliente y presupuesto
- **Tabla detallada** de productos con precios
- **Total destacado** y formato de moneda argentina
- **Descarga automática** con nombre descriptivo

## 🔧 Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Multer** - Subida de archivos
- **CORS** - Cross-Origin Resource Sharing
- **File System** - Almacenamiento en archivos TXT

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Material Design styling
- **JavaScript ES6+** - Lógica de cliente
- **Material Icons** - Iconografía
- **Roboto Font** - Tipografía Material

### Librerías
- **jsPDF** - Generación de PDFs
- **Material Design** - Sistema de diseño
- **Fetch API** - Comunicación con backend

## 📊 Datos y Persistencia

Todos los datos se almacenan en archivos TXT con formato JSON en el directorio `data/`:

### Estructura de datos:

**productos.txt**
```json
{
  "lastUpdated": "2024-01-01T00:00:00.000Z",
  "data": [
    {
      "id": "producto_id",
      "nombre": "Nombre del producto",
      "marca": "Marca",
      "precio": 1000.50,
      "tamaño": "Mediano",
      "peso": "1kg",
      "cantidad": 100,
      "fechaCreacion": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**clientes.txt**
```json
{
  "lastUpdated": "2024-01-01T00:00:00.000Z",
  "data": [
    {
      "id": "cliente_id",
      "nombre": "Juan Pérez",
      "email": "juan@email.com",
      "telefono": "+54 11 1234-5678",
      "direccion": "Av. Corrientes 1234, CABA",
      "fechaCreacion": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**presupuestos.txt**
```json
{
  "lastUpdated": "2024-01-01T00:00:00.000Z",
  "data": [
    {
      "id": "presupuesto_id",
      "numero": 1,
      "cliente": { /* datos del cliente */ },
      "productos": [ /* productos del presupuesto */ ],
      "total": 15000.00,
      "estado": "Pendiente",
      "fechaCreacion": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## 🌐 API Endpoints

### Productos
- `GET /api/productos` - Listar todos los productos
- `POST /api/productos` - Crear nuevo producto
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto

### Clientes
- `GET /api/clientes` - Listar todos los clientes
- `POST /api/clientes` - Crear nuevo cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### Presupuestos
- `GET /api/presupuestos` - Listar todos los presupuestos
- `POST /api/presupuestos` - Crear nuevo presupuesto

### Logo y Configuración
- `GET /api/logo` - Obtener logo actual
- `POST /api/upload-logo` - Subir nuevo logo
- `GET /api/stats` - Obtener estadísticas del sistema

## 📱 Responsive Design

El sistema está completamente optimizado para:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🔐 Consideraciones de Seguridad

- Validación de tipos de archivo para logos
- Límites de tamaño de archivos
- Sanitización de datos de entrada
- Manejo seguro de archivos del servidor

## 🚀 Características Avanzadas

### Material Design
- Shadows y elevaciones correctas
- Transiciones y animaciones suaves
- Tipografía consistente
- Sistema de colores Material

### UX/UI
- Snackbars para notificaciones
- Modales para confirmaciones
- Loading states implícitos
- Navegación intuitiva

### Performance
- Carga asíncrona de datos
- Actualizaciones en tiempo real
- Optimización de imágenes
- Minificación de recursos

## 🔄 Flujo de Trabajo

1. **Configurar logo** de la empresa (opcional)
2. **Agregar productos** con toda la información
3. **Registrar clientes** en la base de datos
4. **Crear presupuestos** seleccionando cliente y productos
5. **Exportar a PDF** con logo y formato profesional

## 📞 Soporte

Sistema desarrollado completamente en español para Argentina:
- Formato de moneda: Peso Argentino (ARS)
- Fechas en formato DD/MM/YYYY
- Validaciones locales
- Interfaz completamente en español

¡El sistema está listo para usar! 🎉 