document.addEventListener('DOMContentLoaded', () => {

    const botonesComprar = document.querySelectorAll('.comprar');

    botonesComprar.forEach(boton => {
        boton.addEventListener('click', agregarAlCarrito);
    });
    actualizarCarritoUI();
});

function agregarAlCarrito(event) {
    const productoElemento = event.target.closest('.bg-black');
    const id = event.target.getAttribute('data-id');
    const nombre = event.target.getAttribute('data-nombre');
    const precio = parseFloat(event.target.getAttribute('data-precio'));
    productoElemento.querySelector('.text-red-500').textContent.replace('$', '').trim();

    const producto = { id, nombre, precio, cantidad: 1 };

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    
    const productoExistente = carrito.find(item => item.id === id);
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push(producto);
    }


    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert(`¡${nombre} agregado al carrito!`);
    actualizarCarritoUI();
}


function actualizarCarritoUI() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const carritoIcono = document.querySelector('#carrito-count');
    const totalCarrito = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);

    // Actualizar contador del carrito
    if (carritoIcono) {
        carritoIcono.textContent = carrito.length;
    }

    // Actualizar total en la página carrito.html si existe
    const totalDisplay = document.querySelector('#total-carrito');
    if (totalDisplay) {
        totalDisplay.textContent = `Total: $${totalCarrito.toFixed(2)}`;
    }

    // Mostrar lista de productos en carrito.html si existe
    const listaCarrito = document.querySelector('#lista-carrito');
    if (listaCarrito) {
        listaCarrito.innerHTML = '';

        carrito.forEach(producto => {
            const li = document.createElement('li');
            li.classList.add('flex', 'justify-between', 'items-center', 'bg-black', 'p-4', 'rounded-md', 'shadow-md');
            li.innerHTML = `
                <span>${producto.nombre} (x${producto.cantidad})</span>
                <span>$${(producto.precio * producto.cantidad).toFixed(2)}</span>
                <button class="bg-red-600 py-1 px-2 rounded-md hover:bg-red-700 text-white eliminar-item" data-id="${producto.id}">
                    Eliminar
                </button>
            `;
            listaCarrito.appendChild(li);
        });
        function cargarCarrito() {
            const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            const listaCarrito = document.getElementById('lista-carrito');
            const totalDisplay = document.getElementById('total-carrito');

            listaCarrito.innerHTML = '';
            let total = 0;

            if (carrito.length === 0) {
                listaCarrito.innerHTML = '<p>El carrito está vacío.</p>';
            } else {
                carrito.forEach(producto => {
                    const li = document.createElement('li');
                    li.classList.add('flex', 'justify-between', 'items-center', 'bg-black', 'p-4', 'rounded-md', 'shadow-md');

                    li.innerHTML = `
                        <span>${producto.nombre} (x${producto.cantidad})</span>
                        <span>$${(producto.precio * producto.cantidad).toFixed(2)}</span>
                        <button class="bg-red-600 py-1 px-2 rounded-md hover:bg-red-700 text-white eliminar-item" data-id="${producto.id}">
                            Eliminar
                        </button>
                    `;
                    listaCarrito.appendChild(li);
                    total += producto.precio * producto.cantidad;
                });
            }


            totalDisplay.textContent = `Total: $${total.toFixed(2)}`;


            document.querySelectorAll('.eliminar-item').forEach(boton => {
                boton.addEventListener('click', eliminarProducto);
            });
        }



        document.querySelectorAll('.eliminar-item').forEach(boton => {
            boton.addEventListener('click', eliminarProducto);
        });
    }
}

// Función para eliminar productos del carrito
function eliminarProducto(event) {
    const id = event.target.getAttribute('data-id');
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Filtrar productos
    carrito = carrito.filter(producto => producto.id !== id);

    // Actualizar carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarritoUI();
}