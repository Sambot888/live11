// 优化钱包检测和连接过程
function scanProviders() {
  const list = [];
  const eth = window.ethereum;

  // 检测钱包提供商
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

  // 无可用钱包扩展时，给出明确提示
  if (!unique.length) {
    const opt = document.createElement("option");
    opt.textContent = "未检测到钱包扩展，请安装钱包扩展（如MetaMask）";
    ui.providerSelect.appendChild(opt);
    state.provider = null;
    state.providerName = "未检测到";
    state.walletDebug = "没有 window.ethereum provider";
    updateWalletState("未检测到钱包", "请在浏览器中安装并启用钱包扩展。");
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
  updateWalletState("检测成功", "请选择钱包提供商并点击“连接钱包”按钮。");
}

async function connectWallet() {
  if (!state.provider) {
    scanProviders();
    if (!state.provider) return;
  }

  try {
    const accounts = await requestAccounts(state.provider);
    state.walletAddress = accounts?.[0] || null;
    state.chainId = await getChainId(state.provider);
    state.walletDebug = `connected=${!!state.walletAddress}`;
    updateWalletState("连接成功", "钱包已成功连接，可以进行链上操作。");
    logEvent(`钱包连接成功：${state.providerName}`);
  } catch (e) {
    state.walletDebug = e?.code ? `code=${e.code}` : "unknown error";
    updateWalletState("连接失败", e?.message || "用户拒绝或钱包异常");
  }
}

async function switchToBsc() {
  if (!state.provider) return updateWalletState("切换失败", "请先检测并连接钱包。");
  try {
    if (state.provider.request) {
      await state.provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x38" }] });
    } else if (state.provider.switchNetwork) {
      await state.provider.switchNetwork("bsc-mainnet");
    } else {
      throw new Error("当前钱包不支持切换网络接口");
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
