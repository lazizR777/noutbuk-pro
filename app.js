const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const L = (k, d) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? d;
  } catch (e) {
    return d;
  }
};
const S = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) {}
};

const USD_RATE = 12800;

const RAW_LAPTOPS = [
  [1, "Apple", "MacBook Air M3", "macbook", 14.9, 16.5, "Apple M3", "8-yadroli GPU", 16, 512, 13.6, 60, 18, 1.24, 4.8, 2024],
  [2, "Apple", "MacBook Pro 16 M3 Max", "macbook", 42.0, 45.0, "Apple M3 Max", "40-yadroli GPU", 48, 1024, 16.2, 120, 22, 2.15, 4.9, 2024],
  [3, "ASUS", "ROG Strix G16", "gaming", 24.5, 28.0, "Core i9-14900HX", "RTX 4070", 32, 1024, 16.0, 240, 8, 2.50, 4.7, 2024],
  [4, "ASUS", "Zenbook 14 OLED", "business", 16.9, 19.0, "Core Ultra 7", "Intel Arc", 16, 1024, 14.0, 120, 14, 1.20, 4.6, 2024],
  [5, "Lenovo", "Legion Pro 7i", "gaming", 36.0, 39.0, "Core i9-14900HX", "RTX 4080", 32, 2048, 16.0, 240, 7, 2.70, 4.8, 2024],
  [6, "Lenovo", "ThinkPad X1 Carbon", "business", 27.0, 29.0, "Core Ultra 7", "Intel Arc", 32, 1024, 14.0, 60, 15, 1.12, 4.7, 2024],
  [7, "HP", "Victus 15", "student", 10.5, 12.5, "Ryzen 5 7640HS", "RTX 4050", 16, 512, 15.6, 144, 7, 2.30, 4.3, 2023],
  [8, "Dell", "XPS 15", "workstation", 31.0, 34.0, "Core i9-13900H", "RTX 4060", 32, 1024, 15.6, 60, 12, 1.90, 4.6, 2023],
  [9, "Acer", "Aspire Go 15", "student", 5.9, 7.2, "Core i3-N305", "UHD", 8, 256, 15.6, 60, 9, 1.70, 4.1, 2023],
  [10, "MSI", "Titan 18 HX", "gaming", 58.0, 64.0, "Core i9-14900HX", "RTX 4090", 64, 2048, 18.0, 120, 6, 3.60, 4.9, 2024],
  [11, "Razer", "Blade 16", "gaming", 52.0, 55.0, "Ryzen 9 8945HX", "RTX 4080", 32, 2048, 16.0, 240, 8, 2.45, 4.8, 2024],
  [12, "Gigabyte", "AERO 16 OLED", "workstation", 33.0, 37.0, "Core i7-13700H", "RTX 4070", 32, 1024, 16.0, 60, 10, 2.20, 4.5, 2023]
];

const ACCESSORIES = [
  { id: "acc-mouse", name: "Logitech G Pro Wireless sichqoncha", price: 1450000 },
  { id: "acc-kb", name: "Keychron Q1 Pro mexanik klaviatura", price: 1950000 },
  { id: "acc-headset", name: "HyperX Cloud III simsiz quloqchin", price: 1250000 },
  { id: "acc-bag", name: "NOUTBUK PRO 16\" suv o‘tkazmas ryukzak", price: 690000 },
  { id: "acc-pad", name: "IKBS sovutish tagligi (Cooling Pad)", price: 540000 }
];

const PROMO_CODES = {
  PRO15: 0.15,
  VIP20: 0.20,
  KIBER10: 0.10
};

let D = L("np_catalog_code_v1", null);
if (!Array.isArray(D) || !D.length) {
  D = RAW_LAPTOPS.map((a) => ({
    id: a[0],
    br: a[1],
    m: a[2],
    cat: a[3],
    p: Math.round(a[4] * 1e6),
    o: Math.round(a[5] * 1e6),
    cpu: a[6],
    gpu: a[7],
    ram: a[8],
    ssd: a[9],
    scr: a[10],
    hz: a[11],
    bat: a[12],
    wt: a[13],
    rt: a[14],
    yr: a[15],
    rev: [
      { author: "Sardor", stars: 5, text: "Ajoyib ishlaydi, sovutish tizimi barqaror." },
      { author: "Madina", stars: 5, text: "Ekran sifati va batareya ishlashi juda yaxshi." }
    ]
  }));
}

const brands = [...new Set(D.map((d) => d.br))];

let st = {
  cat: "all",
  br: "all",
  curr: L("np_curr", "UZS"),
  promo: L("np_promo", ""),
  fav: L("np_fav", []),
  cart: L("np_cart", []),
  cmp: L("np_cmp", []),
  orders: L("np_orders", []),
  setupLaptopId: L("np_setup_lap", D[0].id),
  setupAcc: L("np_setup_acc", ["acc-mouse", "acc-bag"]),
  battleA: D[2].id,
  battleB: D[0].id,
  swipeIdx: 0,
  swipeLikes: L("np_swipe_likes", [])
};

const saveState = () => {
  S("np_catalog_code_v1", D);
  S("np_curr", st.curr);
  S("np_promo", st.promo);
  S("np_fav", st.fav);
  S("np_cart", st.cart);
  S("np_cmp", st.cmp);
  S("np_orders", st.orders);
  S("np_setup_lap", st.setupLaptopId);
  S("np_setup_acc", st.setupAcc);
  S("np_swipe_likes", st.swipeLikes);
};

function fmt(uzs) {
  if (st.curr === "USD") {
    const usd = (uzs / USD_RATE).toFixed(2);
    return "$" + Number(usd).toLocaleString("en-US");
  }
  return Math.round(uzs).toLocaleString("ru-RU") + " so‘m";
}

function fmtShort(uzs) {
  if (st.curr === "USD") {
    return "$" + Math.round(uzs / USD_RATE).toLocaleString("en-US");
  }
  return (Math.round((uzs / 1e6) * 10) / 10) + " mln so‘m";
}

function monthlyInstallment(uzs, months = 12) {
  const withMarkup = uzs * 1.12;
  return fmt(Math.round(withMarkup / months));
}

const pc = (d) => Math.max(0, Math.round((1 - d.p / d.o) * 100));

function toast(msg) {
  const el = document.createElement("div");
  el.className = "ts";
  el.textContent = msg;
  $("#toasts").append(el);
  setTimeout(() => el.remove(), 2400);
}

