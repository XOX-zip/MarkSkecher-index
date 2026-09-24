/* ============================================================
   quotes.js · 编程箴言淡入淡出轮播
   ============================================================ */

(() => {
  const box = document.querySelector(".credo");
  const textEl = document.getElementById("credo-text");
  const authorEl = document.getElementById("credo-author");
  if (!box || !textEl || !authorEl) return;

  const QUOTES = [
    ["算法的艺术在于：把复杂的问题，分解成简单的问题，再把简单的问题写成一堆 bug。", "佚名"],
    ["Talk is cheap. Show me the code.", "Linus Torvalds"],
    ["先解决你的问题，然后再写代码。", "Joel Spolsky"],
    ["任何足够先进的科技，都与魔法无异。", "Arthur C. Clarke"],
    ["编程不难，难的是让别人看懂你写的代码。", "Stack Overflow 名言"],
    ["调试两倍的困难，意味着你写代码时不该用满全部智商。", "Kernighan 定律"],
    ["程序是写给人读的，只是顺便能在机器上运行。", "Abelson & Sussman"],
  ];

  let i = 0;
  setInterval(() => {
    i = (i + 1) % QUOTES.length;
    box.classList.add("fading");
    setTimeout(() => {
      textEl.textContent = QUOTES[i][0];
      authorEl.textContent = "—— " + QUOTES[i][1];
      box.classList.remove("fading");
    }, 500);
  }, 6000);
})();
