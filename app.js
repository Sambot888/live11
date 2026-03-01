const tokenomics = [
  "总量：1,000,000,000 BOY（固定总量）",
  "生态奖励 35%：350,000,000",
  "流动性与做市 20%：200,000,000",
  "团队与顾问 15%：150,000,000（线性解锁）",
  "社区与空投 10%：100,000,000",
  "金库与治理 10%：100,000,000",
  "市场合作 10%：100,000,000"
];

const ui = {
  tokenomics: document.getElementById("tokenomics"),
  gameState: document.getElementById("gameState"),
  walletState: document.getElementById("walletState"),
  walletDiag: document.getElementById("walletDiag"),
  eventLog: document.getElementById("eventLog"),
  providerSelect: document.getElementById("providerSelect"),
  agentMode: document.getElementById("agentMode"),
  agentState: document.getElementById("agentState"),
  playerName: document.getElementById("playerName"),
  playerClass: document.getElementById("playerClass"),
  questPanel: document.getElementById("questPanel"),
  canvas: document.getElementById("gameCanvas")
};

tokenomics.forEach((line) => {
  const li = document.createElement("li");
  li.textContent = line;
  ui.tokenomics.appendChild(li);
});

const ctx = ui.canvas.getContext("2d");
const TILE = 24;
const MAP_W = 40;
const MAP_H = 22;
const map = generateMap(MAP_W, MAP_H);
const scene = generateSceneObjects();

const state = {
  role: null,
  inGame: false,
  paused: false,
  showHud: true,
  mounted: false,
  keys: new Set(),
  mouseTarget: null,
  chainId: null,
  walletAddress: null,
  providers: [],
  provider: null,
  providerName: "未检测",
  walletDebug: "",
  frame: 0,
  agentTimer: null,
  lastAttackAt: 0,
  skillCooldown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  quest: { collect: { need: 8, got: 0 }, kill: { need: 3, got: 0 }, talkNpc: false }
};

const player = { x: 4 * TILE, y: 4 * TILE, size: 14, speed: 2.0, hp: 100, exp: 0, gold: 100, dir: "down" };
const npc = { x: 12 * TILE, y: 9 * TILE, size: 14 };
const enemies = [
  { x: 22 * TILE, y: 8 * TILE, hp: 20, maxHp: 20, alive: true },
  { x: 30 * TILE, y: 14 * TILE, hp: 22, maxHp: 22, alive: true },
  { x: 16 * TILE, y: 16 * TILE, hp: 18, maxHp: 18, alive: true }
];

function generateSceneObjects() {
  const trees = [];
  const houses = [{ x: 6 * TILE, y: 4 * TILE, w: 3 * TILE, h: 2 * TILE }, { x: 33 * TILE, y: 5 * TILE, w: 4 * TILE, h: 2 * TILE }];
  for (let i = 0; i < 24; i++) trees.push({ x: Math.floor(Math.random() * MAP_W) * TILE + 12, y: Math.floor(Math.random() * MAP_H) * TILE + 12 });
  return { trees, houses };
}

function logEvent(text) {
  const li = document.createElement("li");
  li.textContent = `${new Date().toLocaleTimeString()} - ${text}`;
  ui.eventLog.prepend(li);
}

function setDiag(lines) {
  ui.walletDiag.innerHTML = "";
  lines.forEach((line) => {
    const li = document.createElement("li");
    li.textContent = line;
    ui.walletDiag.appendChild(li);
  });
}

function refreshQuestPanel() {
  ui.questPanel.innerHTML = [
    `<strong>任务追踪</strong>`,
    `采集灵石：${state.quest.collect.got}/${state.quest.collect.need}`,
    `击败小妖：${state.quest.kill.got}/${state.quest.kill.need}`,
    `与NPC对话：${state.quest.talkNpc ? "已完成" : "未完成"}`
  ].join("<br>");
}

function updateGameState(title, body) { ui.gameState.innerHTML = `<strong>${title}</strong><br>${body}`; }

