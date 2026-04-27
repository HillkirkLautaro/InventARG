function generateId() {
  if (crypto?.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString();
}

export function getProducts() {
  const raw = localStorage.getItem("products");

  if (!raw) {
    return [];
  }

  try {
    const products = JSON.parse(raw);

    if (!Array.isArray(products)) {
      return [];
    }

    const fixedProducts = products
      .map(product => {
        if (!product || typeof product !== "object") return null;

        const name = String(product.name || "").trim();

        // si no tiene nombre, lo descartamos
        if (!name) return null;

        return {
          id: product.id || generateId(),
          name,
          category: String(product.category || "").trim(),
          price: Number(product.price || 0),
          stock: Number(product.stock || 0)
        };
      })
      .filter(Boolean);

    return fixedProducts;
  } catch (error) {
    console.error("Error parsing products from localStorage:", error);
    return [];
  }
}

export function saveProducts(products) {
  if (!Array.isArray(products)) {
    console.warn("saveProducts recibió un valor inválido");
    return;
  }

  localStorage.setItem("products", JSON.stringify(products));
}