function toggleCurrency() {
  st.curr = st.curr === "UZS" ? "USD" : "UZS";
  $("#curr-btn").textContent = st.curr === "UZS" ? "🇺🇿 SO‘M" : "🇺🇸 USD $";
  saveState();
  renderAll();
  toast(st.curr === "USD" ? "Narxlar USD ($) ga o‘tkazildi" : "Narxlar SO‘M ga o‘tkazildi");
}

function cardHtml(d) {
  const isFav = st.fav.includes(d.id);
  const isCmp = st.cmp.includes(d.id);
  return `
    <article class="card">
      <span class="mu">${d.br} · ${d.cat.toUpperCase()}</span>
      <h3 style="cursor:pointer" onclick="detail(${d.id})">${d.m}</h3>
      <div class="spec">
        <span>⚙ ${d.cpu}</span>
        <span>🎮 ${d.gpu}</span>
        <span>RAM ${d.ram} GB</span>
        <span>SSD ${d.ssd >= 1024 ? d.ssd / 1024 + " TB" : d.ssd + " GB"}</span>
        <span>🖥 ${d.scr}″ ${d.hz}Hz</span>
        <span>★ ${d.rt}</span>
      </div>
      <div class="inst-hint">12 oyga bo‘lib to‘lash: <b>${monthlyInstallment(d.p, 12)}</b> / oy</div>
      <div class="pr">
        <b>${fmt(d.p)}</b>
        <s>${fmt(d.o)}</s>
        <i>−${pc(d)}%</i>
      </div>
      <div class="row">
        <button class="sm ${isFav ? "on" : ""}" onclick="tf(${d.id})" aria-label="Sevimli">♥</button>
        <button class="sm ${isCmp ? "on" : ""}" onclick="tc(${d.id})" aria-label="Taqqoslash">⇄</button>
        <button class="sm" onclick="detail(${d.id})">Batafsil</button>
        <button class="btn" onclick="addCart(${d.id})">Savatchaga</button>
      </div>
    </article>`;
}

function tf(id) {
  st.fav = st.fav.includes(id) ? st.fav.filter((x) => x !== id) : [...st.fav, id];
  saveState();
  updateBadges();
  toast("Sevimlilar yangilandi");
}

function tc(id) {
  if (st.cmp.includes(id)) {
    st.cmp = st.cmp.filter((x) => x !== id);
  } else {
    if (st.cmp.length >= 4) return toast("Eng ko‘pi bilan 4 ta model taqqoslanadi");
    st.cmp.push(id);
  }
  saveState();
  updateBadges();
  renderCmp();
  toast("Taqqoslash ro‘yxati: " + st.cmp.length + " ta");
}

function addCart(id, customTitle = null, customPrice = null) {
  const d = D.find((x) => x.id === id);
  if (!d) return;
  const key = customTitle ? `${id}:${customTitle}` : `${id}`;
  const existing = st.cart.find((x) => x.key === key);
  if (existing) {
    existing.q++;
  } else {
    st.cart.push({
      key,
      id: d.id,
      title: customTitle || `${d.br} ${d.m}`,
      price: customPrice ?? d.p,
      oldPrice: customPrice ? Math.round(customPrice * 1.12) : d.o,
      q: 1
    });
  }
  saveState();
  updateBadges();
  toast("Savatchaga qo‘shildi");
  const cc = $("#cC");
  cc.classList.remove("bump");
  void cc.offsetWidth;
  cc.classList.add("bump");
}

function updateBadges() {
  $("#cF").textContent = st.fav.length;
  $("#cC").textContent = st.cart.reduce((a, b) => a + b.q, 0);
}

function filt() {
  const q = $("#q").value.toLowerCase().trim();
  const b = $("#fb").value;
  const r = +$("#fr").value;
  const s = +$("#fs").value;
  const p = +$("#fp").value;
  const rt = +$("#fq").value;
  const so = $("#so").value;

  const list = D.filter((d) => {
    if (st.cat !== "all" && d.cat !== st.cat) return false;
    if (b !== "all" && d.br !== b) return false;
    if (d.ram < r) return false;
    if (s === 14 && d.scr > 14) return false;
    if (s === 16 && d.scr < 15) return false;
    if (p === 15 && d.p > 15e6) return false;
    if (p === 30 && d.p > 30e6) return false;
    if (p === 99 && d.p <= 30e6) return false;
    if (d.rt < rt) return false;
    const hay = `${d.br} ${d.m} ${d.cpu} ${d.gpu}`.toLowerCase();
    return hay.includes(q);
  });

  list.sort((x, y) => {
    if (so === "lo") return x.p - y.p;
    if (so === "hi") return y.p - x.p;
    if (so === "new") return y.yr - x.yr;
    if (so === "rt") return y.rt - x.rt;
    return y.rt * y.ram - x.rt * x.ram;
  });

  return list;
}

function renderCat() {
  const items = filt();
  $("#grid").innerHTML = items.length
    ? items.map(cardHtml).join("")
    : `<div class="empty" style="grid-column:1/-1">Hech narsa topilmadi. Filtrlarni o‘zgartiring.</div>`;
}

const CAT_LABELS = {
  all: "Barchasi",
  gaming: "Gaming",
  macbook: "MacBook",
  business: "Business",
  student: "Student",
  workstation: "Workstation"
};

function renderAll() {
  $("#heroMediaBox").innerHTML = `
    <div class="hero-card">
      <span class="tag">FLAGMAN TIZIM</span>
      <h3 style="font-size:22px;margin:6px 0">12+ Model · 10 Brend</h3>
      <p class="mu" style="color:#cbd5e1">RTX 4090, RTX 4080, Apple M3 Max va Core Ultra protsessorli konfiguratsiyalar.</p>
      <p style="margin-top:10px">Boshlang‘ich narx: <b>${fmt(Math.min(...D.map((x) => x.p)))}</b></p>
    </div>`;

  $("#cats").innerHTML = Object.keys(CAT_LABELS)
    .map((k) => `<button class="chip ${st.cat === k ? "on" : ""}" onclick="setCat('${k}')">${CAT_LABELS[k]}</button>`)
    .join("");

  $("#brandHome").innerHTML = brands
    .map((b) => `<button class="chip" onclick="filterByBrand('${b}')">${b}</button>`)
    .join("");

  $("#featured").innerHTML = D.slice(0, 4).map(cardHtml).join("");
  $("#sale").innerHTML = [...D].sort((a, b) => pc(b) - pc(a)).slice(0, 4).map(cardHtml).join("");

  const top5 = [...D].sort((a, b) => b.p - a.p).slice(0, 5);
  $("#ring").innerHTML = top5
    .map(
      (d, k) => `
      <div class="it3" style="--k:${k}" onclick="detail(${d.id})">
        <span class="mu">${d.br}</span>
        <b>${d.m}</b>
        <span>${fmtShort(d.p)}</span>
      </div>`
    )
    .join("");

  renderCat();
  renderCmp();
  renderBattle();
  renderSwipe();
  renderSetup();
}

