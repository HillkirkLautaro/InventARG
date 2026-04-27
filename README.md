# 📦 InventARG

InventARG es una aplicación web simple de gestión de inventario construida con **HTML, CSS y JavaScript puro**, desplegada en GitHub Pages.

👉 Demo en vivo: https://hillkirklautaro.github.io/InventARG/

---

## 🚀 Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- LocalStorage (persistencia de datos)
- GitHub Pages para deploy

---

## 📌 Características

- Agregar productos al inventario
- Editar y eliminar productos
- Persistencia de datos usando LocalStorage
- Interfaz simple y ligera
- Funciona completamente en el navegador (sin backend)
- Busqueda por nombre
- Busqueda por categoria
- Modo oscuro
- Importacion/Exportacion de JSON
- Pagina con Estadisticas de Productos
- PWA
---

## 💾 Cómo funciona

La aplicación guarda los datos en el navegador del usuario mediante **localStorage**, lo que permite:

- Mantener el inventario aunque se recargue la página
- No depender de servidores o bases de datos
- Uso offline básico

⚠️ Los datos se almacenan localmente y pueden ser modificados o eliminados desde el navegador.

---

## 🧠 Objetivo del proyecto

Este proyecto fue creado con fines de:

- Práctica de desarrollo frontend
- Manejo del DOM con JavaScript
- Uso de almacenamiento local (LocalStorage)
- Despliegue con GitHub Pages

---

## 📈 Posibles mejoras futuras

- Sistema de usuarios y login
- Backend con base de datos real
- Exportación de inventario (CSV / JSON)
- Filtros y búsqueda avanzada
- Diseño responsive mejorado
- Historial de movimientos

---

## 📦 Importación de productos (JSON)

InventARG permite importar productos desde un archivo JSON para cargar datos de forma masiva.

### 📄 Formato requerido

El archivo debe ser un **array de objetos**, donde cada objeto representa un producto:

```json
[
  {
    "id": "9f1c2b3a-4d5e-6f7a-8b9c-123456789abc",
    "name": "Creatina Monohidratada",
    "category": "Suplementos",
    "price": 12000,
    "stock": 25
  },
  {
    "id": "a8d91f2c-3b4e-4c5d-9a6f-112233445566",
    "name": "Proteína Whey",
    "category": "Suplementos",
    "price": 25000,
    "stock": 10
  },
  {
    "id": "c1b2d3e4-f567-8901-abcd-ef2345678901",
    "name": "Shaker Fitness",
    "category": "Accesorios",
    "price": 5000,
    "stock": 40
  },
  {
    "id": "f0e1d2c3-b4a5-6789-1234-abcdef987654",
    "name": "BCAA",
    "category": "Suplementos",
    "price": 18000,
    "stock": 15
  }
]
---

## 👨‍💻 Autor

**HillkirkLautaro**

- GitHub: https://github.com/HillkirkLautaro

---

## 📄 Licencia

Este proyecto es de uso libre para fines educativos y personales.
