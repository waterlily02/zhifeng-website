/**
 * 数据库初始化与连接管理
 * 使用 SQLite 数据库，文件存储在 backend/db/zhifeng.db
 */
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'zhifeng.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let db = null;

/**
 * 初始化数据库连接并执行建表脚本
 */
function initDatabase() {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('数据库连接失败:', err.message);
                reject(err);
                return;
            }
            console.log('✅ 数据库连接成功:', DB_PATH);
        });

        // 读取并执行 schema.sql
        const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
        db.exec(schema, (err) => {
            if (err) {
                console.error('数据库初始化失败:', err.message);
                reject(err);
            } else {
                console.log('✅ 数据库表结构初始化完成');
                resolve(db);
            }
        });
    });
}

/**
 * 获取数据库连接实例
 */
function getDb() {
    if (!db) {
        throw new Error('数据库未初始化，请先调用 initDatabase()');
    }
    return db;
}

/**
 * 封装查询方法 - 返回 Promise
 */
function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

/**
 * 封装单条查询方法 - 返回 Promise
 */
function queryOne(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

/**
 * 封装执行方法（INSERT/UPDATE/DELETE）- 返回 Promise
 */
function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
}

module.exports = {
    initDatabase,
    getDb,
    query,
    queryOne,
    run
};
