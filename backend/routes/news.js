/**
 * 新闻/动态路由
 * GET /api/news          - 获取新闻列表
 * GET /api/news/:id      - 获取新闻详情
 * POST /api/news         - 新增新闻（管理用）
 * PUT /api/news/:id      - 更新新闻
 * DELETE /api/news/:id   - 删除新闻
 */
const express = require('express');
const router = express.Router();
const { query, queryOne, run } = require('../db/database');

// 获取新闻列表
router.get('/', async (req, res) => {
    try {
        const { category, limit } = req.query;
        let sql = 'SELECT id, title, summary, cover_url, category, created_at FROM news WHERE is_published = 1';
        const params = [];
        if (category) {
            sql += ' AND category = ?';
            params.push(category);
        }
        sql += ' ORDER BY sort_order ASC, created_at DESC';
        if (limit) {
            sql += ' LIMIT ?';
            params.push(parseInt(limit));
        }
        const rows = await query(sql, params);
        res.json({ code: 0, data: rows });
    } catch (err) {
        res.status(500).json({ code: 1, message: '获取新闻列表失败', error: err.message });
    }
});

// 获取新闻详情
router.get('/:id', async (req, res) => {
    try {
        const row = await queryOne(
            'SELECT * FROM news WHERE id = ? AND is_published = 1',
            [req.params.id]
        );
        if (!row) {
            return res.status(404).json({ code: 1, message: '新闻不存在' });
        }
        res.json({ code: 0, data: row });
    } catch (err) {
        res.status(500).json({ code: 1, message: '获取新闻详情失败', error: err.message });
    }
});

// 新增新闻
router.post('/', async (req, res) => {
    try {
        const { title, summary, content, cover_url, category, sort_order } = req.body;
        const result = await run(
            `INSERT INTO news (title, summary, content, cover_url, category, sort_order)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [title, summary, content, cover_url, category || '公司动态', sort_order || 0]
        );
        res.json({ code: 0, message: '创建成功', data: { id: result.id } });
    } catch (err) {
        res.status(500).json({ code: 1, message: '创建失败', error: err.message });
    }
});

// 更新新闻
router.put('/:id', async (req, res) => {
    try {
        const { title, summary, content, cover_url, category, sort_order, is_published } = req.body;
        await run(
            `UPDATE news SET 
                title = ?, summary = ?, content = ?, cover_url = ?,
                category = ?, sort_order = ?, is_published = ?,
                updated_at = datetime('now', 'localtime')
             WHERE id = ?`,
            [title, summary, content, cover_url, category, sort_order || 0, 
             is_published !== undefined ? is_published : 1, req.params.id]
        );
        res.json({ code: 0, message: '更新成功' });
    } catch (err) {
        res.status(500).json({ code: 1, message: '更新失败', error: err.message });
    }
});

// 删除新闻
router.delete('/:id', async (req, res) => {
    try {
        await run('DELETE FROM news WHERE id = ?', [req.params.id]);
        res.json({ code: 0, message: '删除成功' });
    } catch (err) {
        res.status(500).json({ code: 1, message: '删除失败', error: err.message });
    }
});

module.exports = router;