function updateWalletState(title, body) {
  const debug = state.walletDebug ? `<br><em>调试：${state.walletDebug}</em>` : "";
  ui.walletState.innerHTML = `<strong>${title}</strong><br>${body}<br>钱包: ${state.providerName}<br>链: ${state.chainId || "未连接"}<br>地址: ${state.walletAddress || "未连接"}${debug}`;
}

function updateAgentState(title, body) { ui.agentState.innerHTML = `<strong>${title}</strong><br>${body}`; }

function providerLabel(p, idx) {
  if (p.isMetaMask) return "MetaMask";
  if (p.isOkxWallet || p.isOKExWallet) return "OKX Wallet";
  if (p.isBinanceChain) return "Binance Wallet";
  return `EVM Wallet ${idx + 1}`;
}

function scanProviders() {
  const list = [];
  const eth = window.ethereum;
  if (eth?.providers?.length) list.push(...eth.providers);
  if (eth) list.push(eth);
  if (window.BinanceChain) list.push(window.BinanceChain);

  const unique = [];
  const seen = new Set();
  list.forEach((p, i) => {
    if (!p) return;
    const id = p.isMetaMask ? "metamask" : (p.isOkxWallet || p.isOKExWallet) ? "okx" : p.isBinanceChain ? "binance" : `evm_${i}`;
    if (seen.has(id)) return;
    seen.add(id);
    unique.push({ id, provider: p, name: providerLabel(p, i) });
  });

  state.providers = unique;
  ui.providerSelect.innerHTML = "";

  if (!unique.length) {
    ui.providerSelect.innerHTML = "<option>未检测到钱包扩展</option>";
    state.provider = null;
    state.providerName = "未检测到";
    state.walletDebug = "没有 window.ethereum provider";
    updateWalletState("未检测到钱包", "请在本机 Chrome/Edge 安装 MetaMask/OKX/Binance Wallet。\n内嵌浏览器通常无扩展注入。\n");
    setDiag([
      `secureContext=${window.isSecureContext}`,
      `userAgent=${navigator.userAgent.slice(0, 80)}...`,
      "ethereum=undefined"
    ]);
    return;
  }

  unique.forEach((entry) => {
    const opt = document.createElement("option");
    opt.value = entry.id;
    opt.textContent = entry.name;
    ui.providerSelect.appendChild(opt);
  });

  selectProvider(unique[0].id);
  state.walletDebug = `providers=${unique.map((x) => x.name).join(",")}`;
  setDiag([
    `secureContext=${window.isSecureContext}`,
    `providers=${unique.map((x) => x.name).join(",")}`,
    "建议：选择正确Provider后再连接"
  ]);
  updateWalletState("检测成功", "请选择 Provider 后点击连接钱包。\n");
}

function selectProvider(id) {
  const found = state.providers.find((x) => x.id === id);
  state.provider = found?.provider || null;
  state.providerName = found?.name || "未检测";
  if (!state.provider) return;

  try {
    state.provider.removeAllListeners?.("accountsChanged");
    state.provider.removeAllListeners?.("chainChanged");
  } catch (_) {}

  state.provider.on?.("accountsChanged", (accounts) => {
    state.walletAddress = accounts?.[0] || null;
    updateWalletState("账户变化", "账户已更新。\n");
  });
  state.provider.on?.("chainChanged", (chainId) => {
    state.chainId = chainId;
    updateWalletState("网络变化", "链ID已更新。\n");
  });
}

async function requestAccounts(provider) {
  if (provider.request) {
    try {
      return await provider.request({ method: "eth_requestAccounts" });
    } catch (e1) {
      if (provider.requestAccounts) return await provider.requestAccounts();
      if (provider.enable) return await provider.enable();
      throw e1;
    }
  }
  if (provider.requestAccounts) return await provider.requestAccounts();
  if (provider.enable) return await provider.enable();
  throw new Error("当前钱包 provider 不支持请求账户");
}

