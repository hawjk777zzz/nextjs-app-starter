Below is the detailed implementation plan in proper markdown. This plan covers all dependent files—including the data JSON, HTML, CSS, a pure JavaScript (main.js) file to generate the containers, and a Node.js server (server.js) to serve the static assets. All error handling, modern UI/UX considerations, and best practices are detailed below.

---

### 1. produtos.json  
**File Location:** /public/produtos.json  
**Purpose:** Hold the Valorant accounts data.  
**Steps & Details:**  
- Create a JSON file with sample products that include properties: id, name, rank, price, description, and image.  
- Use placeholder URLs with descriptive text and add an onerror fallback in the JS code if images fail.  
- Example Content:
  
```json
[
  {
    "id": 1,
    "name": "Valorant Account Alpha",
    "rank": "Platinum",
    "price": 49.99,
    "description": "High-level account with unlocked agents and skins.",
    "image": "https://placehold.co/400x300?text=Futuristic+Valorant+Account+Alpha"
  },
  {
    "id": 2,
    "name": "Valorant Account Beta",
    "rank": "Diamond",
    "price": 79.99,
    "description": "Premium account with exclusive skins and achievements.",
    "image": "https://placehold.co/400x300?text=Futuristic+Valorant+Account+Beta"
  }
]
```

---

### 2. index.html  
**File Location:** /public/index.html (or root served statically)  
**Purpose:** The landing page that loads CSS and main.js.  
**Steps & Details:**  
- Include standard HTML boilerplate with meta tags.  
- Link the CSS file (style.css) in the `<head>`.  
- Create a hero section with a title and subtitle describing the store.  
- Place two empty containers:
  - One with `id="products-container"` for showing available accounts.
  - Another with `id="detail-container"` for displaying the selected account details.
- At the bottom of the `<body>`, include the `<script src="main.js"></script>` reference.

Example snippet:
```html
<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Loja de Contas Valorant</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <header class="hero">
      <h1>Loja de Contas Valorant</h1>
      <p>Contas profissionais com design futurista</p>
    </header>
    <main>
      <section id="products-container" class="container"></section>
      <section id="detail-container" class="container"></section>
    </main>
    <script src="main.js"></script>
  </body>
</html>
```

---

### 3. style.css  
**File Location:** /public/style.css  
**Purpose:** Style the layout with a modern, dark, and futuristic appearance.  
**Steps & Details:**  
- Set a dark background with contrasting neon-like text and borders.
- Style the hero section (e.g., gradient background, bold typography).
- Create card styles for the products with rounded corners, hover effects, and responsive grid layouts.
- Ensure the detail container has a larger image and clear text display.

Example snippet:
```css
body {
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
  background-color: #121212;
  color: #e0e0e0;
}
.hero {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(90deg, #0d47a1, #6a1b9a, #c62828);
  color: #fff;
}
.container {
  padding: 1rem;
  margin: 1rem auto;
  max-width: 1200px;
}
#products-container {
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(250px, 1fr));
  gap: 1rem;
}
.product-card {
  background-color: #1e1e1e;
  border: 2px solid #00e5ff;
  border-radius: 8px;
  padding: 1rem;
  transition: box-shadow 0.3s ease;
  cursor: pointer;
}
.product-card:hover {
  box-shadow: 0 0 10px #00e5ff;
}
.product-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}
#detail-container {
  border: 2px solid #00e5ff;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 2rem;
}
```

---

### 4. main.js  
**File Location:** /public/main.js  
**Purpose:** Dynamically create the product cards and update the account detail container from produtos.json.  
**Steps & Details:**  
- Add a `DOMContentLoaded` event listener.
- Use the fetch API to load `/produtos.json`. Implement error handling with try–catch and status checks.
- Loop through the products; for each, create a `div` with class `product-card` containing:
  - An `<img>` element with the product image (using an onerror handler to substitute a fallback image).
  - Product name, rank, and price.
- Append each card to `#products-container`.
- Add an event listener on each card so that clicking updates `#detail-container` with full details (include larger image, full description).
- Use template literals for generating HTML content dynamically.

Example snippet:
```javascript
document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.getElementById('products-container');
  const detailContainer = document.getElementById('detail-container');

  const displayProductDetails = (product) => {
    detailContainer.innerHTML = `
      <img src="${product.image}" alt="Imagem detalhada de ${product.name}" onerror="this.src='https://placehold.co/800x600?text=Imagem+Indispon%C3%ADvel'" style="width:100%;height:auto;border-radius:4px;"/>
      <h2>${product.name}</h2>
      <p><strong>Rank:</strong> ${product.rank}</p>
      <p><strong>Preço:</strong> $${product.price.toFixed(2)}</p>
      <p>${product.description}</p>
    `;
  };

  fetch('produtos.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos.');
      }
      return response.json();
    })
    .then(products => {
      products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <img src="${product.image}" alt="Imagem de ${product.name} com design futurista" onerror="this.src='https://placehold.co/400x300?text=Imagem+Indispon%C3%ADvel'" />
          <h3>${product.name}</h3>
          <p>Rank: ${product.rank}</p>
          <p>Preço: $${product.price.toFixed(2)}</p>
        `;
        card.addEventListener('click', () => displayProductDetails(product));
        productsContainer.appendChild(card);
      });
      // Auto-display first product if available.
      if (products.length) {
        displayProductDetails(products[0]);
      }
    })
    .catch(error => {
      productsContainer.innerHTML = `<p style="color:#ff1744;">${error.message}</p>`;
    });
});
```

---

### 5. server.js  
**File Location:** /server.js  
**Purpose:** Use Node.js (with Express) to serve static assets and your index HTML.  
**Steps & Details:**  
- Create a Node.js file (server.js) in the project root.
- Import Express, serve the `/public` folder as static, and listen on a designated port (e.g., 3000).  
- Include basic error handling and logging in case the server fails.
  
Example snippet:
```javascript
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the /public directory
app.use(express.static(path.join(__dirname, 'public')));

// Fallback route for non-matching routes
app.get('*', (req, res) => {
  res.status(404).send('Página não encontrada');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

---

### 6. package.json Update  
**File Location:** /package.json  
**Steps & Details:**  
- Add a start script to run the server.
  
Example addition:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

---

### Summary  
- Created a produtos.json file in /public with sample Valorant account data.  
- Developed index.html to include a hero section and two containers, linking to style.css and main.js.  
- Designed style.css with modern, dark, futuristic UI elements using neon colors and responsive layout.  
- Implemented main.js to fetch data, generate product cards dynamically, and update a detailed container on card click.  
- Developed server.js using Express to serve static files and handle errors gracefully.  
- Updated package.json for streamlined server startup.  
This plan ensures a robust, modern, and professional Node.js website using HTML, CSS, and vanilla JavaScript.
