/* ============================================================
   typing.js · 打字机效果
   ============================================================ */

(() => {
  const el = document.getElementById("typewriter");
  if (!el) return;

  const phrases = [
    "Full-Stack Dreamer · 全栈造梦师",
    "console.log('Hello, Universe!');",
    "用代码把 ☕ 变成软件",
    "Bug? 那是未文档化的特性。",
    "git push --force 命运的齿轮",
  ];
  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const text = phrases[pi];
    ci += deleting ? -1 : 1;
    el.textContent = text.slice(0, ci);

    let delay = deleting ? 35 : 75;
    if (!deleting && ci === text.length) {
      delay = 2200;                 // 打完停留
      deleting = true;
    } else if (deleting && ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
      delay = 500;
    }
    setTimeout(tick, delay);
  }
  tick();
})();