async function getChainId(provider) {
  if (provider.request) {
    try {
      return await provider.request({ method: "eth_chainId" });
    } catch {
      const net = await provider.request({ method: "net_version" });
      return net ? `0x${Number(net).toString(16)}` : null;
    }
  }
  return null;
}

async function runWalletDiagnostic() {
  const lines = [];
  lines.push(`secureContext=${window.isSecureContext}`);
  lines.push(`hasEthereum=${!!window.ethereum}`);
  lines.push(`providersDetected=${state.providers.length}`);
  lines.push(`selected=${state.providerName}`);

  if (!state.provider) {
    lines.push("结果：未检测到可用provider");
    setDiag(lines);
    return;
  }

  try {
    const accounts = state.provider.request
      ? await state.provider.request({ method: "eth_accounts" })
      : [];
    lines.push(`eth_accounts=${accounts?.length || 0}`);
  } catch (e) {
    lines.push(`eth_accounts_error=${e?.code || "NA"}`);
  }

  try {
    const cid = await getChainId(state.provider);
    lines.push(`chainId=${cid || "unknown"}`);
  } catch (e) {
    lines.push(`chainId_error=${e?.code || "NA"}`);
  }

  if (!window.isSecureContext) lines.push("警告：非安全上下文可能导致钱包限制");
  if (!state.provider.request) lines.push("警告：provider无request方法，兼容性差");

  setDiag(lines);
}

async function connectWallet() {
  if (!state.provider) { scanProviders(); if (!state.provider) return; }
  try {
    const accounts = await requestAccounts(state.provider);
    state.walletAddress = accounts?.[0] || null;
    state.chainId = await getChainId(state.provider);
    state.walletDebug = `connected=${!!state.walletAddress}`;
    updateWalletState("连接成功", "钱包连接成功，可执行链上身份验证。\n");
    logEvent(`钱包连接成功：${state.providerName}`);
  } catch (e) {
    state.walletDebug = e?.code ? `code=${e.code}` : "unknown error";
    updateWalletState("连接失败", e?.message || "用户拒绝或钱包异常");
  }
}

async function switchToBsc() {
  if (!state.provider) return updateWalletState("切换失败", "请先检测并连接钱包。\n");
  try {
    if (state.provider.request) {
      await state.provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x38" }] });
    } else if (state.provider.switchNetwork) {
      await state.provider.switchNetwork("bsc-mainnet");
    } else {
      throw new Error("当前钱包不支持切链接口");
    }
  } catch (err) {
    if (err?.code === 4902 && state.provider.request) {
      await state.provider.request({
        method: "wallet_addEthereumChain",
        params: [{ chainId: "0x38", chainName: "BNB Smart Chain", nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 }, rpcUrls: ["https://bsc-dataseed.binance.org/"], blockExplorerUrls: ["https://bscscan.com"] }]
      });
    } else {
      state.walletDebug = err?.code ? `switch code=${err.code}` : "switch error";
      updateWalletState("切换失败", err?.message || "钱包拒绝切换。");
      return;
    }
  }
  state.chainId = await getChainId(state.provider);
  updateWalletState("已切换 BSC", "当前网络为 BSC 主网（0x38）。");
}

function createRole() {
  const name = ui.playerName.value.trim();
  const className = ui.playerClass.value;
  if (!name) return updateGameState("创建失败", "请输入角色名。\n");
  state.role = { name, className, level: 1 };
  player.hp = 100; player.exp = 0; player.gold = 100;
  updateGameState("角色创建成功", `${name}（${className}）已创建。点击“进入游戏”开始冒险。`);
  logEvent(`创建角色：${name}（${className}）`);
}

function enterGame() {
  if (!state.role) return updateGameState("无法进入", "请先创建角色。\n");
  state.inGame = true;
  state.paused = false;
  player.x = 4 * TILE;
  player.y = 4 * TILE;
  updateGameState("已进入游戏", "已进入主城区域。移动、打怪、采集可成长。\n");
  logEvent("进入游戏世界");
}

