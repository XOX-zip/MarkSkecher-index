/* ============================================================
   games/snake.js · 霓虹贪吃蛇
   方向键 / WASD 操控 · R 重开 · 吃球加速
   ============================================================ */

(() => {
  const N = 20;          // 网格数
  const CELL = 20;       // 单元格像素
  const SIZE = N * CELL;

  window.GameRegistry = window.GameRegistry || {};
  window.GameRegistry.snake = {
    title: "🐍 霓虹贪吃蛇",
    hint: "方向键 / WASD 转向 · R 重新开始",
    mount,
  };

  function mount(stage, api) {
    stage.innerHTML = "";

    const holder = document.createElement("div");
    holder.className = "stage-holder";
    const cv = document.createElement("canvas");
    cv.width = cv.height = SIZE;
    cv.className = "game-canvas";
    holder.appendChild(cv);
    stage.appendChild(holder);
    const ctx = cv.getContext("2d");

    let snake, dir, nextDir, food, score, speed, dead = false;

    function reset() {
      snake = [{ x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }];
      dir = nextDir = { x: 1, y: 0 };
      score = 0; speed = 9;                 // 每秒移动格数
      dead = false;
      placeFood();
      api.setScore(0);
      holder.querySelector(".game-over-panel")?.remove();
      restart();
    }

    function placeFood() {
      do {
        food = { x: (Math.random() * N) | 0, y: (Math.random() * N) | 0 };
      } while (snake.some((s) => s.x === food.x && s.y === food.y));
    }

    /* ---------- 渲染 ---------- */
    function draw() {
      ctx.fillStyle = "#080b13";
      ctx.fillRect(0, 0, SIZE, SIZE);

      // 能量食物：脉冲光点
      const t = performance.now() / 300;
      const r = 5 + Math.sin(t) * 1.6;
      ctx.save();
      ctx.shadowColor = "#ff2e88";
      ctx.shadowBlur = 14;
      ctx.fillStyle = "#ff2e88";
      ctx.beginPath();
      ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 蛇身：青→紫渐变 + 外发光
      ctx.save();
      ctx.shadowColor = "#00e5ff";
      ctx.shadowBlur = 10;
      snake.forEach((s, i) => {
        const k = i / Math.max(snake.length - 1, 1);
        ctx.fillStyle = i === 0
          ? "#e8ffff"
          : `rgb(${Math.round(0 + 123 * k)}, ${Math.round(229 - 137 * k)}, ${Math.round(255)})`;
        const pad = i === 0 ? 1 : 2;
        roundRect(s.x * CELL + pad, s.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, 5);
      });
      ctx.restore();
    }

    function roundRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.fill();
    }

    /* ---------- 逻辑 ---------- */
    function tick() {
      if (dead) return;
      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      // 撞墙 / 咬自己
      if (
        head.x < 0 || head.y < 0 || head.x >= N || head.y >= N ||
        snake.some((s) => s.x === head.x && s.y === head.y)
      ) {
        return gameOver();
      }

      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        api.setScore(score);
        speed = Math.min(speed + 0.6, 18);   // 逐渐加速
        placeFood();
        restart();                           // 用新速度重建定时器
      } else {
        snake.pop();
      }
      draw();
    }

    function gameOver() {
      dead = true;
      clearInterval(timer);
      const panel = document.createElement("div");
      panel.className = "game-over-panel";
      panel.innerHTML = `<h4>GAME OVER</h4><p>得分 ${score}</p>
        <button class="btn-restart">R · 重开一局</button>`;
      panel.querySelector(".btn-restart").onclick = reset;
      holder.appendChild(panel);
    }

    let timer = null;
    function restart() {
      clearInterval(timer);
      timer = setInterval(tick, 1000 / speed);
    }

    /* ---------- 输入 ---------- */
    const KEYS = {
      ArrowUp: { x: 0, y: -1 }, KeyW: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 }, KeyS: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 }, KeyA: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 }, KeyD: { x: 1, y: 0 },
    };
    function onKey(e) {
      if (e.code === "KeyR") return reset();
      const d = KEYS[e.code];
      if (!d) return;
      e.preventDefault();
      // 禁止 180° 掉头
      if (d.x === -dir.x && d.y === -dir.y) return;
      nextDir = d;
    }
    window.addEventListener("keydown", onKey);

    reset();
    draw();

    return {
      destroy() {
        clearInterval(timer);
        window.removeEventListener("keydown", onKey);
      },
    };
  }
})();
