const data = {
  chapters: [
    "第一章：断链长安（调查灵脉断裂，修复新手灵脉）",
    "第二章：跨链东海（打通海域传送阵，开放跨服贸易）",
    "第三章：天宫共识战（帮派争夺共识权重，决定赛季结局）"
  ],
  scenes: [
    { name: "长安主城", intro: "主线接取、拍卖行、师徒大厅、公会招募。", web3: "链上市场入口 + 链上事件公告板。", coords: { x: 18, y: 56 }, routes: ["花果山", "天宫议会"], quests: ["日常：巡城除妖", "副本：朱雀坊地宫", "生活：摆摊与拍卖"] },
    { name: "花果山", intro: "日常刷怪、采集、驯养坐骑、单人试炼。", web3: "资源产出受赛季灵气指数与公会领地加成影响。", coords: { x: 40, y: 28 }, routes: ["长安主城", "火焰山"], quests: ["组队：七十二洞挑战", "采集：灵桃与矿脉", "奇遇：猴王残影"] },
    { name: "东海龙宫", intro: "跨服副本入口、跨区交易港、海域 Boss。", web3: "跨服交易可视化跨链桥，潮汐盘代表流动性状态。", coords: { x: 73, y: 44 }, routes: ["火焰山", "天宫议会"], quests: ["团队：潮汐神殿", "贸易：海域商票交换", "挑战：龙渊守卫"] },
    { name: "火焰山", intro: "高难秘境、装备材料掉落、赛季冲榜区。", web3: "高风险高收益的掉落与消耗规则全公开。", coords: { x: 56, y: 68 }, routes: ["花果山", "东海龙宫"], quests: ["高难：业火试炼", "Boss：牛魔残魂", "排行：灼炎层数竞速"] },
    { name: "天宫议会", intro: "赛季规则提案、门派联盟、共识投票。", web3: "任务贡献 + 持证双权重治理，降低参与门槛。", coords: { x: 84, y: 16 }, routes: ["长安主城", "东海龙宫"], quests: ["议会：赛季词条投票", "联盟：帮派条约签署", "奖励：治理徽章"] }
  ],
  events: [
    "周一 20:00：噬链妖王入侵花果山，掉落坐骑强化材料",
    "周三 21:00：龙宫跨服商队刷新，开放限时跨区交易税减免",
    "周五 20:30：火焰山天梯冲刺夜，排行榜积分翻倍",
    "周日 19:30：天宫议会公开辩论，决定下周赛季修正词条"
  ],
  tokenomics: [
    "总量：1,000,000,000 BOY（10 亿，固定总量）",
    "生态奖励：35%（350,000,000）- 任务、赛季、PVE 激励，48个月线性释放",
    "流动性与做市：20%（200,000,000）- DEX/CEX 流动性与深度维护",
    "团队与顾问：15%（150,000,000）- 12个月悬崖 + 24个月线性解锁",
    "社区与空投：10%（100,000,000）- 社区增长、早期贡献者奖励",
    "金库与治理：10%（100,000,000）- 由链上治理控制的生态基金",
    "市场与合作：10%（100,000,000）- 联运、品牌合作、赛事运营"
  ],
  characters: [
    { name: "链机子", role: "军师", desc: "修补灵脉节点，负责新手链上教学。" },
    { name: "白骨夫人·重铸", role: "刺客", desc: "高爆发伪装，追求身份凭证重建名誉。" },
    { name: "龙太子·潮汐守望者", role: "坦克", desc: "守护跨海航路，提供团队护盾减伤。" },
    { name: "玄奘·行愿共识者", role: "辅助", desc: "治疗净化复活，强调可信协作。" },
    { name: "无相魔主", role: "反派", desc: "以无限增发诱惑众生，制造经济失衡。" }
  ],
  loops: [
    "15分钟：日常任务 + 单人速刷（保底收益）",
    "30分钟：组队副本 + 门派任务（核心成长）",
    "弹性时段：摆摊交易 / 家园装修 / 帮派活动",
    "周目标：赛季Boss + 天梯 + 议会提案"
  ],
  tokens: [
    { name: "BOY", usage: "主治理代币", from: "赛季/生态激励", sink: "治理质押、稀有外观竞拍、公会领地税" },
    { name: "LING", usage: "游戏内循环", from: "副本、日常、采集", sink: "强化、打造、修理、传送" }
  ],
  treasureMaps: [
    { title: "长安暗巷残卷", scene: "长安主城", clue: "在城南石狮旁，等待灯笼第三次熄灭后挖掘。", outcomes: ["获得 LING x80", "触发黑市判官喽啰战斗", "挖出可交易家园摆件"] },
    { title: "花果山云雾图", scene: "花果山", clue: "沿瀑布逆流而上，找到会发光的桃树根。", outcomes: ["获得坐骑口粮与驯养经验", "遭遇噬链妖王分身", "发现稀有采集点坐标NFT"] },
    { title: "东海潮汐秘图", scene: "东海龙宫", clue: "潮汐盘指针指向子时方向时，下潜至珊瑚门。", outcomes: ["获得 BOY 碎片", "解锁跨服藏宝副本入口", "获得传奇法宝打造材料"] }
  ]
};

