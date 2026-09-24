/* ============================================================
   games/memory.js · 记忆翻牌
   4×4 · 8 对程序员图标 · 全部配对即胜利
   ============================================================ */

(() => {
  const ICONS = ["🚀", "💻", "☕", "🐍", "⚡", "🌙", "🔥", "🎮"];

  window.GameRegistry = window.GameRegistry || {};
  window.GameRegistry.memory = {
    title: "🃏 记忆翻牌",
    hint: "点击翻开卡片，找出所有相同的图标对",
    mount,
  };

  function mount(stage, api) {
    stage.innerHTML = "";
    stage.style.position = "relative";

    const board = document.createElement("div");
    board.className = "memory-board";
    stage.appendChild(board);

    let first = null, lock = false, matched = 0, moves = 0, cards = [];

    function build() {
      board.innerHTML = "";
      first = null; lock = false; matched = 0; moves = 0;
      api.setScore(0);
      stage.querySelector(".game-over-panel")?.remove();

      cards = [...ICONS, ...ICONS]
        .sort(() => Math.random() - 0.5)
        .map((icon) => {
          const el = document.createElement("div");
          el.className = "mcard";
          el.innerHTML =
            '<div class="mcard-inner">' +
            '<div class="mcard-face mcard-back"></div>' +
            `<div class="mcard-face mcard-front">${icon}</div>` +
            "</div>";
          el.addEventListener("click", () => flip(el, icon));
          board.appendChild(el);
          return { el, icon };
        });
    }

    function flip(el, icon) {
      if (lock || el.classList.contains("matched") || (first && first.el === el)) return;
      el.classList.add("flipped");

      if (!first) { first = { el, icon }; return; }

      // 翻开第二张 → 计一步
      const a = first;
      first = null;
      moves += 1;
      api.setScore(moves);
      lock = true;

      const ok = a.icon === icon;
      setTimeout(() => {
        if (ok) {
          a.el.classList.replace("flipped", "matched");
          el.classList.replace("flipped", "matched");
          matched += 2;
          if (matched === cards.length) win();
        } else {
          a.el.classList.remove("flipped");
          el.classList.remove("flipped");
        }
        lock = false;
      }, ok ? 320 : 720);
    }

    function win() {
      const panel = document.createElement("div");
      panel.className = "game-over-panel";
      panel.innerHTML = `<h4 style="color:var(--neon)">ALL CLEAR!</h4>
        <p>用了 ${moves} 步完成配对</p>
        <button class="btn-restart">再来一局</button>`;
      panel.querySelector(".btn-restart").onclick = build;
      stage.appendChild(panel);
    }

    build();

    return { destroy() {} };
  }
})();
