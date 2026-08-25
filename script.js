// ---------- STORAGE KEYS ----------
const STORAGE_KEYS = {
    PRODUCTS: 'juicy_products',
    GALLERY: 'juicy_gallery',
    NEWS: 'juicy_news',
    SESSION: 'juicy_session'
};

// ---------- DEFAULT DATA ----------
const DEFAULT_DATA = {
    products: [
        { id: 1, name: 'Black Striped Dress', price: 89000, status: 'instock', emoji: '👗', image: 'images/black armed strips.jpeg' },
        { id: 2, name: 'Black Short Dress', price: 75000, status: 'instock', emoji: '👗', image: 'images/black short dress.jpeg' },
        { id: 3, name: 'Leopard Long Dress', price: 120000, status: 'instock', emoji: '👗', image: 'images/leopard long.jpeg' },
        { id: 4, name: 'Leopard Short Dress', price: 95000, status: 'instock', emoji: '👗', image: 'images/leopard short.jpeg' },
        { id: 5, name: 'Pink Dress', price: 82000, status: 'instock', emoji: '👗', image: 'images/jjj.jpeg' },
        { id: 6, name: 'Red Dress Slit', price: 110000, status: 'instock', emoji: '👗', image: 'images/red dress slit.jpeg' },
        { id: 7, name: 'Red Dress', price: 78000, status: 'instock', emoji: '👗', image: 'images/red.jpeg' },
        { id: 8, name: 'Short Dress', price: 65000, status: 'instock', emoji: '👗', image: 'images/short dress.jpeg' },
        { id: 9, name: 'White Dress', price: 88000, status: 'instock', emoji: '👗', image: 'images/white.jpeg' },
        { id: 10, name: 'Mirror Dress', price: 99000, status: 'instock', emoji: '👗', image: 'images/mirror.jpeg' },
        { id: 11, name: 'Leopard 3 Dress', price: 105000, status: 'outofstock', emoji: '👗', image: 'images/leopard 3.jpeg' },
        { id: 12, name: 'III Dress', price: 72000, status: 'instock', emoji: '👗', image: 'images/iii.jpeg' },
    ],
    gallery: [
        'images/bag1.jpeg', 'images/bag2.jpeg', 'images/bag3.jpeg', 'images/bag4.jpeg', 'images/bag5.jpeg',
        'images/bag6.jpeg', 'images/bag7.jpeg', 'images/bag8.jpeg', 'images/bag9.jpeg', 'images/bag10.jpeg',
        'images/bag11.jpeg', 'images/mirror.jpeg', 'images/red dress slit.jpeg', 'images/red.jpeg',
        'images/short dress.jpeg', 'images/white.jpeg'
    ],
    news: [
        { id: 1, title: '🎉 Welcome to Juicy Fashion Closet!', content: 'We are excited to launch our new collection of modern dresses and bags. Stay tuned for exclusive offers!', date: '2026-08-20' },
        { id: 2, title: '🌸 Summer Collection Now Available', content: 'Our new summer collection features vibrant colors and lightweight fabrics perfect for the warm weather. Shop now!', date: '2026-08-18' },
        { id: 3, title: '💝 Customer Appreciation Week', content: 'Enjoy 15% off on all items this week as a thank you for being part of the Juicy Fashion family.', date: '2026-08-15' },
    ]
};

