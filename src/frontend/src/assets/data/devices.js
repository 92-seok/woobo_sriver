/* =========================================================
   이미지 지도 + 마커(70/80/90) + 목록↔마커 연동 + 실시간 수위 바
   (최종본: stage/텍스트/뱃지 업데이트 “한 함수”로 통일)
   ========================================================= */

const $ = (sel, root = document) => (root ? root.querySelector(sel) : null);
const $$ = (sel, root = document) =>
  root ? [...root.querySelectorAll(sel)] : [];

const LEVELS = { CAUTION: 70, WARN: 80, CRIT: 90 };

/** ✅ 지도 이미지 위 좌표(%)로 찍습니다. (left/top) */
export const DEVICES_BASE = [
  {
    id: "D-001",
    name: "상주 용유천",
    addr: "경상북도 상주시 하북면 용유리 601(용유교)",
    // pos: { x: 52, y: 73 }, // 지도 이미지 기준 %
    lat: 36.4128,
    lon: 128.1583,
    water: 42,
    online: true,
    img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=70",
  },
  {
    id: "D-002",
    name: "상주 ○○천",
    addr: "경상북도 상주시 ○○면 ○○리",
    pos: { x: 36, y: 85 },
    water: 73,
    online: true,
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=70",
  },
  {
    id: "D-003",
    name: "창녕 내동천",
    addr: "경상남도 창녕군 이방면 안리 1013",
    pos: { x: 68, y: 64 },
    water: 88,
    online: true,
    img: "https://images.unsplash.com/photo-1441829266145-6d4bfbd38eb4?auto=format&fit=crop&w=900&q=70",
  },
  {
    id: "D-004",
    name: "창녕 내동천(2)",
    addr: "경상남도 창녕군 이방면 안리 1013",
    pos: { x: 75, y: 62 },
    water: null, // 수신 없음 → Unknown
    online: false,
    img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=70",
  },
  {
    id: "D-005",
    name: "창녕 (2)",
    addr: "경상남도",
    pos: { x: 30, y: 62 },
    water: 100, // 수신 없음 → Unknown
    online: true,
    netError: true, // ✅ 추가: 네트워크 에러
    img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=70",
  },
  {
    id: "D-006",
    name: "상주 안동 (2)",
    addr: "경상남도 창녕군 이방면 안리 1013",
    pos: { x: 60, y: 82 },
    water: 82, // 수신 없음 → Unknown
    online: true,
    netError: true, // ✅ 추가: 네트워크 에러
    img: "https://images.unsplash.com/photo-1441829266145-6d4bfbd38eb4?auto=format&fit=crop&w=900&q=70",
  },
];

/* ---------------------------
   유틸
--------------------------- */
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ---------------------------
   ✅ stage 계산 “한 함수”로 통일
--------------------------- */
function waterStageFrom(device) {
  if (!device?.online || device.water === null || device.water === undefined)
    return "unk";
  const w = Number(device.water);
  if (Number.isNaN(w)) return "unk";
  if (w >= LEVELS.CRIT) return "crit";
  if (w >= LEVELS.WARN) return "warn";
  if (w >= LEVELS.CAUTION) return "caution";
  return "ok";
}

/* ---------------------------
   ✅ 텍스트 “한 함수”로 통일
--------------------------- */
function waterText(stage) {
  switch (stage) {
    case "crit":
      return "심각 (90%↑)";
    case "warn":
      return "경계 (80%↑)";
    case "caution":
      return "주의 (70%↑)";
    case "ok":
      return "정상 (<70%)";
    default:
      return "Unknown";
  }
}

/* ---------------------------
   class helpers (기존 스타일 그대로)
--------------------------- */
function stageBadgeClass(stage) {
  switch (stage) {
    case "crit":
      return "badge--crit";
    case "warn":
      return "badge--warn";
    case "caution":
      return "badge--caution";
    case "ok":
      return "badge--ok";
    default:
      return "badge--unk";
  }
}

function stagePillClass(stage) {
  switch (stage) {
    case "crit":
      return "pill pill--crit";
    case "warn":
      return "pill pill--warn";
    case "caution":
      return "pill pill--caution";
    case "ok":
      return "pill pill--ok";
    default:
      return "pill pill--unk";
  }
}

function stageCardClass(stage) {
  if (stage === "crit") return "card--crit";
  if (stage === "warn") return "card--warn";
  if (stage === "caution") return "card--caution";
  if (stage === "ok") return "card--ok";
  return "card--unk";
}

