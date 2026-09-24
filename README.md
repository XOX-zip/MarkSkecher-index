<div align="center">

# 🌌 MarkSkecher · 个人主页 & 街机厅

**把想法编译成世界的开发者 —— 我的赛博霓虹风个人简介页**

纯原生 HTML / CSS / JavaScript 打造，零依赖、零构建、开箱即用。

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![No Build](https://img.shields.io/badge/Build-None%20%E2%9C%BF-28c840?style=flat-square)
![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-00e5ff?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-7b5cff?style=flat-square)

</div>

---

## ✨ 项目简介

**MarkSkecher** 是一个赛博霓虹（Cyber Neon）风格的单页个人简介站点。除了常规的个人展示区块，页面内还内置了一个「街机厅」——三个完全手写的可玩小游戏，全部基于原生 Canvas / DOM 实现，不引入任何第三方库。

> 📂 属于「自制编程作品」系列的 Web 方向实践。

## 🧭 页面导航

| 区块 | 内容 |
|---|---|
| 🏠 **Hero 首屏** | 故障风霓虹大标题、打字机轮播、粒子星网背景、光晕球 + 极光层 |
| 👤 **关于我** | 头像霓虹相框（缺图自动兜底）、终端风格自述、数字滚动统计 |
| ⌨️ **技能栈** | 3D 倾斜卡片 + 进入视口时的能量条充能动画 |
| 🚀 **作品** | 悬停旋转流光边框的作品卡片 |
| 🕹️ **街机厅** | 三个弹窗即玩的小游戏（详见下表） |
| 💬 **编程箴言** | 经典名言淡入淡出轮播 |
| 🛤️ **成长轨迹** | 2019 → 2026 霓虹时间线 + 成就徽章 |
| 📮 **保持联络** | 邮件直达按钮 |

## 🕹️ 内置小游戏

| 游戏 | 操控 | 特性 |
|---|---|---|
| 🐍 霓虹贪吃蛇 | `方向键` / `WASD`，`R` 重开 | 渐变蛇身外发光、脉冲能量球、吃球加速 |
| 🔢 霓虹 2048 | `方向键` / `WASD` 滑动 | 11 档霓虹方块配色、合并弹跳、胜负面板 |
| 🃏 记忆翻牌 | 鼠标点击 | 3D 翻转、8 对程序员图标、步数挑战 |

游戏采用**注册表式插件架构**：每个游戏实现 `mount(stage, api) → { destroy }` 并注册到 `window.GameRegistry`，由 `games-hub.js` 统一调度弹窗生命周期。新增游戏只需在 `js/games/` 下添加一个文件。

## 🎨 视觉与交互细节

- 🌠 Canvas 粒子星网：自动连线、鼠标斥力、**点击脉冲波**（含速度阻尼回落）
- ⚡ 双层自定义光标：质点瞬时跟随 + 光环惯性拖尾，悬停交互元素自动放大
- 🔮 Glitch 故障文字 / 旋转霓虹光环头像 / 极光渐变 / 全站噪点纹理
- 📜 滚动驱动：入场错峰显现、技能条充能、数字缓动计数、顶部进度条
- 🧲 磁吸按钮 & 卡片 3D 倾斜跟随
- 📱 响应式适配 + 移动端汉堡菜单 + `prefers-reduced-motion` 无障碍降级

## 📁 目录结构

```
MarkSkecher/
├── index.html              # 页面骨架
├── css/
│   ├── base.css            # 设计令牌 (CSS Variables) / 重置 / 全局排版
│   ├── layout.css          # 导航 / Hero / 区块 / 响应式
│   ├── components.css      # 按钮 / 卡片 / 终端 / 头像框 / 光标 / 加载器
│   ├── effects.css         # 故障文字 / 光晕 / 极光 / 噪点 / 滚动显现
│   └── games.css           # 街机厅 / 游戏弹窗 / 时间线 / 徽章
└── js/
    ├── particles.js        # 粒子星网引擎（连线 / 斥力 / 点击脉冲）
    ├── typing.js           # 打字机效果
    ├── effects.js          # 加载序列 / 自定义光标 / 3D 倾斜 / 磁吸 / 进度条
    ├── games/
    │   ├── snake.js        # 🐍 霓虹贪吃蛇
    │   ├── game2048.js     # 🔢 霓虹 2048
    │   └── memory.js       # 🃏 记忆翻牌
    ├── games-hub.js        # 游戏弹窗调度（注册表模式）
    ├── quotes.js           # 编程箴言轮播
    └── main.js             # 滚动显现 / 计数 / 导航高亮 / 汉堡菜单
```

## 🚀 快速开始

无需安装任何依赖，两种方式任选：

**方式一：直接打开**

```
双击 index.html 即可在浏览器中运行
```

**方式二：本地服务器**（推荐，避免个别浏览器对本地文件策略的限制）

```bash
# Python
python -m http.server 8090

# Node.js
npx serve .
```

访问 `http://localhost:8090` 即可。

## 🌐 部署到 GitHub Pages

1. 将本仓库推送到 GitHub：
   ```bash
   git init
   git add .
   git commit -m "feat: MarkSkecher personal page & arcade"
   git remote add origin https://github.com/<你的用户名>/MarkSkecher.git
   git push -u origin main
   ```
2. 打开仓库 **Settings → Pages**，Source 选择 `Deploy from a branch`，分支选 `main` / `(root)`，保存。
3. 约一分钟后访问 `https://<你的用户名>.github.io/MarkSkecher/` 🎉

## 🧞 自定义指南

| 想改什么 | 去哪里改 |
|---|---|
| 头像照片 | 将图片保存为 `images/avatar.jpg`（缺图会自动显示 MS 霓虹兜底头像） |
| 联系邮箱 | `index.html` 中的 `mailto:` 链接 |
| 主题配色 | `css/base.css` 顶部 `:root` 的 CSS 变量 |
| 打字机文案 | `js/typing.js` 的 `phrases` 数组 |
| 箴言内容 | `js/quotes.js` 的 `QUOTES` 数组 |
| 技能 / 作品 / 时间线 | `index.html` 对应 section 的文本与 `data-count` / `--w` 数值 |
| 新增小游戏 | 参考 `js/games/snake.js` 注册到 `window.GameRegistry`，并在导航区加一张 `data-game` 卡片 |

## 🛠️ 技术说明

- **零依赖**：无框架、无构建工具、无 CDN，全部原生实现
- **渲染**：`requestAnimationFrame` 驱动的 Canvas 粒子系统 + CSS 合成层动画（`transform` / `opacity`）
- **交互**：`IntersectionObserver` 滚动调度、事件委托、注册表插件模式
- **兼容**：Chrome / Edge 99+（使用了 `ctx.roundRect`、`conic-gradient` 等现代 Web 特性）

## 📄 License

[MIT](LICENSE) © 2026 MarkSkecher

---

<div align="center">

**如果这个项目让你觉得「有点酷」，欢迎点个 ⭐ Star！**

*Designed & Coded by MarkSkecher · `console.log("愿你的 bug 永远是 0")`*

</div>
