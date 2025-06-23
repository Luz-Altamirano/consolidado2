const carrito = [];
const lista = document.getElementById("items-carrito");
const total = document.getElementById("total");

document.querySelectorAll('.agregar-carrito').forEach(boton => {
  boton.addEventListener('click', () => {
    const nombre = boton.getAttribute('data-nombre');
    const precio = parseFloat(boton.getAttribute('data-precio'));

    const figura = boton.closest('figure');
    const imgSrc = figura.querySelector('img').getAttribute('src');

    carrito.push({ nombre, precio, imagen: imgSrc });

    actualizarCarrito();
  });
});

function actualizarCarrito() {
  lista.innerHTML = "";
  let totalCompra = 0;

  carrito.forEach((producto, index) => {
    const item = document.createElement('li');
    item.innerHTML = `
      <img src="${producto.imagen}" width="40" style="vertical-align: middle; margin-right: 10px;">
      ${producto.nombre} - $${producto.precio.toFixed(2)}
      <button class="eliminar-item" style="margin-left: 10px; color: red;">Eliminar</button>
    `;
    
    
    item.querySelector(".eliminar-item").addEventListener("click", function () {
      carrito.splice(index, 1);  
      actualizarCarrito();       
    });

    lista.appendChild(item);
    totalCompra += producto.precio;
  });
  
  total.textContent = totalCompra.toFixed(2);
}


document.getElementById("finalizar-compra").addEventListener("click", function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const cliente = document.getElementById("cliente").value || "Cliente desconocido";
  const items = document.querySelectorAll("#items-carrito li");
  let total = document.getElementById("total").textContent;

  //boleta
  doc.setFillColor(240, 248, 255); 
  doc.rect(0, 0, 210, 297, "F"); 

  // Título con color
  doc.setFontSize(20);
  doc.setTextColor(0, 102, 204); // azul fuerte
  doc.text("Boleta de Compra", 70, 20);


  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); 
  doc.text("Cliente: " + cliente, 20, 30);

  let y = 40;
  doc.setFillColor(0, 102, 204);
  doc.setTextColor(255, 255, 255);
  doc.rect(20, y - 6, 170, 10, "F");
  doc.text("Producto", 25, y);
  doc.text("Precio", 160, y);


  y += 10;
  doc.setTextColor(0, 0, 0); 
  items.forEach((item) => {
    const texto = item.textContent;
    const partes = texto.split(" - $");
    if (partes.length === 2) {
      doc.text(partes[0], 25, y);
      doc.text(`$${partes[1]}`, 160, y);
      y += 10;
    }
  });

  // Total
  y += 10;
  doc.setFontSize(14);
  doc.setTextColor(0, 102, 0); 
  doc.text("Total: $" + total, 25, y);

  doc.save("boleta.pdf");

});