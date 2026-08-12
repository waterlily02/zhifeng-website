/**
 * 产品分类路由
 * GET /api/categories    - 获取所有分类
 * POST /api/categories   - 新增分类
 * PUT /api/categories/:id - 更新分类
 */
const express = require('express');
const router = express.Router();
const { query, run } = require('../db/database');

// 获取所有分类
router.get('/', async (req, res) => {
    try {
        const rows = await query('SELECT * FROM product_categories ORDER BY sort_order ASC, id ASC');
        res.json({ code: 0, data: rows });
    } catch (err) {
        res.status(500).json({ code: 1, message: '获取分类失败', error: err.message });
    }
});

// 新增分类
router.post('/', async (req, res) => {
    try {
        const { name, description, sort_order } = req.body;
        const result = await run(
            'INSERT INTO product_categories (name, description, sort_order) VALUES (?, ?, ?)',
            [name, description, sort_order || 0]
        );
        res.json({ code: 0, message: '创建成功', data: { id: result.id } });
    } catch (err) {
        res.status(500).json({ code: 1, message: '创建失败', error: err.message });
    }
});

// 更新分类
router.put('/:id', async (req, res) => {
    try {
        const { name, description, sort_order } = req.body;
        await run(
            'UPDATE product_categories SET name = ?, description = ?, sort_order = ? WHERE id = ?',
            [name, description, sort_order || 0, req.params.id]
        );
        res.json({ code: 0, message: '更新成功' });
    } catch (err) {
        res.status(500).json({ code: 1, message: '更新失败', error: err.message });
    }
});

module.exports = router;
