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