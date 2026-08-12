/**
 * 产品路由
 * GET /api/products              - 获取产品列表（支持 ?category_id= 筛选）
 * GET /api/products/:id          - 获取产品详情
 * POST /api/products             - 新增产品（管理用）
 * PUT /api/products/:id          - 更新产品（管理用）
 * DELETE /api/products/:id       - 删除产品（管理用）
 */
const express = require('express');
const router = express.Router();
const { query, queryOne, run } = require('../db/database');

// 获取产品列表
router.get('/', async (req, res) => {
    try {
        const { category_id } = req.query;
        let sql = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN product_categories c ON p.category_id = c.id 
            WHERE p.is_active = 1
        `;
        const params = [];
        if (category_id) {
            sql += ' AND p.category_id = ?';
            params.push(category_id);
        }
        sql += ' ORDER BY p.sort_order ASC, p.id ASC';
        
        const rows = await query(sql, params);
        // 解析 JSON 字段
        const products = rows.map(p => ({
            ...p,
            features: p.features ? JSON.parse(p.features) : [],
            specs: p.specs ? JSON.parse(p.specs) : {}
        }));
        res.json({ code: 0, data: products });
    } catch (err) {
        res.status(500).json({ code: 1, message: '获取产品列表失败', error: err.message });
    }
});

// 获取产品详情
router.get('/:id', async (req, res) => {
    try {
        const row = await queryOne(
            `SELECT p.*, c.name as category_name 
             FROM products p 
             LEFT JOIN product_categories c ON p.category_id = c.id 
             WHERE p.id = ? AND p.is_active = 1`,
            [req.params.id]
        );
        if (!row) {
            return res.status(404).json({ code: 1, message: '产品不存在' });
        }
        row.features = row.features ? JSON.parse(row.features) : [];
        row.specs = row.specs ? JSON.parse(row.specs) : {};
        res.json({ code: 0, data: row });
    } catch (err) {
        res.status(500).json({ code: 1, message: '获取产品详情失败', error: err.message });
    }
});

// 新增产品
router.post('/', async (req, res) => {
    try {
        const { category_id, name, subtitle, description, features, specs, image_url, sort_order } = req.body;
        const result = await run(
            `INSERT INTO products (category_id, name, subtitle, description, features, specs, image_url, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [category_id, name, subtitle, description, 
             JSON.stringify(features || []), JSON.stringify(specs || {}), 
             image_url, sort_order || 0]
        );
        res.json({ code: 0, message: '创建成功', data: { id: result.id } });
    } catch (err) {
        res.status(500).json({ code: 1, message: '创建失败', error: err.message });
    }
});

// 更新产品
router.put('/:id', async (req, res) => {
    try {
        const { category_id, name, subtitle, description, features, specs, image_url, sort_order, is_active } = req.body;
        await run(
            `UPDATE products SET 
                category_id = ?, name = ?, subtitle = ?, description = ?,
                features = ?, specs = ?, image_url = ?, sort_order = ?, is_active = ?,
                updated_at = datetime('now', 'localtime')
             WHERE id = ?`,
            [category_id, name, subtitle, description,
             JSON.stringify(features || []), JSON.stringify(specs || {}),
             image_url, sort_order || 0, is_active !== undefined ? is_active : 1,
             req.params.id]
        );
        res.json({ code: 0, message: '更新成功' });
    } catch (err) {
        res.status(500).json({ code: 1, message: '更新失败', error: err.message });
    }
});

// 删除产品（软删除 - 下架）
router.delete('/:id', async (req, res) => {
    try {
        await run('UPDATE products SET is_active = 0 WHERE id = ?', [req.params.id]);
        res.json({ code: 0, message: '已下架' });
    } catch (err) {
        res.status(500).json({ code: 1, message: '删除失败', error: err.message });
    }
});

module.exports = router;
