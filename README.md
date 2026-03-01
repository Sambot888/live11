# 币安西游（Binance Odyssey）像素可玩原型

这是一个可直接运行的前端原型（纯 HTML/CSS/JS，无需打包），重点演示：

- 创建角色并进入游戏
- 像素世界（Canvas）实时移动
- 键盘/鼠标控制人物
- BSC 钱包连接基础接口
- 10亿 BOY 代币经济学展示

## 操作说明

- 键盘：`WASD` 或 `方向键` 移动角色
- 鼠标：点击地图任意位置，角色自动向目标移动
- 按钮：创建角色 -> 进入游戏 -> 暂停/继续

## 钱包接口（BSC）

- 连接钱包：`eth_requestAccounts`
- 查询链：`eth_chainId`
- 切换 BSC：`wallet_switchEthereumChain` 到 `0x38`
- 未添加 BSC 时会尝试 `wallet_addEthereumChain`

> 当前是前端原型联调，不包含真实合约交易。

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
