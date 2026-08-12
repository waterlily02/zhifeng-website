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

-- 产品数据
INSERT OR IGNORE INTO products (category_id, name, subtitle, description, features, specs, image_url, sort_order) VALUES
(1, 'ZF-P100 精密插拔机器人', '微米级精度，适用于精密连接器自动化装配',
 'ZF-P100 是专为精密连接器、电子元件插拔场景设计的高精度机器人系统，采用伺服驱动与力控技术，实现微米级定位精度，支持多品种柔性切换。',
 '["伺服驱动系统，定位精度 ±5μm","力控感知，插拔力实时监测","多规格夹具快速换型","MES系统无缝对接","7×24小时稳定运行"]',
 '{"重复定位精度": "±5μm", "最大行程": "200mm", "插拔速度": "0.5-2s/次", "负载": "5kg", "电源": "220V/50Hz"}',
 '/images/products/p100.svg', 1),

(1, 'ZF-P200 多工位插拔工作站', '多工位协同，产线效率提升3倍',
 'ZF-P200 集成多工位转台与视觉定位系统，支持多型号产品同时作业，单工位节拍可达1.5秒，大幅提升产线吞吐能力。',
 '["4-8工位可配置","视觉引导定位","自动上下料","数据追溯与SPC分析","模块化设计，快速部署"]',
 '{"工位数": "4-8可选", "节拍": "1.5s/工位", "定位精度": "±10μm", "视觉系统": "1300万像素", "气源": "0.5-0.7MPa"}',
 '/images/products/p200.svg', 2),

(2, 'ZF-T300 智能搬运AGV', '激光导航，柔性产线搬运专家',
 'ZF-T300 采用激光SLAM导航技术，无需铺设磁条或二维码，可自主规划路径、避障绕行，适配各类产线物料搬运需求。',
 '["激光SLAM导航，无需改造场地","最大负载300kg","续航8小时，支持自动充电","多车协同调度","对接WMS/MES系统"]',
 '{"导航方式": "激光SLAM", "最大负载": "300kg", "运行速度": "1.5m/s", "定位精度": "±10mm", "续航": "8h"}',
 '/images/products/t300.svg', 1),

(2, 'ZF-T500 重载搬运机器人', '500kg负载，重型物料搬运首选',
 'ZF-T500 专为重型物料搬运设计，采用双轮差速驱动与精密减速机，平稳可靠，适用于汽车零部件、大型结构件等重载场景。',
 '["最大负载500kg","双轮差速驱动","防撞安全防护","路径自动优化","远程监控与诊断"]',
 '{"最大负载": "500kg", "运行速度": "1.2m/s", "导航方式": "激光+磁条混合", "定位精度": "±20mm", "续航": "10h"}',
 '/images/products/t500.svg', 2),

(3, 'ZF-V100 AI视觉检测系统', '深度学习算法，缺陷检出率99.5%',
 'ZF-V100 搭载自研深度学习视觉算法，支持外观缺陷、尺寸偏差、装配错误等多种检测类型，检出率高达99.5%，误判率低于0.1%。',
 '["深度学习算法引擎","支持2D/3D视觉","检测速度0.3s/件","缺陷类型可扩展","检测报告自动生成"]',
 '{"检测速度": "0.3s/件", "检出率": "99.5%", "误判率": "<0.1%", "相机": "2000万像素", "视野": "可定制"}',
 '/images/products/v100.svg', 1),

(3, 'ZF-V200 在线尺寸测量仪', '非接触式高精度尺寸测量',
 'ZF-V200 采用激光三角测量与机器视觉融合技术，实现非接触式在线尺寸测量，适用于精密零部件的产线全检。',
 '["非接触式测量","测量精度 ±2μm","支持多尺寸同时测量","SPC统计过程控制","数据自动上传MES"]',
 '{"测量精度": "±2μm", "测量范围": "0-50mm", "测量速度": "0.2s/件", "光源": "激光+LED", "通讯": "TCP/IP"}',
 '/images/products/v200.svg', 2);

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
('address', '苏州市工业园区独墅湖科教创新区启月街288号'),
('phone', '0512-6288 8888'),
('email', 'contact@zhifeng-tech.com'),
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
