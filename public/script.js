// Variables globales
let productos = [];
let clientes = [];
let presupuestos = [];
let currentBudgetProducts = [];

// Cargar datos iniciales del servidor
async function loadInitialData() {
    try {
        productos = await ProductAPI.getAll();
        clientes = await ClientAPI.getAll();
        presupuestos = await BudgetAPI.getAll();
    } catch (error) {
        console.error('Error cargando datos iniciales:', error);
        showSnackbar('Error conectando con el servidor', 'error');
    }
}

// Funciones para productos
async function renderProductsTable() {
    const tbody = document.getElementById('productosTableBody');
    if (!tbody) return;

    try {
        productos = await ProductAPI.getAll();
        tbody.innerHTML = '';

        productos.forEach(product => {
            const row = document.createElement('tr');
            row.className = 'fade-in';
            row.innerHTML = `
                <td>${product.nombre}</td>
                <td>${product.marca}</td>
                <td>${formatCurrency(product.precio)}</td>
                <td>${product.tamaño || '-'}</td>
                <td>${product.peso || '-'}</td>
                <td><span class="${product.cantidad < 10 ? 'warning' : ''}">${product.cantidad}</span></td>
                <td class="actions">
                    <button class="mdc-button mdc-button--outlined btn-small" onclick="editProduct('${product.id}')">
                        <span class="mdc-button__label">Editar</span>
                    </button>
                    <button class="mdc-button error btn-small" onclick="deleteProduct('${product.id}')">
                        <span class="mdc-button__label">Eliminar</span>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        showSnackbar('Error cargando productos', 'error');
    }
}

async function addProduct() {
    const form = document.getElementById('productForm');
    const formData = new FormData(form);
    
    const product = {
        nombre: formData.get('nombre'),
        marca: formData.get('marca'),
        precio: parseFloat(formData.get('precio')),
        tamaño: formData.get('tamaño') || '',
        peso: formData.get('peso') || '',
        cantidad: parseInt(formData.get('cantidad'))
    };

    // Validación
    if (!product.nombre || !product.marca || !product.precio || product.cantidad === undefined) {
        showSnackbar('Por favor, completa todos los campos obligatorios', 'error');
        return;
    }

    try {
        const result = await ProductAPI.create(product);
        if (result.success) {
            form.reset();
            await renderProductsTable();
            showSnackbar('Producto agregado correctamente', 'success');
        }
    } catch (error) {
        showSnackbar('Error al guardar el producto', 'error');
    }
}

async function deleteProduct(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        try {
            const result = await ProductAPI.delete(id);
            if (result.success) {
                await renderProductsTable();
                showSnackbar('Producto eliminado correctamente', 'success');
            }
        } catch (error) {
            showSnackbar('Error al eliminar el producto', 'error');
        }
    }
}

// Funciones para clientes
async function renderClientsTable() {
    const tbody = document.getElementById('clientesTableBody');
    if (!tbody) return;

    try {
        clientes = await ClientAPI.getAll();
        tbody.innerHTML = '';

        clientes.forEach(client => {
            const row = document.createElement('tr');
            row.className = 'fade-in';
            row.innerHTML = `
                <td>${client.nombre}</td>
                <td>${client.email}</td>
                <td>${client.telefono}</td>
                <td>${client.direccion || '-'}</td>
                <td class="actions">
                    <button class="mdc-button mdc-button--outlined btn-small" onclick="editClient('${client.id}')">
                        <span class="mdc-button__label">Editar</span>
                    </button>
                    <button class="mdc-button error btn-small" onclick="deleteClient('${client.id}')">
                        <span class="mdc-button__label">Eliminar</span>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        showSnackbar('Error cargando clientes', 'error');
    }
}

async function addClient() {
    const form = document.getElementById('clientForm');
    const formData = new FormData(form);
    
    const client = {
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        direccion: formData.get('direccion') || ''
    };

    // Validación
    if (!client.nombre || !client.email || !client.telefono) {
        showSnackbar('Por favor, completa todos los campos obligatorios', 'error');
        return;
    }

    try {
        const result = await ClientAPI.create(client);
        if (result.success) {
            form.reset();
            await renderClientsTable();
            showSnackbar('Cliente agregado correctamente', 'success');
        }
    } catch (error) {
        showSnackbar('Error al guardar el cliente', 'error');
    }
}

async function deleteClient(id) {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
        try {
            const result = await ClientAPI.delete(id);
            if (result.success) {
                await renderClientsTable();
                showSnackbar('Cliente eliminado correctamente', 'success');
            }
        } catch (error) {
            showSnackbar('Error al eliminar el cliente', 'error');
        }
    }
}

// Funciones para presupuestos
async function loadClientsSelect() {
    const select = document.getElementById('clienteSelect');
    if (!select) return;

    try {
        clientes = await ClientAPI.getAll();
        select.innerHTML = '<option value="">Seleccionar cliente</option>';
        
        clientes.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = `${client.nombre} - ${client.email}`;
            select.appendChild(option);
        });
    } catch (error) {
        showSnackbar('Error cargando clientes', 'error');
    }
}