function generateMap(w, h) {
  const arr = Array.from({ length: h }, () => Array.from({ length: w }, () => 0));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) arr[y][x] = 1;
      if ((x % 9 === 0 && y % 5 < 3) || (y % 7 === 0 && x % 11 === 3)) arr[y][x] = 1;
      if (Math.random() < 0.045) arr[y][x] = 2;
      if ((x > 26 && x < 34 && y > 3 && y < 9) || (x > 4 && x < 10 && y > 13 && y < 17)) arr[y][x] = 3;
    }
  }
  arr[4][4] = 0;
  return arr;
}

function isBlocked(px, py) {
  const tx = Math.floor(px / TILE);
  const ty = Math.floor(py / TILE);
  const cell = map[ty]?.[tx];
  return cell === 1 || cell === 3;
}

function tryMove(dx, dy) {
  const nx = player.x + dx;
  const ny = player.y + dy;
  if (!isBlocked(nx, player.y)) player.x = nx;
  if (!isBlocked(player.x, ny)) player.y = ny;
}

function enemyAi() {
  enemies.forEach((e, i) => {
    if (!e.alive) return;
    const dx = Math.cos((state.frame + i * 13) / 26) * 0.35;
    const dy = Math.sin((state.frame + i * 11) / 29) * 0.35;
    if (!isBlocked(e.x + dx, e.y + dy)) { e.x += dx; e.y += dy; }

    const dist = Math.hypot(player.x - e.x, player.y - e.y);
    if (dist < 26 && Date.now() - state.lastAttackAt > 850) {
      e.hp -= state.mounted ? 8 : 5;
      player.hp = Math.max(0, player.hp - 1);
      state.lastAttackAt = Date.now();
      if (e.hp <= 0) {
        e.alive = false;
        state.quest.kill.got += 1;
        player.exp += 12;
        player.gold += 16;
        logEvent("击败小妖：+12 EXP, +16 金币");
      }
    }
  });
}

function interactNpc() {
  const d = Math.hypot(player.x - npc.x, player.y - npc.y);
  if (d <= 34) {
    state.quest.talkNpc = true;
    logEvent("与NPC对话完成：获得补给包");
    player.hp = Math.min(100, player.hp + 20);
  } else logEvent("交互失败：请靠近 NPC");
}

function doAttack() {
  const target = enemies.find((e) => e.alive && Math.hypot(player.x - e.x, player.y - e.y) < 50);
  if (!target) return logEvent("攻击落空：附近没有敌人");
  target.hp -= 7;
  if (target.hp <= 0) {
    target.alive = false;
    state.quest.kill.got += 1;
    player.exp += 12;
    player.gold += 16;
  }
}

function doDash() {
  const step = state.mounted ? 22 : 16;
  if (player.dir === "up") tryMove(0, -step);
  if (player.dir === "down") tryMove(0, step);
  if (player.dir === "left") tryMove(-step, 0);
  if (player.dir === "right") tryMove(step, 0);
}

function toggleMount() {
  state.mounted = !state.mounted;
  player.speed = state.mounted ? 2.8 : 2.0;
  logEvent(state.mounted ? "已上坐骑：移动速度提升" : "已下坐骑");
}

function castSkill(id) {
  const now = Date.now();
  if (state.skillCooldown[id] > now) return;
  state.skillCooldown[id] = now + 1800;
  if (id === "1") doAttack();
  else if (id === "2") doDash();
  else if (id === "3") interactNpc();
  else if (id === "4") { player.hp = Math.min(100, player.hp + 10); logEvent("技能4：恢复10生命"); }
  else if (id === "5") { state.mounted = !state.mounted; toggleMount(); }
}