const ui = {
  chaptersEl: document.getElementById("chapters"),
  scenesEl: document.getElementById("sceneCards"),
  sceneDetailEl: document.getElementById("sceneDetail"),
  mapCanvasEl: document.getElementById("mapCanvas"),
  questListEl: document.getElementById("questList"),
  eventTimelineEl: document.getElementById("eventTimeline"),
  tokenomicsEl: document.getElementById("tokenomics"),
  tabsEl: document.getElementById("characterTabs"),
  characterDetailEl: document.getElementById("characterDetail"),
  loopsEl: document.getElementById("loops"),
  tokensEl: document.getElementById("tokens"),
  treasureDetailEl: document.getElementById("treasureDetail"),
  treasureLogEl: document.getElementById("treasureLog"),
  agentStateEl: document.getElementById("agentState"),
  agentLogEl: document.getElementById("agentLog"),
  strategyEl: document.getElementById("agentStrategy"),
  walletStateEl: document.getElementById("walletState"),
  gameStateEl: document.getElementById("gameState")
};

const state = {
  currentTreasureMap: null,
  activeSceneIndex: 0,
  agentTimer: null,
  walletAddress: null,
  chainId: null,
  role: null,
  inGame: false
};

function render() {
  data.chapters.forEach((text) => appendListItem(ui.chaptersEl, text));
  data.events.forEach((text) => appendListItem(ui.eventTimelineEl, text));
  data.loops.forEach((text) => appendListItem(ui.loopsEl, text));
  data.tokenomics.forEach((text) => appendListItem(ui.tokenomicsEl, text));

  data.scenes.forEach((scene, idx) => {
    const card = document.createElement("button");
    card.className = "card";
    card.textContent = scene.name;
    card.addEventListener("click", () => showScene(idx));
    ui.scenesEl.appendChild(card);
  });

  data.characters.forEach((c, idx) => {
    const btn = document.createElement("button");
    btn.className = "tab";
    btn.textContent = `${c.name} · ${c.role}`;
    btn.addEventListener("click", () => showCharacter(idx));
    ui.tabsEl.appendChild(btn);
  });

  data.tokens.forEach((t) => {
    const div = document.createElement("div");
    div.className = "token";
    div.innerHTML = `<strong>${t.name}</strong><p>用途：${t.usage}</p><p>来源：${t.from}</p><p>主要消耗：${t.sink}</p>`;
    ui.tokensEl.appendChild(div);
  });

  buildMap();
  showScene(0);
  showCharacter(0);
  assignNewTreasureMap();
  updateAgentState("未启动", "请选择策略并点击“启动代理”。");
  updateWalletState("未连接", "请连接 EVM 钱包（MetaMask/OKX Wallet）。");
  updateGameState("未创建角色", "请先创建角色，再进入游戏体验。");
}

function appendListItem(parent, text) {
  const li = document.createElement("li");
  li.textContent = text;
  parent.appendChild(li);
}

