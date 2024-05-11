
// Verificar si hay un token JWT en localStorage
const token = localStorage.getItem('token');
window.token=token

if (window.token) {
    // Si hay un token, ocultar los enlaces de inicio de sesión y registro y mostrar "Cerrar sesión"
    document.getElementById('dropdownMenu').innerHTML = `
        <li><a class="dropdown-item" href="#">Cerrar sesión</a></li>
    `;
}
dropdownMenu.addEventListener('click', function(event) {
    if (event.target.textContent === 'Cerrar sesión') {
        localStorage.removeItem('token');
        window.token=undefined;
        window.location.reload();

    }
});
// Manejar evento de clic en el botón "Agregar al carrito"
document.querySelectorAll('.btn-agregar').forEach(btn => {
    btn.addEventListener('click', () => {
        // Obtener el estado del carrito del almacenamiento local
        let carrito = JSON.parse(localStorage.getItem('carrito')) || {};

        const cardBody = btn.closest('.card-body');
        const producto = cardBody.querySelector('.card-title').textContent;
        const cantidad = parseInt(cardBody.querySelector('.form-control').value);

        // Comprobar si el producto ya está en el carrito
        if (carrito.hasOwnProperty(producto)) {
            // Actualizar la cantidad sumándola a la cantidad existente
            carrito[producto] += cantidad;
        } else {
            // Agregar el producto al carrito con su cantidad
            carrito[producto] = cantidad;
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
    // Limpiar la lista de productos antes de actualizarla
    listaProductos.innerHTML = '';
    // Iterar sobre los productos en el carrito y agregarlos a la lista
    for (const producto in carrito) {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = `${producto}: ${carrito[producto]}`;
        listaProductos.appendChild(li);
    }
    // Mostrar la ventana emergente del carrito
    const modal = new bootstrap.Modal(document.getElementById('productos-agregados'));
    modal.show();
}
document.getElementById('borrar-carrito').addEventListener('click', function() {
    // Limpiar la lista de productos
    document.getElementById('lista-productos').innerHTML = '';
    // Limpiar el carrito almacenado en localStorage
    localStorage.removeItem('carrito');
});
/*
document.getElementById('ver-carrito').addEventListener('click', function() {
    // Obtener el estado actual del carrito del almacenamiento local
    let carrito = JSON.parse(localStorage.getItem('carrito')) || {};
    // Actualizar la ventana emergente del carrito con los productos actuales
    actualizarVentanaEmergenteCarrito(carrito);
});*/
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
        li.textContent = `${producto}: ${carrito[producto]}`;
        listaProductos.appendChild(li);
    }

    // Mostrar la ventana emergente del carrito
    const modalElement = document.getElementById('productos-agregados');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.show();
});






