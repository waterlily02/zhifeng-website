# 苏州智蜂创元科技有限公司 - 企业官网

> 智造精密 · 蜂领未来 — 工业精密制造自动化解决方案

## 项目简介

本项目为苏州智蜂创元科技有限公司企业官网，包含前端页面和后端API服务，采用前后端一体化架构，使用 SQLite 数据库存储数据。

### 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | HTML5 + CSS3 + 原生JS | 无框架依赖，便于二次修改 |
| 后端 | Node.js + Express | 轻量级 Web 服务框架 |
| 数据库 | SQLite | 零配置，文件型数据库，无需安装 |
| 依赖管理 | npm | Node 包管理器 |

### 页面结构

- **首页** (`/`) — Hero展示、统计数据、核心业务、明星产品、标杆案例、新闻动态
- **关于我们** (`/about.html`) — 公司简介、使命愿景、核心优势、发展历程
- **产品服务** (`/products.html`) — 产品分类筛选、产品列表、产品详情弹窗、成功案例、服务流程
- **联系我们** (`/contact.html`) — 联系信息、在线留言表单、地图

---

## 快速启动

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装与运行

```bash
# 1. 进入后端目录
cd backend

# 2. 安装依赖
npm install

# 3. 启动服务
npm start
```

启动成功后，浏览器访问 **http://localhost:3000** 即可查看网站。

> 首次启动时会自动创建 SQLite 数据库文件 `backend/db/zhifeng.db` 并导入初始数据。

---

## 目录结构

```
zhifeng-website/
├── backend/                          # 后端服务
│   ├── server.js                     # 服务入口（Express 配置与路由注册）
│   ├── package.json                  # 依赖配置
│   ├── db/                           # 数据库相关
│   │   ├── database.js               # 数据库连接与操作封装
│   │   ├── schema.sql                # 建表脚本与初始数据
│   │   └── zhifeng.db                # SQLite 数据库文件（运行后自动生成）
│   └── routes/                       # API 路由
│       ├── company.js                # 公司信息 API
│       ├── products.js               # 产品 API（CRUD）
│       ├── categories.js             # 产品分类 API
│       ├── news.js                   # 新闻动态 API（CRUD）
│       ├── cases.js                  # 案例API（CRUD）
│       ├── contact.js                # 留言 API（提交+管理）
│       └── stats.js                  # 统计数据 API
│
├── frontend/                         # 前端页面
│   ├── index.html                    # 首页
│   ├── about.html                    # 关于我们
│   ├── products.html                 # 产品服务
│   ├── contact.html                  # 联系我们
│   ├── css/
│   │   └── style.css                 # 全局样式表
│   ├── js/
│   │   └── main.js                   # 全局脚本（API封装+页面逻辑）
│   └── images/                       # 图片资源目录
│
└── README.md                         # 本文件
```

---

## API 接口文档

### 公司信息

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/company` | 获取全部公司信息 |
| GET | `/api/company/:key` | 获取指定字段 |
| PUT | `/api/company` | 更新公司信息 |

### 产品管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/products` | 获取产品列表（支持 `?category_id=` 筛选） |
| GET | `/api/products/:id` | 获取产品详情 |
| POST | `/api/products` | 新增产品 |
| PUT | `/api/products/:id` | 更新产品 |
| DELETE | `/api/products/:id` | 下架产品（软删除） |

### 产品分类

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/categories` | 获取所有分类 |
| POST | `/api/categories` | 新增分类 |
| PUT | `/api/categories/:id` | 更新分类 |

### 新闻动态

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/news` | 获取新闻列表（支持 `?category=`、`?limit=`） |
| GET | `/api/news/:id` | 获取新闻详情 |
| POST | `/api/news` | 新增新闻 |
| PUT | `/api/news/:id` | 更新新闻 |
| DELETE | `/api/news/:id` | 删除新闻 |

