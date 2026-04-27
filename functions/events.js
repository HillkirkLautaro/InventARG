import { getProducts, saveProducts } from "./storage.js";
import { renderProducts } from "./ui.js";

export function initEvents() {
  const form = document.getElementById("product-form");

  form.addEventListener("submit", e => {
    e.preventDefault();

    const name = form.name.value;
    const price = Number(form.price.value);
    const stock = Number(form.stock.value);

    const products = getProducts();

    products.push({
      id: crypto.randomUUID(),
      name,
      price,
      stock
    });

    saveProducts(products);
    renderProducts(products);

    form.reset();
  });

  document.addEventListener("click", e => {
    if (e.target.classList.contains("delete")) {
      const id = e.target.dataset.id;
      let products = getProducts();

      products = products.filter(p => p.id !== id);

      saveProducts(products);
      renderProducts(products);
    }
  });
}