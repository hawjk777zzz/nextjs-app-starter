// Estado global da aplicação
let allProducts = [];
let filteredProducts = [];
let selectedProduct = null;

// Elementos DOM
const loadingScreen = document.getElementById('loading-screen');
const productsGrid = document.getElementById('products-grid');
const productDetails = document.getElementById('product-details');
const noProductsMessage = document.getElementById('no-products');
const rankFilter = document.getElementById('rank-filter');
const priceFilter = document.getElementById('price-filter');
const priceDisplay = document.getElementById('price-display');
const clearFiltersBtn = document.getElementById('clear-filters');

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Função principal de inicialização
async function initializeApp() {
    try {
        // Simular loading
        await simulateLoading();
        
        // Carregar produtos
        await loadProducts();
        
        // Configurar event listeners
        setupEventListeners();
        
        // Renderizar produtos iniciais
        renderProducts();
        
        // Remover tela de loading
        hideLoadingScreen();
        
        // Selecionar primeiro produto automaticamente
        if (allProducts.length > 0) {
            selectProduct(allProducts[0]);
        }
        
    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
        showError('Erro ao carregar a loja. Tente recarregar a página.');
        hideLoadingScreen();
    }
}

// Simular loading para melhor UX
function simulateLoading() {
    return new Promise(resolve => {
        const progressBar = document.querySelector('.loading-progress');
        let progress = 0;
        
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(resolve, 500);
            }
            progressBar.style.width = `${progress}%`;
        }, 100);
    });
}

// Carregar produtos do JSON
async function loadProducts() {
    try {
        const response = await fetch('/produtos.json');
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
            throw new Error('Formato de dados inválido');
        }
        
        allProducts = data;
        filteredProducts = [...allProducts];
        
        console.log(`✅ ${allProducts.length} produtos carregados com sucesso`);
        
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        throw new Error('Não foi possível carregar os produtos');
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Filtros
    rankFilter.addEventListener('change', applyFilters);
    priceFilter.addEventListener('input', updatePriceDisplay);
    priceFilter.addEventListener('change', applyFilters);
    clearFiltersBtn.addEventListener('click', clearFilters);
    
    // Scroll suave para seção de produtos
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            document.querySelector('.products-section').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    // Animações de scroll
    setupScrollAnimations();
}

// Atualizar display do preço
function updatePriceDisplay() {
    const value = priceFilter.value;
    priceDisplay.textContent = `R$ ${value}`;
}

// Aplicar filtros
function applyFilters() {
    const selectedRank = rankFilter.value.toLowerCase();
    const maxPrice = parseFloat(priceFilter.value);
    
    filteredProducts = allProducts.filter(product => {
        const matchesRank = !selectedRank || 
            product.rank.toLowerCase().includes(selectedRank);
        const matchesPrice = product.price <= maxPrice;
        
        return matchesRank && matchesPrice;
    });
    
    renderProducts();
    
    // Se o produto selecionado não está mais nos filtros, limpar seleção
    if (selectedProduct && !filteredProducts.find(p => p.id === selectedProduct.id)) {
        clearSelection();
    }
}

// Limpar filtros
function clearFilters() {
    rankFilter.value = '';
    priceFilter.value = 600;
    updatePriceDisplay();
    filteredProducts = [...allProducts];
    renderProducts();
}

// Renderizar produtos no grid
function renderProducts() {
    if (filteredProducts.length === 0) {
        productsGrid.style.display = 'none';
        noProductsMessage.style.display = 'block';
        return;
    }
    
    productsGrid.style.display = 'grid';
    noProductsMessage.style.display = 'none';
    
    productsGrid.innerHTML = filteredProducts.map(product => 
        createProductCard(product)
    ).join('');
    
    // Adicionar event listeners aos cards
    const productCards = productsGrid.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            selectProduct(filteredProducts[index]);
        });
    });
    
    // Animar entrada dos cards
    animateProductCards();
}

// Criar HTML do card do produto
function createProductCard(product) {
    const isSelected = selectedProduct && selectedProduct.id === product.id;
    
    return `
        <div class="product-card ${isSelected ? 'selected' : ''}" data-product-id="${product.id}">
            <img 
                src="${product.image}" 
                alt="Imagem da ${product.name} com design futurista"
                class="product-image"
                onerror="this.src='https://placehold.co/400x300?text=Imagem+Indispon%C3%ADvel'"
                loading="lazy"
            />
            <h3 class="product-name">${product.name}</h3>
            <span class="product-rank">${product.rank}</span>
            <div class="product-price">R$ ${product.price.toFixed(2)}</div>
            <p class="product-description">${truncateText(product.description, 80)}</p>
        </div>
    `;
}

