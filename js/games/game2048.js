/* ============================================================
   games/game2048.js · 霓虹 2048
   方向键 / WASD 滑动合并 · R 重开
   ============================================================ */

(() => {
  const SIZE = 4;

  window.GameRegistry = window.GameRegistry || {};
  window.GameRegistry.game2048 = {
    title: "🔢 霓虹 2048",
    hint: "方向键 / WASD 滑动 · R 重新开始",
    mount,
  };

  function mount(stage, api) {
    stage.innerHTML = "";
    const board = document.createElement("div");
    board.className = "g2048-board";
    stage.appendChild(board);

    let grid, score, won;

    const blank = () => Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

    function reset() {
      grid = blank();
      score = 0; won = false;
      api.setScore(0);
      stage.querySelector(".game-over-panel")?.remove();
      addTile(); addTile();
      render();
    }

    function addTile() {
      const empty = [];
      grid.forEach((row, y) => row.forEach((v, x) => !v && empty.push({ x, y })));
      if (!empty.length) return;
      const { x, y } = empty[(Math.random() * empty.length) | 0];
      grid[y][x] = Math.random() < 0.9 ? 2 : 4;
    }

    /* 沿左方向压缩一行：返回 {row, gained} */
    function slide(row) {
      const arr = row.filter((v) => v);
      const out = [];
      let gained = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === arr[i + 1]) {
          out.push(arr[i] * 2);
          gained += arr[i] * 2;
          if (arr[i] * 2 === 2048) won = true;
          i++;
        } else out.push(arr[i]);
      }
      while (out.length < SIZE) out.push(0);
      return { row: out, gained };
    }

    const transpose = (g) => g[0].map((_, i) => g.map((r) => r[i]));
    const reverse = (g) => g.map((r) => r.slice().reverse());

    function move(dirX, dirY) {
      const before = JSON.stringify(grid);
      let gained = 0;

      const work =
        dirY === -1 ? transpose(grid) :
        dirY === 1  ? reverse(transpose(grid)) :
        dirX === 1  ? reverse(grid) : grid;

      const moved = work.map((row) => {
        const r = slide(row);
        gained += r.gained;
        return r.row;
      });

      let restored =
        dirY === -1 ? transpose(moved) :
        dirY === 1  ? reverse(transpose(moved)) :
        dirX === 1  ? reverse(moved) : moved;

      grid = restored;
      if (JSON.stringify(grid) === before) return;   // 未移动，忽略

      score += gained;
      api.setScore(score);
      addTile();
      render();
      if (won) overlay("YOU WIN! 🎉", "#00e5ff");
      else if (isDead()) overlay("GAME OVER", "#ff2e88");
    }

    function isDead() {
      if (grid.some((row) => row.includes(0))) return false;
      for (let y = 0; y < SIZE; y++)
        for (let x = 0; x < SIZE; x++) {
          const v = grid[y][x];
          if (grid[y][x + 1] === v || grid[y + 1]?.[x] === v) return false;
        }
      return true;
    }

    function overlay(msg, color) {
      const holder = document.createElement("div");
      holder.className = "game-over-panel";
      holder.innerHTML = `<h4 style="color:${color}">${msg}</h4>
        <p>得分 ${score}</p><button class="btn-restart">R · 再来一局</button>`;
      holder.querySelector(".btn-restart").onclick = reset;
      stage.style.position = "relative";
      stage.appendChild(holder);
    }

    function render() {
      board.innerHTML = "";
      grid.forEach((row) =>
        row.forEach((v) => {
          const cell = document.createElement("div");
          cell.className = "g2048-cell" + (v ? " pop" : "");
          if (v) cell.dataset.v = v;
          cell.textContent = v || "";
          cell.style.fontSize = v >= 128 ? "1.3rem" : "1.6rem";
          board.appendChild(cell);
        })
      );
    }

    const MAP = {
      ArrowUp: [0, -1], KeyW: [0, -1],
      ArrowDown: [0, 1], KeyS: [0, 1],
      ArrowLeft: [-1, 0], KeyA: [-1, 0],
      ArrowRight: [1, 0], KeyD: [1, 0],
    };
    function onKey(e) {
      if (e.code === "KeyR") return reset();
      const m = MAP[e.code];
      if (!m) return;
      e.preventDefault();
      move(m[0], m[1]);
    }
    window.addEventListener("keydown", onKey);

    reset();

    return {
      destroy() {
        window.removeEventListener("keydown", onKey);
      },
    };
  }
})();