function filterByBrand(b) {
  st.br = b;
  $("#fb").value = b;
  st.cat = "all";
  location.hash = "catalog";
  renderAll();
}

function setCat(k) {
  st.cat = k;
  location.hash = k === "gaming" ? "gaming" : k === "macbook" ? "macbook" : "catalog";
  renderAll();
}

function renderCmp() {
  const list = st.cmp.map((id) => D.find((d) => d.id === id)).filter(Boolean);
  if (list.length < 2) {
    $("#cmp").innerHTML = `<div class="empty">Tanlangan: ${list.length}. Kamida 2 ta noutbuk tanlang (katalogda ⇄).</div>`;
    return;
  }

  const rows = [
    ["Narx", (d) => fmt(d.p), (d) => d.p, -1],
    ["CPU", (d) => d.cpu, null, 0],
    ["GPU", (d) => d.gpu, null, 0],
    ["RAM", (d) => d.ram + " GB", (d) => d.ram, 1],
    ["SSD", (d) => d.ssd + " GB", (d) => d.ssd, 1],
    ["Ekran", (d) => d.scr + "″", null, 0],
    ["Yangilanish", (d) => d.hz + " Hz", (d) => d.hz, 1],
    ["Batareya", (d) => d.bat + " soat", (d) => d.bat, 1],
    ["Og‘irlik", (d) => d.wt + " kg", (d) => d.wt, -1],
    ["Reyting", (d) => "★ " + d.rt, (d) => d.rt, 1]
  ];

  $("#cmp").innerHTML = `
    <div class="tbl">
      <table>
        <tr>
          <th>Xususiyat</th>
          ${list.map((d) => `<th>${d.m}<br><button class="sm" onclick="tc(${d.id})">× olib tashlash</button></th>`).join("")}
        </tr>
        ${rows
          .map((r) => {
            let best = null;
            if (r[2]) {
              const vals = list.map(r[2]);
              best = r[3] > 0 ? Math.max(...vals) : Math.min(...vals);
              if (vals.every((x) => x === vals[0])) best = null;
            }
            return `
              <tr>
                <th>${r[0]}</th>
                ${list.map((d) => `<td class="${best !== null && r[2](d) === best ? "best" : ""}">${r[1](d)}</td>`).join("")}
              </tr>`;
          })
          .join("")}
      </table>
    </div>`;
}

function scoreLaptop(d) {
  return Math.round(
    d.ram * 1.4 +
      d.ssd / 32 +
      d.hz * 0.25 +
      d.bat * 2.5 +
      d.rt * 22 +
      (d.gpu.includes("4090") ? 55 : d.gpu.includes("4080") ? 45 : d.gpu.includes("4070") ? 35 : d.gpu.includes("Max") ? 42 : 20)
  );
}

function renderBattle() {
  const a = D.find((x) => x.id === st.battleA) || D[2];
  const b = D.find((x) => x.id === st.battleB) || D[0];
  const scA = scoreLaptop(a);
  const scB = scoreLaptop(b);
  const winner = scA >= scB ? a : b;
  const opts = D.map((x) => `<option value="${x.id}">${x.br} ${x.m}</option>`).join("");

  $("#battleArea").innerHTML = `
    <div class="battle-grid">
      <div class="fighter">
        <select id="bSelA" onchange="st.battleA=+this.value;renderBattle()" style="padding:8px 12px;border-radius:10px;background:var(--bg);border:1px solid var(--bd);width:100%">
          ${opts}
        </select>
        <h3 style="margin-top:12px">${a.m}</h3>
        <p class="mu">${a.cpu} · ${a.gpu} · ${a.ram}GB</p>
        <p style="margin-top:8px"><b>Reyting balli: ${scA}</b></p>
      </div>
      <div class="vs-badge">VS</div>
      <div class="fighter">
        <select id="bSelB" onchange="st.battleB=+this.value;renderBattle()" style="padding:8px 12px;border-radius:10px;background:var(--bg);border:1px solid var(--bd);width:100%">
          ${opts}
        </select>
        <h3 style="margin-top:12px">${b.m}</h3>
        <p class="mu">${b.cpu} · ${b.gpu} · ${b.ram}GB</p>
        <p style="margin-top:8px"><b>Reyting balli: ${scB}</b></p>
      </div>
    </div>
    <div class="stat">
      <span class="tag">JANG NATIJASI</span>
      <h3 style="margin:6px 0">🏆 G‘olib: ${winner.br} ${winner.m} (${Math.max(scA, scB)} ball)</h3>
      <p class="mu">Narxi: ${fmt(winner.p)} · Batareya: ${winner.bat} soat · Ekran: ${winner.scr}″ ${winner.hz}Hz</p>
      <div style="margin-top:12px">
        <button class="btn sm-btn" onclick="addCart(${winner.id})">G‘olibni savatchaga qo‘shish</button>
      </div>
    </div>`;

  $("#bSelA").value = a.id;
  $("#bSelB").value = b.id;
}

function renderSwipe() {
  const d = D[st.swipeIdx % D.length];
  $("#swipeArea").innerHTML = `
    <div class="swipe-box">
      <span class="tag">KARTOSHKA ${(st.swipeIdx % D.length) + 1} / ${D.length}</span>
      <h3 style="margin-top:10px">${d.br} ${d.m}</h3>
      <p class="mu">${d.cpu} · ${d.gpu} · ${d.ram} GB RAM · ${d.wt} kg</p>
      <p style="margin:8px 0"><b>${fmt(d.p)}</b></p>
      <div class="row" style="justify-content:center">
        <button class="btn g sm-btn" onclick="swipeAction(false)">❌ Keyingisi</button>
        <button class="btn sm-btn" onclick="swipeAction(true)">❤️ Yoqdi</button>
      </div>
      ${
        st.swipeLikes.length
          ? `<p class="mu" style="margin-top:12px">Sizga yoqqan modellar (${st.swipeLikes.length}): ${st.swipeLikes
              .map((id) => D.find((x) => x.id === id)?.m)
              .filter(Boolean)
              .join(", ")}</p>`
          : ""
      }
    </div>`;
}

function swipeAction(liked) {
  const d = D[st.swipeIdx % D.length];
  if (liked && !st.swipeLikes.includes(d.id)) {
    st.swipeLikes.push(d.id);
    toast(`❤️ ${d.m} yoqtirilganlarga qo‘shildi`);
  }
  st.swipeIdx++;
  saveState();
  renderSwipe();
}