function buildMap() {
  const sceneByName = Object.fromEntries(data.scenes.map((s, i) => [s.name, i]));
  data.scenes.forEach((scene) => {
    scene.routes.forEach((target) => {
      if (scene.name > target) return;
      drawLink(scene.coords, data.scenes[sceneByName[target]].coords);
    });
  });

  data.scenes.forEach((scene, idx) => {
    const node = document.createElement("button");
    node.className = "map-node";
    node.textContent = scene.name;
    node.style.left = `${scene.coords.x}%`;
    node.style.top = `${scene.coords.y}%`;
    node.addEventListener("click", () => showScene(idx));
    ui.mapCanvasEl.appendChild(node);
  });
}

function drawLink(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const line = document.createElement("div");
  line.className = "map-link";
  line.style.left = `${a.x}%`;
  line.style.top = `${a.y}%`;
  line.style.width = `${Math.hypot(dx, dy)}%`;
  line.style.transform = `rotate(${Math.atan2(dy, dx) * (180 / Math.PI)}deg)`;
  ui.mapCanvasEl.appendChild(line);
}

function showScene(i) {
  state.activeSceneIndex = i;
  const s = data.scenes[i];
  ui.sceneDetailEl.innerHTML = `<h3>${s.name}</h3><p>${s.intro}</p><p><strong>Web3映射：</strong>${s.web3}</p><p><strong>可前往：</strong>${s.routes.join("、")}</p><p><strong>推荐内容：</strong>${s.quests.join(" / ")}</p>`;
  ui.questListEl.innerHTML = "";
  s.quests.forEach((q) => appendListItem(ui.questListEl, `${s.name} · ${q}`));
  document.querySelectorAll(".map-node").forEach((node, idx) => node.classList.toggle("active", idx === i));
}

function showCharacter(i) {
  const c = data.characters[i];
  ui.characterDetailEl.innerHTML = `<h3>${c.name}（${c.role}）</h3><p>${c.desc}</p>`;
}

function assignNewTreasureMap() {
  state.currentTreasureMap = data.treasureMaps[Math.floor(Math.random() * data.treasureMaps.length)];
  ui.treasureDetailEl.innerHTML = `<h3>${state.currentTreasureMap.title}</h3><p><strong>目标场景：</strong>${state.currentTreasureMap.scene}</p><p><strong>线索：</strong>${state.currentTreasureMap.clue}</p>`;
  addTreasureLog(`已领取新宝图：${state.currentTreasureMap.title}`);
}

function digTreasure() {
  if (!state.currentTreasureMap) return addTreasureLog("当前没有宝图，请先领取。", true);
  const outcome = state.currentTreasureMap.outcomes[Math.floor(Math.random() * state.currentTreasureMap.outcomes.length)];
  addTreasureLog(`你在【${state.currentTreasureMap.scene}】挖宝结果：${outcome}`);
  const sceneIndex = data.scenes.findIndex((scene) => scene.name === state.currentTreasureMap.scene);
  if (sceneIndex >= 0 && sceneIndex !== state.activeSceneIndex) showScene(sceneIndex);
}

function addTreasureLog(message, isWarn = false) {
  const li = document.createElement("li");
  li.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
  if (isWarn) li.style.color = "#ffd166";
  ui.treasureLogEl.prepend(li);
}

function updateAgentState(status, action) {
  ui.agentStateEl.innerHTML = `<h3>状态：${status}</h3><p><strong>策略：</strong>${ui.strategyEl.value}</p><p><strong>最近动作：</strong>${action}</p>`;
}
function addAgentLog(message) {
  const li = document.createElement("li");
  li.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
  ui.agentLogEl.prepend(li);
}
function autoAgentTick() {
  const actions = {
    balanced: ["完成日常任务", "挑战场景副本", "执行一次挖宝"],
    farm: ["优先采集资源", "结算摆摊交易", "执行一次挖宝"],
    pve: ["匹配组队副本", "推进高难关卡", "执行一次挖宝"]
  };
  const chosen = actions[ui.strategyEl.value][Math.floor(Math.random() * 3)];
  if (chosen.includes("挖宝")) {
    if (!state.currentTreasureMap) assignNewTreasureMap();
    digTreasure();
  } else if (chosen.includes("副本") || chosen.includes("关卡")) {
    const randomScene = Math.floor(Math.random() * data.scenes.length);
    showScene(randomScene);
    addAgentLog(`OpenClaw 代理切换到【${data.scenes[randomScene].name}】，执行：${chosen}`);
  } else addAgentLog(`OpenClaw 代理执行：${chosen}`);
  updateAgentState("运行中", chosen);
}
function startAgent() {
  if (state.agentTimer) return;
  addAgentLog("OpenClaw 自动代理已启动。");
  updateAgentState("运行中", "初始化巡检");
  state.agentTimer = setInterval(autoAgentTick, 5000);
}
function stopAgent() {
  if (!state.agentTimer) return;
  clearInterval(state.agentTimer);
  state.agentTimer = null;
  addAgentLog("OpenClaw 自动代理已停止。");
  updateAgentState("已停止", "等待下一次启动");
}

