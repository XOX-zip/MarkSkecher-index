/* ============================================================
   particles.js · 交互式粒子星网背景
   粒子之间自动连线，鼠标靠近时产生斥力涟漪
   ============================================================ */

(() => {
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");

  const CONFIG = {
    density: 14000,     // 每多少个像素一个粒子
    linkDist: 130,      // 连线距离阈值
    mouseDist: 160,     // 鼠标影响半径
    speed: 0.35,
    colorA: "0, 229, 255",   // 霓虹青
    colorB: "123, 92, 255",  // 电光紫
  };

  let particles = [];
  let W, H;
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const count = Math.min(160, Math.floor((W * H) / CONFIG.density));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * CONFIG.speed,
      vy: (Math.random() - 0.5) * CONFIG.speed,
      r: Math.random() * 1.8 + 0.6,
      hueMix: Math.random(),
      twinkle: Math.random() * Math.PI * 2,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      // 阻尼：让点击脉冲后速度平滑回落到基础值
      p.vx += (Math.sign(p.vx) * CONFIG.speed - p.vx) * 0.02;
      p.vy += (Math.sign(p.vy) * CONFIG.speed - p.vy) * 0.02;
      p.x += p.vx;
      p.y += p.vy;
      p.twinkle += 0.02;

      // 边界环绕
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      // 鼠标斥力
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const d = Math.hypot(dx, dy);
      if (d < CONFIG.mouseDist && d > 0.01) {
        const force = (CONFIG.mouseDist - d) / CONFIG.mouseDist * 0.6;
        p.x += (dx / d) * force;
        p.y += (dy / d) * force;
      }

      const alpha = 0.5 + Math.sin(p.twinkle) * 0.3;
      const color = p.hueMix > 0.5 ? CONFIG.colorA : CONFIG.colorB;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${alpha})`;
      ctx.fill();
    }

    // 粒子连线
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < CONFIG.linkDist) {
          const alpha = (1 - d / CONFIG.linkDist) * 0.22;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${CONFIG.colorA}, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // 点击产生脉冲：瞬间向外推开周围粒子
  window.addEventListener("pointerdown", (e) => {
    for (const p of particles) {
      const dx = p.x - e.clientX;
      const dy = p.y - e.clientY;
      const d = Math.hypot(dx, dy);
      if (d < 220 && d > 0.01) {
        const push = (1 - d / 220) * 9;
        p.vx += (dx / d) * push * 0.06;
        p.vy += (dy / d) * push * 0.06;
      }
    }
  });

  resize();
  step();
})();
