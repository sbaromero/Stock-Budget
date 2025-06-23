# Sistema de Presupuestos y Stock

## Descripción
Sistema web completo para gestión de productos, clientes y creación de presupuestos. Permite controlar el inventario y generar presupuestos automáticamente calculando totales.

## Características

### 📦 Gestión de Productos
- Agregar productos con nombre, marca, precio, tamaño, peso y cantidad
- Ver listado completo de productos
- Editar y eliminar productos
- Control de stock en tiempo real

### 👥 Gestión de Clientes
- Registrar clientes con información completa
- Administrar base de datos de clientes
- Información de contacto y dirección

### 📋 Creación de Presupuestos
- Seleccionar cliente para el presupuesto
- Agregar productos del inventario
- Cálculo automático de subtotales y total
- Control de stock disponible
- Actualización automática del inventario al guardar

## Estructura del Proyecto

```
Stock&Budget/
├── index.html          # Página principal con navegación
├── productos.html      # Gestión de productos
├── clientes.html       # Gestión de clientes
├── presupuestos.html   # Creación de presupuestos
├── styles.css          # Estilos del sistema
├── script.js           # Lógica JavaScript
└── README.md           # Documentación
```

## Tecnologías Utilizadas

- **HTML5**: Estructura de las páginas
- **CSS3**: Diseño responsivo y moderno
- **JavaScript ES6+**: Lógica de negocio
- **LocalStorage**: Persistencia de datos local

## Funcionalidades

### Productos
- ✅ Agregar nuevos productos
- ✅ Validación de campos obligatorios
- ✅ Formateo de precios en pesos argentinos
- ✅ Control de stock
- ✅ Eliminar productos

### Clientes
- ✅ Registro de clientes
- ✅ Validación de email
- ✅ Información de contacto completa
- ✅ Eliminar clientes

### Presupuestos
- ✅ Selección de cliente
- ✅ Agregar múltiples productos
- ✅ Cálculo automático de totales
- ✅ Verificación de stock disponible
- ✅ Actualización automática del inventario
- ✅ Limpiar presupuesto

## Instalación y Uso

1. Descargar todos los archivos en una carpeta
2. Abrir `index.html` en un navegador web
3. Comenzar agregando productos en la sección de Productos
4. Registrar clientes en la sección de Clientes
5. Crear presupuestos seleccionando cliente y productos

## Navegación

El sistema tiene una navegación intuitiva:
- **Inicio**: Panel principal con estadísticas
- **Productos**: Gestión completa del inventario
- **Clientes**: Base de datos de clientes
- **Presupuestos**: Creación de presupuestos

## Almacenamiento de Datos

Los datos se guardan localmente en el navegador usando LocalStorage:
- `productos`: Array de productos
- `clientes`: Array de clientes  
- `presupuestos`: Array de presupuestos generados

## Características Técnicas

- **Diseño Responsivo**: Se adapta a dispositivos móviles y desktop
- **Validación**: Campos obligatorios y validación de datos
- **Alertas**: Sistema de notificaciones para el usuario
- **Formateo**: Precios en formato de moneda argentina
- **IDs únicos**: Generación automática de identificadores

## Próximas Mejoras

- Exportar presupuestos a PDF
- Sistema de búsqueda y filtros
- Reportes de ventas
- Base de datos persistente
- Sistema de usuarios

## Soporte

Sistema desarrollado en español para Argentina. Utiliza formato de moneda ARS (Pesos Argentinos) y validaciones locales. 