function update() {
  if (!state.inGame || state.paused) return;
  const s = player.speed;
  if (state.keys.has("arrowup") || state.keys.has("w")) { tryMove(0, -s); player.dir = "up"; }
  if (state.keys.has("arrowdown") || state.keys.has("s")) { tryMove(0, s); player.dir = "down"; }
  if (state.keys.has("arrowleft") || state.keys.has("a")) { tryMove(-s, 0); player.dir = "left"; }
  if (state.keys.has("arrowright") || state.keys.has("d")) { tryMove(s, 0); player.dir = "right"; }

  if (state.mouseTarget) {
    const dx = state.mouseTarget.x - player.x;
    const dy = state.mouseTarget.y - player.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 4) state.mouseTarget = null;
    else tryMove((dx / dist) * s, (dy / dist) * s);
  }

  const tx = Math.floor(player.x / TILE);
  const ty = Math.floor(player.y / TILE);
  if (map[ty]?.[tx] === 2) {
    map[ty][tx] = 0;
    state.quest.collect.got += 1;
    player.gold += 8;
    player.exp += 3;
  }

  enemyAi();
  refreshQuestPanel();
  state.frame += 1;
}

function drawPlayerSprite(x, y) {
  const blink = (Math.floor(state.frame / 20) % 2) ? "#ffd166" : "#ffe08a";
  ctx.fillStyle = state.mounted ? "#9de0ff" : blink;
  ctx.fillRect(x - 7, y - 7, 14, 14);
  ctx.fillStyle = "#3a2700";
  ctx.fillRect(x - 2, y - 2, 4, 4);
}

function drawSceneDecor() {
  scene.houses.forEach((h) => {
    ctx.fillStyle = "#6b4b2b";
    ctx.fillRect(h.x, h.y, h.w, h.h);
    ctx.fillStyle = "#a83d2f";
    ctx.fillRect(h.x, h.y - 8, h.w, 8);
  });
  scene.trees.forEach((t) => {
    ctx.fillStyle = "#1b5a33";
    ctx.fillRect(t.x - 6, t.y - 10, 12, 12);
    ctx.fillStyle = "#6b4b2b";
    ctx.fillRect(t.x - 2, t.y + 2, 4, 6);
  });
}

function draw() {
  if (!ctx) return;
  const wave = (Math.sin(state.frame / 10) + 1) * 0.5;
  const g = ctx.createLinearGradient(0, 0, 0, ui.canvas.height);
  g.addColorStop(0, "#203f7f");
  g.addColorStop(1, "#0f1e44");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, ui.canvas.width, ui.canvas.height);

  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      const cell = map[y][x];
      if (cell === 1) ctx.fillStyle = "#3b5c96";
      else if (cell === 3) ctx.fillStyle = wave > 0.45 ? "#2b7cb5" : "#21699c";
      else ctx.fillStyle = ((x + y) % 2 === 0) ? "#1e4b2f" : "#245a37";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      if (cell === 2) {
        ctx.fillStyle = "#7dff9a";
        ctx.fillRect(x * TILE + 8, y * TILE + 8, 8, 8);
      }
    }
  }

  drawSceneDecor();
  ctx.fillStyle = "#ff77d8";
  ctx.fillRect(npc.x - npc.size / 2, npc.y - npc.size / 2, npc.size, npc.size);

  enemies.forEach((e) => {
    if (!e.alive) return;
    ctx.fillStyle = "#ff6f61";
    ctx.fillRect(e.x - 7, e.y - 7, 14, 14);
    ctx.fillStyle = "#111";
    ctx.fillRect(e.x - 8, e.y - 12, 16, 3);
    ctx.fillStyle = "#f44";
    ctx.fillRect(e.x - 8, e.y - 12, Math.max(0, (e.hp / e.maxHp) * 16), 3);
  });

  drawPlayerSprite(player.x, player.y);
  if (state.mouseTarget) {
    ctx.strokeStyle = "#6ee7ff";
    ctx.beginPath();
    ctx.arc(state.mouseTarget.x, state.mouseTarget.y, 7, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (state.showHud) {
    ctx.fillStyle = "rgba(3,8,20,0.78)";
    ctx.fillRect(8, 8, 390, 82);
    ctx.fillStyle = "#e7f1ff";
    ctx.font = "14px Arial";
    const roleLine = state.role ? `${state.role.name} Lv.${state.role.level} ${state.role.className}` : "未创建角色";
    ctx.fillText(roleLine, 16, 28);
    ctx.fillText(`HP ${player.hp} | EXP ${player.exp} | 金币 ${player.gold} | 坐骑 ${state.mounted ? "是" : "否"}`, 16, 48);
    ctx.fillText(`状态: ${state.inGame ? (state.paused ? "暂停" : "游戏中") : "未进入"}`, 16, 68);
  }
}

function findNearestCellValue(value) {
  let best = null;
  let bestDist = Infinity;
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      if (map[y][x] !== value) continue;
      const cx = x * TILE + TILE / 2;
      const cy = y * TILE + TILE / 2;
      const d = Math.hypot(player.x - cx, player.y - cy);
      if (d < bestDist) { bestDist = d; best = { x: cx, y: cy }; }
    }
  }
  return best;
}

