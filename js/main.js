/* ============================================================
   main.js · 滚动显现 / 数字滚动 / 导航高亮 / 移动菜单 / 彩蛋
   ============================================================ */

/* ---------- 1. 滚动显现 (IntersectionObserver) ---------- */
(() => {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();

/* ---------- 2. 数字滚动计数 ---------- */
(() => {
  const nums = document.querySelectorAll(".stat-num");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = +el.dataset.count;
        const dur = 1600;
        const t0 = performance.now();

        (function frame(t) {
          const p = Math.min((t - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
          el.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(frame);
        })(t0);

        io.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  nums.forEach((n) => io.observe(n));
})();

/* ---------- 3. 导航栏：滚动底色 + 当前区块高亮 ---------- */
(() => {
  const nav = document.querySelector(".navbar");
  const links = document.querySelectorAll(".nav-links a");
  const sections = [...links]
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);

    const y = window.scrollY + window.innerHeight * 0.35;
    let current = sections[0];
    for (const s of sections) {
      if (s.offsetTop <= y) current = s;
    }
    links.forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === "#" + current.id)
    );
  }, { passive: true });
})();

/* ---------- 4. 移动端汉堡菜单 ---------- */
(() => {
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".nav-links");
  burger.addEventListener("click", () => menu.classList.toggle("open"));
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => menu.classList.remove("open"))
  );
})();

/* ---------- 5. 控制台彩蛋 ---------- */
console.log(
  "%c MarkSkecher %c Hello, fellow developer! 👋 ",
  "background:linear-gradient(90deg,#00e5ff,#7b5cff);color:#06080f;font-weight:bold;padding:4px 8px;border-radius:4px 0 0 4px;",
  "background:#0b0f1a;color:#00e5ff;padding:4px 8px;border-radius:0 4px 4px 0;"
);
