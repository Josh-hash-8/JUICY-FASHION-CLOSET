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
        { id: 5, name: 'Maroon Dress', price: 82000, status: 'instock', emoji: '👗', image: 'images/maroon.jpeg' },
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
    let products = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (products) {
        try { products = JSON.parse(products); } 
        catch (e) { products = JSON.parse(JSON.stringify(DEFAULT_DATA.products)); }
    } else {
        products = JSON.parse(JSON.stringify(DEFAULT_DATA.products));
    }
    products = products.map(p => ({ ...p, image: p.image || '' }));

    let gallery = localStorage.getItem(STORAGE_KEYS.GALLERY);
    if (gallery) {
        try { gallery = JSON.parse(gallery); } 
        catch (e) { gallery = [...DEFAULT_DATA.gallery]; }
    } else {
        gallery = [...DEFAULT_DATA.gallery];
    }

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

// ---------- SESSION CHECK ----------
function checkSession() {
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (session !== 'true') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// ---------- RENDER FUNCTIONS ----------
function renderAdminProducts(data) {
    const list = document.getElementById('adminItemList');
    if (!list) return;

    list.innerHTML = data.products.map(p => {
        const priceFormatted = 'UGX ' + Number(p.price).toLocaleString();
        return `
            <div class="admin-item" data-id="${p.id}">
                <div class="info">
                    <span class="name">${p.emoji || '👗'} ${p.name}</span>
                    <span class="price">${priceFormatted}</span>
                </div>
                <div class="actions">
                    <button class="toggle-btn ${p.status === 'instock' ? 'instock' : 'outofstock'}" data-id="${p.id}">
                        ${p.status === 'instock' ? 'In stock' : 'Out of stock'}
                    </button>
                    <button class="delete-btn" data-id="${p.id}" title="Delete product"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    }).join('');

    // Toggle stock
    document.querySelectorAll('#adminItemList .toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const product = data.products.find(p => p.id === id);
            if (product) {
                product.status = product.status === 'instock' ? 'outofstock' : 'instock';
                saveData(data);
                renderAll(data);
            }
        });
    });

    // Delete product
    document.querySelectorAll('#adminItemList .delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            if (confirm('Delete this product?')) {
                data.products = data.products.filter(p => p.id !== id);
                saveData(data);
                renderAll(data);
            }
        });
    });
}

function renderAdminGallery(data) {
    const adminList = document.getElementById('galleryAdminList');
    if (!adminList) return;

    if (data.gallery.length === 0) {
        adminList.innerHTML = `<p style="opacity:0.6;">No images in gallery.</p>`;
    } else {
        adminList.innerHTML = data.gallery.map((img, index) => {
            const src = img.startsWith('data:') ? img.substring(0, 40) + '...' : img;
            return `
                <div class="admin-item">
                    <span style="font-size:0.9rem; flex:1;">📷 ${src}</span>
                    <button class="delete-btn" data-index="${index}" title="Remove image"><i class="fas fa-trash"></i></button>
                </div>
            `;
        }).join('');

        document.querySelectorAll('#galleryAdminList .delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                if (confirm('Remove this image from gallery?')) {
                    data.gallery.splice(index, 1);
                    saveData(data);
                    renderAll(data);
                }
            });
        });
    }

    const list = document.getElementById('galleryFileList');
    if (list) {
        list.innerHTML = `<i class="fas fa-check-circle" style="color:#b85f48;"></i> ${data.gallery.length} image(s) in gallery.`;
    }
}

function renderAdminNews(data) {
    const adminList = document.getElementById('newsAdminList');
    if (!adminList) return;

    if (data.news.length === 0) {
        adminList.innerHTML = `<p style="opacity:0.6;">No news items.</p>`;
    } else {
        adminList.innerHTML = data.news.map((n, index) => `
            <div class="admin-item">
                <div class="info">
                    <span class="name">${n.title}</span>
                    <span class="price">${n.date}</span>
                </div>
                <button class="delete-btn" data-index="${index}" title="Delete news"><i class="fas fa-trash"></i></button>
            </div>
        `).join('');

        document.querySelectorAll('#newsAdminList .delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                if (confirm('Delete this news item?')) {
                    data.news.splice(index, 1);
                    saveData(data);
                    renderAll(data);
                }
            });
        });
    }
}

function renderAll(data) {
    renderAdminProducts(data);
    renderAdminGallery(data);
    renderAdminNews(data);
}

// ---------- ADD PRODUCT ----------
function addProduct(data, name, price, emoji, imageDataUrl) {
    if (!name || !price || isNaN(price) || price <= 0) {
        alert('Please enter a valid name and price.');
        return false;
    }
    const newId = data.products.length ? Math.max(...data.products.map(p => p.id)) + 1 : 1;
    data.products.push({
        id: newId,
        name: name.trim(),
        price: Number(price),
        status: 'instock',
        emoji: emoji.trim() || '👗',
        image: imageDataUrl || ''
    });
    saveData(data);
    renderAll(data);
    return true;
}

// ---------- ADD NEWS ----------
function addNews(data, title, content) {
    if (!title || !content) {
        alert('Please enter both title and content.');
        return false;
    }
    const newId = data.news.length ? Math.max(...data.news.map(n => n.id)) + 1 : 1;
    const today = new Date().toISOString().split('T')[0];
    data.news.push({
        id: newId,
        title: title.trim(),
        content: content.trim(),
        date: today
    });
    saveData(data);
    renderAll(data);
    return true;
}

// ---------- RESET / CLEAR ----------
function resetAll(data) {
    if (confirm('Reset all data to default? (your changes will be lost)')) {
        data.products = JSON.parse(JSON.stringify(DEFAULT_DATA.products));
        data.gallery = [...DEFAULT_DATA.gallery];
        data.news = JSON.parse(JSON.stringify(DEFAULT_DATA.news));
        saveData(data);
        renderAll(data);
    }
}

function clearGallery(data) {
    if (confirm('Remove all gallery images?')) {
        data.gallery = [];
        saveData(data);
        renderAll(data);
    }
}

function clearNews(data) {
    if (confirm('Remove all news items?')) {
        data.news = [];
        saveData(data);
        renderAll(data);
    }
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', function() {
    // Check session
    if (!checkSession()) return;

    // Load data
    const data = loadData();
    renderAll(data);

    // ---- ADD PRODUCT ----
    document.getElementById('addProductBtn').addEventListener('click', function() {
        const name = document.getElementById('productName').value;
        const price = document.getElementById('productPrice').value;
        const emoji = document.getElementById('productEmoji').value;
        const fileInput = document.getElementById('adminProductImage');

        if (fileInput.files && fileInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function(e) {
                if (addProduct(data, name, price, emoji, e.target.result)) {
                    document.getElementById('productName').value = '';
                    document.getElementById('productPrice').value = '';
                    document.getElementById('productEmoji').value = '👗';
                    fileInput.value = '';
                }
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            if (addProduct(data, name, price, emoji, '')) {
                document.getElementById('productName').value = '';
                document.getElementById('productPrice').value = '';
                document.getElementById('productEmoji').value = '👗';
            }
        }
    });

    // ---- PRODUCT IMAGE UPLOAD TRIGGER ----
    document.getElementById('adminFileDrop').addEventListener('click', function() {
        document.getElementById('adminProductImage').click();
    });

    // ---- GALLERY UPLOAD ----
    const galleryFileInput = document.getElementById('galleryFileInput');
    const galleryDrop = document.getElementById('galleryFileDrop');

    function handleGalleryFiles(files) {
        if (!files || files.length === 0) return;
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = function(e) {
                data.gallery.push(e.target.result);
                saveData(data);
                renderAll(data);
            };
            reader.readAsDataURL(file);
        });
    }

    galleryDrop.addEventListener('click', function() {
        galleryFileInput.click();
    });

    galleryFileInput.addEventListener('change', function(e) {
        handleGalleryFiles(e.target.files);
        this.value = '';
    });

    galleryDrop.addEventListener('dragover', (e) => {
        e.preventDefault();
        galleryDrop.style.borderColor = '#b4644c';
        galleryDrop.style.background = '#fae8e1';
    });
    galleryDrop.addEventListener('dragleave', (e) => {
        e.preventDefault();
        galleryDrop.style.borderColor = '#dba392';
        galleryDrop.style.background = '#fcf3ef';
    });
    galleryDrop.addEventListener('drop', (e) => {
        e.preventDefault();
        galleryDrop.style.borderColor = '#dba392';
        galleryDrop.style.background = '#fcf3ef';
        if (e.dataTransfer.files) {
            handleGalleryFiles(e.dataTransfer.files);
        }
    });

    // ---- ADD NEWS ----
    document.getElementById('addNewsBtn').addEventListener('click', function() {
        const title = document.getElementById('newsTitle').value;
        const content = document.getElementById('newsContent').value;
        if (addNews(data, title, content)) {
            document.getElementById('newsTitle').value = '';
            document.getElementById('newsContent').value = '';
        }
    });

    // ---- RESET / CLEAR ----
    document.getElementById('resetDefaultsBtn').addEventListener('click', function() {
        resetAll(data);
    });
    document.getElementById('clearGalleryBtn').addEventListener('click', function() {
        clearGallery(data);
    });
    document.getElementById('clearNewsBtn').addEventListener('click', function() {
        clearNews(data);
    });
});