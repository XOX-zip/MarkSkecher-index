/* ============================================================
   games-hub.js · 街机厅弹窗调度
   读取 GameRegistry，卡片点击 → 打开对应游戏，关闭时 destroy
   ============================================================ */

(() => {
  const modal = document.getElementById("game-modal");
  if (!modal) return;

  const stage = document.getElementById("game-stage");
  const scoreEl = document.getElementById("game-score");
  const titleEl = document.getElementById("game-title");
  const hintEl = document.getElementById("game-hint");
  const closeBtn = document.getElementById("game-close");

  let current = null; // { destroy }

  const api = { setScore: (n) => (scoreEl.textContent = n) };

  function open(key) {
    const game = window.GameRegistry?.[key];
    if (!game) return;

    titleEl.textContent = game.title;
    hintEl.textContent = game.hint || "";
    scoreEl.textContent = "0";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    current = game.mount(stage, api) || { destroy() {} };
  }

  function close() {
    if (!modal.classList.contains("open")) return;
    current?.destroy?.();
    current = null;
    stage.innerHTML = "";
    stage.style.position = "";
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  // 卡片绑定
  document.querySelectorAll(".game-card[data-game]").forEach((card) => {
    card.addEventListener("click", () => open(card.dataset.game));
  });

  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();      // 点背景关闭
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();
