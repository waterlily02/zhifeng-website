/**
 * 苏州智蜂创元科技有限公司 - 前端通用脚本
 * 
 * 功能:
 * 1. API 请求封装
 * 2. 导航栏交互
 * 3. 滚动动画
 * 4. 各页面数据加载与渲染
 */

// ====== API 配置 ======
const API_BASE = '';  // 同源请求，无需配置

/**
 * 封装 fetch 请求
 */
async function api(path, options = {}) {
    const url = `${API_BASE}/api${path}`;
    const config = {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    };
    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }
    try {
        const res = await fetch(url, config);
        const data = await res.json();
        return data;
    } catch (err) {
        console.error('API 请求失败:', path, err);
        return { code: -1, message: '网络请求失败，请稍后重试' };
    }
}

// ====== 导航栏交互 ======
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // 滚动效果
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 返回顶部按钮
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            if (window.scrollY > 400) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }
    });

    // 移动端菜单
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
    }

    // 点击菜单项后关闭移动端菜单
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
        });
    });

    // 返回顶部
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ====== 滚动动画 ======
function initScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });
}

// ====== 加载公司信息到页脚 ======
async function loadCompanyInfo() {
    const res = await api('/company');
    if (res.code !== 0) return;
    const info = res.data;

    // 更新页脚公司信息
    const footerElements = {
        'footer-phone': info.phone,
        'footer-email': info.email,
        'footer-address': info.address,
        'footer-copyright': info.company_name,
    };

    Object.entries(footerElements).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el && value) el.textContent = value;
    });

    // 更新版权年份
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    return info;
}

// ====== 加载统计数据 ======
async function loadStats() {
    const res = await api('/stats');
    if (res.code !== 0) return;
    const stats = res.data;

    const statElements = {
        'stat-products': stats.productCount,
        'stat-cases': stats.caseCount,
        'stat-employee': stats.company.employee_count,
        'stat-patent': stats.company.patent_count,
    };

    Object.entries(statElements).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el && value) {
            // 提取数字部分
            const num = parseInt(value);
            const unit = value.replace(/[0-9]/g, '').replace('+', '');
            if (unit) {
                el.innerHTML = `${num}<span class="unit">${unit}+</span>`;
            } else {
                el.textContent = num;
            }
        }
    });
}

// ====== 加载产品列表 ======
async function loadProducts(categoryId = null) {
    const params = categoryId ? `?category_id=${categoryId}` : '';
    const res = await api(`/products${params}`);
    if (res.code !== 0) return [];

    // 获取分类名称映射
    const catRes = await api('/categories');
    const catMap = {};
    if (catRes.code === 0) {
        catRes.data.forEach(c => { catMap[c.id] = c.name; });
    }

    return res.data.map(p => ({
        ...p,
        categoryName: catMap[p.category_id] || ''
    }));
}

// ====== 渲染产品卡片 ======
function renderProductCard(product) {
    const features = (product.features || []).slice(0, 3).map(f => `<li>${f}</li>`).join('');
    return `
        <div class="product-card fade-in-up" onclick="showProductDetail(${product.id})">
            <div class="product-image">
                ${product.categoryName ? `<span class="product-badge">${product.categoryName}</span>` : ''}
                ${getProductIcon(product.category_id)}
            </div>
            <div class="product-body">
                <h3>${product.name}</h3>
                <p class="subtitle">${product.subtitle || ''}</p>
                <ul class="product-features">${features}</ul>
            </div>
        </div>
    `;
}

// ====== 产品图标 SVG ======
function getProductIcon(categoryId) {
    const icons = {
        1: `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color:#1E6FFF">
            <rect x="30" y="20" width="60" height="80" rx="8"/>
            <line x1="45" y1="40" x2="75" y2="40"/>
            <line x1="45" y1="55" x2="75" y2="55"/>
            <circle cx="60" cy="75" r="8" fill="#1E6FFF" opacity="0.2"/>
            <path d="M55 75 L58 78 L65 71"/>
        </svg>`,
        2: `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color:#FF8A00">
            <rect x="35" y="50" width="50" height="35" rx="6"/>
            <circle cx="45" cy="90" r="8"/>
            <circle cx="75" cy="90" r="8"/>
            <path d="M50 50 L50 35 L70 35 L70 50"/>
            <line x1="40" y1="65" x2="80" y2="65"/>
        </svg>`,
        3: `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color:#0F2C4C">
            <circle cx="60" cy="55" r="25"/>
            <circle cx="60" cy="55" r="10" fill="#1E6FFF" opacity="0.15"/>
            <line x1="60" y1="20" x2="60" y2="30"/>
            <line x1="60" y1="80" x2="60" y2="90"/>
            <line x1="25" y1="55" x2="35" y2="55"/>
            <line x1="85" y1="55" x2="95" y2="55"/>
            <rect x="35" y="95" width="50" height="15" rx="4"/>
        </svg>`
    };
    return icons[categoryId] || icons[1];
}

