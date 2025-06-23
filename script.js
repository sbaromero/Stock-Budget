// Utilidades generales
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(amount);
}

function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.display = 'block';
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Gestión de productos
class ProductManager {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('productos') || '[]');
    }

    save() {
        localStorage.setItem('productos', JSON.stringify(this.products));
    }

    addProduct(product) {
        const newProduct = {
            id: generateId(),
            ...product,
            fechaCreacion: new Date().toISOString()
        };
        this.products.push(newProduct);
        this.save();
        return newProduct;
    }

    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedProduct };
            this.save();
            return this.products[index];
        }
        return null;
    }

    deleteProduct(id) {
        this.products = this.products.filter(p => p.id !== id);
        this.save();
    }

    getProduct(id) {
        return this.products.find(p => p.id === id);
    }

    getAllProducts() {
        return this.products;
    }

    getProductsInStock() {
        return this.products.filter(p => p.cantidad > 0);
    }
}

// Gestión de clientes
class ClientManager {
    constructor() {
        this.clients = JSON.parse(localStorage.getItem('clientes') || '[]');
    }

    save() {
        localStorage.setItem('clientes', JSON.stringify(this.clients));
    }

    addClient(client) {
        const newClient = {
            id: generateId(),
            ...client,
            fechaCreacion: new Date().toISOString()
        };
        this.clients.push(newClient);
        this.save();
        return newClient;
    }

    updateClient(id, updatedClient) {
        const index = this.clients.findIndex(c => c.id === id);
        if (index !== -1) {
            this.clients[index] = { ...this.clients[index], ...updatedClient };
            this.save();
            return this.clients[index];
        }
        return null;
    }

    deleteClient(id) {
        this.clients = this.clients.filter(c => c.id !== id);
        this.save();
    }

    getClient(id) {
        return this.clients.find(c => c.id === id);
    }

    getAllClients() {
        return this.clients;
    }
}

// Gestión de presupuestos
class BudgetManager {
    constructor() {
        this.budgets = JSON.parse(localStorage.getItem('presupuestos') || '[]');
    }

    save() {
        localStorage.setItem('presupuestos', JSON.stringify(this.budgets));
    }

    addBudget(budget) {
        const newBudget = {
            id: generateId(),
            ...budget,
            fechaCreacion: new Date().toISOString(),
            estado: 'Pendiente'
        };
        this.budgets.push(newBudget);
        this.save();
        return newBudget;
    }

    updateBudget(id, updatedBudget) {
        const index = this.budgets.findIndex(b => b.id === id);
        if (index !== -1) {
            this.budgets[index] = { ...this.budgets[index], ...updatedBudget };
            this.save();
            return this.budgets[index];
        }
        return null;
    }

    deleteBudget(id) {
        this.budgets = this.budgets.filter(b => b.id !== id);
        this.save();
    }

    getBudget(id) {
        return this.budgets.find(b => b.id === id);
    }

    getAllBudgets() {
        return this.budgets;
    }

    calculateTotal(productos) {
        return productos.reduce((total, item) => {
            return total + (item.precio * item.cantidad);
        }, 0);
    }
}

// Instancias globales
const productManager = new ProductManager();
const clientManager = new ClientManager();
const budgetManager = new BudgetManager();

// Funciones para productos
function renderProductsTable() {
    const tbody = document.getElementById('productosTableBody');
    if (!tbody) return;

    const products = productManager.getAllProducts();
    tbody.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.nombre}</td>
            <td>${product.marca}</td>
            <td>${formatCurrency(product.precio)}</td>
            <td>${product.tamaño}</td>
            <td>${product.peso}</td>
            <td>${product.cantidad}</td>
            <td class="actions">
                <button class="btn btn-secondary btn-small" onclick="editProduct('${product.id}')">
                    Editar
                </button>
                <button class="btn btn-danger btn-small" onclick="deleteProduct('${product.id}')">
                    Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function addProduct() {
    const form = document.getElementById('productForm');
    const formData = new FormData(form);
    
    const product = {
        nombre: formData.get('nombre'),
        marca: formData.get('marca'),
        precio: parseFloat(formData.get('precio')),
        tamaño: formData.get('tamaño'),
        peso: formData.get('peso'),
        cantidad: parseInt(formData.get('cantidad'))
    };

    // Validación
    if (!product.nombre || !product.marca || !product.precio || !product.cantidad) {
        showAlert('Por favor, completa todos los campos obligatorios', 'error');
        return;
    }

    productManager.addProduct(product);
    form.reset();
    renderProductsTable();
    showAlert('Producto agregado correctamente');
}

function deleteProduct(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        productManager.deleteProduct(id);
        renderProductsTable();
        showAlert('Producto eliminado correctamente');
    }
}

