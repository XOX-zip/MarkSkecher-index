/* ============================================================
   merger.js · Scratch 扩展合并器 核心逻辑
   文件管理 / IIFE 包裹合并 / 重复积木静态扫描 / 下载与复制
   全部在浏览器本地完成，不发送任何网络请求
   ============================================================ */

(() => {
  const $ = (id) => document.getElementById(id);

  const dropzone = $("dropzone");
  const fileInput = $("file-input");
  const filePanel = $("file-panel");
  const fileList = $("file-list");
  const fileCount = $("file-count");
  const totalSize = $("total-size");

  const optIIFE = $("opt-iife");
  const optHeader = $("opt-header");
  const optDedupe = $("opt-dedupe");

  const btnMerge = $("btn-merge");
  const btnDownload = $("btn-download");
  const btnCopy = $("btn-copy");
  const btnClear = $("btn-clear");

  const reportPanel = $("report-panel");
  const reportBody = $("report-body");
  const previewPanel = $("preview-panel");
  const codePreview = $("code-preview");
  const mergedSize = $("merged-size");

  /** 文件状态：{ name, size, text }，顺序即合并顺序 */
  const files = [];
  let mergedText = "";

  const kb = (n) => (n / 1024).toFixed(1) + " KB";

  /* ---------- toast ---------- */
  let toastEl, toastTimer;
  function toast(msg, isError) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.toggle("error", !!isError);
    requestAnimationFrame(() => toastEl.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  /* ---------- 添加文件 ---------- */
  async function addFiles(list) {
    let skipped = 0;
    for (const f of list) {
      if (!/\.(js|txt)$/i.test(f.name)) { skipped++; continue; }
      try {
        const text = await f.text();
        files.push({ name: f.name, size: f.size, text });
      } catch {
        skipped++;
      }
    }
    render();
    if (skipped) toast(`已跳过 ${skipped} 个非 .js/.txt 文件`, true);
  }

  dropzone.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => {
    addFiles([...fileInput.files]);
    fileInput.value = "";                       // 允许重复选同一文件
  });

  ["dragover", "dragenter"].forEach((ev) =>
    dropzone.addEventListener(ev, (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    })
  );
  ["dragleave", "drop"].forEach((ev) =>
    dropzone.addEventListener(ev, (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
      if (ev === "drop" && e.dataTransfer?.files?.length) addFiles([...e.dataTransfer.files]);
    })
  );

  /* ---------- 列表渲染与排序 ---------- */
  function render() {
    fileList.innerHTML = "";
    files.forEach((f, i) => {
      const li = document.createElement("li");
      li.className = "file-item";

      const idx = document.createElement("span");
      idx.className = "file-idx";
      idx.textContent = "#" + (i + 1);

      const name = document.createElement("span");
      name.className = "file-name";
      name.textContent = f.name;
      name.title = f.name;

      const size = document.createElement("span");
      size.className = "file-size";
      size.textContent = kb(f.size);

      const ops = document.createElement("span");
      ops.className = "file-ops";
      ops.append(
        opBtn("↑", "up", i, 0),
        opBtn("↓", "down", i, files.length - 1),
        opBtn("✕", "remove", i, -1)
      );

      li.append(idx, name, size, ops);
      fileList.appendChild(li);
    });

    fileCount.textContent = files.length;
    totalSize.textContent = kb(files.reduce((s, f) => s + f.size, 0));
    filePanel.hidden = files.length === 0;
  }

  function opBtn(label, act, index, min) {
    const b = document.createElement("button");
    b.textContent = label;
    b.dataset.act = act;
    if (act !== "remove" && (index === min || files.length < 2)) b.disabled = true;
    b.addEventListener("click", () => {
      if (act === "up") [files[index - 1], files[index]] = [files[index], files[index - 1]];
      if (act === "down") [files[index + 1], files[index]] = [files[index], files[index + 1]];
      if (act === "remove") files.splice(index, 1);
      render();
    });
    return b;
  }

  btnClear.addEventListener("click", () => {
    files.length = 0;
    mergedText = "";
    render();
    reportPanel.hidden = previewPanel.hidden = true;
    btnDownload.disabled = btnCopy.disabled = true;
    toast("列表已清空");
  });

  /* ---------- 重复积木 / 扩展 ID 静态扫描 ---------- */
  // 模式1：新对象格式  blockId: "xxx"
  // 模式2：经典数组格式 blocks: [ ["xxx", { ... }] ]
  // 模式3：扩展 ID      id: "xxx"（同一 ID 重复注册会互相覆盖）
  const PATTERNS = [
    /\bblockId:\s*["']([^"']+)["']/g,
    /\[\s*["']([a-zA-Z_][\w]*(?:[ _][\w]+)*)["']\s*,\s*\{/g,
    /^\s{0,4}id:\s*["']([^"']+)["']/gm,
  ];

  function scanBlocks(text) {
    const found = new Set();
    for (const re of PATTERNS) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(text))) found.add(m[1]);
    }
    return found;
  }

  function detectDuplicates() {
    const owner = new Map();   // 积木名 -> 首个文件
    const dups = new Map();    // 积木名 -> [文件...]
    files.forEach((f) => {
      for (const name of scanBlocks(f.text)) {
        if (owner.has(name)) {
          if (!dups.has(name)) dups.set(name, [owner.get(name)]);
          dups.get(name).push(f.name);
        } else {
          owner.set(name, f.name);
        }
      }
    });
    return dups;
  }

  function renderReport(dups) {
    reportPanel.hidden = false;
    reportBody.innerHTML = "";
    if (!dups.size) {
      const ok = document.createElement("p");
      ok.className = "report-ok";
      ok.textContent = "✔ 未发现重复积木 / 扩展 ID，可放心加载";
      reportBody.appendChild(ok);
      return;
    }
    const title = document.createElement("p");
    title.className = "report-warn-title";
    title.textContent = `⚠ 发现 ${dups.size} 项跨文件重复（Scratch 中会冲突，请删除靠后定义）`;
    reportBody.appendChild(title);
    for (const [name, fl] of dups) {
      const item = document.createElement("div");
      item.className = "dup-item";
      const code = document.createElement("code");
      code.textContent = name;
      const where = document.createElement("span");
      where.className = "dup-files";
      where.textContent = " 出现于： " + fl.join(" 、 ");
      item.append(code, where);
      reportBody.appendChild(item);
    }
  }

  /* ---------- 合并 ---------- */
  btnMerge.addEventListener("click", () => {
    if (files.length === 0) return toast("请先添加至少一个 .js 文件", true);
    if (files.length === 1) toast("只有 1 个文件，合并即原样输出");

    mergedText = files
      .map((f, i) => {
        const header = optHeader.checked
          ? `/* ══════════════ [${i + 1}/${files.length}] ${f.name} ══════════════ */\n`
          : "";
        const body = optIIFE.checked
          ? `(() => {\n${f.text.trimEnd()}\n})();`
          : f.text.trimEnd();
        return header + body;
      })
      .join("\n\n");

    // 预览（超大时截断，避免卡顿）
    const LIMIT = 30000;
    codePreview.textContent =
      mergedText.length > LIMIT
        ? mergedText.slice(0, LIMIT) + `\n\n… /* 预览已截断，下载可获取完整文件（共 ${mergedText.length.toLocaleString()} 字符） */`
        : mergedText;
    mergedSize.textContent = kb(new Blob([mergedText]).size);
    previewPanel.hidden = false;
    btnDownload.disabled = btnCopy.disabled = false;

    // 重复检测
    if (optDedupe.checked && files.length > 1) renderReport(detectDuplicates());
    else reportPanel.hidden = true;

    toast(`已合并 ${files.length} 个文件 ✔`);
    previewPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /* ---------- 下载 ---------- */
  btnDownload.addEventListener("click", () => {
    if (!mergedText) return;
    const url = URL.createObjectURL(new Blob([mergedText], { type: "text/javascript" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "merged-extension.js";
    a.click();
    URL.revokeObjectURL(url);
    toast("merged-extension.js 已下载 ✔");
  });

  /* ---------- 复制 ---------- */
  btnCopy.addEventListener("click", async () => {
    if (!mergedText) return;
    try {
      await navigator.clipboard.writeText(mergedText);
      toast("完整合并代码已复制到剪贴板 ✔");
    } catch {
      // 非 HTTPS / 旧浏览器兜底
      const ta = document.createElement("textarea");
      ta.value = mergedText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy") ? toast("已复制 ✔") : toast("复制失败，请手动选择预览内容", true);
      ta.remove();
    }
  });
})();
