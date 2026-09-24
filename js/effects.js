/* ============================================================
   effects.js · 加载动画 / 自定义光标 / 3D倾斜 / 磁吸 / 滚动进度
   ============================================================ */

/* ---------- 0. 全局鼠标坐标（供聚光高亮使用） ---------- */
window.addEventListener("mousemove", (e) => {
  document.body.style.setProperty("--mx", e.clientX + "px");
  document.body.style.setProperty("--my", e.clientY + "px");
}, { passive: true });

/* ---------- 1. 开场加载动画 ---------- */
(() => {
  const loader = document.getElementById("loader");
  if (!loader) return;
  window.addEventListener("load", () => {
    setTimeout(() => loader.classList.add("hidden"), 1700);
  });
  // 兜底：若 load 已过期或卡住，2.6s 后强制关闭
  setTimeout(() => loader.classList.add("hidden"), 2600);
})();

/* ---------- 2. 自定义双层光标 ---------- */
(() => {
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (!dot || !ring) return;
  if (window.matchMedia("(hover: none)").matches) return; // 触屏跳过

  let mx = innerWidth / 2, my = innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  }, { passive: true });

  // 光环惯性跟随
  (function loop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();

  // 悬停可交互元素时放大光环
  const hoverables = "a, button, .tag, .stat, .btn-glow, .work-card, .skill-card, .burger";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverables)) ring.classList.add("hovering");
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hoverables)) ring.classList.remove("hovering");
  });
})();

/* ---------- 3. 卡片 3D 倾斜 ---------- */
(() => {
  if (window.matchMedia("(hover: none)").matches) return;
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        `perspective(900px) rotateX(${-py * 10}deg) rotateY(${px * 12}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
})();

/* ---------- 4. 磁吸按钮 ---------- */
(() => {
  if (window.matchMedia("(hover: none)").matches) return;
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
      btn.style.transition = "transform 0.4s var(--ease-out)";
      setTimeout(() => (btn.style.transition = ""), 400);
    });
  });
})();

/* ---------- 5. 顶部滚动进度条 ---------- */
(() => {
  const bar = document.getElementById("scroll-bar");
  if (!bar) return;
  const update = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
})();
