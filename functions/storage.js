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

    let normalized = false;
    const fixedProducts = products
      .map(product => {
        if (!product || typeof product !== "object") {
          return null;
        }

        if (!product.id) {
          normalized = true;
          return { ...product, id: crypto.randomUUID() };
        }

        return product;
      })
      .filter(Boolean);

    if (normalized) {
      saveProducts(fixedProducts);
    }

    return fixedProducts;
  } catch {
    return [];
  }
}

export function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}