/**
 * 案例路由
 * GET /api/cases          - 获取案例列表
 * GET /api/cases/:id      - 获取案例详情
 * POST /api/cases         - 新增案例
 * PUT /api/cases/:id      - 更新案例
 * DELETE /api/cases/:id   - 删除案例
 */
const express = require('express');
const router = express.Router();
const { query, queryOne, run } = require('../db/database');

// 获取案例列表
router.get('/', async (req, res) => {
    try {
        const rows = await query('SELECT * FROM cases WHERE is_active = 1 ORDER BY sort_order ASC, id ASC');
        res.json({ code: 0, data: rows });
    } catch (err) {
        res.status(500).json({ code: 1, message: '获取案例列表失败', error: err.message });
    }
});

// 获取案例详情
router.get('/:id', async (req, res) => {
    try {
        const row = await queryOne('SELECT * FROM cases WHERE id = ? AND is_active = 1', [req.params.id]);
        if (!row) {
            return res.status(404).json({ code: 1, message: '案例不存在' });
        }
        res.json({ code: 0, data: row });
    } catch (err) {
        res.status(500).json({ code: 1, message: '获取案例详情失败', error: err.message });
    }
});

// 新增案例
router.post('/', async (req, res) => {
    try {
        const { title, client, industry, description, image_url, sort_order } = req.body;
        const result = await run(
            `INSERT INTO cases (title, client, industry, description, image_url, sort_order)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [title, client, industry, description, image_url, sort_order || 0]
        );
        res.json({ code: 0, message: '创建成功', data: { id: result.id } });
    } catch (err) {
        res.status(500).json({ code: 1, message: '创建失败', error: err.message });
    }
});

// 更新案例
router.put('/:id', async (req, res) => {
    try {
        const { title, client, industry, description, image_url, sort_order, is_active } = req.body;
        await run(
            `UPDATE cases SET 
                title = ?, client = ?, industry = ?, description = ?,
                image_url = ?, sort_order = ?, is_active = ?
             WHERE id = ?`,
            [title, client, industry, description, image_url, sort_order || 0,
             is_active !== undefined ? is_active : 1, req.params.id]
        );
        res.json({ code: 0, message: '更新成功' });
    } catch (err) {
        res.status(500).json({ code: 1, message: '更新失败', error: err.message });
    }
});

// 删除案例
router.delete('/:id', async (req, res) => {
    try {
        await run('UPDATE cases SET is_active = 0 WHERE id = ?', [req.params.id]);
        res.json({ code: 0, message: '已删除' });
    } catch (err) {
        res.status(500).json({ code: 1, message: '删除失败', error: err.message });
    }
});

module.exports = router;
