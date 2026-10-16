# DEAR MR. ZOU

**AN UNEXPECTED PROPOSAL · 致邹老师：一份意想不到的提案**

2603班送给新班主任、商务英语老师邹老师的一份互动欢迎礼物。以一份郑重的提案开场，观众亲手改写三处措辞，最后合成一封欢迎信。人物信息仅使用项目提供的事实。

## 体验

- 点击折页，封套滑开、纸面沿折痕展开，进入提案。
- 阅读初稿；轻触手写边注，查看学生为什么想修改措辞。
- 选择任意一处修订，拖动原生滑块揭开新表达；也可以直接点击采用。键盘可用方向键、Home、End、Enter。
- 每一处修订均可撤销，修订痕迹保留原稿与新表达。
- 三处修改完成后，把语句合成欢迎信。可以回看修订或重新打开礼物。
- 完整中文、英文切换；进度和偏好保存在当前浏览器。保存不可用时仍能正常浏览。
- 尊重系统的 `prefers-reduced-motion`；页面也提供减弱动效控制。

## 运行与构建

需要 Node.js 20 或更高版本。没有第三方 JavaScript 依赖，不需要执行 npm install。

```sh
npm run check
npm run build
npm run preview
```

`dist/` 是可直接部署的静态成品。预览地址在命令输出中。也可使用任意标准 HTTP 静态文件服务。请通过 HTTP 打开；直接双击 HTML 的 `file://` 方式会被浏览器的 ES Module 安全策略限制。

## GitHub Pages

仓库设置：**Settings → Pages → Build and deployment → Source: GitHub Actions**。

推送到 `main` 会运行 `.github/workflows/pages.yml`，先检查、构建，再部署 `dist/`。也可在 Actions 中手动运行 “Publish the welcome”。所有资源与模块均使用相对路径，适用于项目子路径，无需修改域名、base URL 或配置后端。

## 文件

| 文件 | 用途 |
| --- | --- |
| `index.html` | 四幕语义结构、无脚本欢迎信 |
| `styles.css` | 原创构图、折页、修订揭页、响应式和动效 |
| `app.js` | 事件、可访问性、历史记录、进度保存 |
| `content.mjs` | 全部中英文文案 |
| `state.mjs` | 校验过的状态转换与完成条件 |
| `assets/` | 本地字体、授权声明、原创几何标记 |
| `scripts/` | 零依赖构建与本地预览 |
| `tests/` | 状态边界、双语覆盖、子路径与资源检查 |
| `TEST-RESULTS.md` | 本次实际检查记录与范围 |

## 字体与素材

英文字体为本地 Latin Modern 的 WOFF 子集，保留 GUST Font License 与作者信息，并使用 Folio Roman / Folio Sans 网页字体族名称。中文使用设备自带的中文字体，避免为少量文案加载数兆字节字体。纸页、封套、折痕和几何线条均由原生 HTML/CSS 与原创 SVG 构成；没有远程 CDN、照片素材、追踪器、API、数据库或后台服务。

## 隐私与可访问性

不收集个人资料，不上传浏览进度。主要操作都是真实按钮，揭页使用原生 range 输入，支持键盘与触屏。字体及交互不依赖网络第三方。主线没有强制滚动、声音自动播放或长时间锁定动画；关闭 JavaScript 仍可阅读最终欢迎内容。

请勿在修改文案时编造老师经历、性格或尚未发生的师生共同回忆。
