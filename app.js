const tokenomics = [
  "总量：1,000,000,000 BOY（固定总量）",
  "生态奖励 35%：350,000,000",
  "流动性与做市 20%：200,000,000",
  "团队与顾问 15%：150,000,000（线性解锁）",
  "社区与空投 10%：100,000,000",
  "金库与治理 10%：100,000,000",
  "市场合作 10%：100,000,000"
];

tokenomics.forEach((line) => {
  const li = document.createElement("li");
  li.textContent = line;
  document.getElementById("tokenomics").appendChild(li);
});

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const TILE = 24;
const MAP_W = 40;
const MAP_H = 22;
const map = generateMap(MAP_W, MAP_H);

const state = {
  role: null,
  inGame: false,
  paused: false,
  keys: new Set(),
  mouseTarget: null,
  walletAddress: null,
  chainId: null
};

const player = {
  x: 4 * TILE,
  y: 4 * TILE,
  size: 14,
  speed: 2.1,
  hp: 100,
  exp: 0,
  gold: 100
};

function logEvent(text) {
  const li = document.createElement("li");
  li.textContent = `${new Date().toLocaleTimeString()} - ${text}`;
  document.getElementById("eventLog").prepend(li);
}

function updateGameState(title, body) {
  document.getElementById("gameState").innerHTML = `<strong>${title}</strong><br/>${body}`;
}

function updateWalletState(title, body) {
  document.getElementById("walletState").innerHTML = `<strong>${title}</strong><br/>${body}<br/>链: ${state.chainId || "未连接"}<br/>地址: ${state.walletAddress || "未连接"}`;
}

function createRole() {
  const name = document.getElementById("playerName").value.trim();
  const className = document.getElementById("playerClass").value;
  if (!name) return updateGameState("创建失败", "请输入角色名");
  state.role = { name, className, level: 1 };
  player.hp = 100; player.exp = 0; player.gold = 100;
  updateGameState("角色创建成功", `${name}（${className}）已创建，点击“进入游戏”开始冒险。`);
  logEvent(`创建角色：${name}（${className}）`);
}

function enterGame() {
  if (!state.role) return updateGameState("无法进入", "请先创建角色");
  state.inGame = true;
  state.paused = false;
  player.x = 4 * TILE; player.y = 4 * TILE;
  updateGameState("已进入游戏", "你已进入长安主城，使用键盘或鼠标控制角色。\n靠近绿色像素点可拾取灵石。\n");
  logEvent("进入游戏世界");
}

async function connectWallet() {
  if (!window.ethereum) {
    updateWalletState("未检测到钱包", "请安装 MetaMask/OKX Wallet（EVM）。");
    return;
  }
  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    state.walletAddress = accounts?.[0] || null;
    state.chainId = await window.ethereum.request({ method: "eth_chainId" });
    updateWalletState("连接成功", "钱包已连接，可进行链上身份验证。\n");
    logEvent("钱包连接成功");
  } catch (e) {
    updateWalletState("连接失败", e?.message || "用户拒绝或钱包异常");
  }
}

async function switchToBsc() {
  if (!window.ethereum) {
    updateWalletState("无法切链", "未检测到钱包注入对象");
    return;
  }
  try {
    await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x38" }] });
  } catch (err) {
    if (err?.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: "0x38",
          chainName: "BNB Smart Chain",
          nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
          rpcUrls: ["https://bsc-dataseed.binance.org/"],
          blockExplorerUrls: ["https://bscscan.com"]
        }]
      });
    } else {
      updateWalletState("切换失败", err?.message || "钱包拒绝切换");
      return;
    }
  }
  state.chainId = await window.ethereum.request({ method: "eth_chainId" });
  updateWalletState("已切换BSC", "当前网络已切换到 BSC 主网（0x38）。");
  logEvent("切换到 BSC 主网");
}

function generateMap(w, h) {
  const arr = Array.from({ length: h }, () => Array.from({ length: w }, () => 0));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) arr[y][x] = 1;
      if ((x % 9 === 0 && y % 5 < 3) || (y % 7 === 0 && x % 11 === 3)) arr[y][x] = 1;
      if (Math.random() < 0.03) arr[y][x] = 2; // 灵石
    }
  }
  arr[4][4] = 0;
  return arr;
}