function stepAgent() {
  if (!state.inGame || state.paused) return;
  const mode = ui.agentMode.value;
  const alive = enemies.find((e) => e.alive);
  if (mode === "farm") {
    const target = findNearestCellValue(2);
    if (target) state.mouseTarget = target;
  } else if (mode === "combat") {
    if (alive) state.mouseTarget = { x: alive.x, y: alive.y };
  } else {
    const target = Math.random() > 0.5 ? findNearestCellValue(2) : alive ? { x: alive.x, y: alive.y } : null;
    if (target) state.mouseTarget = target;
  }
  updateAgentState("运行中", `当前策略：${mode}`);
}

function startAgent() {
  if (state.agentTimer) return;
  state.agentTimer = setInterval(stepAgent, 1200);
  updateAgentState("已启动", `OpenClaw 代理策略：${ui.agentMode.value}`);
}

function stopAgent() {
  if (!state.agentTimer) return;
  clearInterval(state.agentTimer);
  state.agentTimer = null;
  updateAgentState("已停止", "代理已停止，恢复手动控制。\n");
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

ui.canvas.addEventListener("click", (e) => {
  const rect = ui.canvas.getBoundingClientRect();
  const scaleX = ui.canvas.width / rect.width;
  const scaleY = ui.canvas.height / rect.height;
  state.mouseTarget = { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
});
window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  state.keys.add(key);
  if (["1", "2", "3", "4", "5"].includes(key)) castSkill(key);
});
window.addEventListener("keyup", (e) => state.keys.delete(e.key.toLowerCase()));

ui.providerSelect.addEventListener("change", () => selectProvider(ui.providerSelect.value));
document.getElementById("detectWalletBtn").addEventListener("click", scanProviders);
document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);
document.getElementById("switchBscBtn").addEventListener("click", switchToBsc);
document.getElementById("walletDiagBtn").addEventListener("click", runWalletDiagnostic);
document.getElementById("createRoleBtn").addEventListener("click", createRole);
document.getElementById("enterGameBtn").addEventListener("click", enterGame);
document.getElementById("pauseBtn").addEventListener("click", () => { state.paused = !state.paused; });
document.getElementById("toggleHudBtn").addEventListener("click", () => { state.showHud = !state.showHud; });
document.getElementById("startAgentBtn").addEventListener("click", startAgent);
document.getElementById("stopAgentBtn").addEventListener("click", stopAgent);
document.getElementById("attackBtn").addEventListener("click", doAttack);
document.getElementById("dashBtn").addEventListener("click", doDash);
document.getElementById("interactBtn").addEventListener("click", interactNpc);
document.getElementById("mountBtn").addEventListener("click", toggleMount);
document.querySelectorAll('.skill').forEach((btn)=>btn.addEventListener('click',()=>castSkill(btn.dataset.skill)));

updateGameState("等待创建角色", "创建角色后进入游戏即可操作人物。\n");
updateAgentState("未启动", "选择策略后点击启动代理。\n");
refreshQuestPanel();
scanProviders();
logEvent("原型已加载：梦幻主界面增强版");
loop();
