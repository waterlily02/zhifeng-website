/**
 * 统计数据路由
 * GET /api/stats - 获取首页统计数据
 */
const express = require('express');
const router = express.Router();
const { query, queryOne } = require('../db/database');

// 获取统计数据
router.get('/', async (req, res) => {
    try {
        const productCount = await queryOne('SELECT COUNT(*) as count FROM products WHERE is_active = 1');
        const caseCount = await queryOne('SELECT COUNT(*) as count FROM cases WHERE is_active = 1');
        const newsCount = await queryOne('SELECT COUNT(*) as count FROM news WHERE is_published = 1');
        const contactCount = await queryOne('SELECT COUNT(*) as count FROM contacts WHERE is_read = 0');

        // 从公司信息表获取展示数据
        const stats = await query(
            `SELECT key_name, value FROM company_info 
             WHERE key_name IN ('established_year', 'registered_capital', 'employee_count', 'patent_count')`
        );
        const companyStats = {};
        stats.forEach(s => { companyStats[s.key_name] = s.value; });

        res.json({
            code: 0,
            data: {
                productCount: productCount.count,
                caseCount: caseCount.count,
                newsCount: newsCount.count,
                unreadMessages: contactCount.count,
                company: companyStats
            }
        });
    } catch (err) {
        res.status(500).json({ code: 1, message: '获取统计数据失败', error: err.message });
    }
});

module.exports = router;
