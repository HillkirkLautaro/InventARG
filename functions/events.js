import { getProducts, saveProducts } from "./storage.js";
import { renderProducts } from "./ui.js";

export function initEvents() {
  const form = document.getElementById("product-form");
  const cancelEditButton = document.getElementById("cancel-edit");
  const submitButton = form.querySelector("button[type=submit]");
  let currentEditId = null;

  function resetForm() {
    currentEditId = null;
    form.reset();
    submitButton.textContent = "Agregar";
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
    renderProducts(products);
    resetForm();
  });

  cancelEditButton.addEventListener("click", () => {
    resetForm();
  });

  document.addEventListener("click", e => {
    if (e.target.classList.contains("delete")) {
      const id = e.target.dataset.id;
      let products = getProducts();

      products = products.filter(p => p.id !== id);

      saveProducts(products);
      renderProducts(products);
      if (currentEditId === id) {
        resetForm();
      }
    }

    if (e.target.classList.contains("edit")) {
      const id = e.target.dataset.id;
      const products = getProducts();
      const product = products.find(p => p.id === id);

      if (!product) {
        return;
      }

      form.name.value = product.name;
      form.price.value = product.price;
      form.stock.value = product.stock;
      currentEditId = id;
      submitButton.textContent = "Guardar cambios";
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