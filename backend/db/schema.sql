-- ============================================================
-- 苏州智蜂创元科技有限公司 - 企业官网数据库
-- Database: SQLite
-- ============================================================

-- 产品分类表
CREATE TABLE IF NOT EXISTS product_categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,                    -- 分类名称
    description TEXT,                             -- 分类描述
    sort_order  INTEGER DEFAULT 0,                -- 排序
    created_at  TEXT DEFAULT (datetime('now', 'localtime'))
);

-- 产品表
CREATE TABLE IF NOT EXISTS products (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id   INTEGER,                        -- 分类ID
    name          TEXT NOT NULL,                  -- 产品名称
    subtitle      TEXT,                           -- 副标题/一句话描述
    description   TEXT,                           -- 详细描述
    features      TEXT,                           -- 产品特点（JSON数组）
    specs         TEXT,                           -- 技术规格（JSON）
    image_url     TEXT,                           -- 产品图片URL
    sort_order    INTEGER DEFAULT 0,              -- 排序
    is_active     INTEGER DEFAULT 1,              -- 是否上架 1:是 0:否
    created_at    TEXT DEFAULT (datetime('now', 'localtime')),
    updated_at    TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (category_id) REFERENCES product_categories(id)
);

-- 公司信息表
CREATE TABLE IF NOT EXISTS company_info (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    key_name      TEXT UNIQUE NOT NULL,           -- 键名
    value         TEXT,                           -- 值
    updated_at    TEXT DEFAULT (datetime('now', 'localtime'))
);

-- 客户留言/联系我们表
CREATE TABLE IF NOT EXISTS contacts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,                    -- 联系人姓名
    company     TEXT,                             -- 公司名称
    phone       TEXT,                             -- 联系电话
    email       TEXT,                             -- 邮箱
    subject     TEXT,                             -- 主题
    message     TEXT NOT NULL,                    -- 留言内容
    is_read     INTEGER DEFAULT 0,                -- 是否已读 0:未读 1:已读
    is_replied  INTEGER DEFAULT 0,                -- 是否已回复
    created_at  TEXT DEFAULT (datetime('now', 'localtime'))
);

-- 新闻/动态表
CREATE TABLE IF NOT EXISTS news (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,                    -- 标题
    summary     TEXT,                             -- 摘要
    content     TEXT,                             -- 正文
    cover_url   TEXT,                             -- 封面图URL
    category    TEXT DEFAULT '公司动态',           -- 分类
    is_published INTEGER DEFAULT 1,               -- 是否发布
    sort_order  INTEGER DEFAULT 0,                -- 排序
    created_at  TEXT DEFAULT (datetime('now', 'localtime')),
    updated_at  TEXT DEFAULT (datetime('now', 'localtime'))
);

-- 案例表
CREATE TABLE IF NOT EXISTS cases (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,                    -- 案例标题
    client      TEXT,                             -- 客户名称
    industry    TEXT,                             -- 行业
    description TEXT,                             -- 案例描述
    image_url   TEXT,                             -- 图片URL
    sort_order  INTEGER DEFAULT 0,                -- 排序
    is_active   INTEGER DEFAULT 1,                -- 是否显示
    created_at  TEXT DEFAULT (datetime('now', 'localtime'))
);

-- ============================================================
-- 初始数据
-- ============================================================

-- 产品分类
INSERT OR IGNORE INTO product_categories (name, description, sort_order) VALUES
('精密插拔', '高精度插拔设备与解决方案，适用于各类精密连接器、电子元件的自动化插拔作业', 1),
('产线搬运', '智能搬运机器人与输送系统，实现产线物料的高效、精准流转', 2),
('智能检测', 'AI视觉检测与质量管控系统，覆盖外观检测、尺寸测量、缺陷识别等场景', 3);

-- 产品数据（来自《产品说明.docx》）
INSERT OR IGNORE INTO products (category_id, name, subtitle, description, features, specs, image_url, sort_order) VALUES
(2, 'Z100L', '轮式双臂通用作业具身机器人',
 '产线多功能普工，专为工业精密制造场景打造，覆盖取料、上下料、过站、Pass/Fail 分拣、跨工位转运等核心环节。',
 '["取料：6D 位姿估计 + 柔顺力控，适配光模块、料盘等无损操作","上下料：毫米级精度匹配定位销 / 槽，无需改造机台","过站：自动扫码识别 + MES 对接，SN 全程追溯","Pass / Fail 分拣：视觉判定良品 / 次品，自动分盘放置","跨工位转运：SLAM 自主导航，承担工序间物料流角色"]',
 '{"双臂协同负载": "单臂 5 kg / 双臂 10 kg", "重复定位精度": "±0.1 mm", "力觉反馈精度": "≤ 0.1 N", "移动底盘": "360° 全向轮式底盘，SLAM 自主导航", "导航精度": "≤ 2 cm", "安全速度": "≤ 1.5 m/s", "持续工作": "支持自主回充", "任务成功率": "≥ 99%"}',
 '/images/products/z100l.jpg', 1),