function stageDotClass(stage) {
  if (stage === "crit") return "card__dot card__dot--crit";
  if (stage === "warn") return "card__dot card__dot--warn";
  if (stage === "caution") return "card__dot card__dot--caution";
  if (stage === "ok") return "card__dot card__dot--ok";
  return "card__dot card__dot--unk";
}

function markerDotClass(stage) {
  switch (stage) {
    case "crit":
      return "nm-dot nm-dot--crit";
    case "warn":
      return "nm-dot nm-dot--warn";
    case "caution":
      return "nm-dot nm-dot--caution";
    case "ok":
      return "nm-dot nm-dot--ok";
    default:
      return "nm-dot nm-dot--unk";
  }
}

/* ---------------------------
   ✅ applyWaterBadges()
   - pill + popupWaterBadge 동시에 업데이트
--------------------------- */
function waterBadgeClass(stage) {
  if (stage === "crit") return "popup__waterBadge--crit";
  if (stage === "warn") return "popup__waterBadge--warn";
  if (stage === "caution") return "popup__waterBadge--caution";
  if (stage === "ok") return "popup__waterBadge--ok";
  return "popup__waterBadge--unk";
}

/**
 * @param {Object} args
 * @param {Object} args.device
 * @param {HTMLElement|null} args.pillEl  - 목록 pill 요소 (없으면 null)
 * @param {HTMLElement|null} args.popupEl - 팝업 뱃지 요소 (없으면 null)
 */
function applyWaterBadges({ device, pillEl = null, popupEl = null }) {
  const stage = waterStageFrom(device);
  const text = waterText(stage);

  // 목록 pill
  if (pillEl) {
    pillEl.className = stagePillClass(stage);
    pillEl.textContent = text;
  }

  // 팝업 waterBadge
  if (popupEl) {
    popupEl.className = "popup__waterBadge " + waterBadgeClass(stage);
    popupEl.textContent = text;
  }
}

/* ---------------------------
   네트워크 상태 (공통)
--------------------------- */

/**
 * 우선순위
 * 1) netError === true  -> Network Error
 * 2) online === false   -> Unknown
 * 3) water == null      -> Unknown
 * 4) 그 외              -> Operational
 */
function networkLabel(device) {
  if (!device) return "Unknown";
  if (device.netError === true) return "Network Error";
  if (!device.online || device.water == null) return "Unknown";
  return "Operational";
}

/**
 * 카드/팝업에서 쓰는 네트워크 stage
 * ok | error | unk
 */
function networkStage(device) {
  const label = networkLabel(device);
  if (label === "Operational") return "ok";
  if (label === "Network Error") return "error";
  return "unk";
}

function updatePopupNetwork(device) {
  const netWrap = document.getElementById("popupNet");
  const netDot = document.getElementById("popupNetDot");
  const netTextEl = document.getElementById("popupNetText");
  const popup = document.getElementById("devicePopup");

  if (!netWrap || !netDot || !netTextEl || !popup) return;

  const stage = networkStage(device); // ok | error | unk
  const netText = networkLabel(device); // Operational | Network Error | Unknown

  // 텍스트
  netTextEl.textContent = netText;

  // 네트워크 영역
  netWrap.className = "popup__net popup__net--" + stage;
  netDot.className = "popup__dot popup__dot--" + stage;

  // ✅ 팝업 테두리 동기화 (핵심)
  popup.classList.remove("popup--net-ok", "popup--net-error", "popup--net-unk");
  popup.classList.add("popup--net-" + stage);
}

function networkDotClass(stage) {
  return "card__dot card__dot--" + stage;
}

function networkTextClass(stage) {
  return "status-text status-text--" + stage;
}

/* ---------------------------
   전역 상태
--------------------------- */
const state = {
  devices: DEVICES_BASE.map((d) => ({ ...d, updatedAt: Date.now() })),
  activeId: DEVICES_BASE[0]?.id ?? null,
  issueOnly: false,
};

const elMarkers = $("#mapMarkers");
const elList = $("#deviceList");
const elTotal = $("#totalCount");

const elPopup = $("#devicePopup");
const elPopupName = $("#popupName");
const elPopupAddr = $("#popupAddr");
const elPopupWaterBadge = $("#popupWaterBadge");

const elPopupWater = $("#popupWater");
const elPopupImg = $("#popupImg");
const elLv70 = $("#popupLv70");
const elLv80 = $("#popupLv80");
const elLv90 = $("#popupLv90");

const elWaterFill = $("#waterFill");
const elWaterPctText = $("#waterPctText");

