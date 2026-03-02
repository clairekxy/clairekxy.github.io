# clairekxy.github.io

Personal Portfolio Website

## 个人网站 GitHub Pages 方案（建议版）

这个仓库可以直接作为你的 GitHub Pages 站点（`<username>.github.io`）。
下面给你一个**从 0 到上线**、并且后续可扩展的方案。

### 1) 目标与定位
- 目标：快速上线一个简洁、可信、可持续更新的个人网站。
- 受众：招聘方、合作方、同学朋友。
- 核心信息：你是谁、你做过什么、如何联系你。

### 2) 网站结构（推荐）
- 首页 Home：一句话自我介绍 + 头像 + CTA（查看简历/联系我）。
- 项目 Projects：3–6 个代表项目（问题、方案、结果、链接）。
- 关于 About：教育背景、技能栈、兴趣方向。
- 博客/笔记 Notes（可选）：沉淀思考、提高搜索曝光。
- 联系 Contact：邮箱、LinkedIn、GitHub。

### 3) 技术方案（按阶段）

#### 阶段 A：快速上线（1 天内）
- 用纯 HTML/CSS（当前方式）维护一个单页版本。
- 优点：部署简单、学习成本低、随时可发布。
- 适合：先有一个“能看、能联系、能展示”的版本。

#### 阶段 B：结构化升级（1–2 周）
- 采用静态站点生成器（推荐 `Astro` 或 `Jekyll`）。
- 加入可复用组件（导航、项目卡片、页脚）和统一样式。
- 把项目内容改为数据文件（JSON/YAML/Markdown），后续维护更轻松。

#### 阶段 C：品牌化与增长（持续）
- 绑定自定义域名（如 `clairexinyikuang.com`）。
- 增加 SEO 元信息、Open Graph、站点地图。
- 接入轻量统计（如 Plausible 或 GA4）观察访问与跳出情况。

### 4) GitHub Pages 部署步骤
1. 仓库命名为 `username.github.io`（你当前仓库形式已符合）。
2. `Settings` → `Pages` → Source 选择 `Deploy from a branch`。
3. 选择分支 `main`（或当前默认分支）与根目录 `/`。
4. 等待构建完成，访问 `https://username.github.io`。
5. （可选）自定义域名：在 `Pages` 填入域名，并在 DNS 添加记录。

### 5) 内容模板（可直接套用）

#### 首页一句话
> Hi, I’m Claire — I build thoughtful digital experiences at the intersection of product, design, and technology.

#### 项目卡片建议字段
- 项目名
- 背景/问题
- 你的角色
- 关键动作（你做了什么）
- 结果（最好量化）
- 链接（Demo / GitHub / Case Study）

### 6) 设计与体验建议
- 首屏 5 秒内让访客知道：你是谁 + 你做什么 + 怎么联系你。
- 字体和颜色保持克制：1 个主色 + 1 个强调色。
- 移动端优先：按钮可点击区域足够大，段落不宜过长。
- 图片统一比例与风格，项目卡片排版一致。

### 7) SEO 与可信度（最小必做）
- 每页唯一 `title` 和 `description`。
- 添加 `favicon`、`og:title`、`og:description`、`og:image`。
- 保持 `README` 与网站内容一致，减少“信息割裂”。
- 确保联系方式真实有效、链接可访问。

### 8) 维护节奏（建议）
- 每月更新 1 次：新增项目进展或学习笔记。
- 每季度审查 1 次：删除过时信息，更新成果数据。
- 关键经历发生时（实习/比赛/论文）立即更新。

### 9) 下一步行动清单（你现在就可以做）
- [ ] 确认网站主叙事（求职导向 / 作品导向 / 个人品牌导向）
- [ ] 先完成单页版：Home + Projects + Contact
- [ ] 整理 3 个最强项目，补齐“结果数据”
- [ ] 开启 GitHub Pages 并验证可访问
- [ ] 绑定自定义域名与 HTTPS
- [ ] 规划后续迁移到 Astro/Jekyll（可选）

### 10) 零基础该用什么 IDE？（推荐）

如果你没有代码基础，我最推荐从 **Visual Studio Code（VS Code）** 开始：
- 免费、轻量、资料多，几乎所有前端教程都能直接跟着做。
- 对 HTML/CSS/Markdown 特别友好，适合你现在这种 GitHub Pages 项目。
- 插件生态很成熟，后续你想学更多技术也不用换工具。

#### 新手最实用的 VS Code 插件（先装这 4 个）
- **Live Server**：一键本地预览网页，保存就自动刷新。
- **Prettier**：自动格式化代码，避免排版混乱。
- **GitLens**：更直观地看 Git 历史和改动。
- **Chinese (Simplified) Language Pack**：界面中文化，降低学习成本。

#### 你的最简工作流（零基础版）
1. 安装 VS Code。
2. 打开这个仓库文件夹。
3. 修改 `index.html`（比如标题、简介、链接）。
4. 用 Live Server 本地预览效果。
5. `git add . && git commit -m "update homepage" && git push`。
6. 等 1–3 分钟后刷新 GitHub Pages 网站。

> 如果你只想要“更傻瓜”的网页编辑体验，也可以用 **GitHub.dev**（在仓库页面按 `.` 进入在线编辑），但长期来看还是建议尽快上手 VS Code。

---

如果你愿意，我下一步可以直接帮你输出：
1) 一个“可直接复制”的首页文案（中英双语）；
2) 一个现代简洁风格的页面结构（含项目卡片）；