// Selecionar produto e mostrar detalhes
function selectProduct(product) {
    selectedProduct = product;
    
    // Atualizar visual dos cards
    const cards = productsGrid.querySelectorAll('.product-card');
    cards.forEach(card => {
        const productId = parseInt(card.dataset.productId);
        card.classList.toggle('selected', productId === product.id);
    });
    
    // Renderizar detalhes
    renderProductDetails(product);
    
    // Scroll suave para detalhes em mobile
    if (window.innerWidth <= 1200) {
        document.querySelector('.details-container').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Renderizar detalhes do produto
function renderProductDetails(product) {
    productDetails.innerHTML = `
        <img 
            src="${product.image}" 
            alt="Imagem detalhada da ${product.name}"
            class="details-image"
            onerror="this.src='https://placehold.co/800x600?text=Imagem+Indispon%C3%ADvel'"
        />
        
        <h2 class="details-name">${product.name}</h2>
        <span class="details-rank">${product.rank}</span>
        <div class="details-price">R$ ${product.price.toFixed(2)}</div>
        <p class="details-description">${product.description}</p>
        
        <div class="details-info">
            <div class="info-item">
                <span class="info-label">Nível da Conta:</span>
                <span class="info-value">${product.nivel}</span>
            </div>
            
            <div class="info-item">
                <span class="info-label">Valorant Points:</span>
                <span class="info-value">${product.vp.toLocaleString()} VP</span>
            </div>
            
            <div class="info-item">
                <span class="info-label">Radianite Points:</span>
                <span class="info-value">${product.rp.toLocaleString()} RP</span>
            </div>
            
            <div class="info-item">
                <span class="info-label">Região:</span>
                <span class="info-value">${product.regiao}</span>
            </div>
            
            <div class="info-item">
                <span class="info-label">Agentes:</span>
                <div class="agents-list">
                    ${Array.isArray(product.agentes) 
                        ? product.agentes.map(agent => `<span class="agent-tag">${agent}</span>`).join('')
                        : `<span class="agent-tag">${product.agentes}</span>`
                    }
                </div>
            </div>
            
            <div class="info-item">
                <span class="info-label">Skins:</span>
                <div class="skins-list">
                    ${product.skins.map(skin => `<span class="skin-tag">${skin}</span>`).join('')}
                </div>
            </div>
        </div>
        
        <div style="margin-top: 2rem; text-align: center;">
            <button class="btn-purchase" onclick="showPurchaseInfo('${product.name}')">
                💎 Comprar Agora
            </button>
        </div>
    `;
    
    // Adicionar estilo do botão de compra
    if (!document.querySelector('#purchase-btn-style')) {
        const style = document.createElement('style');
        style.id = 'purchase-btn-style';
        style.textContent = `
            .btn-purchase {
                background: linear-gradient(135deg, var(--accent-green), var(--accent-blue));
                border: none;
                color: var(--primary-bg);
                padding: 1rem 2rem;
                border-radius: 12px;
                font-family: var(--font-primary);
                font-size: 1.1rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 1px;
                box-shadow: 0 4px 20px rgba(0, 255, 136, 0.3);
            }
            
            .btn-purchase:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 30px rgba(0, 255, 136, 0.5);
            }
            
            .btn-purchase:active {
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
}

// Limpar seleção
function clearSelection() {
    selectedProduct = null;
    
    // Remover classe selected de todos os cards
    const cards = productsGrid.querySelectorAll('.product-card');
    cards.forEach(card => card.classList.remove('selected'));
    
    // Mostrar placeholder
    productDetails.innerHTML = `
        <div class="details-placeholder">
            <div class="placeholder-icon">👆</div>
            <h3>Selecione uma conta</h3>
            <p>Clique em uma conta ao lado para ver todos os detalhes, agentes, skins e informações completas.</p>
        </div>
    `;
}

// Mostrar informações de compra
function showPurchaseInfo(productName) {
    alert(`🎮 Interessado na ${productName}?\n\n📧 Entre em contato:\n• Discord: LojaValorant#1234\n• WhatsApp: (11) 99999-9999\n• Email: contato@lojavalorant.com\n\n💎 Pagamento seguro e entrega imediata!`);
}

// Animar cards dos produtos
function animateProductCards() {
    const cards = productsGrid.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Configurar animações de scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const animateElements = document.querySelectorAll('.feature-card, .section-title');
    animateElements.forEach(el => observer.observe(el));
    
    // Adicionar CSS para animações
    if (!document.querySelector('#scroll-animations')) {
        const style = document.createElement('style');
        style.id = 'scroll-animations';
        style.textContent = `
            .feature-card, .section-title {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease;
            }
            
            .feature-card.animate-in, .section-title.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
}

// Remover tela de loading
function hideLoadingScreen() {
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 500);
}

// Mostrar erro
function showError(message) {
    productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--accent-pink);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
            <h3>Erro ao carregar</h3>
            <p>${message}</p>
            <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--accent-blue); border: none; border-radius: 8px; color: white; cursor: pointer;">
                Tentar Novamente
            </button>
        </div>
    `;
}

// Truncar texto
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Utilitários para debugging
window.debugApp = {
    products: () => allProducts,
    filtered: () => filteredProducts,
    selected: () => selectedProduct,
    reload: () => location.reload()
};

// Log de inicialização
console.log('🎮 Loja Valorant - Sistema carregado');
console.log('💡 Use window.debugApp para debugging');