(1, 'Z700Fs', '固定式精密操作具身机器人',
 '精密制造智能技工，以视触融合力控与高精度对位技术，实现光模块、连接器等精密接口的可靠插拔。',
 '["视触融合精准插入：±0.03 mm 对位 + ≤ 0.1N 力闭环，消除接口偏移与损伤风险","平稳拔出防损伤：匀速分离，避免机械冲击损伤精密接口","智能异常检测：自动识别插拔异常并实时反馈处理","扫码 + MES 对接：自动过站、SN 追溯，无缝融入产线信息流"]',
 '{"重复定位精度": "±0.03 mm", "视触融合力控": "≤ 0.1 N", "安装形式": "桌面固定式，即插即用", "换型时间": "≤ 0.5 小时，适配混线生产", "持续工作": "支持24小时连续工作", "任务成功率": "≥ 99%"}',
 '/images/products/z700fs.jpg', 2);

-- 公司信息
INSERT OR IGNORE INTO company_info (key_name, value) VALUES
('company_name', '苏州智蜂创元科技有限公司'),
('company_short', '智蜂创元'),
('company_slogan', '智造精密 · 蜂领未来'),
('company_description', '苏州智蜂创元科技有限公司专注于工业精密制造领域的自动化解决方案，核心业务覆盖精密插拔、产线搬运、智能检测三大板块。公司依托自主研发的伺服控制、机器视觉、智能调度等核心技术，为3C电子、汽车零部件、半导体、医疗器械等行业客户提供高精度、高可靠性的智能制造装备与服务。'),
('established_year', '2018'),
('registered_capital', '5000万元'),
('employee_count', '200+'),
('patent_count', '60+'),
('website', 'www.zhifeng-tech.com'),
('fax', '0512-6288 8889');

-- 新闻数据
INSERT OR IGNORE INTO news (title, summary, content, cover_url, category, sort_order) VALUES
('智蜂创元发布新一代ZF-V100 AI视觉检测系统', '全新深度学习算法引擎，缺陷检出率提升至99.5%',
 '近日，智蜂创元正式发布新一代ZF-V100 AI视觉检测系统。该系统搭载自研深度学习算法引擎，支持2D/3D视觉融合检测，缺陷检出率提升至99.5%，误判率降低至0.1%以下，已在多家3C电子龙头企业产线成功部署。',
 '/images/news/news1.svg', '公司动态', 1),
('智蜂创元荣获2024年度苏州市专精特新企业认定', '技术创新能力获政府认可',
 '经苏州市工信局评审，智蜂创元凭借在工业精密制造领域的技术积累和创新成果，荣获2024年度苏州市专精特新中小企业认定。这是公司继获得高新技术企业认证后的又一重要资质。',
 '/images/news/news2.svg', '公司荣誉', 2),
('智蜂创元与某头部汽车零部件企业签署战略合作协议', '深化智能检测领域合作',
 '智蜂创元与国内某头部汽车零部件制造企业签署战略合作协议，将在智能检测、产线自动化升级等领域展开深度合作，预计三年内合作金额超5000万元。',
 '/images/news/news3.svg', '合作动态', 3);

-- 案例数据
INSERT OR IGNORE INTO cases (title, client, industry, description, image_url, sort_order) VALUES
('某3C电子龙头连接器自动化产线项目', '国内头部3C电子企业', '3C电子',
 '为客户定制8条精密连接器自动化插拔产线，集成ZF-P200多工位插拔工作站与ZF-V100视觉检测系统，产线效率提升200%，良率从98.5%提升至99.8%。',
 '/images/cases/case1.svg', 1),
('某汽车零部件企业智能搬运项目', '国内知名汽车零部件制造商', '汽车零部件',
 '部署12台ZF-T300智能搬运AGV，实现车间物料全自动配送与多车协同调度，搬运效率提升150%，人工成本降低60%。',
 '/images/cases/case2.svg', 2),
('某半导体封测企业在线检测项目', '国内半导体封装测试企业', '半导体',
 '为客户新建产线配置ZF-V200在线尺寸测量仪与ZF-V100视觉检测系统，实现芯片封装尺寸全检与外观缺陷自动识别，检测节拍0.3s/件，漏检率为零。',
 '/images/cases/case3.svg', 3);
