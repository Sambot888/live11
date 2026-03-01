# 币安西游（Binance Odyssey）像素可玩原型

本轮继续优化了场景和操作界面，重点提升“像游戏”的体验：

- 更丰富场景：草地/水域/障碍/建筑/树木/NPC/敌人
- 操作面板：攻击、冲刺、交互、上/下坐骑
- 任务追踪：采集、击杀、NPC 对话三类进度
- OpenClaw 自动代理：刷资源/打怪/均衡模式
- 钱包连接优化：多 Provider 检测 + 手动选择 + BSC 切链

## 玩法操作

- 键盘：`WASD` / `方向键` 移动
- 鼠标：点击地图自动移动
- 战斗：靠近敌人自动战斗，或点“攻击”主动打击
- 冲刺：点击“冲刺”快速位移
- 交互：靠近 NPC 点击“交互”完成任务项
- 坐骑：点击“上/下坐骑”切换移速与战斗伤害

## 钱包连接建议流程

1. 点击「检测钱包」
2. 在下拉框选择钱包 Provider（MetaMask/OKX/Binance）
3. 点击「连接钱包」授权
4. 点击「切换 BSC」切到 `0x38`

## 启动

### Linux / macOS

```bash
./run_local.sh
```

### Windows

```bat
run_local.bat
```

打开：

- http://localhost:8000/


### 钱包仍连不上时（新增）

- 看右侧“调试”字段：会显示 provider 检测结果与错误码（例如 `code=4001`）。
- `code=4001` 表示你在钱包弹窗里点了拒绝。
- 若显示“没有 window.ethereum provider”，说明当前浏览器/环境没有注入扩展（常见于内置WebView）。
- Binance Wallet 可走 `switchNetwork("bsc-mainnet")` 兼容路径，已在代码中增加。
