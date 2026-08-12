/**
 * 联系我们/留言路由
 * POST /api/contact          - 提交留言（公开）
 * GET  /api/contact          - 获取留言列表（管理用）
 * GET  /api/contact/:id      - 获取留言详情
 * PUT  /api/contact/:id/read - 标记已读
 * DELETE /api/contact/:id    - 删除留言
 */
const express = require('express');
const router = express.Router();
const { query, queryOne, run } = require('../db/database');

// 提交留言（公开接口）
router.post('/', async (req, res) => {
    try {
        const { name, company, phone, email, subject, message } = req.body;
        
        // 参数校验
        if (!name || !message) {
            return res.status(400).json({ code: 1, message: '姓名和留言内容为必填项' });
        }
        
        const result = await run(
            `INSERT INTO contacts (name, company, phone, email, subject, message)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, company || '', phone || '', email || '', subject || '', message]
        );
        res.json({ code: 0, message: '留言提交成功，我们将尽快与您联系', data: { id: result.id } });
    } catch (err) {
        res.status(500).json({ code: 1, message: '提交失败', error: err.message });
    }
});

// 获取留言列表（管理用）
router.get('/', async (req, res) => {
    try {
        const { is_read } = req.query;
        let sql = 'SELECT * FROM contacts';
        const params = [];
        if (is_read !== undefined) {
            sql += ' WHERE is_read = ?';
            params.push(parseInt(is_read));
        }
        sql += ' ORDER BY created_at DESC';
        const rows = await query(sql, params);
        res.json({ code: 0, data: rows });
    } catch (err) {
        res.status(500).json({ code: 1, message: '获取留言列表失败', error: err.message });
    }
});

// 获取留言详情
router.get('/:id', async (req, res) => {
    try {
        const row = await queryOne('SELECT * FROM contacts WHERE id = ?', [req.params.id]);
        if (!row) {
            return res.status(404).json({ code: 1, message: '留言不存在' });
        }
        res.json({ code: 0, data: row });
    } catch (err) {
        res.status(500).json({ code: 1, message: '获取失败', error: err.message });
    }
});

// 标记已读
router.put('/:id/read', async (req, res) => {
    try {
        await run('UPDATE contacts SET is_read = 1 WHERE id = ?', [req.params.id]);
        res.json({ code: 0, message: '已标记为已读' });
    } catch (err) {
        res.status(500).json({ code: 1, message: '操作失败', error: err.message });
    }
});

// 删除留言
router.delete('/:id', async (req, res) => {
    try {
        await run('DELETE FROM contacts WHERE id = ?', [req.params.id]);
        res.json({ code: 0, message: '删除成功' });
    } catch (err) {
        res.status(500).json({ code: 1, message: '删除失败', error: err.message });
    }
});

module.exports = router;
