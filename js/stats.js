import { getProducts } from "./storage.js";

function formatMoney(value) {
  return "$" + value.toLocaleString();
}

function calculateStats(products) {
  const totalProducts = products.length;

  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);

  const totalValue = products.reduce(
    (acc, p) => acc + p.price * p.stock,
    0
  );

  const maxPriceProduct = products.reduce((max, p) =>
    p.price > (max?.price || 0) ? p : max,
    null
  );

  const lowStock = products.filter(p => p.stock < 5).length;

  return {
    totalProducts,
    totalStock,
    totalValue,
    maxPriceProduct,
    lowStock
  };
}

function renderStats() {
  const products = getProducts();
  const stats = calculateStats(products);

  document.getElementById("total-products").textContent = stats.totalProducts;
  document.getElementById("total-stock").textContent = stats.totalStock;
  document.getElementById("total-value").textContent = formatMoney(stats.totalValue);

  document.getElementById("max-price").textContent =
    stats.maxPriceProduct
      ? `${stats.maxPriceProduct.name} ($${stats.maxPriceProduct.price})`
      : "-";

  document.getElementById("low-stock").textContent = stats.lowStock;
}

renderStats();