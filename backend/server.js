/**
 * 苏州智蜂创元科技有限公司 - 企业官网后端服务
 * 
 * 技术栈: Node.js + Express + SQLite
 * 端口: 3000
 * 
 * API 路由:
 *   GET  /api/company              - 获取公司信息
 *   GET  /api/products             - 获取产品列表（支持分类筛选）
 *   GET  /api/products/:id         - 获取产品详情
 *   GET  /api/categories           - 获取产品分类
 *   GET  /api/news                 - 获取新闻列表
 *   GET  /api/news/:id             - 获取新闻详情
 *   GET  /api/cases                - 获取案例列表
 *   POST /api/contact              - 提交联系留言
 *   GET  /api/contacts             - 获取留言列表（管理用）
 *   PUT  /api/contacts/:id/read    - 标记留言已读
 *   GET  /api/stats                - 获取统计数据
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务 - 托管前端页面
app.use(express.static(path.join(__dirname, '../frontend')));

// 路由注册
app.use('/api/company', require('./routes/company'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/news', require('./routes/news'));
app.use('/api/cases', require('./routes/cases'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/stats', require('./routes/stats'));

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 前端页面路由（SPA 支持）
app.get(['/',/about|products|contact/], (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// 启动服务
async function start() {
    try {
        await initDatabase();
        app.listen(PORT, () => {
            console.log('');
            console.log('========================================');
            console.log('  苏州智蜂创元科技有限公司 - 企业官网');
            console.log('========================================');
            console.log(`  服务地址: http://localhost:${PORT}`);
            console.log(`  API 文档: http://localhost:${PORT}/api/health`);
            console.log('========================================');
            console.log('');
        });
    } catch (err) {
        console.error('服务启动失败:', err);
        process.exit(1);
    }
}

start();
