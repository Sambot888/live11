# 币安西游（Binance Odyssey）可运行原型

这是一个基于 `binance-westward-game-design.md` 的前端可运行原型（纯 HTML/CSS/JS，无需安装依赖）。

## 当前版本包含

- 角色创建与“进入游戏”体验流
- BSC 钱包接口（连接钱包 + 切换到 BSC 主网 0x38）
- 三章主线、世界事件时间轴、可点击三界场景地图
- 场景任务/副本推荐、核心人物、挖宝图玩法
- OpenClaw 自动代理实验模块（自动日常/副本/挖宝策略）
- 代币经济学基础方案：`BOY` 总量 **10 亿**（固定总量）

## OpenClaw 自动代理说明

- 在页面中选择策略（平衡收益 / 资源优先 / 副本优先）后点击“启动代理”。
- 代理会每 5 秒自动执行一次动作（刷任务、切换场景副本或触发挖宝）。
- 你可以随时点击“停止代理”结束自动执行。
- 这是前端原型级自动代理，用于演示 AI/脚本托管玩法，不连接真实链上交易。

## BSC 钱包接口说明（基础）

- 点击“连接钱包”会调用 `window.ethereum` 的 `eth_requestAccounts`。
- 点击“切换 BSC”会尝试 `wallet_switchEthereumChain` 到 `0x38`。
- 若钱包未配置 BSC，会自动尝试 `wallet_addEthereumChain` 添加 BSC 网络。
- 当前版本仅做前端接口联调与状态展示，不含链上合约交互。

## 快速启动（推荐）

### Linux / macOS

```bash
./run_local.sh
```

### Windows

```bat
run_local.bat
```

启动后访问：

- http://localhost:8000/

## 备用启动方式

```bash
python3 serve.py
```

或：

```bash
python3 -m http.server 8000
```

## 常见无法访问问题排查

1. **服务没有启动成功**：终端需要持续运行，不要关闭启动窗口。
2. **端口被占用**：
   - Linux/macOS: `PORT=8080 ./run_local.sh`
   - Windows: `set PORT=8080 && run_local.bat`
   - 然后访问 `http://localhost:8080/`
3. **容器/远程环境访问**：若本机无法直连 `localhost`，请使用平台提供的端口转发地址。
4. **防火墙限制**：确认本地防火墙或安全软件未阻止 Python 网络监听。

## 文件说明

- `binance-westward-game-design.md`：完整策划文档
- `index.html`：页面结构
- `styles.css`：视觉样式
- `app.js`：场景/人物/玩法等交互逻辑
- `serve.py`：显式监听 `0.0.0.0:8000` 的启动脚本
- `run_local.sh` / `run_local.bat`：一键启动脚本
