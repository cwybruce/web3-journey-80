# 🚀 完整部署指南 - 一步一步操作

本指南将带你从零开始，一步步完成整个项目的部署。

## 📋 部署概览

我们需要部署两个部分：
1. **Worker** (后端 GraphQL API) → Cloudflare Workers
2. **Frontend** (前端网页) → Cloudflare Pages

预计完成时间：**20-30 分钟**

---

## 第一部分：前置准备 (5 分钟)

### Step 1: 确认 Node.js 环境

```bash
# 检查 Node.js 版本（需要 18 或更高）
node --version

# 检查 npm 版本
npm --version
```

如果没有安装 Node.js，请访问 https://nodejs.org/ 下载安装。

### Step 2: 克隆并安装项目依赖

```bash
# 如果还没有克隆项目
git clone https://github.com/cwybruce/web3-journey-80.git
cd web3-journey-80

# 安装所有依赖（这可能需要几分钟）
npm install
```

等待安装完成，你应该看到类似这样的输出：
```
added 856 packages in 2m
```

### Step 3: 注册 Cloudflare 账号

1. 访问 https://dash.cloudflare.com/sign-up
2. 注册一个免费账号（如果已有账号可直接登录）
3. 验证邮箱

---

## 第二部分：获取 AI API Keys (10 分钟)

你需要至少获取一个 AI API Key（推荐同时获取两个以便切换使用）。

### Step 4: 获取 DeepSeek API Key（推荐，便宜）

1. **访问 DeepSeek 平台**
   - 打开 https://platform.deepseek.com/
   - 点击右上角「登录/注册」

2. **注册账号**
   - 可以使用手机号或邮箱注册
   - 完成手机/邮箱验证

3. **充值**
   - 登录后，点击「余额充值」
   - 最低充值金额通常是 ¥10-50
   - 支持支付宝/微信支付

4. **创建 API Key**
   - 点击「API Keys」或「密钥管理」
   - 点击「创建新密钥」
   - 复制生成的 API Key（格式类似：`sk-xxx...`）
   - ⚠️ **重要：立即保存这个 Key，页面关闭后无法再查看**

### Step 5: 获取 OpenAI API Key（可选）

1. **访问 OpenAI 平台**
   - 打开 https://platform.openai.com/
   - 点击右上角 "Sign up" 注册

2. **注册账号**
   - 使用邮箱注册
   - 完成邮箱验证
   - 可能需要手机验证（支持中国手机号）

3. **充值**
   - 点击 "Billing" → "Add payment method"
   - 添加信用卡（需要 Visa/Mastercard）
   - 最低充值 $5-10

4. **创建 API Key**
   - 点击 "API Keys"
   - 点击 "Create new secret key"
   - 给 Key 起个名字（如 "web3-journey"）
   - 复制生成的 API Key（格式：`sk-proj-xxx...`）
   - ⚠️ **重要：立即保存这个 Key**

### Step 6: 保存 API Keys

创建一个安全的地方保存这些 Keys（推荐使用密码管理器）：

```
DeepSeek API Key: sk-xxx...
OpenAI API Key: sk-proj-xxx...
```

---

## 第三部分：部署 Worker (5-10 分钟)

### Step 7: 登录 Cloudflare CLI

```bash
# 进入 worker 目录
cd packages/worker

# 登录 Cloudflare（会打开浏览器）
npx wrangler login
```

操作步骤：
1. 浏览器会自动打开 Cloudflare 授权页面
2. 点击「Allow」允许访问
3. 看到 "Successfully logged in" 表示成功
4. 返回终端继续操作

### Step 8: 配置本地开发环境（可选，用于本地测试）

```bash
# 复制环境变量模板
cp .dev.vars.example .dev.vars

# 编辑文件，填入你的 API Keys
# 可以使用任何文本编辑器，例如：
nano .dev.vars
# 或
vim .dev.vars
# 或使用 VS Code
code .dev.vars
```

