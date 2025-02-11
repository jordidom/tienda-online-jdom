// Lista de productos (puedes agregar más fácilmente)
const productos = [
    { nombre: "Alas de Sangre", precio: 10, imagen: "https://th.bing.com/th/id/R.03b9e056c03cf190fbe5bd694503daf1?rik=ziP6zZRfpuztOw&riu=http%3a%2f%2fsarasvatilibreria.com%2fcdn%2fshop%2fproducts%2falas-de-sangre-empireo-1-rebecca-yarros-241358.jpg%3fv%3d1701722208&ehk=Zh9FkgVk0vCZ0AVu3L4qypTLAlAR4jjNrNbpIYkipv4%3d&risl=&pid=ImgRaw&r=0" },
    { nombre: "Alas de Hierro", precio: 15, imagen: "https://www.contalles.es/wp-content/uploads/2024/02/alas-de-hierro-contalles-benidorm-1a-edicion.jpg" },
    { nombre: "Alas de Ónix", precio: 20, imagen: "https://www.uniminutoradio.com.co/wp-content/uploads/2025/02/alas-de-onix-empireo-3_9788408297079_3d_202411290947.png" },
    { nombre: "La chica de nieve", precio: 25, imagen: "https://http2.mlstatic.com/D_NQ_NP_803851-MLC43731697392_102020-F.jpg" }
];

// Recuperamos carrito del localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// 🚀 Cargar productos dinámicamente
function cargarProductos() {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    productos.forEach((producto, index) => {
        let div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h2>${producto.nombre}</h2>
            <p class="precio">${producto.precio}€</p>
            <button onclick="agregarAlCarrito(${index})">Añadir al carrito</button>
        `;
        contenedor.appendChild(div);
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

    let pedidoTexto = Object.values(carrito)
        .map(item => `${item.nombre} - ${item.precio}€ x ${item.cantidad}`)
        .join("\n");

    document.getElementById("pedidoInput").value = pedidoTexto;
    document.getElementById("nombreInput").value = nombre;
    document.getElementById("direccionInput").value = direccion;

    document.getElementById("formularioPedido").submit();

    alert("✅ Pedido enviado correctamente.");
    carrito = {};
    actualizarCarrito();
    document.getElementById("datosCliente").reset();
}

// 🚀 Cargar productos y carrito al iniciar
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    actualizarCarrito();
});