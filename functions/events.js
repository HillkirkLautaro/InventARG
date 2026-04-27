import { getProducts, saveProducts } from "./storage.js";
import { renderProducts } from "./ui.js";

export function initEvents() {
  const form = document.getElementById("product-form");
  const cancelEditButton = document.getElementById("cancel-edit");
  const searchInput = document.getElementById("product-search");
  const submitButton = form.querySelector("button[type=submit]");
  let currentEditId = null;

  function resetForm() {
    currentEditId = null;
    form.reset();
    submitButton.textContent = "Agregar";
  }

  function renderFilteredProducts() {
    const query = searchInput.value.trim().toLowerCase();
    const products = getProducts();
    const filtered = query
      ? products.filter(product => product.name.toLowerCase().includes(query))
      : products;

    renderProducts(filtered);
  }

  form.addEventListener("submit", e => {
    e.preventDefault();

    const name = form.name.value.trim();
    const price = Number(form.price.value);
    const stock = Number(form.stock.value);
    const products = getProducts();

    if (currentEditId !== null) {
      const index = products.findIndex(p => p.id === currentEditId);
      if (index !== -1) {
        products[index] = { id: currentEditId, name, price, stock };
      }
    } else {
      products.push({
        id: crypto.randomUUID(),
        name,
        price,
        stock
      });
    }

    saveProducts(products);
    renderFilteredProducts();
    resetForm();
  });

  cancelEditButton.addEventListener("click", () => {
    resetForm();
  });

  searchInput.addEventListener("input", () => {
    renderFilteredProducts();
  });

  document.addEventListener("click", e => {
    if (e.target.classList.contains("delete")) {
      const id = e.target.dataset.id;
      let products = getProducts();

      products = products.filter(p => p.id !== id);

      saveProducts(products);
      renderFilteredProducts();
      if (currentEditId === id) {
        resetForm();
      }
    }

    if (e.target.classList.contains("stock-add") || e.target.classList.contains("stock-remove")) {
      const id = e.target.dataset.id;
      const products = getProducts();
      const index = products.findIndex(p => p.id === id);

      if (index === -1) {
        return;
      }

      const delta = e.target.classList.contains("stock-add") ? 1 : -1;
      const currentStock = Number(products[index].stock || 0);
      products[index].stock = Math.max(0, currentStock + delta);

      saveProducts(products);
      renderFilteredProducts();
      return;
    }

    if (e.target.classList.contains("edit")) {
      const id = e.target.dataset.id;
      const products = getProducts();
      const product = products.find(p => p.id === id);

      if (!product) {
        return;
      }

      const item = e.target.closest(".product-item");
      if (!item) {
        return;
      }

      item.innerHTML = `
        <div class="product-edit">
          <input type="text" class="edit-name" value="${product.name}" />
          <input type="number" class="edit-price" min="0" value="${product.price}" />
          <input type="number" class="edit-stock" min="0" value="${product.stock}" />
        </div>
        <div class="product-actions">
          <button type="button" data-id="${id}" class="save-inline">Guardar</button>
          <button type="button" data-id="${id}" class="cancel-inline">Cancelar</button>
        </div>
      `;

      return;
    }

    if (e.target.classList.contains("save-inline")) {
      const id = e.target.dataset.id;
      const item = e.target.closest(".product-item");
      if (!item) {
        return;
      }

      const nameInput = item.querySelector(".edit-name");
      const priceInput = item.querySelector(".edit-price");
      const stockInput = item.querySelector(".edit-stock");
      const name = nameInput?.value.trim();
      const price = Number(priceInput?.value);
      const stock = Number(stockInput?.value);

      if (!name || Number.isNaN(price) || Number.isNaN(stock)) {
        return;
      }

      const products = getProducts();
      const index = products.findIndex(p => p.id === id);
      if (index === -1) {
        return;
      }

      products[index] = { ...products[index], name, price, stock };
      saveProducts(products);
      renderFilteredProducts();
      return;
    }

    if (e.target.classList.contains("cancel-inline")) {
      renderFilteredProducts();
      return;
    }

    if (e.target.classList.contains("increment") || e.target.classList.contains("decrement")) {
      const id = e.target.dataset.id;
      const products = getProducts();
      const index = products.findIndex(p => p.id === id);

      if (index === -1) {
        return;
      }

      const change = e.target.classList.contains("increment") ? 1 : -1;
      const newStock = products[index].stock + change;
      products[index] = {
        ...products[index],
        stock: newStock < 0 ? 0 : newStock
      };

      saveProducts(products);
      renderProducts(products);

      if (currentEditId === id) {
        form.stock.value = products[index].stock;
      }
    }
  });
}