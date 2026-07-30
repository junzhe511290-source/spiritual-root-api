# 灵根计算 API 部署指南

> AncientTongue.AI · Spiritual Root Calculator API  
> 版本：v1.0  
> 日期：2026-07-30

---

## 📦 部署包内容

```
api_deploy/
├── spiritual_root_api.js    # API主程序 (21KB)
├── package.json              # Node.js依赖配置
├── package-lock.json         # 依赖锁定
└── README.md                 # 本文件
```

---

## 🔧 技术方案

### 推荐方案：Railway / Render（最快上线）

**优势：**
- 零配置，拖拽部署
- 自动HTTPS
- 免费套餐支持
- 全球CDN

**部署步骤：**

1. **打包代码**
   ```bash
   cd api_deploy
   zip -r spiritual_root_api.zip .
   ```

2. **部署到 Railway**
   - 访问 https://railway.app
   - 创建新项目
   - 选择 "Deploy from Docker image" 或 "Deploy from GitHub"
   - 上传 zip 或推送代码到 GitHub

3. **环境变量**
   ```
   PORT=3000
   NODE_ENV=production
   ```

4. **获取API地址**
   - Railway会分配一个域名，如：`https://spiritual-root-api.railway.app`
   - 测试：`https://your-domain.railway.app/api/health`

---

### 备选方案：阿里云函数计算 FC

**优势：**
- 按调用次数付费，成本极低
- 自动扩缩容
- 适合B端API服务

**部署步骤：**

1. **安装 Fun CLI**
   ```bash
   npm install @alicloud/fun -g
   ```

2. **配置阿里云凭证**
   ```bash
   fun config
   # 输入 AccessKey ID 和 Secret
   ```

3. **创建 fun.yml**
   ```yaml
   edition: '3.0.0'
   name: spiritual-root-api
   access: default
   
   resources:
     spiritual-root-api:
       component: fc
       props:
         region: cn-hangzhou
         service:
           name: ancienttongue
         function:
           name: spiritual-root
           runtime: nodejs18
           handler: spiritual_root_api.app
           memorySize: 512
           timeout: 60
           codeUri: ./
         triggers:
           - name: httpTrigger
             type: http
             config:
               authType: anonymous
               methods: ['GET', 'POST']
   ```

4. **部署**
   ```bash
   fun deploy
   ```

5. **获取API地址**
   - 阿里云会分配一个HTTP触发器URL
   - 格式：`https://xxx.cn-hangzhou.fc.aliyuncs.com/api/spiritual-root`

---

### 备选方案：Vercel

**优势：**
- 免费套餐支持
- 自动HTTPS
- 全球CDN

**注意：** Vercel主要面向前端，Node.js API支持有限，建议优先用Railway。

---

## 🚀 快速部署（一键脚本）

### 方式1：Docker部署（推荐）

**创建 Dockerfile：**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY spiritual_root_api.js .

EXPOSE 3000

CMD ["node", "spiritual_root_api.js"]
```

**构建并运行：**
```bash
docker build -t spiritual-root-api .
docker run -p 3000:3000 spiritual-root-api
```

**推送到Docker Hub：**
```bash
docker tag spiritual-root-api yourusername/spiritual-root-api:latest
docker push yourusername/spiritual-root-api:latest
```

然后在 Railway/Render 选择 Docker 镜像部署。

---

### 方式2：直接上传（Railway）

1. 打包代码：
   ```bash
   cd api_deploy
   zip -r spiritual_root_api.zip .
   ```

2. 访问 Railway → 新项目 → Deploy from upload
3. 上传 zip
4. 等待部署完成（约1-2分钟）

---

## 🧪 测试API

部署完成后，测试以下端点：

```bash
# 健康检查
curl https://your-domain.com/api/health

# POST方式测试
curl -X POST https://your-domain.com/api/spiritual-root \
  -H "Content-Type: application/json" \
  -d '{
    "birth_date": "1990-08-16",
    "birth_hour": 14,
    "gender": "female"
  }'

# GET方式测试
curl "https://your-domain.com/api/spiritual-root?birth_date=1990-08-16&birth_hour=14&gender=female"

# API文档
curl https://your-domain.com/api/docs
```

---

## 💰 成本估算

### Railway
- 免费套餐：$5/月额度
- 预计成本：$0-5/月（轻量级API）
- 超出后：$0.0005/请求

### 阿里云 FC
- 免费额度：100万次调用/月
- 超出后：¥0.0001/次
- 预计成本：¥0-10/月

### Render
- 免费套餐：750小时/月
- 自动休眠（15分钟无请求）
- 适合测试，不适合生产

---

## 🔐 安全配置

### 生产环境建议：

1. **启用HTTPS**（Railway/Render自动支持）

2. **添加API密钥验证**（可选）
   ```javascript
   // 在 spiritual_root_api.js 中添加
   const API_KEY = process.env.API_KEY;
   
   app.use((req, res, next) => {
     if (req.path === '/api/spiritual-root') {
       const key = req.headers['x-api-key'];
       if (key !== API_KEY) {
         return res.status(401).json({ error: 'Invalid API key' });
       }
     }
     next();
   });
   ```

3. **限制请求频率**（可选）
   - 使用 express-rate-limit 中间件
   - 建议：100次/分钟/IP

4. **日志监控**
   - Railway/Render 自带日志
   - 可接入 Sentry 错误追踪

---

## 📊 监控与运维

### 健康检查端点
```
GET /api/health
```
返回：
```json
{
  "status": "ok",
  "timestamp": "2026-07-30T00:00:00.000Z",
  "uptime": 3600
}
```

### 建议监控指标：
- 请求成功率
- 响应时间（P50/P95/P99）
- 错误率
- 并发请求数

---

## 🎯 下一步

API上线后，可以：

1. **B端合作**：向合作方提供API接入文档
2. **网站集成**：AncientTongue.AI网站接入API
3. **小程序接入**：国内小程序调用API
4. **数据分析**：记录调用数据，分析用户画像

---

## 📞 技术支持

如有问题，联系：
- 邮箱：zhangyunfei@shejianai.com.cn
- 微信：[老公微信]

---

**文档版本：** v1.0  
**最后更新：** 2026-07-30
