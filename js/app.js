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

const goStatsButton = document.getElementById("go-stats");

goStatsButton.addEventListener("click", function() {
  window.location.href = "stats.html";
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/InventARG/sw.js")
      .then((reg) => {
        console.log("SW registrado:", reg.scope);
      })
      .catch((err) => {
        console.log("Error SW:", err);
      });
  });
}

initTheme();