async function loadProductsSelect() {
    const select = document.getElementById('productoSelect');
    if (!select) return;

    try {
        productos = await ProductAPI.getAll();
        const productsInStock = productos.filter(p => p.cantidad > 0);
        select.innerHTML = '<option value="">Seleccionar producto</option>';
        
        productsInStock.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.nombre} - ${product.marca} (Stock: ${product.cantidad})`;
            select.appendChild(option);
        });
    } catch (error) {
        showSnackbar('Error cargando productos', 'error');
    }
}

function addProductToBudget() {
    const productoId = document.getElementById('productoSelect').value;
    const cantidad = parseInt(document.getElementById('cantidadProducto').value);

    if (!productoId || !cantidad) {
        showSnackbar('Selecciona un producto y especifica la cantidad', 'error');
        return;
    }

    const product = productos.find(p => p.id === productoId);
    if (!product) {
        showSnackbar('Producto no encontrado', 'error');
        return;
    }

    if (cantidad > product.cantidad) {
        showSnackbar('No hay suficiente stock disponible', 'error');
        return;
    }

    // Verificar si el producto ya está en el presupuesto
    const existingIndex = currentBudgetProducts.findIndex(p => p.id === productoId);
    if (existingIndex !== -1) {
        const newQuantity = currentBudgetProducts[existingIndex].cantidad + cantidad;
        if (newQuantity > product.cantidad) {
            showSnackbar('No hay suficiente stock para esa cantidad total', 'error');
            return;
        }
        currentBudgetProducts[existingIndex].cantidad = newQuantity;
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
    
    showSnackbar('Producto agregado al presupuesto', 'success');
}

function renderBudgetProducts() {
    const tbody = document.getElementById('presupuestoProductsBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    currentBudgetProducts.forEach((product, index) => {
        const subtotal = product.precio * product.cantidad;
        const row = document.createElement('tr');
        row.className = 'fade-in';
        row.innerHTML = `
            <td>${product.nombre}</td>
            <td>${product.marca}</td>
            <td>${formatCurrency(product.precio)}</td>
            <td>${product.cantidad}</td>
            <td>${formatCurrency(subtotal)}</td>
            <td class="actions">
                <button class="mdc-button error btn-small" onclick="removeProductFromBudget(${index})">
                    <span class="mdc-button__label">Quitar</span>
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
    showSnackbar('Producto removido del presupuesto', 'info');
}

function updateBudgetTotal() {
    const total = currentBudgetProducts.reduce((total, item) => {
        return total + (item.precio * item.cantidad);
    }, 0);
    
    const totalElements = document.querySelectorAll('#presupuestoTotal, #presupuestoTotalFinal');
    totalElements.forEach(element => {
        if (element) {
            element.textContent = formatCurrency(total);
        }
    });
}