// ---------- DATA MANAGEMENT ----------
function loadData() {
    // Products
    let products = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (products) {
        try { products = JSON.parse(products); } 
        catch (e) { products = JSON.parse(JSON.stringify(DEFAULT_DATA.products)); }
    } else {
        products = JSON.parse(JSON.stringify(DEFAULT_DATA.products));
    }
    products = products.map(p => ({ ...p, image: p.image || '' }));

    // Gallery
    let gallery = localStorage.getItem(STORAGE_KEYS.GALLERY);
    if (gallery) {
        try { gallery = JSON.parse(gallery); } 
        catch (e) { gallery = [...DEFAULT_DATA.gallery]; }
    } else {
        gallery = [...DEFAULT_DATA.gallery];
    }

    // News
    let news = localStorage.getItem(STORAGE_KEYS.NEWS);
    if (news) {
        try { news = JSON.parse(news); } 
        catch (e) { news = JSON.parse(JSON.stringify(DEFAULT_DATA.news)); }
    } else {
        news = JSON.parse(JSON.stringify(DEFAULT_DATA.news));
    }

    return { products, gallery, news };
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data.products));
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(data.gallery));
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(data.news));
}

// ---------- SESSION MANAGEMENT ----------
function checkSession() {
    return localStorage.getItem(STORAGE_KEYS.SESSION) === 'true';
}

function login(username, password) {
    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem(STORAGE_KEYS.SESSION, 'true');
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
}

// ---------- RENDER FUNCTIONS ----------
function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = products.map(p => {
        const imgSrc = p.image && !p.image.startsWith('data:') ? p.image : '';
        const imgHtml = imgSrc ? 
            `<img src="${imgSrc}" alt="${p.name}" onerror="this.parentElement.innerHTML='${p.emoji || '👗'}'">` : 
            (p.emoji || '👗');
        const priceFormatted = 'UGX ' + Number(p.price).toLocaleString();
        return `
            <div class="product-card" data-id="${p.id}">
                <div class="product-img">${imgHtml}</div>
                <div class="product-name">${p.name}</div>
                <div class="product-price">${priceFormatted}</div>
                <span class="product-status ${p.status === 'instock' ? 'status-instock' : 'status-outofstock'}">
                    ${p.status === 'instock' ? '✅ In stock' : '❌ Out of stock'}
                </span>
            </div>
        `;
    }).join('');
}

function renderGallery(images, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (images.length === 0) {
        container.innerHTML = `<p style="grid-column:1/-1; text-align:center; opacity:0.6; padding:40px;">No gallery images yet.</p>`;
        return;
    }

    container.innerHTML = images.map(img => {
        const src = img.startsWith('data:') ? img : img;
        return `<img src="${src}" alt="gallery image" loading="lazy" onerror="this.style.display='none'" />`;
    }).join('');
}

function renderNews(news, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (news.length === 0) {
        container.innerHTML = `<p style="text-align:center; opacity:0.6; padding:30px;">No news yet. Check back soon!</p>`;
        return;
    }

    container.innerHTML = news.map(n => `
        <div class="news-item">
            <div class="date">📅 ${n.date}</div>
            <h4>${n.title}</h4>
            <p>${n.content}</p>
        </div>
    `).join('');
}

// ---------- HERO SLIDESHOW ----------
function initHero() {
    let slideIndex = 0;
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    function showSlide(idx) {
        slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    }

    function nextSlide() {
        slideIndex = (slideIndex + 1) % slides.length;
        showSlide(slideIndex);
    }
    
    setInterval(nextSlide, 4000);
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', function() {
    // Load data
    const data = loadData();
    
    // Render products on home page
    renderProducts(data.products, 'productGrid');
    
    // Render gallery on gallery page
    renderGallery(data.gallery, 'galleryGrid');
    
    // Render news on news page
    renderNews(data.news, 'newsContainer');
    
    // Init hero slideshow
    initHero();
    
    // Check session for logout button
    if (checkSession()) {
        document.querySelectorAll('.logout-btn').forEach(btn => btn.style.display = 'inline-block');
        document.querySelectorAll('.login-btn').forEach(btn => btn.style.display = 'none');
    } else {
        document.querySelectorAll('.logout-btn').forEach(btn => btn.style.display = 'none');
        document.querySelectorAll('.login-btn').forEach(btn => btn.style.display = 'inline-block');
    }
    
    // Logout handler
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            logout();
            window.location.href = 'index.html';
        });
    });
});