在 `.dev.vars` 文件中填入你的 Keys：
```bash
# 至少填写一个（推荐两个都填）
DEEPSEEK_API_KEY=sk-你的DeepSeek-key
OPENAI_API_KEY=sk-proj-你的OpenAI-key
```

保存文件并退出编辑器。

### Step 9: 本地测试 Worker（可选但推荐）

```bash
# 启动本地开发服务器
npm run dev
```

你应该看到：
```
⛅️ wrangler 3.x.x
------------------
⎔ Starting local server...
[wrangler:inf] Ready on http://localhost:8787
```

**测试 API：**

打开另一个终端窗口，运行：

```bash
# 测试 Hello 查询
curl -X POST http://localhost:8787/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ hello(name: \"Test\") }"}'
```

如果看到类似这样的响应，说明工作正常：
```json
{"data":{"hello":"你好, Test! 欢迎使用 Cloudflare Workers + GraphQL 🚀"}}
```

测试完成后，按 `Ctrl+C` 停止本地服务器。

### Step 10: 部署 Worker 到 Cloudflare

```bash
# 确保在 packages/worker 目录
# 部署
npm run deploy
```

你会看到部署过程：
```
⛅️ wrangler 3.x.x
------------------
Total Upload: xxx KiB / gzip: xxx KiB
Uploaded web3-journey-worker (x.xx sec)
Published web3-journey-worker (x.xx sec)
  https://web3-journey-worker.你的账号.workers.dev
```

**⚠️ 重要：记录这个 Worker URL！**

例如：`https://web3-journey-worker.abc123.workers.dev`

### Step 11: 配置 Worker 的 Secrets（生产环境 API Keys）

```bash
# 配置 DeepSeek API Key
npx wrangler secret put DEEPSEEK_API_KEY
```

终端会提示：
```
Enter a secret value: ›
```

**粘贴你的 DeepSeek API Key**，然后按回车。

如果你也有 OpenAI Key：

```bash
# 配置 OpenAI API Key
npx wrangler secret put OPENAI_API_KEY
```

同样粘贴 OpenAI Key 并按回车。

### Step 12: 测试已部署的 Worker

```bash
# 将下面的 URL 替换为你的 Worker URL
curl -X POST https://你的worker.workers.dev/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ hello(name: \"Production\") }"}'
```

看到正确响应说明 Worker 部署成功！✅

---

## 第四部分：部署 Frontend (5-10 分钟)

### Step 13: 返回项目根目录

```bash
cd ../..  # 回到项目根目录
```

### Step 14: 通过 Cloudflare Dashboard 部署（推荐方式）

1. **访问 Cloudflare Pages**
   - 打开 https://dash.cloudflare.com/
   - 点击左侧菜单「Workers & Pages」
   - 点击「Create application」
   - 选择「Pages」标签
   - 点击「Connect to Git」

2. **连接 GitHub**
   - 选择「GitHub」
   - 点击「Connect GitHub」
   - 授权 Cloudflare 访问你的 GitHub
   - 选择仓库：`cwybruce/web3-journey-80`
   - 点击「Begin setup」

3. **配置构建设置**

   在配置页面填写：

   | 配置项 | 值 |
   |--------|-----|
   | Project name | `web3-journey-frontend`（或你喜欢的名字） |
   | Production branch | `main`（或你的主分支名） |
   | Framework preset | 选择「None」或「Vite」 |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | `packages/frontend` ⚠️ **重要！** |

4. **配置环境变量**

   在「Environment variables」部分，点击「Add variable」，添加：

   | 变量名 | 值 |
   |--------|-----|
   | `VITE_WORKER_URL` | `https://你的worker.workers.dev/graphql` |
   | `NODE_VERSION` | `18` |

   **⚠️ 重要：**
   - `VITE_WORKER_URL` 必须是完整的 Worker URL + `/graphql`
   - 例如：`https://web3-journey-worker.abc123.workers.dev/graphql`

5. **开始部署**
   - 点击「Save and Deploy」
   - 等待构建完成（通常需要 2-5 分钟）

