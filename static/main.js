const API = {
  trades: "/api/trades",
  summary: "/api/summary"
};

async function fetchJSON(url, opts) {
  const res = await fetch(url, opts);
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

async function loadTrades() {
  const data = await fetchJSON(API.trades);
  renderTrades(data.trades || []);
}

function renderTrades(trades) {
  const tbody = document.querySelector("#tradesTable tbody");
  tbody.innerHTML = "";
  trades.forEach(t => {
    const tr = document.createElement("tr");
    const time = new Date(t.timestamp || Date.now()).toLocaleString();
    tr.innerHTML = `
      <td>${time}</td>
      <td>${t.symbol}</td>
      <td>${t.side}</td>
      <td>${t.quantity}</td>
      <td>${t.price}</td>
      <td>${t.account || ''}</td>
      <td>${t.notes || ''}</td>
      <td><button class="btn btn-sm btn-danger btn-delete" data-id="${t.id}">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });

  // attach delete events
  document.querySelectorAll(".btn-delete").forEach(b => {
    b.addEventListener("click", async (ev) => {
      const id = ev.target.dataset.id;
      if (!confirm("Delete trade?")) return;
      await fetch(`/api/trades/${id}`, { method: "DELETE" });
      await refreshAll();
    });
  });
}

document.getElementById("addTradeForm").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const form = ev.target;
  const data = Object.fromEntries(new FormData(form).entries());
  try {
    await fetchJSON("/api/trades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    form.reset();
    await refreshAll();
  } catch (err) {
    alert("Error adding trade: " + err.message);
  }
});

let pnlChart;
async function drawPnlChart() {
  const res = await fetchJSON(API.trades);
  // make a small timeseries: sum cashflow by minute (or trade index)
  const trades = (res.trades || []).slice().reverse(); // old->new
  const labels = trades.map(t => new Date(t.timestamp || Date.now()).toLocaleTimeString());
  const dataset = [];
  let running = 0;
  trades.forEach(t => {
    const q = Number(t.quantity || 0);
    const p = Number(t.price || 0);
    if (t.side === "buy") running -= q * p;
    else running += q * p;
    dataset.push(running);
  });

  const ctx = document.getElementById("pnlChart").getContext("2d");
  if (pnlChart) pnlChart.destroy();
  pnlChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Net Cashflow (approx)",
        data: dataset,
        fill: false,
        tension: 0.2,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      scales: { x: { display: false } }
    }
  });
}

async function loadSummary() {
  try {
    const s = await fetchJSON(API.summary);
    document.getElementById("summary-info").innerText =
      `Trades: ${s.total_trades} • Volume: ${s.total_volume} • Net P&L: ${s.net_pnl.toFixed(2)}`;
  } catch (e) {
    console.warn("Summary error", e);
  }
}

async function refreshAll() {
  await Promise.all([loadTrades(), drawPnlChart(), loadSummary()]);
}

document.getElementById("refreshBtn").addEventListener("click", refreshAll);

window.addEventListener("load", () => {
  refreshAll();
  // poll every 8 seconds
  setInterval(refreshAll, 8000);
});