const elCountOk = $("#countOk");
const elCountWarn = $("#countWarn");
const elCountCrit = $("#countCrit");
const elCountUnk = $("#countUnk");

const elBarOk = $("#barOk");
const elBarWarn = $("#barWarn");
const elBarCrit = $("#barCrit");
const elBarUnk = $("#barUnk");

const elPctOk = $("#pctOk");
const elPctWarn = $("#pctWarn");
const elPctCrit = $("#pctCrit");
const elPctUnk = $("#pctUnk");

/* ---------------------------
   마커 렌더링 (이미지 지도 위)
--------------------------- */
function renderMarkers() {
  if (!elMarkers) return;
  elMarkers.innerHTML = "";

  state.devices.forEach((d) => {
    const stage = waterStageFrom(d);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "map-marker" + (d.id === state.activeId ? " is-active" : "");
    btn.style.left = `${clamp(d.pos.x, 0, 100)}%`;
    btn.style.top = `${clamp(d.pos.y, 0, 100)}%`;
    btn.dataset.id = d.id;
    btn.setAttribute("aria-label", `${d.name} 마커`);
    btn.innerHTML = `<span class="${markerDotClass(stage)}"></span>`;

    btn.addEventListener("click", () =>
      selectDevice(d.id, { openPopup: true }),
    );
    elMarkers.appendChild(btn);
  });
}

function syncMarkerActive() {
  $$(".map-marker", elMarkers).forEach((btn) => {
    const id = btn.dataset.id;
    btn.classList.toggle("is-active", id === state.activeId);

    const d = state.devices.find((x) => x.id === id);
    const stage = d ? waterStageFrom(d) : "unk";
    const dot = btn.querySelector(".nm-dot");
    if (dot) dot.className = markerDotClass(stage);
  });
}

function isMobileLike() {
  // 폴드/모바일 브라우저에서 가장 안정적인 조건
  return window.matchMedia("(pointer: coarse)").matches;
  // 필요하면 아래처럼 폭 조건도 OR로 추가 가능:
  // return window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 1024;
}

/* ---------------------------
   우측 목록 렌더링
--------------------------- */
function getShownDevices() {
  if (!state.issueOnly) return state.devices;

  return state.devices.filter((d) => {
    const st = waterStageFrom(d);
    return st === "caution" || st === "warn" || st === "crit" || st === "unk";
  });
}

function renderList() {
  if (!elList) return;
  elList.innerHTML = "";

  const shown = getShownDevices();
  elTotal.textContent = String(shown.length);

  shown.forEach((d) => {
    const stage = waterStageFrom(d); // 수위 단계
    const netStage = networkStage(d); // 네트워크 단계
    const netText = networkLabel(d);

    const card = document.createElement("div");
    card.className =
      "card " +
      stageCardClass(stage) +
      (d.id === state.activeId ? " card--active" : "");
    card.role = "listitem";
    card.tabIndex = 0;

    card.innerHTML = `
      <div class="card__top">
        <div class="card__name">${escapeHtml(d.name)}</div>

        <div class="card__status">
          <span class="${networkDotClass(netStage)}"></span>
          <span class="${networkTextClass(netStage)}">
            ${escapeHtml(netText)}
          </span>
        </div>
      </div>

      <div class="card__addr">${escapeHtml(d.addr)}</div>

      <div style="margin-top:10px; display:flex; justify-content:flex-end;">
        <div class="pill pill--unk" data-water-pill="1">Unknown</div>
      </div>
    `;

    const pillEl = card.querySelector('[data-water-pill="1"]');
    applyWaterBadges({ device: d, pillEl, popupEl: null });

    card.addEventListener("click", () =>
      selectDevice(d.id, { openPopup: true }),
    );
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        selectDevice(d.id, { openPopup: true });
      }
    });

    elList.appendChild(card);
  });

  updateBottomStats(shown);
}

/* ---------------------------
   선택 동기화 (목록 ↔ 마커 ↔ 팝업)
--------------------------- */
function selectDevice(id, opts = { openPopup: true }) {
  state.activeId = id;

  renderList();
  syncMarkerActive();

  const d = state.devices.find((x) => x.id === id);
  if (!d) return;

  if (opts.openPopup) openPopupAtMarker(d);
}