6. **查看构建进度**

   你会看到构建日志：
   ```
   ⚡️ Cloudflare Pages
   Building your site...
   Running "npm run build"
   ...
   ✨ Success! Uploaded xxx files
   ✨ Deployment complete!
   ```

7. **获取 Pages URL**

   部署成功后，你会看到：
   ```
   🌎 Your site is live at: https://web3-journey-frontend.pages.dev
   ```

   **记录这个 URL！**

---

## 第五部分：验证和测试 (5 分钟)

### Step 15: 访问你的应用

1. **打开前端 URL**
   - 访问 `https://你的项目.pages.dev`
   - 你应该看到完整的应用界面

2. **测试 Hello 功能**
   - 在「GraphQL 连接测试」区域
   - 输入你的名字
   - 应该看到问候语响应

3. **测试 AI 聊天**
   - 在「AI 聊天」区域
   - 选择一个 AI Provider（DeepSeek 或 OpenAI）
   - 输入一条消息，例如「你好」
   - 点击「发送」
   - 等待 AI 回复（通常 1-3 秒）

### Step 16: 测试 AI Provider 切换

1. 发送一条消息使用 DeepSeek
   - 选择「🚀 DeepSeek」
   - 发送消息
   - 查看回复，应该显示「DeepSeek」徽章

2. 切换到 OpenAI 再试一次
   - 选择「🤖 OpenAI GPT」
   - 发送消息
   - 查看回复，应该显示「OpenAI」徽章

### Step 17: 检查浏览器控制台

按 `F12` 打开开发者工具，查看 Console：

✅ **正常情况：**
- 没有红色错误
- 可能有一些蓝色的 info 日志

❌ **如果有错误：**

常见问题及解决方法：

1. **CORS 错误**
   ```
   Access to fetch at '...' has been blocked by CORS policy
   ```
   - 检查 `VITE_WORKER_URL` 是否配置正确
   - 确保 Worker URL 包含 `/graphql`

2. **Network Error 或 Failed to fetch**
   - Worker 可能没有部署成功
   - 重新运行 `npm run deploy` 在 worker 目录

3. **API Key Error**
   - 检查 Secrets 是否配置正确
   - 重新运行 `npx wrangler secret put DEEPSEEK_API_KEY`

---

## 第六部分：配置自定义域名（可选，5 分钟）

### Step 18: 购买或配置域名

#### 选项 A：在 Cloudflare 购买新域名

1. 访问 https://dash.cloudflare.com/
2. 点击「Domain Registration」
3. 搜索想要的域名
4. 购买域名（价格因域名而异，通常 $10-20/年）

#### 选项 B：转入现有域名

1. 在 Cloudflare Dashboard 点击「Add site」
2. 输入你的域名
3. 选择「Free」计划
4. 按照指示修改域名的 Nameserver
5. 等待 DNS 生效（可能需要几小时）

### Step 19: 为 Worker 配置自定义域名

1. 访问 https://dash.cloudflare.com/
2. 点击「Workers & Pages」
3. 找到并点击你的 Worker（`web3-journey-worker`）
4. 点击「Triggers」标签
5. 在「Custom Domains」部分点击「Add Custom Domain」
6. 输入子域名，例如：`api.yourdomain.com`
7. 点击「Add Custom Domain」
8. DNS 会自动配置，几分钟后生效

### Step 20: 为 Pages 配置自定义域名

1. 在「Workers & Pages」中点击你的 Pages 项目
2. 点击「Custom domains」标签
3. 点击「Set up a custom domain」
4. 输入域名，例如：
   - `yourdomain.com`（根域名）
   - 或 `app.yourdomain.com`（子域名）
5. 点击「Activate domain」
6. DNS 会自动配置

### Step 21: 更新环境变量

如果配置了自定义域名，需要更新 Pages 的环境变量：

1. 在 Pages 项目中点击「Settings」
2. 点击「Environment variables」
3. 找到 `VITE_WORKER_URL`
4. 点击「Edit」
5. 更新为：`https://api.yourdomain.com/graphql`
6. 点击「Save」

**重新部署：**

