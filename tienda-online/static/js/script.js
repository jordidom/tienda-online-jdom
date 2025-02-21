// Lista de productos con varias imágenes
const productos = [
    {
        nombre: "Castigo - Anne Holt",
        precio: 4,
        imagenes: [
            "static/img/producto 1/castigo-delante.jpg",
            "static/img/producto 1/castigo-detras.jpg",
            "static/img/producto 1/castigo-lateral.jpg"
        ]
    },
    {
        nombre: "La chica de nieve - Javier Castillo",
        precio: 12,
        imagenes: [
            "static/img/producto 2/la-chica-de-nieve-delante.jpg",
            "static/img/producto 2/la-chica-de-nieve-detras.jpg",
            "static/img/producto 2/la-chica-de-nieve-lateral.jpg"
        ]
    },
    {
        nombre: "The second stranger - Martin Griffin",
        precio: 10,
        imagenes: [
            "static/img/producto 3/the-second-stranger-delante.jpg",
            "static/img/producto 3/the-second-stranger-detras.jpg",
            "static/img/producto 3/the-second-stranger-lateral.jpg"
        ]
    },
    {
        nombre: "Qué bueno que te fuiste - Lae Sánchez",
        precio: 5,
        imagenes: [
            "static/img/producto 4/que-bueno-que-te-fuiste-delante.jpg",
            "static/img/producto 4/que-bueno-que-te-fuiste-detras.jpg",
            "static/img/producto 4/que-bueno-que-te-fuiste-lateral.jpg"
        ]
    }
];

// Recuperamos carrito del localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// 🚀 Cargar productos con carrusel
function cargarProductos() {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    productos.forEach((producto, index) => {
        let div = document.createElement("div");
        div.classList.add("producto");

        div.innerHTML = `
            <div class="swiper product-swiper">
                <div class="swiper-wrapper">
                    ${producto.imagenes.map(img => `<div class="swiper-slide"><img src="${img}" alt="${producto.nombre}"></div>`).join('')}
                </div>
                <!-- Flechas de navegación -->
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
            </div>
            <h2>${producto.nombre}</h2>
            <p class="precio">${producto.precio}€</p>
            <button onclick="agregarAlCarrito(${index})">Añadir al carrito</button>
        `;

        contenedor.appendChild(div);
    });

    // Inicializar Swiper
    new Swiper('.product-swiper', {
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }
    });
}

// 🚀 Agregar al carrito con cantidad
function agregarAlCarrito(index) {
    let producto = productos[index];

    if (carrito[producto.nombre]) {
        carrito[producto.nombre].cantidad++;
    } else {
        carrito[producto.nombre] = { ...producto, cantidad: 1 };
    }

    actualizarCarrito();
}

// 🚀 Actualizar carrito y guardarlo en localStorage
function actualizarCarrito() {
    const lista = document.getElementById("lista-carrito");
    lista.innerHTML = "";

    Object.keys(carrito).forEach(nombre => {
        let item = carrito[nombre];
        let li = document.createElement("li");
        li.innerHTML = `
            ${item.nombre} - ${item.precio}€ x ${item.cantidad} 
            <button onclick="modificarCantidad('${item.nombre}', 1)">➕</button>
            <button onclick="modificarCantidad('${item.nombre}', -1)">➖</button>
            <button onclick="eliminarDelCarrito('${nombre}')">❌</button>
            
        `;
        lista.appendChild(li);
    });

    // Guardamos carrito en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// 🚀 Modificar cantidad de productos en el carrito
function modificarCantidad(nombre, cambio) {
    if (carrito[nombre]) {
        carrito[nombre].cantidad += cambio;

        if (carrito[nombre].cantidad <= 0) {
            delete carrito[nombre];
        }
    }
    actualizarCarrito();
}

// 🚀 Eliminar un producto del carrito
function eliminarDelCarrito(nombre) {
    delete carrito[nombre];
    actualizarCarrito();
}


// 🚀 Eliminar producto de la tienda
function eliminarProducto(index) {
    productos.splice(index, 1);
    cargarProductos();
}

// 🚀 Enviar pedido con Formspree
function enviarPedido() {
    let nombre = document.getElementById("nombre").value.trim();
    let direccion = document.getElementById("direccion").value.trim();

    if (!nombre || !direccion) {
        alert("⚠️ Por favor, ingresa tu nombre y dirección.");
        return;
    }

    if (Object.keys(carrito).length === 0) {
        alert("⚠️ El carrito está vacío.");
        return;
    }

    // Mostrar el botón de PayPal
    document.getElementById("paypal-button-container").innerHTML = ""; // Limpiar el div
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: calcularTotalCarrito() // Calcula el total del carrito
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert("✅ Pago completado por " + details.payer.name.given_name);

                // Vaciar carrito después del pago
                carrito = {};
                actualizarCarrito();

                // Redirigir a la página principal
                window.location.href = "tienda-online.html";
            });
        },
        onError: function(err) {
            console.error("❌ Error en el pago:", err);
            alert("Hubo un problema con el pago. Inténtalo de nuevo.");
        }
    }).render('#paypal-button-container'); // Renderizar el botón de PayPal
}

// Función para inicializar PayPal Smart Buttons
function iniciarPaypal() {
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: calcularTotalCarrito() // Calcula el total del carrito
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert("✅ Pago completado por " + details.payer.name.given_name);
                carrito = {}; // Vaciar carrito
                actualizarCarrito();
            });
        },
        onError: function(err) {
            console.error("❌ Error en el pago:", err);
        }
    }).render('#paypal-button-container');
}

// Función para calcular el total del carrito
function calcularTotalCarrito() {
    return Object.values(carrito).reduce((total, item) => total + (item.precio * item.cantidad), 0).toFixed(2);
}

// 🚀 Cargar productos y carrito al iniciar
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    actualizarCarrito();
});