function positionPopupNearMarker(deviceId) {
  const popup = elPopup;
  const marker = document.querySelector(`.map-marker[data-id="${deviceId}"]`);
  const map = document.querySelector(".map");
  if (!popup || !marker || !map) return;

  const mapRect = map.getBoundingClientRect();
  const mRect = marker.getBoundingClientRect();

  // marker center (relative to map)
  let x = mRect.left + mRect.width / 2 - mapRect.left;
  let y = mRect.top - mapRect.top;

  popup.style.left = x + "px";
  popup.style.top = y + "px";

  // clamp horizontally inside map
  requestAnimationFrame(() => {
    const pRect = popup.getBoundingClientRect();
    const leftOverflow = pRect.left - mapRect.left;
    const rightOverflow = mapRect.right - pRect.right;

    if (leftOverflow < 8) x += 8 - leftOverflow;
    if (rightOverflow < 8) x -= 8 - rightOverflow;

    popup.style.left = x + "px";
    popup.style.top = y + "px";
  });
}

// function isMobileLike() {
//   return window.matchMedia("(pointer: coarse)").matches;
// }

function isMobilePopupMode() {
  // 터치 기기(폴드 포함)면 모바일 모드로 간주
  return window.matchMedia("(pointer: coarse)").matches;
}

function openPopupAtMarker(d) {
  openCenterPopup(d); // 내용 채우고 show

  // ✅ 모바일(터치): CSS fixed 위치로 고정 (마커 근처 배치 금지)
  if (isMobilePopupMode()) return;

  // ✅ PC(마우스): 위젯/마커 근처로 띄우기
  positionPopupNearMarker(d.id);
}

window.addEventListener("resize", () => {
  // ✅ 모바일(터치)은 주소창/툴바 변동으로 resize가 잦아서 재배치 금지
  if (isMobilePopupMode()) return;

  if (elPopup && !elPopup.hidden && state.activeId) {
    positionPopupNearMarker(state.activeId);
  }
});

/* ---------------------------
   가운데 팝업 + 수위 바
--------------------------- */
function fillColorByStage(stage) {
  if (stage === "crit") return "rgba(255,77,79,.90)";
  if (stage === "warn") return "rgba(255,159,26,.90)";
  if (stage === "caution") return "rgba(247,201,72,.90)";
  if (stage === "ok") return "rgba(39,196,107,.90)";
  return "rgba(154,167,183,.85)";
}

function updateWaterBar(d) {
  const stage = waterStageFrom(d);
  const pct = d.water == null ? 0 : clamp(d.water, 0, 100);

  if (elWaterFill) {
    elWaterFill.style.background = fillColorByStage(stage);
    elWaterFill.style.width = pct + "%";
  }
  if (elWaterPctText) {
    elWaterPctText.textContent = d.water == null ? "-" : `${pct}%`;
  }
}

function closePopup() {
  if (elPopup) elPopup.hidden = true;
}

/* ✅ 최종 openCenterPopup (applyWaterBadges로 popupWaterBadge 갱신) */
function openCenterPopup(d) {
  if (!elPopup) return;

  elPopupName.textContent = d.name;
  elPopupAddr.textContent = d.addr;
  elPopupWater.textContent = d.water == null ? "-" : String(d.water);

  elLv70.textContent = d.water != null && d.water >= 70 ? "해당" : "해당 없음";
  elLv80.textContent = d.water != null && d.water >= 80 ? "해당" : "해당 없음";
  elLv90.textContent = d.water != null && d.water >= 90 ? "해당" : "해당 없음";

  elPopupImg.src = d.img;

  updatePopupNetwork(d);
  applyWaterBadges({ device: d, pillEl: null, popupEl: elPopupWaterBadge });

  updateWaterBar(d);

  elPopup.hidden = false;
}

/* ---------------------------
   하단 상태바
--------------------------- */
function updateBottomStats(list) {
  const total = list.length || 1;

  let ok = 0,
    warn = 0,
    crit = 0,
    unk = 0;

  list.forEach((d) => {
    const st = waterStageFrom(d);
    if (st === "ok") ok++;
    else if (st === "caution" || st === "warn") warn++;
    else if (st === "crit") crit++;
    else unk++;
  });

  elCountOk.textContent = String(ok);
  elCountWarn.textContent = String(warn);
  elCountCrit.textContent = String(crit);
  elCountUnk.textContent = String(unk);

  const pctOk = Math.round((ok / total) * 100);
  const pctWarn = Math.round((warn / total) * 100);
  const pctCrit = Math.round((crit / total) * 100);
  const pctUnk = Math.max(0, 100 - pctOk - pctWarn - pctCrit);

  elBarOk.style.width = pctOk + "%";
  elBarWarn.style.width = pctWarn + "%";
  elBarCrit.style.width = pctCrit + "%";
  elBarUnk.style.width = pctUnk + "%";

  elPctOk.textContent = pctOk + "%";
  elPctWarn.textContent = pctWarn + "%";
  elPctCrit.textContent = pctCrit + "%";
  elPctUnk.textContent = pctUnk + "%";
}

