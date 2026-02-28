# 币安西游（Binance Odyssey）可运行原型

这是一个基于 `binance-westward-game-design.md` 的前端可运行原型（纯 HTML/CSS/JS，无需安装依赖）。

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