### 案例

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/cases` | 获取案例列表 |
| GET | `/api/cases/:id` | 获取案例详情 |
| POST | `/api/cases` | 新增案例 |
| PUT | `/api/cases/:id` | 更新案例 |
| DELETE | `/api/cases/:id` | 删除案例 |

### 联系留言

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/contact` | 提交留言（公开接口） |
| GET | `/api/contact` | 获取留言列表（管理用） |
| GET | `/api/contact/:id` | 获取留言详情 |
| PUT | `/api/contact/:id/read` | 标记留言已读 |
| DELETE | `/api/contact/:id` | 删除留言 |

### 统计数据

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/stats` | 获取首页统计数据 |
| GET | `/api/health` | 健康检查 |

---

## 数据库结构

### 主要数据表

| 表名 | 说明 |
|------|------|
| `product_categories` | 产品分类表 |
| `products` | 产品表（含分类关联、技术规格JSON） |
| `company_info` | 公司信息键值表 |
| `contacts` | 客户留言表 |
| `news` | 新闻动态表 |
| `cases` | 案例表 |

### 初始数据

系统首次启动会自动导入以下初始数据：
- 3 个产品分类（精密插拔、产线搬运、智能检测）
- 6 个产品（每个分类 2 个）
- 13 条公司信息
- 3 条新闻动态
- 3 个成功案例

---

## 二次开发指南

### 修改公司信息

编辑 `backend/db/schema.sql` 中的 `INSERT INTO company_info` 语句，或通过 API 更新：
```bash
curl -X PUT http://localhost:3000/api/company \
  -H "Content-Type: application/json" \
  -d '{"data": {"phone": "0512-12345678"}}'
```

### 新增产品

编辑 `backend/db/schema.sql` 中的 `INSERT INTO products` 语句，或通过 API 新增：
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "category_id": 1,
    "name": "新产品名称",
    "subtitle": "一句话描述",
    "description": "详细描述",
    "features": ["特点1", "特点2"],
    "specs": {"参数1": "值1"},
    "image_url": "/images/products/new.svg",
    "sort_order": 1
  }'
```

### 修改页面样式

全局样式集中在 `frontend/css/style.css`，通过 CSS 变量统一管理配色：
```css
:root {
    --color-primary: #0F2C4C;    /* 主色 - 深蓝 */
    --color-accent: #1E6FFF;     /* 强调色 - 科技蓝 */
    --color-orange: #FF8A00;     /* 点缀色 - 橙色 */
    --color-bg: #F7F9FC;         /* 背景色 */
    /* ... 更多变量见 style.css 顶部 */
}
```

### 修改页面内容

各页面 HTML 文件可直接编辑修改静态内容。动态内容（产品、新闻、案例）通过 API 加载，修改数据库数据即可更新。

### 添加新页面

1. 在 `frontend/` 目录下新建 HTML 文件
2. 引入 `/css/style.css` 和 `/js/main.js`
3. 如需后端数据支持，在 `backend/routes/` 下新增路由文件
4. 在 `server.js` 中注册新路由

### 重置数据库

删除 `backend/db/zhifeng.db` 文件后重新启动服务，会自动重建数据库并导入初始数据。

---

## 常见问题

**Q: 如何修改端口号？**
A: 修改 `backend/server.js` 中的 `PORT` 变量，或设置环境变量 `PORT=4000 npm start`。

**Q: 地图不显示？**
A: 联系页面中的地图使用腾讯地图，需在 `contact.html` 中替换 `YOUR_MAP_KEY` 为你的腾讯地图 API Key。申请地址: https://lbs.qq.com/

**Q: 如何添加产品图片？**
A: 将图片放入 `frontend/images/` 目录，在产品的 `image_url` 字段中填写路径即可。

**Q: 数据库文件在哪？**
A: `backend/db/zhifeng.db`，首次运行后自动生成。可用 DB Browser for SQLite 等工具查看编辑。

---

## License

本项目为苏州智蜂创元科技有限公司所有，仅供内部使用。
