import { getProducts } from "./storage.js";
import { renderProducts } from "./ui.js";
import { initEvents } from "./events.js";

const products = getProducts();
renderProducts(products);
initEvents();