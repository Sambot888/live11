# 币安西游（Binance Odyssey）像素可玩原型

这是一个可直接运行的前端原型（纯 HTML/CSS/JS，无需打包），重点演示：

- 创建角色并进入游戏
- 像素世界（Canvas）实时移动与 HUD
- 键盘/鼠标控制人物
- BSC 钱包连接基础接口（多钱包检测）
- 10亿 BOY 代币经济学展示

## 操作说明

- 键盘：`WASD` 或 `方向键` 移动角色
- 鼠标：点击地图任意位置，角色自动向目标移动
- 按钮：创建角色 -> 进入游戏 -> 暂停/继续

## 钱包接口（BSC）

- 先点“检测钱包”：识别 `MetaMask / OKX / Binance Wallet`
- 连接钱包：`eth_requestAccounts`
- 查询链：`eth_chainId`
- 切换 BSC：`wallet_switchEthereumChain` 到 `0x38`
- 未添加 BSC 时会尝试 `wallet_addEthereumChain`

> 当前是前端原型联调，不包含真实合约交易。

### 如果仍无法连接钱包

1. 请确保你在**本机浏览器**打开（建议 `http://localhost:8000`）。
2. 确认钱包扩展已安装并启用“允许该网站访问”。
3. 如果浏览器装了多个钱包，先点“检测钱包”再连接。
4. 清空页面缓存后重试（Ctrl/Cmd + Shift + R）。

## 代币经济学（BOY）

- 总量：1,000,000,000（10亿，固定）
- 分配：生态35%、流动性20%、团队15%、社区10%、金库10%、市场10%

## 启动

### Linux / macOS

```bash
./run_local.sh
```

### Windows

```bat
run_local.bat
```

然后打开：

- http://localhost:8000/