function renderSetup() {
  const lap = D.find((x) => x.id === st.setupLaptopId) || D[0];
  const accTotal = st.setupAcc.reduce((sum, id) => {
    const item = ACCESSORIES.find((a) => a.id === id);
    return sum + (item ? item.price : 0);
  }, 0);
  const rawTotal = lap.p + accTotal;
  const bundleDiscount = st.setupAcc.length ? Math.round(rawTotal * 0.1) : 0;
  const finalTotal = rawTotal - bundleDiscount;

  $("#setupArea").innerHTML = `
    <div class="setup-layout">
      <div class="setup-panel">
        <h3>1. Noutbukni tanlang</h3>
        <select id="setupLapSel" onchange="st.setupLaptopId=+this.value;saveState();renderSetup()" style="width:100%;padding:10px;border-radius:12px;background:var(--bg);border:1px solid var(--bd);margin:8px 0 16px">
          ${D.map((x) => `<option value="${x.id}">${x.br} ${x.m} — ${fmt(x.p)}</option>`).join("")}
        </select>
        <h3>2. Aksessuarlar (10% komplekt chegirma)</h3>
        ${ACCESSORIES.map((a) => {
          const checked = st.setupAcc.includes(a.id);
          return `
            <label class="acc-item">
              <span style="display:flex;gap:10px;align-items:center">
                <input type="checkbox" ${checked ? "checked" : ""} onchange="toggleSetupAcc('${a.id}')">
                <span>${a.name}</span>
              </span>
              <b>${fmt(a.price)}</b>
            </label>`;
        }).join("")}
      </div>
      <div class="setup-summary">
        <h3>${lap.br} ${lap.m}</h3>
        <p class="mu">Tanlangan aksessuarlar: ${st.setupAcc.length} ta</p>
        <hr style="border:0;border-top:1px solid var(--bd);margin:12px 0">
        <p>Komplekt chegirmasi (10%): <b style="color:var(--ok)">−${fmt(bundleDiscount)}</b></p>
        <p style="margin-top:6px">Jami Setup narxi: <b style="font-size:21px">${fmt(finalTotal)}</b></p>
        <button class="btn" style="width:100%;margin-top:14px" onclick="addSetupToCart()">Setupni savatchaga qo‘shish</button>
      </div>
    </div>`;

  $("#setupLapSel").value = lap.id;
}

function toggleSetupAcc(id) {
  st.setupAcc = st.setupAcc.includes(id) ? st.setupAcc.filter((x) => x !== id) : [...st.setupAcc, id];
  saveState();
  renderSetup();
}

function addSetupToCart() {
  const lap = D.find((x) => x.id === st.setupLaptopId) || D[0];
  const accTotal = st.setupAcc.reduce((sum, id) => {
    const item = ACCESSORIES.find((a) => a.id === id);
    return sum + (item ? item.price : 0);
  }, 0);
  const rawTotal = lap.p + accTotal;
  const finalTotal = rawTotal - (st.setupAcc.length ? Math.round(rawTotal * 0.1) : 0);
  addCart(lap.id, `${lap.m} + Setup (${st.setupAcc.length} aksessuar)`, finalTotal);
}

const NEWS = [
  ["Apple Silicon", "M4 avlodi: samaradorlik va batareya", "M4 chiplari AI vazifalarda tezkor ishlashi va energiya tejamkorligi bilan ajralib turadi."],
  ["NVIDIA GPU", "RTX 50 seriyasi noutbuklarga kelmoqda", "Yangi arxitektura DLSS va nur izlash (ray tracing) tezligini oshiradi."],
  ["AI noutbuklar", "NPU bilan jihozlangan Copilot+ PC", "Mahalliy AI vazifalari uchun maxsus protsessor bloklari keng qo‘llanilmoqda."],
  ["AMD / Intel", "Ryzen AI va Core Ultra raqobati", "Ikkala ishlab chiqaruvchi ham avtonomlik va integratsiyalangan grafikani kuchaytirmoqda."]
];

function renderNews() {
  $("#newsG").innerHTML = NEWS.map(
    (n, i) => `
      <article class="art" onclick="openArt(${i})" tabindex="0" role="button">
        <span class="tag">${n[0]}</span>
        <h3 style="margin:6px 0">${n[1]}</h3>
        <p class="mu">${n[2]}</p>
      </article>`
  ).join("");
}

function openArt(i) {
  const n = NEWS[i];
  openModal(`
    <span class="tag">${n[0]}</span>
    <h2>${n[1]}</h2>
    <p style="margin:12px 0">${n[2]}</p>
    <button class="btn sm-btn" onclick="closeModal()">Yopish</button>
  `);
}

function openModal(html) {
  $("#mb").innerHTML = html;
  $("#ovM").classList.add("show");
}

function closeModal() {
  $("#ovM").classList.remove("show");
}

let activeRgbColor = "#3b82f6";

function playKeySound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = 520 + Math.random() * 140;
    gain.gain.value = 0.04;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.045);
  } catch (e) {}
}

