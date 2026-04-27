export function renderProducts(products) {
  const list = document.getElementById("product-list");
  list.innerHTML = "";

  if (products.length === 0) {
    const empty = document.createElement("li");
    empty.className = "no-products";
    empty.textContent = "No hay productos. Agrega uno para verlo aquí.";
    list.appendChild(empty);
    return;
  }

  products.forEach(p => {
    const item = document.createElement("li");
    item.className = "product-item";
    item.innerHTML = `
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>Precio: $${p.price}</p>
        <p>Stock: ${p.stock}</p>
      </div>
      <div class="product-actions">
        <button type="button" data-id="${p.id}" class="stock-remove">-</button>
        <button type="button" data-id="${p.id}" class="stock-add">+</button>
        <button type="button" data-id="${p.id}" class="edit">Editar</button>
        <button type="button" data-id="${p.id}" class="delete">Eliminar</button>
      </div>
      
    `;
    list.appendChild(item);
  });
}