async function saveBudget() {
    const clienteId = document.getElementById('clienteSelect').value;
    
    if (!clienteId) {
        showSnackbar('Selecciona un cliente', 'error');
        return;
    }

    if (currentBudgetProducts.length === 0) {
        showSnackbar('Agrega al menos un producto al presupuesto', 'error');
        return;
    }

    const client = clientes.find(c => c.id === clienteId);
    const total = currentBudgetProducts.reduce((total, item) => {
        return total + (item.precio * item.cantidad);
    }, 0);

    const budget = {
        cliente: {
            id: clienteId,
            nombre: client.nombre,
            email: client.email,
            telefono: client.telefono,
            direccion: client.direccion || ''
        },
        productos: [...currentBudgetProducts],
        total: total
    };

    try {
        const result = await BudgetAPI.create(budget);
        if (result.success) {
            // Actualizar stock de productos
            for (const budgetProduct of currentBudgetProducts) {
                const product = productos.find(p => p.id === budgetProduct.id);
                if (product) {
                    await ProductAPI.update(budgetProduct.id, {
                        cantidad: product.cantidad - budgetProduct.cantidad
                    });
                }
            }

            // Mostrar botón de exportar PDF
            showExportButton(result.presupuesto);
            
            // Limpiar formulario
            clearBudget();
            await loadProductsSelect(); // Recargar productos para actualizar stock
            
            showSnackbar('Presupuesto guardado correctamente', 'success');
        }
    } catch (error) {
        showSnackbar('Error al guardar el presupuesto', 'error');
    }
}

function showExportButton(presupuesto) {
    // Crear modal de confirmación con opción de exportar
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="mdc-card modal-card">
            <div class="modal-header">
                <h3 class="mdc-typography--headline6">Presupuesto Guardado</h3>
            </div>
            <div class="modal-content">
                <p class="mdc-typography--body1">El presupuesto #${presupuesto.numero} ha sido guardado exitosamente.</p>
                <p class="mdc-typography--body2">¿Deseas exportarlo a PDF?</p>
                <div class="modal-actions">
                    <button class="mdc-button mdc-button--outlined" onclick="closeExportModal()">
                        <span class="mdc-button__label">Ahora no</span>
                    </button>
                    <button class="mdc-button mdc-button--raised" onclick="exportToPDF(${JSON.stringify(presupuesto).replace(/"/g, '&quot;')})">
                        <span class="mdc-button__label">Exportar PDF</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentExportModal = modal;
}

function closeExportModal() {
    if (window.currentExportModal) {
        window.currentExportModal.remove();
        window.currentExportModal = null;
    }
}

async function exportToPDF(presupuesto) {
    try {
        await generatePDF(presupuesto);
        showSnackbar('PDF exportado correctamente', 'success');
        closeExportModal();
    } catch (error) {
        showSnackbar('Error al exportar PDF', 'error');
        console.error('Error exportando PDF:', error);
    }
}

function clearBudget() {
    currentBudgetProducts = [];
    const clienteSelect = document.getElementById('clienteSelect');
    if (clienteSelect) clienteSelect.value = '';
    renderBudgetProducts();
    updateBudgetTotal();
}

// Funciones de edición (placeholder)
function editProduct(id) {
    showSnackbar('Función de edición en desarrollo', 'info');
}

function editClient(id) {
    showSnackbar('Función de edición en desarrollo', 'info');
}

// Inicialización de páginas
document.addEventListener('DOMContentLoaded', async function() {
    await loadInitialData();
    
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'productos.html':
            await renderProductsTable();
            break;
        case 'clientes.html':
            await renderClientsTable();
            break;
        case 'presupuestos.html':
            await loadClientsSelect();
            await loadProductsSelect();
            renderBudgetProducts();
            updateBudgetTotal();
            break;
    }
});

// Exportar funciones globales necesarias
window.addProduct = addProduct;
window.deleteProduct = deleteProduct;
window.editProduct = editProduct;
window.addClient = addClient;
window.deleteClient = deleteClient;
window.editClient = editClient;
window.addProductToBudget = addProductToBudget;
window.removeProductFromBudget = removeProductFromBudget;
window.saveBudget = saveBudget;
window.clearBudget = clearBudget;
window.closeExportModal = closeExportModal;
window.exportToPDF = exportToPDF; 