function detail(id) {
  const d = D.find((x) => x.id === id);
  if (!d) return;
  const sim = D.filter((x) => x.cat === d.cat && x.id !== id).slice(0, 2);
  const keys = ["ESC", "1", "2", "3", "4", "Q", "W", "E", "R", "SPACE"];

  openModal(`
    <div>
      <span class="tag">${d.br} · ${d.cat.toUpperCase()}</span>
      <h2 style="margin-top:4px">${d.br} ${d.m}</h2>
      <div class="pr">
        <b>${fmt(d.p)}</b>
        <s>${fmt(d.o)}</s>
        <i>−${pc(d)}%</i>
      </div>
      <p class="mu" style="margin:8px 0">${d.cpu} · ${d.gpu} · ${d.ram} GB RAM · ${d.ssd} GB SSD · ${d.scr}″ ${d.hz}Hz · ${d.bat} soat · ${d.wt} kg</p>

      <div class="tabs">
        <button class="tab-btn on" id="tab-xray" onclick="setDetailTab('xray')">🩻 X-Ray Ichki tuzilish</button>
        <button class="tab-btn" id="tab-rgb" onclick="setDetailTab('rgb')">⌨️ RGB Klaviatura</button>
        <button class="tab-btn" id="tab-inst" onclick="setDetailTab('inst')">📅 Bo‘lib to‘lash</button>
      </div>

      <div id="detail-panel-xray" class="xray-box">
        <b>X-Ray Termal va Komponent Tahlili (${d.m})</b>
        <p class="mu" style="color:#cbd5e1;margin-top:4px">Protsessor: ${d.cpu} · Grafika: ${d.gpu} · Og‘irlik: ${d.wt} kg</p>
        <div class="cooler-row">
          <div class="fan">KULER 1</div>
          <div class="fan">KULER 2</div>
        </div>
      </div>

      <div id="detail-panel-rgb" class="rgb-board" style="display:none">
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <span style="font-size:13px;font-weight:600">RGB Rang:</span>
          <button class="sm" style="background:#3b82f6;color:#fff" onclick="setRgbColor('#3b82f6')">Ko‘k</button>
          <button class="sm" style="background:#ef4444;color:#fff" onclick="setRgbColor('#ef4444')">Qizil</button>
          <button class="sm" style="background:#10b981;color:#fff" onclick="setRgbColor('#10b981')">Yashil</button>
          <button class="sm" style="background:#a855f7;color:#fff" onclick="setRgbColor('#a855f7')">Binafsha</button>
        </div>
        <div class="rgb-keys">
          ${keys
            .map(
              (k) => `<button type="button" class="rgb-key lit" style="--rgb-c:${activeRgbColor}" onmousedown="this.classList.add('pressed');playKeySound()" onmouseup="this.classList.remove('pressed')" onmouseleave="this.classList.remove('pressed')">${k}</button>`
            )
            .join("")}
        </div>
      </div>

      <div id="detail-panel-inst" style="display:none;background:var(--bg);border:1px solid var(--bd);border-radius:14px;padding:14px;margin:10px 0">
        <b>Muddatli to‘lov kalkulyatori</b>
        <div class="row">
          <span class="chip">3 oy: <b>${monthlyInstallment(d.p, 3)}</b></span>
          <span class="chip">6 oy: <b>${monthlyInstallment(d.p, 6)}</b></span>
          <span class="chip">12 oy: <b>${monthlyInstallment(d.p, 12)}</b></span>
        </div>
      </div>

      <div style="margin-top:16px">
        <b>Sharhlar (${d.rev.length})</b>
        <div id="revList" style="margin:8px 0">
          ${d.rev.map((r) => `<p class="mu">★${r.stars} <b>${r.author}:</b> ${r.text}</p>`).join("")}
        </div>
        <form onsubmit="submitReview(event, ${d.id})" style="margin-top:8px">
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <input name="author" placeholder="Ismingiz" required style="flex:1;min-width:140px;padding:8px 10px;border-radius:10px;background:var(--bg);border:1px solid var(--bd)">
            <select name="stars" style="padding:8px 10px;border-radius:10px;background:var(--bg);border:1px solid var(--bd)">
              <option value="5">★★★★★ (5)</option>
              <option value="4">★★★★☆ (4)</option>
              <option value="3">★★★☆☆ (3)</option>
            </select>
          </div>
          <input name="text" placeholder="Noutbuk haqida fikringizni yozing..." required style="width:100%;margin-top:8px;padding:8px 10px;border-radius:10px;background:var(--bg);border:1px solid var(--bd)">
          <button class="btn sm-btn" style="margin-top:8px">Sharh qoldirish</button>
        </form>
      </div>

      ${
        sim.length
          ? `<div style="margin-top:18px"><b>O‘xshash modellar</b><div class="cards" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr));margin-top:8px">${sim
              .map((s) => `<div class="card" onclick="detail(${s.id})"><b>${s.m}</b><span class="mu">${fmt(s.p)}</span></div>`)
              .join("")}</div></div>`
          : ""
      }

      <div class="row" style="margin-top:18px">
        <button class="btn" onclick="addCart(${d.id})">Savatchaga qo‘shish</button>
        <button class="btn g" onclick="closeModal()">Yopish</button>
      </div>
    </div>
  `);
}

function setDetailTab(tab) {
  ["xray", "rgb", "inst"].forEach((t) => {
    const panel = $(`#detail-panel-${t}`);
    const btn = $(`#tab-${t}`);
    if (panel) panel.style.display = t === tab ? "block" : "none";
    if (btn) btn.classList.toggle("on", t === tab);
  });
}

function setRgbColor(color) {
  activeRgbColor = color;
  $$(".rgb-key").forEach((k) => {
    k.style.setProperty("--rgb-c", color);
  });
}

function submitReview(e, id) {
  e.preventDefault();
  const f = e.target;
  const author = f.author.value.trim();
  const stars = +f.stars.value;
  const text = f.text.value.trim();
  if (!author || !text) return;
  const d = D.find((x) => x.id === id);
  if (!d) return;
  d.rev.unshift({ author, stars, text });
  saveState();
  toast("Sharhingiz qo‘shildi!");
  detail(id);
}

function openChest() {
  const codes = Object.keys(PROMO_CODES);
  const picked = codes[Math.floor(Math.random() * codes.length)];
  const pct = Math.round(PROMO_CODES[picked] * 100);
  st.promo = picked;
  saveState();
  openModal(`
    <div style="text-align:center">
      <div style="font-size:46px">🎁</div>
      <h2>Tabriklaymiz! Promokod yutdingiz</h2>
      <p class="mu" style="margin:10px 0">Sizga <b>${pct}% chegirma</b> beruvchi promokod faollashtirildi:</p>
      <div style="font-size:24px;font-weight:800;padding:10px 18px;border-radius:14px;background:var(--bg);border:1px dashed var(--ac);display:inline-block;margin:8px 0">${picked}</div>
      <p class="mu">Savatchada avtomatik qo‘llaniladi.</p>
      <div class="row" style="justify-content:center;margin-top:14px">
        <button class="btn sm-btn" onclick="closeModal();openCart()">Savatchaga o‘tish</button>
        <button class="btn g sm-btn" onclick="closeModal()">Yopish</button>
      </div>
    </div>
  `);
}

function cartTotals() {
  const subtotal = st.cart.reduce((sum, item) => sum + item.price * item.q, 0);
  const oldTotal = st.cart.reduce((sum, item) => sum + (item.oldPrice || item.price) * item.q, 0);
  const rate = PROMO_CODES[st.promo] || 0;
  const promoDiscount = Math.round(subtotal * rate);
  const afterPromo = subtotal - promoDiscount;
  const delivery = co.dm === "k" && afterPromo < 20e6 && st.cart.length ? 30000 : 0;
  return { subtotal, oldTotal, promoDiscount, delivery, total: afterPromo + delivery };
}