function updateWalletState(status, detail) {
  ui.walletStateEl.innerHTML = `<h3>钱包状态：${status}</h3><p>${detail}</p><p><strong>当前链：</strong>${state.chainId || "未识别"}</p><p><strong>地址：</strong>${state.walletAddress || "未连接"}</p>`;
}

async function connectWallet() {
  if (!window.ethereum) {
    updateWalletState("未检测到钱包", "请安装 MetaMask 或其他 EVM 钱包。当前仍可体验离线模式。");
    return;
  }
  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    state.walletAddress = accounts?.[0] || null;
    state.chainId = await window.ethereum.request({ method: "eth_chainId" });
    updateWalletState("已连接", "钱包连接成功，可进行链上身份与资产步骤。\n");
  } catch (error) {
    updateWalletState("连接失败", error?.message || "用户拒绝或钱包异常。");
  }
}

async function switchToBsc() {
  if (!window.ethereum) {
    updateWalletState("无法切链", "未检测到钱包注入对象。请先安装钱包。");
    return;
  }
  try {
    await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x38" }] });
  } catch (switchError) {
    if (switchError?.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{ chainId: "0x38", chainName: "BNB Smart Chain", nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 }, rpcUrls: ["https://bsc-dataseed.binance.org/"], blockExplorerUrls: ["https://bscscan.com"] }]
      });
    } else {
      updateWalletState("切换失败", switchError?.message || "钱包拒绝或异常。");
      return;
    }
  }
  state.chainId = await window.ethereum.request({ method: "eth_chainId" });
  updateWalletState("已切换 BSC", "已切换到 BSC 主网（0x38）。");
}

function updateGameState(status, detail) {
  ui.gameStateEl.innerHTML = `<h3>游戏状态：${status}</h3><p>${detail}</p>${state.role ? `<p><strong>角色：</strong>${state.role.name}（${state.role.className}）</p>` : ""}`;
}

function createRole() {
  const name = document.getElementById("playerName").value.trim();
  const className = document.getElementById("playerClass").value;
  if (!name) {
    updateGameState("创建失败", "请输入角色名。", true);
    return;
  }
  state.role = { name, className, level: 1 };
  updateGameState("角色已创建", "可以点击“进入游戏”开始体验主城与地图内容。");
}

function enterGame() {
  if (!state.role) {
    updateGameState("无法进入", "请先创建角色。", true);
    return;
  }
  state.inGame = true;
  showScene(0);
  updateGameState("已进入游戏", "已进入长安主城，可点击地图、挖宝、启动代理进行体验。", false);
}

document.getElementById("startBtn").addEventListener("click", () => document.getElementById("mapCanvas").scrollIntoView({ behavior: "smooth" }));
document.getElementById("newTreasureBtn").addEventListener("click", assignNewTreasureMap);
document.getElementById("digTreasureBtn").addEventListener("click", digTreasure);
document.getElementById("startAgentBtn").addEventListener("click", startAgent);
document.getElementById("stopAgentBtn").addEventListener("click", stopAgent);
document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);
document.getElementById("switchBscBtn").addEventListener("click", switchToBsc);
document.getElementById("createRoleBtn").addEventListener("click", createRole);
document.getElementById("enterGameBtn").addEventListener("click", enterGame);
window.addEventListener("beforeunload", stopAgent);

render();
