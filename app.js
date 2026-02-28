const data = {
  chapters: [
    "第一章：断链长安（调查灵脉断裂）",
    "第二章：跨链东海（修复传送阵与交易港）",
    "第三章：天宫共识战（门派争夺赛季结局）"
  ],
  scenes: [
    { name: "长安主城", intro: "主线接取、拍卖行、师徒大厅", web3: "链上市场入口 + 链上事件公告" },
    { name: "花果山", intro: "日常刷怪、采集、驯养坐骑", web3: "资源产出受赛季与公会控制影响" },
    { name: "东海龙宫", intro: "跨服副本与跨区交易港", web3: "跨服交易可视化跨链桥机制" },
    { name: "火焰山", intro: "高难秘境 + 排行榜", web3: "高风险高收益且收益规则透明" },
    { name: "天宫议会", intro: "赛季提案与规则投票", web3: "任务贡献 + 持证双权重治理" }
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
    { name: "YAO", usage: "治理/高价值", from: "赛季、贡献、活动" },
    { name: "LING", usage: "游戏内循环", from: "用于强化、打造、修理、传送" }
  ],
  treasureMaps: [
    {
      title: "长安暗巷残卷",
      scene: "长安主城",
      clue: "在城南石狮旁，等待灯笼第三次熄灭后挖掘。",
      outcomes: ["获得 LING x80", "触发黑市判官喽啰战斗", "挖出可交易家园摆件"]
    },
    {
      title: "花果山云雾图",
      scene: "花果山",
      clue: "沿瀑布逆流而上，找到会发光的桃树根。",
      outcomes: ["获得坐骑口粮与驯养经验", "遭遇噬链妖王分身", "发现稀有采集点坐标NFT"]
    },
    {
      title: "东海潮汐秘图",
      scene: "东海龙宫",
      clue: "潮汐盘指针指向子时方向时，下潜至珊瑚门。",
      outcomes: ["获得 YAO 碎片", "解锁跨服藏宝副本入口", "获得传奇法宝打造材料"]
    }
  ]
};

const chaptersEl = document.getElementById("chapters");
const scenesEl = document.getElementById("sceneCards");
const sceneDetailEl = document.getElementById("sceneDetail");
const tabsEl = document.getElementById("characterTabs");
const characterDetailEl = document.getElementById("characterDetail");
const loopsEl = document.getElementById("loops");
const tokensEl = document.getElementById("tokens");
const treasureDetailEl = document.getElementById("treasureDetail");
const treasureLogEl = document.getElementById("treasureLog");

let currentTreasureMap = null;

function render() {
  data.chapters.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    chaptersEl.appendChild(li);
  });

  data.scenes.forEach((scene, idx) => {
    const card = document.createElement("button");
    card.className = "card";
    card.textContent = scene.name;
    card.addEventListener("click", () => showScene(idx));
    scenesEl.appendChild(card);
  });

  data.characters.forEach((c, idx) => {
    const btn = document.createElement("button");
    btn.className = "tab";
    btn.textContent = `${c.name} · ${c.role}`;
    btn.addEventListener("click", () => showCharacter(idx));
    tabsEl.appendChild(btn);
  });

  data.loops.forEach((l) => {
    const li = document.createElement("li");
    li.textContent = l;
    loopsEl.appendChild(li);
  });

  data.tokens.forEach((t) => {
    const div = document.createElement("div");
    div.className = "token";
    div.innerHTML = `<strong>${t.name}</strong><p>用途：${t.usage}</p><p>主要来源：${t.from}</p>`;
    tokensEl.appendChild(div);
  });

  showScene(0);
  showCharacter(0);
  assignNewTreasureMap();
}

function showScene(i) {
  const s = data.scenes[i];
  sceneDetailEl.innerHTML = `<h3>${s.name}</h3><p>${s.intro}</p><p><strong>Web3映射：</strong>${s.web3}</p>`;
}

function showCharacter(i) {
  const c = data.characters[i];
  characterDetailEl.innerHTML = `<h3>${c.name}（${c.role}）</h3><p>${c.desc}</p>`;
}

function assignNewTreasureMap() {
  const randomIndex = Math.floor(Math.random() * data.treasureMaps.length);
  currentTreasureMap = data.treasureMaps[randomIndex];
  treasureDetailEl.innerHTML = `
    <h3>${currentTreasureMap.title}</h3>
    <p><strong>目标场景：</strong>${currentTreasureMap.scene}</p>
    <p><strong>线索：</strong>${currentTreasureMap.clue}</p>
  `;
  addTreasureLog(`已领取新宝图：${currentTreasureMap.title}`);
}

function digTreasure() {
  if (!currentTreasureMap) {
    addTreasureLog("当前没有宝图，请先领取。", true);
    return;
  }

  const roll = Math.floor(Math.random() * currentTreasureMap.outcomes.length);
  const outcome = currentTreasureMap.outcomes[roll];
  addTreasureLog(`你在【${currentTreasureMap.scene}】挖宝结果：${outcome}`);
}

function addTreasureLog(message, isWarn = false) {
  const li = document.createElement("li");
  li.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
  if (isWarn) {
    li.style.color = "#ffd166";
  }
  treasureLogEl.prepend(li);
}

document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("sceneCards").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("newTreasureBtn").addEventListener("click", assignNewTreasureMap);
document.getElementById("digTreasureBtn").addEventListener("click", digTreasure);

render();
