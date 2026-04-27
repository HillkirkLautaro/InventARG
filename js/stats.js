import { getProducts } from "./storage.js";

function formatMoney(value) {
  return "$" + value.toLocaleString();
}

function calculateStats(products) {
  const totalProducts = products.length;

  const totalStock = products.reduce((acc, product) => acc + product.stock, 0);

  let totalValue = 0;
  for (const product of products) {
    totalValue += product.price * product.stock;
  }

  const maxPriceProduct = products.reduce((max, product) => product.price > (max?.price || 0) ? product : max, null);

  const lowStock = products.filter(product => product.stock < 5).length;

  return {
    totalProducts,
    totalStock,
    totalValue,
    maxPriceProduct,
    lowStock
  };
}

function renderStats() {
  const products = getProducts(); // Asegúrate de que esta línea llame correctamente a la función getProducts()
  const stats = calculateStats(products);

  const totalProductsElement = document.getElementById("total-products");
  totalProductsElement.textContent = stats.totalProducts;

  const totalStockElement = document.getElementById("total-stock");
  totalStockElement.textContent = stats.totalStock;

  const totalValueElement = document.getElementById("total-value");
  totalValueElement.textContent = formatMoney(stats.totalValue);

  const maxPriceElement = document.getElementById("max-price");
  maxPriceElement.textContent = stats.maxPriceProduct ? `${stats.maxPriceProduct.name} ($${stats.maxPriceProduct.price})` : "-";

  const lowStockElement = document.getElementById("low-stock");
  lowStockElement.textContent = stats.lowStock;
}
renderStats();