function openCart() {
  const { subtotal, oldTotal, promoDiscount, delivery, total } = cartTotals();
  const listHtml = st.cart
    .map(
      (c) => `
      <div class="it">
        <div>
          <b>${c.title}</b><br>
          <span class="mu">${fmt(c.price)}</span>
        </div>
        <button class="sm" onclick="changeQty('${c.key}', -1)">−</button>
        <span>${c.q}</span>
        <button class="sm" onclick="changeQty('${c.key}', 1)">+</button>
        <button class="sm" onclick="removeItem('${c.key}')" aria-label="O‘chirish">🗑</button>
      </div>`
    )
    .join("");

  $("#cb").innerHTML = `
    <h2>Savatcha</h2>
    ${listHtml || `<div class="empty">Savatcha bo‘sh</div>`}
    ${
      st.cart.length
        ? `
        <div style="margin-top:14px">
          <label style="font-size:13px;font-weight:600">Promokod (PRO15, VIP20, KIBER10)</label>
          <div style="display:flex;gap:8px;margin-top:6px">
            <input id="promoInput" value="${st.promo}" placeholder="Masalan: PRO15" style="flex:1;padding:9px 12px;border-radius:10px;background:var(--bg);border:1px solid var(--bd)">
            <button class="btn sm-btn" onclick="applyPromo()">Qo‘llash</button>
          </div>
        </div>
        <div style="margin-top:14px">
          <p>Aksiya tejamkorligi: <b>${fmt(Math.max(0, oldTotal - subtotal))}</b></p>
          ${promoDiscount ? `<p style="color:var(--ok)">Promokod (${st.promo}): <b>−${fmt(promoDiscount)}</b></p>` : ""}
          <p>Yetkazish: <b>${delivery ? fmt(delivery) : "Bepul"}</b></p>
          <p style="margin-top:6px">Jami: <b style="font-size:21px">${fmt(total)}</b></p>
        </div>
        <div class="row" style="margin-top:14px">
          <button class="btn" onclick="startCheckout()">Rasmiylashtirish</button>
          <button class="btn g" onclick="$('#ovC').classList.remove('show')">Yopish</button>
        </div>`
        : `<button class="btn g" style="margin-top:14px" onclick="$('#ovC').classList.remove('show')">Yopish</button>`
    }
  `;
  $("#ovC").classList.add("show");
}

function applyPromo() {
  const code = ($("#promoInput")?.value || "").trim().toUpperCase();
  if (!code) {
    st.promo = "";
    saveState();
    openCart();
    return toast("Promokod tozalandi");
  }
  if (!PROMO_CODES[code]) {
    return toast("Noto‘g‘ri promokod. Sinab ko‘ring: PRO15, VIP20, KIBER10");
  }
  st.promo = code;
  saveState();
  openCart();
  toast(`${code} promokodi qo‘llandi!`);
}

function changeQty(key, delta) {
  const item = st.cart.find((x) => x.key === key);
  if (!item) return;
  item.q += delta;
  if (item.q < 1) st.cart = st.cart.filter((x) => x.key !== key);
  saveState();
  updateBadges();
  openCart();
}

function removeItem(key) {
  st.cart = st.cart.filter((x) => x.key !== key);
  saveState();
  updateBadges();
  openCart();
}

let co = {
  step: 1,
  name: "",
  phone: "",
  city: "Toshkent",
  addr: "",
  dm: "k",
  pm: "card",
  maskedCard: ""
};

function startCheckout() {
  if (!st.cart.length) return toast("Savatcha bo‘sh");
  $("#ovC").classList.remove("show");
  co.step = 1;
  renderCheckout();
}

function renderCheckout() {
  const { promoDiscount, delivery, total } = cartTotals();
  const stepsBar = `
    <div class="stp">
      ${["1. Yetkazish", "2. To‘lov", "3. Tasdiq & Chek"]
        .map((label, idx) => `<span class="${co.step >= idx + 1 ? "on" : ""}">${label}</span>`)
        .join("")}
    </div>`;

  let body = `<h2>Buyurtmani rasmiylashtirish</h2>${stepsBar}`;

  if (co.step === 1) {
    body += `
      <form id="coStep1" novalidate>
        <label>Ism va familiya<input name="name" value="${co.name}" placeholder="Azizbek Karimov"></label>
        <div class="er"></div>
        <label>Telefon raqam (+998…)<input name="phone" value="${co.phone}" placeholder="+998901234567"></label>
        <div class="er"></div>
        <label>Shahar
          <select name="city" style="width:100%;padding:10px;border-radius:10px;background:var(--bg);border:1px solid var(--bd)">
            ${["Toshkent", "Samarqand", "Buxoro", "Andijon", "Namangan", "Farg‘ona"]
              .map((c) => `<option ${c === co.city ? "selected" : ""}>${c}</option>`)
              .join("")}
          </select>
        </label>
        <label>Manzil (ko‘cha, uy, mo‘ljal)<input name="addr" value="${co.addr}" placeholder="Amir Temur ko‘chasi, 108-uy"></label>
        <div class="er"></div>
        <label class="opt">
          <input type="radio" name="dm" value="k" ${co.dm === "k" ? "checked" : ""}>
          Kuryer orqali yetkazish · 1–3 ish kuni (${total >= 20e6 ? "Bepul" : fmt(30000)})
        </label>
        <label class="opt">
          <input type="radio" name="dm" value="p" ${co.dm === "p" ? "checked" : ""}>
          Showroom’dan olib ketish · Bepul
        </label>
        <button class="btn" style="width:100%;margin-top:12px">Davom etish →</button>
      </form>`;
  } else if (co.step === 2) {
    body += `
      <form id="coStep2" novalidate>
        ${[
          ["card", "💳 Bank kartasi (Uzcard / Humo / Visa / Mastercard)"],
          ["payme", "🟦 Payme"],
          ["click", "🔵 Click"],
          ["cash", "💵 Naqd pul (qabul qilganda)"]
        ]
          .map(
            ([val, lbl]) => `
            <label class="opt">
              <input type="radio" name="pm" value="${val}" ${co.pm === val ? "checked" : ""} onchange="toggleCardBox(this.value)">
              <span>${lbl}</span>
            </label>`
          )
          .join("")}
        <div id="cardFields" style="display:${co.pm === "card" ? "block" : "none"};margin-top:8px">
          <label>Karta raqami
            <input name="cn" inputmode="numeric" maxlength="19" placeholder="8600 0000 0000 0000" oninput="this.value=this.value.replace(/[^0-9]/g,'').replace(/(.{4})/g,'$1 ').trim()">
          </label>
          <div class="er"></div>
          <div style="display:flex;gap:10px">
            <div style="flex:1">
              <label>Amal qilish (MM/YY)<input name="ex" maxlength="5" placeholder="09/28"></label>
              <div class="er"></div>
            </div>
            <div style="flex:1">
              <label>CVV / CVC<input name="cv" type="password" inputmode="numeric" maxlength="3" placeholder="123"></label>
              <div class="er"></div>
            </div>
          </div>
        </div>
        <div class="row" style="margin-top:14px">
          <button type="button" class="btn g" onclick="co.step=1;renderCheckout()">← Orqaga</button>
          <button class="btn">Buyurtma xulosasiga →</button>
        </div>
      </form>`;
  } else {
    const pmText = { card: "Bank kartasi", payme: "Payme", click: "Click", cash: "Naqd pul" }[co.pm];
    body += `
      <div class="receipt">
        <p class="mu">Mijoz: <b>${co.name}</b> · ${co.phone}</p>
        <p class="mu">Manzil: <b>${co.dm === "k" ? `${co.city}, ${co.addr}` : `Showroom (${co.city})`}</b></p>
        <p class="mu">To‘lov usuli: <b>${pmText}</b>${co.maskedCard ? ` (${co.maskedCard})` : ""}</p>
        <hr style="border:0;border-top:1px solid var(--bd);margin:10px 0">
        ${st.cart
          .map(
            (c) => `<div style="display:flex;justify-content:space-between;margin:4px 0"><span>${c.title} × ${c.q}</span><b>${fmt(c.price * c.q)}</b></div>`
          )
          .join("")}
        ${promoDiscount ? `<div style="display:flex;justify-content:space-between;color:var(--ok);margin-top:6px"><span>Promokod (${st.promo})</span><b>−${fmt(promoDiscount)}</b></div>` : ""}
        <div style="display:flex;justify-content:space-between;margin-top:6px"><span>Yetkazib berish</span><b>${delivery ? fmt(delivery) : "Bepul"}</b></div>
        <hr style="border:0;border-top:1px solid var(--bd);margin:10px 0">
        <div style="display:flex;justify-content:space-between;font-size:18px"><b>Jami to‘lov:</b><b>${fmt(total)}</b></div>
      </div>
      <div class="row">
        <button type="button" class="btn g" onclick="co.step=2;renderCheckout()">← Orqaga</button>
        <button class="btn" onclick="finalizeOrder()">Buyurtmani tasdiqlash</button>
      </div>`;
  }

  openModal(body);
  bindCheckoutForms();
}