// Funciones para clientes
function renderClientsTable() {
    const tbody = document.getElementById('clientesTableBody');
    if (!tbody) return;

    const clients = clientManager.getAllClients();
    tbody.innerHTML = '';

    clients.forEach(client => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${client.nombre}</td>
            <td>${client.email}</td>
            <td>${client.telefono}</td>
            <td>${client.direccion}</td>
            <td class="actions">
                <button class="btn btn-secondary btn-small" onclick="editClient('${client.id}')">
                    Editar
                </button>
                <button class="btn btn-danger btn-small" onclick="deleteClient('${client.id}')">
                    Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function addClient() {
    const form = document.getElementById('clientForm');
    const formData = new FormData(form);
    
    const client = {
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        direccion: formData.get('direccion')
    };

    // Validación
    if (!client.nombre || !client.email || !client.telefono) {
        showAlert('Por favor, completa todos los campos obligatorios', 'error');
        return;
    }

    clientManager.addClient(client);
    form.reset();
    renderClientsTable();
    showAlert('Cliente agregado correctamente');
}

function deleteClient(id) {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
        clientManager.deleteClient(id);
        renderClientsTable();
        showAlert('Cliente eliminado correctamente');
    }
}

// Funciones para presupuestos
function loadClientsSelect() {
    const select = document.getElementById('clienteSelect');
    if (!select) return;

    const clients = clientManager.getAllClients();
    select.innerHTML = '<option value="">Seleccionar cliente</option>';
    
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = `${client.nombre} - ${client.email}`;
        select.appendChild(option);
    });
}

function loadProductsSelect() {
    const select = document.getElementById('productoSelect');
    if (!select) return;

    const products = productManager.getProductsInStock();
    select.innerHTML = '<option value="">Seleccionar producto</option>';
    
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.nombre} - ${product.marca} (Stock: ${product.cantidad})`;
        select.appendChild(option);
    });
}

let currentBudgetProducts = [];

function addProductToBudget() {
    const productoId = document.getElementById('productoSelect').value;
    const cantidad = parseInt(document.getElementById('cantidadProducto').value);

    if (!productoId || !cantidad) {
        showAlert('Selecciona un producto y especifica la cantidad', 'error');
        return;
    }

    const product = productManager.getProduct(productoId);
    if (!product) {
        showAlert('Producto no encontrado', 'error');
        return;
    }

    if (cantidad > product.cantidad) {
        showAlert('No hay suficiente stock disponible', 'error');
        return;
    }

    // Verificar si el producto ya está en el presupuesto
    const existingIndex = currentBudgetProducts.findIndex(p => p.id === productoId);
    if (existingIndex !== -1) {
        currentBudgetProducts[existingIndex].cantidad += cantidad;
    } else {
        currentBudgetProducts.push({
            id: productoId,
            nombre: product.nombre,
            marca: product.marca,
            precio: product.precio,
            cantidad: cantidad
        });
    }

    renderBudgetProducts();
    updateBudgetTotal();
    
    // Limpiar selección
    document.getElementById('productoSelect').value = '';
    document.getElementById('cantidadProducto').value = '';
}

function renderBudgetProducts() {
    const tbody = document.getElementById('presupuestoProductsBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    currentBudgetProducts.forEach((product, index) => {
        const subtotal = product.precio * product.cantidad;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.nombre}</td>
            <td>${product.marca}</td>
            <td>${formatCurrency(product.precio)}</td>
            <td>${product.cantidad}</td>
            <td>${formatCurrency(subtotal)}</td>
            <td class="actions">
                <button class="btn btn-danger btn-small" onclick="removeProductFromBudget(${index})">
                    Quitar
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function removeProductFromBudget(index) {
    currentBudgetProducts.splice(index, 1);
    renderBudgetProducts();
    updateBudgetTotal();
}

function updateBudgetTotal() {
    const total = budgetManager.calculateTotal(currentBudgetProducts);
    const totalElement = document.getElementById('presupuestoTotal');
    if (totalElement) {
        totalElement.textContent = formatCurrency(total);
    }
}

function saveBudget() {
    const clienteId = document.getElementById('clienteSelect').value;
    
    if (!clienteId) {
        showAlert('Selecciona un cliente', 'error');
        return;
    }

    if (currentBudgetProducts.length === 0) {
        showAlert('Agrega al menos un producto al presupuesto', 'error');
        return;
    }

    const client = clientManager.getClient(clienteId);
    const total = budgetManager.calculateTotal(currentBudgetProducts);

    const budget = {
        cliente: {
            id: clienteId,
            nombre: client.nombre,
            email: client.email,
            telefono: client.telefono,
            direccion: client.direccion
        },
        productos: [...currentBudgetProducts],
        total: total
    };

    budgetManager.addBudget(budget);
    
    // Actualizar stock de productos
    currentBudgetProducts.forEach(budgetProduct => {
        const product = productManager.getProduct(budgetProduct.id);
        if (product) {
            productManager.updateProduct(budgetProduct.id, {
                cantidad: product.cantidad - budgetProduct.cantidad
            });
        }
    });

    // Limpiar formulario
    currentBudgetProducts = [];
    document.getElementById('clienteSelect').value = '';
    renderBudgetProducts();
    updateBudgetTotal();
    loadProductsSelect(); // Recargar productos para actualizar stock

    showAlert('Presupuesto guardado correctamente');
}

// Inicialización de páginas
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'productos.html':
            renderProductsTable();
            break;
        case 'clientes.html':
            renderClientsTable();
            break;
        case 'presupuestos.html':
            loadClientsSelect();
            loadProductsSelect();
            renderBudgetProducts();
            updateBudgetTotal();
            break;
    }
}); 