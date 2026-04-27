import { getProducts } from "./storage.js";
import { renderProducts } from "./ui.js";
import { initEvents } from "./events.js";

const products = getProducts();
renderProducts(products);
initEvents();

const themeToggle = document.querySelector("#theme-toggle");

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark", isDark);

  if (themeToggle) {
    themeToggle.textContent = isDark ? "Modo claro" : "Modo oscuro";
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  if (themeToggle) {
    themeToggle.textContent = isDark ? "Modo claro" : "Modo oscuro";
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
}

initTheme();