// ====== 产品详情弹窗 ======
async function showProductDetail(id) {
    const res = await api(`/products/${id}`);
    if (res.code !== 0) {
        alert('获取产品详情失败');
        return;
    }
    const p = res.data;

    const features = (p.features || []).map(f => `<li>${f}</li>`).join('');
    const specs = Object.entries(p.specs || {}).map(([k, v]) =>
        `<tr><th>${k}</th><td>${v}</td></tr>`
    ).join('');

    const modal = document.getElementById('product-modal');
    const modalContent = document.getElementById('modal-content');

    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>${p.name}</h3>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
            <p class="modal-subtitle">${p.subtitle || ''}</p>
            <p class="modal-desc">${p.description || ''}</p>
            
            <div class="modal-section-title">核心特点</div>
            <ul class="feature-list">${features}</ul>
            
            <div class="modal-section-title">技术规格</div>
            <table class="spec-table">${specs}</table>
        </div>
    `;

    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('show');
}

// 点击遮罩关闭
document.addEventListener('click', (e) => {
    if (e.target.classList && e.target.classList.contains('modal-overlay')) {
        closeModal();
    }
});

// ESC 关闭
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// ====== 加载案例列表 ======
async function loadCases() {
    const res = await api('/cases');
    if (res.code !== 0) return [];
    return res.data;
}

function renderCaseCard(c) {
    return `
        <div class="case-card fade-in-up">
            <div class="case-image">
                <span class="case-industry">${c.industry || ''}</span>
                <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M30 5 L50 15 L50 35 L30 45 L10 35 L10 15 Z"/>
                    <path d="M30 5 L30 25 L10 15"/>
                    <path d="M30 25 L50 15"/>
                    <path d="M30 25 L30 45"/>
                </svg>
            </div>
            <div class="case-body">
                <h3>${c.title}</h3>
                <p class="case-client">${c.client || ''}</p>
                <p>${c.description || ''}</p>
            </div>
        </div>
    `;
}

// ====== 加载新闻列表 ======
async function loadNews(limit = null) {
    const params = limit ? `?limit=${limit}` : '';
    const res = await api(`/news${params}`);
    if (res.code !== 0) return [];
    return res.data;
}

function renderNewsCard(n) {
    const date = new Date(n.created_at).toLocaleDateString('zh-CN');
    return `
        <div class="news-card fade-in-up">
            <div class="news-image">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="6" y="10" width="36" height="28" rx="3"/>
                    <line x1="12" y1="18" x2="26" y2="18"/>
                    <line x1="12" y1="24" x2="36" y2="24"/>
                    <line x1="12" y1="30" x2="30" y2="30"/>
                </svg>
            </div>
            <div class="news-body">
                <p class="news-date">${date}</p>
                <h3>${n.title}</h3>
                <p>${n.summary || ''}</p>
                <span class="news-tag">${n.category || '公司动态'}</span>
            </div>
        </div>
    `;
}

// ====== 联系表单提交 ======
async function submitContactForm(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // 验证
    if (!data.name || !data.message) {
        showFormMessage('请填写姓名和留言内容', 'error');
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '提交中...';
    submitBtn.disabled = true;

    const res = await api('/contact', {
        method: 'POST',
        body: data,
    });

    submitBtn.textContent = originalText;
    submitBtn.disabled = false;

    if (res.code === 0) {
        showFormMessage('留言提交成功！我们将尽快与您联系。', 'success');
        form.reset();
    } else {
        showFormMessage(res.message || '提交失败，请稍后重试', 'error');
    }
}

function showFormMessage(msg, type) {
    const el = document.getElementById('form-message');
    if (!el) return;
    el.textContent = msg;
    el.className = `form-message ${type}`;
    setTimeout(() => {
        el.style.display = 'none';
    }, 5000);
}

// ====== 页面初始化 ======
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollAnimation();
    loadCompanyInfo();
});