function isBlocked(px, py) {
  const tx = Math.floor(px / TILE);
  const ty = Math.floor(py / TILE);
  return map[ty]?.[tx] === 1;
}

function tryMove(dx, dy) {
  const nx = player.x + dx;
  const ny = player.y + dy;
  if (!isBlocked(nx, player.y)) player.x = nx;
  if (!isBlocked(player.x, ny)) player.y = ny;
}

function update() {
  if (!state.inGame || state.paused) return;

  const speed = player.speed;
  if (state.keys.has("ArrowUp") || state.keys.has("w")) tryMove(0, -speed);
  if (state.keys.has("ArrowDown") || state.keys.has("s")) tryMove(0, speed);
  if (state.keys.has("ArrowLeft") || state.keys.has("a")) tryMove(-speed, 0);
  if (state.keys.has("ArrowRight") || state.keys.has("d")) tryMove(speed, 0);

  if (state.mouseTarget) {
    const dx = state.mouseTarget.x - player.x;
    const dy = state.mouseTarget.y - player.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 4) {
      state.mouseTarget = null;
    } else {
      tryMove((dx / dist) * speed, (dy / dist) * speed);
    }
  }

  const tx = Math.floor(player.x / TILE);
  const ty = Math.floor(player.y / TILE);
  if (map[ty]?.[tx] === 2) {
    map[ty][tx] = 0;
    player.gold += 8;
    player.exp += 3;
    logEvent("拾取灵石 +8 金币, +3 经验");
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      const cell = map[y][x];
      if (cell === 1) ctx.fillStyle = "#243c6e";
      else ctx.fillStyle = ((x + y) % 2 === 0) ? "#0f2144" : "#11284f";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);

      if (cell === 2) {
        ctx.fillStyle = "#53ff8d";
        ctx.fillRect(x * TILE + 9, y * TILE + 9, 6, 6);
      }
    }
  }

  ctx.fillStyle = "#ffcc66";
  ctx.fillRect(player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);
  ctx.fillStyle = "#231800";
  ctx.fillRect(player.x - 2, player.y - 2, 4, 4);

  if (state.mouseTarget) {
    ctx.strokeStyle = "#6ee7ff";
    ctx.beginPath();
    ctx.arc(state.mouseTarget.x, state.mouseTarget.y, 6, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(5,10,25,0.8)";
  ctx.fillRect(8, 8, 280, 68);
  ctx.fillStyle = "#d8e8ff";
  ctx.font = "14px Arial";
  const roleLine = state.role ? `${state.role.name} Lv.${state.role.level} ${state.role.className}` : "未创建角色";
  ctx.fillText(roleLine, 16, 28);
  ctx.fillText(`HP: ${player.hp}  EXP: ${player.exp}  金币: ${player.gold}`, 16, 48);
  ctx.fillText(`状态: ${state.inGame ? (state.paused ? "暂停" : "游戏中") : "未进入"}`, 16, 68);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  state.mouseTarget = {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
});

window.addEventListener("keydown", (e) => state.keys.add(e.key.toLowerCase()));
window.addEventListener("keyup", (e) => state.keys.delete(e.key.toLowerCase()));

document.getElementById("createRoleBtn").addEventListener("click", createRole);
document.getElementById("enterGameBtn").addEventListener("click", enterGame);
document.getElementById("pauseBtn").addEventListener("click", () => { state.paused = !state.paused; logEvent(state.paused ? "游戏已暂停" : "继续游戏"); });
document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);
document.getElementById("switchBscBtn").addEventListener("click", switchToBsc);
document.getElementById("startBtn").addEventListener("click", () => canvas.scrollIntoView({ behavior: "smooth" }));

updateGameState("等待创建角色", "创建角色后进入游戏即可操作人物。\n");
updateWalletState("未连接", "点击“连接钱包”开始。\n");
logEvent("原型已加载：可创建角色并控制人物移动");
loop();
