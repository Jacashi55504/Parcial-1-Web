// Verificar si hay un token JWT en localStorage
const token = localStorage.getItem('token');
window.token = token;

if (window.token) {
    // Si hay un token, ocultar los enlaces de inicio de sesión y registro y mostrar "Cerrar sesión"
    document.getElementById('dropdownMenu').innerHTML = `
        <li><a class="dropdown-item" href="#">Cerrar sesión</a></li>
    `;
}

dropdownMenu.addEventListener('click', function(event) {
    if (event.target.textContent === 'Cerrar sesión') {
        localStorage.removeItem('token');
        window.token = undefined;
        window.location.reload();
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    if (window.token) {
        // Mostrar pedidos
        await cargarPedidos();
    }
});

//CARRITO

// Manejar evento de clic en el botón "Agregar al carrito"
document.querySelectorAll('.btn-agregar').forEach(btn => {
    btn.addEventListener('click', () => {
        // Obtener el estado del carrito del almacenamiento local
        let carrito = JSON.parse(localStorage.getItem('carrito')) || {};

        const cardBody = btn.closest('.card-body');
        const producto = cardBody.querySelector('.card-title').textContent;
        const precio = parseInt(cardBody.querySelector('.card-text').textContent.replace(/[^0-9.-]+/g, ""), 10);
        const cantidad = parseInt(cardBody.querySelector('.form-control').value, 10);

        // Comprobar si el producto ya está en el carrito
        if (carrito.hasOwnProperty(producto)) {
            // Actualizar la cantidad sumándola a la cantidad existente
            carrito[producto].cantidad += cantidad;
        } else {
            // Agregar el producto al carrito con su cantidad
            carrito[producto] = { cantidad, precio };
        }

        // Guardar el estado actualizado del carrito en el almacenamiento local
        localStorage.setItem('carrito', JSON.stringify(carrito));

        // Actualizar la ventana emergente del carrito
        actualizarVentanaEmergenteCarrito(carrito);
    });
});

// Función para actualizar la ventana emergente del carrito
function actualizarVentanaEmergenteCarrito(carrito) {
    const listaProductos = document.getElementById('lista-productos');
    listaProductos.innerHTML = '';

    const nombresArticulos = [];
    const cantidades = [];
    const precios = [];

    for (const producto in carrito) {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = `${producto}: ${carrito[producto].cantidad}`;
        listaProductos.appendChild(li);

        nombresArticulos.push(producto);
        cantidades.push(carrito[producto].cantidad);
        precios.push(carrito[producto].precio);
    }

    localStorage.setItem('nombresArticulos', JSON.stringify(nombresArticulos));
    localStorage.setItem('cantidades', JSON.stringify(cantidades));
    localStorage.setItem('precios', JSON.stringify(precios));

    const modal = new bootstrap.Modal(document.getElementById('productos-agregados'));
    modal.show();
}

document.getElementById('borrar-carrito').addEventListener('click', function() {
    // Limpiar la lista de productos
    document.getElementById('lista-productos').innerHTML = '';
    // Limpiar el carrito almacenado en localStorage
    localStorage.removeItem('carrito');
});

document.getElementById('ver-carrito').addEventListener('click', function() {
    // Obtener el estado actual del carrito del almacenamiento local
    let carrito = JSON.parse(localStorage.getItem('carrito')) || {};
    const listaProductos = document.getElementById('lista-productos');

    // Limpiar la lista de productos antes de mostrar los productos del carrito
    listaProductos.innerHTML = '';

    // Iterar sobre los productos en el carrito y agregarlos a la lista
    for (const producto in carrito) {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = `${producto}: ${carrito[producto].cantidad}`;
        listaProductos.appendChild(li);
    }

    // Mostrar la ventana emergente del carrito
    const modalElement = document.getElementById('productos-agregados');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.show();
});

// PEDIDOS

// Función para cargar pedidos
async function cargarPedidos() {
    const response = await fetch('http://localhost:8000/api/pedidos/', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (response.ok) {
        const pedidos = await response.json();
        const pedidosContainer = document.getElementById('pedidos-container');
        pedidosContainer.innerHTML = '';
        pedidos.forEach(pedido => {
            const pedidoDiv = document.createElement('div');
            pedidoDiv.innerHTML = `
                <div>Pedido ID: ${pedido._id} - Total: ${pedido.total}</div>
                <button onclick="editarPedido('${pedido._id}')">Editar</button>
                <button onclick="borrarPedido('${pedido._id}')">Borrar</button>
                <ul>${pedido.articulos.map((articulo, index) => `<li>${articulo.nombre}: ${pedido.cantidades[index]}</li>`).join('')}</ul>
            `;
            pedidosContainer.appendChild(pedidoDiv);
        });
    }
}

// Función para editar un pedido
async function editarPedido(id) {
    console.log('Editar pedido', id);
    // Implementar lógica para editar un pedido
}

// Función para borrar un pedido
async function borrarPedido(id) {
    console.log('Borrar pedido', id);
    const response = await fetch(`http://localhost:8000/api/pedidos/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (response.ok) {
        alert('Pedido borrado con éxito');
        cargarPedidos();  // Recargar pedidos después de borrar
    }
}

// Función para realizar un pedido
document.getElementById('realizar-pedido').addEventListener('click', async () => {
    try {
        const carrito = JSON.parse(localStorage.getItem('carrito'));
        const nombresArticulos = Object.keys(carrito);
        const detallesArticulos = nombresArticulos.map(nombre => {
            return {
                nombre: nombre,
                cantidad: carrito[nombre].cantidad,
                precio: carrito[nombre].precio
            };
        });

        const body = {
            articulos: detallesArticulos.map(item => item.nombre),
            cantidades: detallesArticulos.map(item => item.cantidad),
            precios: detallesArticulos.map(item => item.precio)
        };

        const response = await fetch('http://localhost:8000/api/pedidos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) throw new Error('Error al realizar el pedido');
        alert('Pedido realizado con éxito');
        localStorage.removeItem('carrito');
        window.location.reload();
    } catch (error) {
        console.error(error.message);
        alert('Error al realizar el pedido: ' + error.message);
    }
});