1. 点击「Deployments」标签
2. 点击最新部署右侧的「...」
3. 选择「Retry deployment」

等待重新部署完成（约 2-3 分钟）。

---

## 🎉 完成！

### 验证清单

确认以下所有项目都完成：

- [ ] Worker 已部署到 Cloudflare
- [ ] Worker Secrets（API Keys）已配置
- [ ] Worker GraphQL API 可以访问
- [ ] Frontend 已部署到 Cloudflare Pages
- [ ] Pages 环境变量已配置
- [ ] 前端可以正常访问
- [ ] Hello 测试功能正常
- [ ] AI 聊天功能正常
- [ ] 可以切换不同的 AI Provider
- [ ] 消息显示正确的 AI 模型和提供商
- [ ] （可选）自定义域名已配置并生效

### 你的部署信息

记录下面的信息以便以后使用：

```
项目名称：Web3 Journey
GitHub 仓库：https://github.com/cwybruce/web3-journey-80

Worker URL：https://_____________________.workers.dev
Worker 自定义域名（如有）：https://_____________________

Pages URL：https://_____________________.pages.dev
Pages 自定义域名（如有）：https://_____________________

DeepSeek API Key：sk-_____________________ (已配置)
OpenAI API Key：sk-proj-_____________________ (已配置)

部署日期：___________
```

---

## 🔧 常见问题排查

### 问题 1：构建失败

**错误信息：** "Build failed"

**解决方法：**
```bash
# 检查 Node.js 版本
node --version  # 应该 >= 18

# 在 Pages 设置中添加环境变量
NODE_VERSION = 18
```

### 问题 2：API 调用失败

**错误信息：** "AI 调用失败"

**解决方法：**
1. 检查 API Key 是否正确配置
2. 检查 API Key 余额是否充足
3. 在 Worker 中运行 `npx wrangler tail` 查看实时日志

```bash
cd packages/worker
npx wrangler tail
```

然后访问前端触发 AI 调用，查看详细错误信息。

### 问题 3：前端无法连接到 Worker

**错误信息：** "Failed to fetch" 或 CORS 错误

**解决方法：**
1. 检查 `VITE_WORKER_URL` 是否正确
2. 确保 URL 包含 `/graphql` 后缀
3. 确认 Worker 已成功部署

```bash
# 测试 Worker 是否可访问
curl https://你的worker.workers.dev/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ hello(name: \"Test\") }"}'
```

### 问题 4：环境变量未生效

**Pages 环境变量更新后没有生效**

**解决方法：**
1. 修改环境变量后必须重新部署
2. 在 Deployments 页面点击「Retry deployment」
3. 或者推送新的 commit 触发自动部署

---

## 📱 移动端访问

你的应用已经支持响应式设计，可以在手机上访问：

1. 用手机浏览器打开 Pages URL
2. 界面会自动适配手机屏幕
3. AI 选择器在移动端会以全宽显示

---

## 🚀 下一步

现在你的应用已经完全部署，你可以：

1. **分享给朋友**
   - 发送 Pages URL 给朋友试用
   - 展示你的全栈应用技能

2. **监控使用情况**
   - 在 Cloudflare Dashboard 查看访问统计
   - 监控 AI API 消费

3. **继续开发**
   - 添加更多功能
   - 优化 UI 设计
   - 每次推送到 GitHub 会自动部署

4. **成本优化**
   - Cloudflare Pages 和 Workers 免费额度很大
   - DeepSeek API 非常便宜（约 ¥0.001 / 1K tokens）
   - 监控使用量，设置预算提醒

---

## 📚 相关文档

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [DeepSeek API 文档](https://platform.deepseek.com/docs)
- [OpenAI API 文档](https://platform.openai.com/docs)

---

## 💬 需要帮助？

如果遇到问题：

1. 查看上面的「常见问题排查」部分
2. 检查浏览器控制台的错误信息
3. 查看 Worker 日志：`npx wrangler tail`
4. 在 GitHub Issues 提问

**祝你部署成功！🎉**
