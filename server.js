const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, 'logo-empresa' + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|svg/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB límite
});

// Directorio para archivos de datos
const dataDir = 'data/';
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Funciones auxiliares para manejo de archivos
function saveToFile(filename, data) {
    try {
        const filePath = path.join(dataDir, filename);
        const timestamp = new Date().toISOString();
        const dataWithTimestamp = {
            lastUpdated: timestamp,
            data: data
        };
        fs.writeFileSync(filePath, JSON.stringify(dataWithTimestamp, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving to file:', error);
        return false;
    }
}

function loadFromFile(filename) {
    try {
        const filePath = path.join(dataDir, filename);
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const parsedData = JSON.parse(fileContent);
            return parsedData.data || [];
        }
        return [];
    } catch (error) {
        console.error('Error loading from file:', error);
        return [];
    }
}

// Rutas para productos
app.get('/api/productos', (req, res) => {
    const productos = loadFromFile('productos.txt');
    res.json(productos);
});

app.post('/api/productos', (req, res) => {
    const productos = loadFromFile('productos.txt');
    const nuevoProducto = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        ...req.body,
        fechaCreacion: new Date().toISOString()
    };
    productos.push(nuevoProducto);
    
    if (saveToFile('productos.txt', productos)) {
        res.json({ success: true, producto: nuevoProducto });
    } else {
        res.status(500).json({ success: false, error: 'Error al guardar producto' });
    }
});

app.put('/api/productos/:id', (req, res) => {
    const productos = loadFromFile('productos.txt');
    const index = productos.findIndex(p => p.id === req.params.id);
    
    if (index !== -1) {
        productos[index] = { ...productos[index], ...req.body };
        if (saveToFile('productos.txt', productos)) {
            res.json({ success: true, producto: productos[index] });
        } else {
            res.status(500).json({ success: false, error: 'Error al actualizar producto' });
        }
    } else {
        res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }
});

app.delete('/api/productos/:id', (req, res) => {
    const productos = loadFromFile('productos.txt');
    const filteredProductos = productos.filter(p => p.id !== req.params.id);
    
    if (saveToFile('productos.txt', filteredProductos)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, error: 'Error al eliminar producto' });
    }
});

// Rutas para clientes
app.get('/api/clientes', (req, res) => {
    const clientes = loadFromFile('clientes.txt');
    res.json(clientes);
});

app.post('/api/clientes', (req, res) => {
    const clientes = loadFromFile('clientes.txt');
    const nuevoCliente = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        ...req.body,
        fechaCreacion: new Date().toISOString()
    };
    clientes.push(nuevoCliente);
    
    if (saveToFile('clientes.txt', clientes)) {
        res.json({ success: true, cliente: nuevoCliente });
    } else {
        res.status(500).json({ success: false, error: 'Error al guardar cliente' });
    }
});

app.put('/api/clientes/:id', (req, res) => {
    const clientes = loadFromFile('clientes.txt');
    const index = clientes.findIndex(c => c.id === req.params.id);
    
    if (index !== -1) {
        clientes[index] = { ...clientes[index], ...req.body };
        if (saveToFile('clientes.txt', clientes)) {
            res.json({ success: true, cliente: clientes[index] });
        } else {
            res.status(500).json({ success: false, error: 'Error al actualizar cliente' });
        }
    } else {
        res.status(404).json({ success: false, error: 'Cliente no encontrado' });
    }
});

app.delete('/api/clientes/:id', (req, res) => {
    const clientes = loadFromFile('clientes.txt');
    const filteredClientes = clientes.filter(c => c.id !== req.params.id);
    
    if (saveToFile('clientes.txt', filteredClientes)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, error: 'Error al eliminar cliente' });
    }
});

// Rutas para presupuestos
app.get('/api/presupuestos', (req, res) => {
    const presupuestos = loadFromFile('presupuestos.txt');
    res.json(presupuestos);
});

app.post('/api/presupuestos', (req, res) => {
    const presupuestos = loadFromFile('presupuestos.txt');
    const nuevoPresupuesto = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        numero: presupuestos.length + 1,
        ...req.body,
        fechaCreacion: new Date().toISOString(),
        estado: 'Pendiente'
    };
    presupuestos.push(nuevoPresupuesto);
    
    if (saveToFile('presupuestos.txt', presupuestos)) {
        res.json({ success: true, presupuesto: nuevoPresupuesto });
    } else {
        res.status(500).json({ success: false, error: 'Error al guardar presupuesto' });
    }
});

app.put('/api/presupuestos/:id', (req, res) => {
    const presupuestos = loadFromFile('presupuestos.txt');
    const index = presupuestos.findIndex(p => p.id === req.params.id);
    
    if (index !== -1) {
        presupuestos[index] = { ...presupuestos[index], ...req.body };
        if (saveToFile('presupuestos.txt', presupuestos)) {
            res.json({ success: true, presupuesto: presupuestos[index] });
        } else {
            res.status(500).json({ success: false, error: 'Error al actualizar presupuesto' });
        }
    } else {
        res.status(404).json({ success: false, error: 'Presupuesto no encontrado' });
    }
});

app.delete('/api/presupuestos/:id', (req, res) => {
    const presupuestos = loadFromFile('presupuestos.txt');
    const presupuestoIndex = presupuestos.findIndex(p => p.id === req.params.id);
    
    if (presupuestoIndex !== -1) {
        const presupuestoEliminado = presupuestos[presupuestoIndex];
        const filteredPresupuestos = presupuestos.filter(p => p.id !== req.params.id);
        
        if (saveToFile('presupuestos.txt', filteredPresupuestos)) {
            res.json({ 
                success: true, 
                message: `Presupuesto #${presupuestoEliminado.numero} eliminado correctamente`,
                presupuesto: presupuestoEliminado
            });
        } else {
            res.status(500).json({ success: false, error: 'Error al eliminar presupuesto' });
        }
    } else {
        res.status(404).json({ success: false, error: 'Presupuesto no encontrado' });
    }
});

// Ruta para subir logo de empresa
app.post('/api/upload-logo', upload.single('logo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No se subió ningún archivo' });
    }
    
    res.json({ 
        success: true, 
        filename: req.file.filename,
        path: '/uploads/' + req.file.filename
    });
});

// Ruta para obtener el logo actual
app.get('/api/logo', (req, res) => {
    const uploadDir = 'uploads/';
    const logoExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];
    
    for (const ext of logoExtensions) {
        const logoPath = path.join(uploadDir, 'logo-empresa' + ext);
        if (fs.existsSync(logoPath)) {
            return res.json({ 
                success: true, 
                path: '/uploads/logo-empresa' + ext 
            });
        }
    }
    
    res.json({ success: false, error: 'No hay logo configurado' });
});

// Servir archivos estáticos de uploads
app.use('/uploads', express.static('uploads'));

// Ruta para estadísticas
app.get('/api/stats', (req, res) => {
    const productos = loadFromFile('productos.txt');
    const clientes = loadFromFile('clientes.txt');
    const presupuestos = loadFromFile('presupuestos.txt');
    
    res.json({
        totalProductos: productos.length,
        totalClientes: clientes.length,
        totalPresupuestos: presupuestos.length,
        productosConStock: productos.filter(p => p.cantidad > 0).length,
        valorTotalInventario: productos.reduce((total, p) => total + (p.precio * p.cantidad), 0)
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
    console.log(`📁 Datos guardados en: ${path.resolve(dataDir)}`);
    console.log(`🖼️  Logos guardados en: ${path.resolve('uploads/')}`);
}); 