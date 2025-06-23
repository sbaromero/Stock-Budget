// Configuración de la API
const API_BASE_URL = 'http://localhost:3000';

// Función auxiliar para hacer llamadas a la API
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
        const response = await fetch(url, finalOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Funciones para gestión de productos
const ProductAPI = {
    async getAll() {
        return await apiCall('/api/productos');
    },

    async create(producto) {
        return await apiCall('/api/productos', {
            method: 'POST',
            body: JSON.stringify(producto)
        });
    },

    async update(id, producto) {
        return await apiCall(`/api/productos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(producto)
        });
    },

    async delete(id) {
        return await apiCall(`/api/productos/${id}`, {
            method: 'DELETE'
        });
    }
};

// Funciones para gestión de clientes
const ClientAPI = {
    async getAll() {
        return await apiCall('/api/clientes');
    },

    async create(cliente) {
        return await apiCall('/api/clientes', {
            method: 'POST',
            body: JSON.stringify(cliente)
        });
    },

    async update(id, cliente) {
        return await apiCall(`/api/clientes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(cliente)
        });
    },

    async delete(id) {
        return await apiCall(`/api/clientes/${id}`, {
            method: 'DELETE'
        });
    }
};

// Funciones para gestión de presupuestos
const BudgetAPI = {
    async getAll() {
        return await apiCall('/api/presupuestos');
    },

    async create(presupuesto) {
        return await apiCall('/api/presupuestos', {
            method: 'POST',
            body: JSON.stringify(presupuesto)
        });
    },

    async update(id, presupuesto) {
        return await apiCall(`/api/presupuestos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(presupuesto)
        });
    },

    async delete(id) {
        return await apiCall(`/api/presupuestos/${id}`, {
            method: 'DELETE'
        });
    }
};

// Función para mostrar notificaciones
function showSnackbar(message, type = 'info') {
    // Remover snackbar existente si hay uno
    const existingSnackbar = document.querySelector('.mdc-snackbar');
    if (existingSnackbar) {
        existingSnackbar.remove();
    }

    // Crear nuevo snackbar
    const snackbar = document.createElement('div');
    snackbar.className = `mdc-snackbar ${type}`;
    snackbar.textContent = message;
    
    document.body.appendChild(snackbar);
    
    // Mostrar con animación
    setTimeout(() => {
        snackbar.style.opacity = '1';
        snackbar.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        snackbar.style.opacity = '0';
        snackbar.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => {
            if (snackbar.parentNode) {
                snackbar.remove();
            }
        }, 300);
    }, 3000);
}

// Función auxiliar para formatear moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(amount);
}

// Función auxiliar para generar PDFs con logo
async function generatePDF(presupuesto) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let yPosition = 20;
    
    try {
        // Cargar logo si existe
        const logoResponse = await fetch('/api/logo');
        const logoData = await logoResponse.json();
        
        if (logoData.success) {
            try {
                // Convertir imagen a base64
                const imgResponse = await fetch(logoData.path);
                const imgBlob = await imgResponse.blob();
                const imgBase64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(imgBlob);
                });
                
                // Agregar logo al PDF
                doc.addImage(imgBase64, 'JPEG', 20, yPosition, 40, 20);
                yPosition += 30;
            } catch (error) {
                console.warn('Error cargando logo:', error);
            }
        }
    } catch (error) {
        console.warn('No se pudo cargar el logo:', error);
    }
    
    // Título del presupuesto
    doc.setFontSize(20);
    doc.setTextColor(25, 118, 210);
    doc.text('PRESUPUESTO', 20, yPosition);
    yPosition += 15;
    
    // Información del presupuesto
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Número: ${presupuesto.numero}`, 20, yPosition);
    doc.text(`Fecha: ${new Date(presupuesto.fechaCreacion).toLocaleDateString('es-AR')}`, 120, yPosition);
    yPosition += 20;
    
    // Información del cliente
    doc.setFontSize(14);
    doc.setTextColor(25, 118, 210);
    doc.text('CLIENTE:', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Nombre: ${presupuesto.cliente.nombre}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Email: ${presupuesto.cliente.email}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Teléfono: ${presupuesto.cliente.telefono}`, 20, yPosition);
    yPosition += 7;
    if (presupuesto.cliente.direccion) {
        doc.text(`Dirección: ${presupuesto.cliente.direccion}`, 20, yPosition);
        yPosition += 7;
    }
    yPosition += 10;
    
    // Tabla de productos
    doc.setFontSize(14);
    doc.setTextColor(25, 118, 210);
    doc.text('PRODUCTOS:', 20, yPosition);
    yPosition += 10;
    
    // Cabecera de la tabla
    doc.setFillColor(25, 118, 210);
    doc.rect(20, yPosition, 170, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('PRODUCTO', 22, yPosition + 5);
    doc.text('CANTIDAD', 100, yPosition + 5);
    doc.text('PRECIO UNIT.', 130, yPosition + 5);
    doc.text('SUBTOTAL', 165, yPosition + 5);
    yPosition += 10;
    
    // Productos
    doc.setTextColor(0, 0, 0);
    presupuesto.productos.forEach((producto) => {
        const subtotal = producto.precio * producto.cantidad;
        
        doc.text(`${producto.nombre} - ${producto.marca}`, 22, yPosition);
        doc.text(producto.cantidad.toString(), 105, yPosition);
        doc.text(formatCurrency(producto.precio), 132, yPosition);
        doc.text(formatCurrency(subtotal), 167, yPosition);
        yPosition += 7;
        
        // Nueva página si es necesario
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }
    });
    
    // Línea de separación
    yPosition += 5;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;
    
    // Total
    doc.setFontSize(14);
    doc.setTextColor(25, 118, 210);
    doc.text('TOTAL:', 140, yPosition);
    doc.setFontSize(16);
    doc.text(formatCurrency(presupuesto.total), 167, yPosition);
    
    // Descargar PDF
    const fileName = `Presupuesto_${presupuesto.numero}_${presupuesto.cliente.nombre.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
}

// Exportar funciones globalmente
window.ProductAPI = ProductAPI;
window.ClientAPI = ClientAPI;
window.BudgetAPI = BudgetAPI;
window.apiCall = apiCall;
window.showSnackbar = showSnackbar;
window.formatCurrency = formatCurrency;
window.generatePDF = generatePDF; 