/* ---------------------------
   검색/필터/이슈필터
--------------------------- */
function applySearch() {
  const type = $("#searchType")?.value;
  const q = ($("#q")?.value || "").trim().toLowerCase();

  if (!q) {
    state.devices = DEVICES_BASE.map((d) => ({ ...d, updatedAt: Date.now() }));
    state.activeId = state.devices[0]?.id ?? null;
    renderMarkers();
    renderList();
    if (state.activeId) selectDevice(state.activeId, { openPopup: true });
    return;
  }

  const filtered = DEVICES_BASE.filter((d) => {
    const hay = type === "addr" ? d.addr : type === "id" ? d.id : d.name;
    return String(hay).toLowerCase().includes(q);
  }).map((d) => ({ ...d, updatedAt: Date.now() }));

  state.devices = filtered;
  state.activeId = state.devices[0]?.id ?? null;

  renderMarkers();
  renderList();
  if (state.activeId) selectDevice(state.activeId, { openPopup: true });
}

/* ---------------------------
   실시간 수위 시뮬레이션 (3초마다)
--------------------------- */
function startRealtimeSimulation() {
  setInterval(() => {
    state.devices = state.devices.map((d) => {
      if (!d.online || d.water == null) return d;

      const delta = Math.round(Math.random() * 10 - 5); // -5~+5
      const next = clamp(d.water + delta, 0, 100);

      return {
        ...d,
        water: next,
        updatedAt: Date.now(),
      };
    });

    // UI 동기 갱신
    renderList();
    syncMarkerActive();

    // 팝업이 열려있으면 내용도 갱신
    if (elPopup && !elPopup.hidden && state.activeId) {
      const active = state.devices.find((x) => x.id === state.activeId);
      if (active) {
        elPopupWater.textContent =
          active.water == null ? "-" : String(active.water);

        elLv70.textContent =
          active.water != null && active.water >= 70 ? "해당" : "해당 없음";
        elLv80.textContent =
          active.water != null && active.water >= 80 ? "해당" : "해당 없음";
        elLv90.textContent =
          active.water != null && active.water >= 90 ? "해당" : "해당 없음";

        updatePopupNetwork(active);
        applyWaterBadges({
          device: active,
          pillEl: null,
          popupEl: elPopupWaterBadge,
        });

        updateWaterBar(active);
      }
    }
  }, 3000);
}

/* ---------------------------
   이벤트 바인딩 / 부팅
--------------------------- */
function bindUI() {
  $("#filterForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    state.devices = DEVICES_BASE.map((d) => ({ ...d, updatedAt: Date.now() }));
    state.issueOnly = false;
    const qEl = $("#q");
    if (qEl) qEl.value = "";

    state.activeId = state.devices[0]?.id ?? null;
    renderMarkers();
    renderList();
    if (state.activeId) selectDevice(state.activeId, { openPopup: true });
  });

  $("#btnSearch")?.addEventListener("click", applySearch);
  $("#q")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") applySearch();
  });

  $("#btnIssue")?.addEventListener("click", () => {
    state.issueOnly = !state.issueOnly;
    renderList();
  });

  $("#btnClosePopup")?.addEventListener("click", closePopup);

  // 상세보기 버튼 → detail.html 새창 열기
  document.getElementById("btnDetail")?.addEventListener("click", () => {
    const url = "soha_detail.html"; // 필요 시 파라미터 추가 가능
    window.open(url, "_blank", "noopener,noreferrer");
  });

  // toolbar (수위/CCTV) 버튼: UI 토글만
  $$(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".chip").forEach((b) => b.classList.remove("chip--active"));
      btn.classList.add("chip--active");
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && elPopup && !elPopup.hidden) closePopup();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindUI();

  // 최초 렌더
  renderMarkers();
  renderList();
  if (state.activeId) selectDevice(state.activeId, { openPopup: true });

  // 실시간 수위
  startRealtimeSimulation();
});

function netStage(d) {
  return !d.online || d.water == null ? "unk" : "ok"; // Operational=ok, Unknown=unk
}
function netText(d) {
  return netStage(d) === "ok" ? "Operational" : "Unknown";
}
