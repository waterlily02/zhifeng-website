/**
 * 公司信息路由
 * GET /api/company          - 获取全部公司信息
 * GET /api/company/:key     - 获取指定字段
 * PUT /api/company          - 更新公司信息（管理用）
 */
const express = require('express');
const router = express.Router();
const { query, queryOne, run } = require('../db/database');

// 获取全部公司信息
router.get('/', async (req, res) => {
    try {
        const rows = await query('SELECT key_name, value FROM company_info');
        const result = {};
        rows.forEach(row => {
            result[row.key_name] = row.value;
        });
        res.json({ code: 0, data: result });
    } catch (err) {
        res.status(500).json({ code: 1, message: '获取公司信息失败', error: err.message });
    }
});

// 获取指定字段
router.get('/:key', async (req, res) => {
    try {
        const row = await queryOne('SELECT value FROM company_info WHERE key_name = ?', [req.params.key]);
        if (!row) {
            return res.status(404).json({ code: 1, message: '字段不存在' });
        }
        res.json({ code: 0, data: row.value });
    } catch (err) {
        res.status(500).json({ code: 1, message: '获取失败', error: err.message });
    }
});

// 更新公司信息（管理用）
router.put('/', async (req, res) => {
    try {
        const { data } = req.body;
        for (const [key, value] of Object.entries(data)) {
            await run(
                `INSERT INTO company_info (key_name, value, updated_at) 
                 VALUES (?, ?, datetime('now', 'localtime'))
                 ON CONFLICT(key_name) DO UPDATE SET value = ?, updated_at = datetime('now', 'localtime')`,
                [key, value, value]
            );
        }
        res.json({ code: 0, message: '更新成功' });
    } catch (err) {
        res.status(500).json({ code: 1, message: '更新失败', error: err.message });
    }
});

module.exports = router;