function toggleCardBox(val) {
  const box = $("#cardFields");
  if (box) box.style.display = val === "card" ? "block" : "none";
}

function luhnCheck(numStr) {
  if (!/^\d{16,19}$/.test(numStr)) return false;
  let sum = 0;
  let alt = false;
  for (let i = numStr.length - 1; i >= 0; i--) {
    let n = Number(numStr[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function bindCheckoutForms() {
  const f1 = $("#coStep1");
  if (f1) {
    f1.onsubmit = (e) => {
      e.preventDefault();
      const f = e.target;
      const name = f.name.value.trim();
      const phone = f.phone.value.replace(/\s+/g, "");
      const city = f.city.value;
      const addr = f.addr.value.trim();
      const dm = f.dm.value;

      const checks = [
        name.split(/\s+/).length >= 2 && name.length >= 4,
        /^\+?998\d{9}$/.test(phone),
        dm === "p" || addr.length >= 5
      ];
      const msgs = [
        "Ism va familiyani to‘liq kiriting",
        "Telefon formati: +998901234567",
        "Yetkazish manzilini kiriting"
      ];
      $$("#coStep1 .er").forEach((el, i) => (el.textContent = checks[i] ? "" : msgs[i]));
      if (!checks.every(Boolean)) return;

      Object.assign(co, { name, phone, city, addr, dm, step: 2 });
      renderCheckout();
    };
  }

  const f2 = $("#coStep2");
  if (f2) {
    f2.onsubmit = (e) => {
      e.preventDefault();
      const f = e.target;
      const pm = f.pm.value;
      co.maskedCard = "";

      if (pm === "card") {
        const rawNum = f.cn.value.replace(/\s+/g, "");
        const ex = f.ex.value.trim();
        const cv = f.cv.value.trim();
        const mm = Number(ex.slice(0, 2));
        const yy = Number(ex.slice(3, 5)) + 2000;
        const now = new Date();
        const validExp =
          /^\d{2}\/\d{2}$/.test(ex) &&
          mm >= 1 &&
          mm <= 12 &&
          (yy > now.getFullYear() || (yy === now.getFullYear() && mm >= now.getMonth() + 1));

        const checks = [luhnCheck(rawNum), validExp, /^\d{3}$/.test(cv)];
        const msgs = [
          "16 xonali karta raqamini to‘g‘ri kiriting",
          "Muddatni MM/YY formatida (kelajak oy) kiriting",
          "CVV kod 3 ta raqamdan iborat bo‘lishi kerak"
        ];
        $$("#coStep2 .er").forEach((el, i) => (el.textContent = checks[i] ? "" : msgs[i]));
        if (!checks.every(Boolean)) return;
        co.maskedCard = "•••• " + rawNum.slice(-4);
      }

      co.pm = pm;
      co.step = 3;
      renderCheckout();
    };
  }
}

function finalizeOrder() {
  const { total } = cartTotals();
  const orderId = "NP-" + Math.floor(100000 + Math.random() * 900000);
  const createdAt = new Date().toLocaleString("uz-UZ");
  const snapshotItems = st.cart.map((c) => ({ title: c.title, q: c.q, price: c.price }));
  const totalQty = snapshotItems.reduce((s, x) => s + x.q, 0);

  const newOrder = {
    id: orderId,
    at: createdAt,
    customer: co.name,
    phone: co.phone,
    city: co.city,
    addr: co.dm === "k" ? co.addr : "Showroom",
    pm: co.pm,
    items: snapshotItems,
    qty: totalQty,
    total,
    status: "Rasmiylashtirildi"
  };

  st.orders.unshift(newOrder);
  st.cart = [];
  st.promo = "";
  saveState();
  updateBadges();
  renderAll();
  showOfficialReceipt(newOrder);
}

function showOfficialReceipt(ord) {
  const pmLabel = { card: "Bank kartasi", payme: "Payme", click: "Click", cash: "Naqd pul" }[ord.pm] || ord.pm;
  openModal(`
    <div class="receipt" id="printableReceipt">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px dashed var(--bd);padding-bottom:10px">
        <div>
          <span class="tag">RASMIY ELEKTRON CHEK</span>
          <h2 style="margin:2px 0">NOUTBUK PRO</h2>
          <p class="mu">Kassa / Buyurtma №: <b>${ord.id}</b></p>
        </div>
        <div style="text-align:right;font-size:12px" class="mu">
          <div>${ord.at}</div>
          <div>Holat: <b>${ord.status}</b></div>
        </div>
      </div>
      <div style="margin:12px 0;font-size:14px">
        <p>Xaridor: <b>${ord.customer}</b> (${ord.phone})</p>
        <p>Manzil: <b>${ord.city}, ${ord.addr}</b></p>
        <p>To‘lov turi: <b>${pmLabel}</b></p>
      </div>
      <div style="border-top:1px dashed var(--bd);border-bottom:1px dashed var(--bd);padding:10px 0">
        ${ord.items
          .map(
            (it) => `<div style="display:flex;justify-content:space-between;margin:5px 0;font-size:14px">
              <span>${it.title} × ${it.q}</span>
              <b>${fmt(it.price * it.q)}</b>
            </div>`
          )
          .join("")}
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px">
        <span style="font-size:16px;font-weight:700">Jami summa:</span>
        <span style="font-size:21px;font-weight:800">${fmt(ord.total)}</span>
      </div>
      <div style="margin-top:14px;padding:10px;border-radius:12px;background:var(--bg2);border:1px solid var(--bd);font-size:12px;text-align:center" class="mu">
        Kassa kodi: <b>${ord.id}-${ord.qty}PCS-VERIFIED</b> · 12 oy rasmiy kafolat
      </div>
    </div>
    <div class="row no-print">
      <button class="btn" onclick="window.print()">🖨 Chekni chop etish</button>
      <button class="btn g" onclick="closeModal()">Yopish</button>
    </div>
  `);
}

function openFavorites() {
  openModal(`
    <h2>Sevimlilar (${st.fav.length})</h2>
    ${
      st.fav.length
        ? `<div class="cards" style="margin-top:12px">${st.fav
            .map((id) => D.find((d) => d.id === id))
            .filter(Boolean)
            .map(cardHtml)
            .join("")}</div>`
        : `<div class="empty">Hozircha sevimli noutbuklar yo‘q. Kartochkadagi ♥ tugmasini bosing.</div>`
    }
    <button class="btn g sm-btn" style="margin-top:14px" onclick="closeModal()">Yopish</button>
  `);
}

function openProfile() {
  openModal(`
    <h2>Profil va Buyurtmalar</h2>
    <p class="mu">Saqlangan buyurtmalar soni: <b>${st.orders.length}</b></p>
    <div style="margin-top:14px">
      ${
        st.orders.length
          ? st.orders
              .map(
                (o) => `
                <div class="acc-item">
                  <div>
                    <b>#${o.id}</b> · ${o.qty} ta mahsulot · <span class="mu">${o.at}</span><br>
                    <span class="mu">${o.customer || "Mijoz"} · ${o.city || ""}</span>
                  </div>
                  <div style="text-align:right">
                    <b>${fmt(o.total)}</b><br>
                    <button class="sm" style="margin-top:4px" onclick="showOfficialReceiptById('${o.id}')">Chek</button>
                  </div>
                </div>`
              )
              .join("")
          : `<div class="empty">Hali buyurtmalar rasmiylashtirilmagan.</div>`
      }
    </div>
    <button class="btn g sm-btn" style="margin-top:14px" onclick="closeModal()">Yopish</button>
  `);
}

function showOfficialReceiptById(id) {
  const ord = st.orders.find((x) => x.id === id);
  if (ord) showOfficialReceipt(ord);
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $("#thm").textContent = theme === "dark" ? "☀️" : "🌙";
  S("np_theme", theme);
}

function route() {
  const rawHash = location.hash.slice(1) || "home";
  if (rawHash === "gaming") st.cat = "gaming";
  else if (rawHash === "macbook") st.cat = "macbook";
  else if (rawHash === "catalog" && ["gaming", "macbook"].includes(st.cat)) st.cat = "all";

  const pageKey = ["gaming", "macbook"].includes(rawHash) ? "catalog" : rawHash;
  $$(".pg").forEach((p) => p.classList.toggle("on", p.id === "p-" + pageKey));
  $$("nav a").forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + rawHash));
  $("#nav").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
  renderAll();
}

$("#curr-btn").textContent = st.curr === "USD" ? "🇺🇸 USD $" : "🇺🇿 SO‘M";
$("#curr-btn").onclick = toggleCurrency;
$("#thm").onclick = () => applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
$("#bFav").onclick = openFavorites;
$("#bCart").onclick = openCart;
$("#bProf").onclick = openProfile;
$("#burger").onclick = () => $("#nav").classList.toggle("open");

[$("#ovM"), $("#ovC")].forEach((ov) => {
  ov.onclick = (e) => {
    if (e.target === ov) ov.classList.remove("show");
  };
});
document.onkeydown = (e) => {
  if (e.key === "Escape") $$(".ov").forEach((ov) => ov.classList.remove("show"));
};

$("#cf").onsubmit = (e) => {
  e.preventDefault();
  const f = e.target;
  const n = f.n.value.trim();
  const em = f.e.value.trim();
  const m = f.m.value.trim();
  const checks = [n.length > 1, /^\S+@\S+\.\S+$/.test(em), m.length > 2];
  $$("#cf .er").forEach((el, i) => (el.textContent = checks[i] ? "" : "Maydonni to‘g‘ri to‘ldiring"));
  if (checks.every(Boolean)) {
    toast("Xabaringiz yuborildi!");
    f.reset();
  }
};

["q", "fb", "fr", "fs", "fp", "fq", "so"].forEach((id) => {
  $("#" + id).addEventListener(id === "q" ? "input" : "change", renderCat);
});
$("#fb").innerHTML = `<option value="all">Barcha brendlar</option>` + brands.map((b) => `<option>${b}</option>`).join("");
$("#mqi").textContent = (brands.join(" · ") + " · ").repeat(5).toUpperCase();

document.addEventListener("mousemove", (e) => {
  $("#cg").style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
});
addEventListener("scroll", () => {
  const maxH = Math.max(1, document.body.scrollHeight - innerHeight);
  $("#pb").style.width = (scrollY / maxH) * 100 + "%";
});
addEventListener("hashchange", route);

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll("[data-n]").forEach((el) => {
        if (el.dataset.done) return;
        el.dataset.done = "1";
        const target = +el.dataset.n;
        let start = null;
        const step = (ts) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / 1100, 1);
          el.textContent = Math.round(target * p).toLocaleString();
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    });
  },
  { threshold: 0.2 }
);
$$(".stats").forEach((s) => statObserver.observe(s));

const savedTheme = L("np_theme", null);
const prefDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (prefDark ? "dark" : "light"));

renderNews();
updateBadges();
route();

setTimeout(() => {
  $("#load").style.opacity = "0";
  setTimeout(() => $("#load").remove(), 550);
}, 500);
