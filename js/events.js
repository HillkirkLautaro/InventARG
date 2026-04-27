import { getProducts, saveProducts } from "./storage.js";
import { renderProducts } from "./ui.js";

export function initEvents() {
  const form = document.getElementById("product-form");
  const cancelEditButton = document.getElementById("cancel-edit");
  const searchInput = document.getElementById("product-search");
  const searchToggleNameButton = document.getElementById("search-toggle-name");
  const searchToggleCategoryButton = document.getElementById("search-toggle-category");
  const submitButton = form.querySelector("button[type=submit]");
  let currentEditId = null;
  let searchMode = "name";

  function resetForm() {
    currentEditId = null;
    form.reset();
    submitButton.textContent = "Agregar";
  }

  function renderFilteredProducts() {
    const query = searchInput.value.trim().toLowerCase();
    const products = getProducts();
    const filtered = query
      ? products.filter(product => {
          if (searchMode === "category") {
            return product.category?.toLowerCase().includes(query);
          }

          return product.name.toLowerCase().includes(query);
        })
      : products;

    renderProducts(filtered);
  }

  form.addEventListener("submit", e => {
    e.preventDefault();

    const name = form.name.value.trim();
    const category = form.category.value.trim();
    const price = Number(form.price.value);
    const stock = Number(form.stock.value);
    const products = getProducts();

    if (currentEditId !== null) {
      const index = products.findIndex(p => p.id === currentEditId);
      if (index !== -1) {
        products[index] = { id: currentEditId, name, category, price, stock };
      }
    } else {
      products.push({
        id: crypto.randomUUID(),
        name,
        category,
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

  function openSearch(mode) {
    searchMode = mode;
    searchInput.placeholder = mode === "category" ? "Buscar por categoría" : "Buscar por nombre";
    searchInput.classList.remove("hidden");
    searchToggleNameButton?.classList.add("hidden");
    searchToggleCategoryButton?.classList.add("hidden");
    searchInput.focus();
  }

  if (searchToggleNameButton) {
    searchToggleNameButton.addEventListener("click", () => openSearch("name"));
  }

  if (searchToggleCategoryButton) {
    searchToggleCategoryButton.addEventListener("click", () => openSearch("category"));
  }

  searchInput.addEventListener("input", () => {
    renderFilteredProducts();
  });

  searchInput.addEventListener("blur", () => {
    searchInput.classList.add("hidden");
    searchToggleNameButton?.classList.remove("hidden");
    searchToggleCategoryButton?.classList.remove("hidden");
  });

  const exportButton = document.getElementById("export-json");
  const importButton = document.getElementById("import-json");
  const importFileInput = document.getElementById("import-file");

  function downloadProducts() {
    const products = getProducts();
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");

    link.href = url;
    link.download = `inventarg-products-${timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function parseImportedProducts(fileText) {
    try {
      const products = JSON.parse(fileText);

      if (!Array.isArray(products)) {
        return null;
      }

      return products
        .filter(product => product && typeof product === "object")
        .map(product => ({
          id: product.id || crypto.randomUUID(),
          name: String(product.name || "").trim(),
          category: String(product.category || "").trim(),
          price: Number(product.price || 0),
          stock: Number(product.stock || 0)
        }))
        .filter(product => product.name.length > 0);
    } catch {
      return null;
    }
  }

  function importProducts(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imported = parseImportedProducts(String(reader.result || ""));

      if (!imported) {
        alert("El archivo no contiene un JSON válido de productos.");
        importFileInput.value = "";
        return;
      }

      saveProducts(imported);
      renderFilteredProducts();
      importFileInput.value = "";
      alert("Importación completada correctamente.");
    };
    reader.onerror = () => {
      alert("No se pudo leer el archivo seleccionado.");
      importFileInput.value = "";
    };
    reader.readAsText(file);
  }

  if (exportButton) {
    exportButton.addEventListener("click", downloadProducts);
  }

  if (importButton) {
    importButton.addEventListener("click", () => importFileInput?.click());
  }

  importFileInput?.addEventListener("change", importProducts);

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
          <input type="text" class="edit-category" value="${product.category || ""}" />
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
      const categoryInput = item.querySelector(".edit-category");
      const priceInput = item.querySelector(".edit-price");
      const stockInput = item.querySelector(".edit-stock");
      const name = nameInput?.value.trim();
      const category = categoryInput?.value.trim();
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

      products[index] = { ...products[index], name, category, price, stock };
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