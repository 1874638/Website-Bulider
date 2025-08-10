// 간단 HTML 웹사이트 빌더 (KR/EN 다국어 지원)
// 상태 -------------------------------------------------------------
const LS_KEY = "simple-site-builder-v1";
const defaultState = {
  meta: { title: "내 웹사이트", bg: "#ffffff", maxWidth: 900, lang: "ko" },
  blocks: []
};

let state = loadState();
if (!state.meta) state.meta = {};
if (!state.meta.lang) state.meta.lang = "ko";

// i18n -------------------------------------------------------------
const i18n = {
  ko: {
    "brand.title": "간단 HTML 웹사이트 빌더",
    "buttons.sample": "샘플 템플릿 불러오기",
    "buttons.clear": "초기화",
    "buttons.publish": "Publish",
    "labels.language": "언어",
    "lang.ko": "한국어",
    "lang.en": "English",
    "palette.addBlocks": "블록 추가",
    "palette.pageSettings": "페이지 설정",
    "fields.pageTitle": "페이지 제목",
    "fields.pageTitlePlaceholder": "예: 내 웹사이트",
    "fields.bgColor": "배경색",
    "fields.maxWidth": "본문 최대 폭(px)",
    "canvas.hint": "좌측에서 블록을 추가해 시작하세요",
    "editor.title": "블록 편집",
    "buttons.close": "닫기",
    "buttons.cancel": "취소",
    "buttons.save": "저장",
    "publish.title": "생성된 index.html",
    "publish.copy": "복사하기",
    "publish.download": "index.html 다운로드",
    "blocks.heading": "제목",
    "blocks.paragraph": "문단",
    "blocks.image": "이미지",
    "blocks.button": "버튼",
    "blocks.divider": "구분선",
    "blocks.spacer": "여백",
    "controls.up": "위로",
    "controls.down": "아래로",
    "controls.edit": "편집",
    "controls.delete": "삭제",
    "confirm.clearAll": "모든 내용을 초기화할까요?",
    "confirm.loadTemplate": "샘플 템플릿으로 바꾸시겠어요? 현재 내용은 덮어쓰여요.",
    "confirm.deleteBlock": "이 블록을 삭제할까요?",
    "alerts.copySuccess": "코드를 클립보드에 복사했습니다.",
    "preview.imagePlaceholder": "이미지 URL을 설정해주세요",
    "editor.heading.level": "제목 레벨",
    "editor.heading.text": "텍스트",
    "editor.paragraph.text": "문단 텍스트",
    "editor.image.url": "이미지 URL",
    "editor.image.alt": "대체 텍스트(alt)",
    "editor.image.radius": "모서리 반경(px)",
    "editor.button.label": "라벨",
    "editor.button.href": "링크",
    "editor.button.variant": "스타일",
    "editor.button.variant.primary": "프라이머리",
    "editor.button.variant.link": "링크",
    "editor.spacer.height": "높이(px)",
    "editor.divider.none": "설정할 항목이 없습니다.",
    "defaults.headingText": "새 제목",
    "defaults.paragraphText": "여기에 문단 내용을 입력하세요.",
    "defaults.buttonLabel": "자세히 보기",
    "sample.title": "간단 랜딩 페이지",
    "sample.h1": "안녕하세요, 나의 첫 웹사이트!",
    "sample.p1": "이 도구로 아주 쉽게 HTML 웹사이트를 만들 수 있어요.\n좌측에서 블록을 추가하고, Publish로 코드를 생성하세요.",
    "sample.button": "시작하기",
    "sample.imgAlt": "샘플 이미지",
    "sample.footer": "© 2025 내 웹사이트"
  },
  en: {
    "brand.title": "Simple HTML Website Builder",
    "buttons.sample": "Load sample template",
    "buttons.clear": "Reset",
    "buttons.publish": "Publish",
    "labels.language": "Language",
    "lang.ko": "Korean",
    "lang.en": "English",
    "palette.addBlocks": "Add blocks",
    "palette.pageSettings": "Page settings",
    "fields.pageTitle": "Page title",
    "fields.pageTitlePlaceholder": "e.g., My website",
    "fields.bgColor": "Background color",
    "fields.maxWidth": "Max content width (px)",
    "canvas.hint": "Add blocks from the left to get started",
    "editor.title": "Edit block",
    "buttons.close": "Close",
    "buttons.cancel": "Cancel",
    "buttons.save": "Save",
    "publish.title": "Generated index.html",
    "publish.copy": "Copy",
    "publish.download": "Download index.html",
    "blocks.heading": "Heading",
    "blocks.paragraph": "Paragraph",
    "blocks.image": "Image",
    "blocks.button": "Button",
    "blocks.divider": "Divider",
    "blocks.spacer": "Spacer",
    "controls.up": "Up",
    "controls.down": "Down",
    "controls.edit": "Edit",
    "controls.delete": "Delete",
    "confirm.clearAll": "Reset all content?",
    "confirm.loadTemplate": "Replace with the sample template? Current content will be overwritten.",
    "confirm.deleteBlock": "Delete this block?",
    "alerts.copySuccess": "Code copied to clipboard.",
    "preview.imagePlaceholder": "Please set an image URL",
    "editor.heading.level": "Heading level",
    "editor.heading.text": "Text",
    "editor.paragraph.text": "Paragraph text",
    "editor.image.url": "Image URL",
    "editor.image.alt": "Alt text",
    "editor.image.radius": "Border radius (px)",
    "editor.button.label": "Label",
    "editor.button.href": "Link",
    "editor.button.variant": "Style",
    "editor.button.variant.primary": "Primary",
    "editor.button.variant.link": "Link",
    "editor.spacer.height": "Height (px)",
    "editor.divider.none": "No settings.",
    "defaults.headingText": "New heading",
    "defaults.paragraphText": "Write your paragraph here.",
    "defaults.buttonLabel": "Learn more",
    "sample.title": "Simple landing page",
    "sample.h1": "Hello, my first website!",
    "sample.p1": "With this tool, you can easily build an HTML website.\nAdd blocks from the left and click Publish to generate code.",
    "sample.button": "Get started",
    "sample.imgAlt": "Sample image",
    "sample.footer": "© 2025 My website"
  }
};

function t(key) {
  const lang = state?.meta?.lang || "ko";
  return i18n[lang]?.[key] ?? i18n["ko"]?.[key] ?? key;
}

// 유틸 -------------------------------------------------------------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function saveState() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Failed to save state", e);
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return structuredClone(defaultState);
}

function sanitize(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function nl2br(text) {
  return sanitize(text).replaceAll("\n", "<br>");
}

// 앱 시작 ----------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
  wireUI();
  renderAll();
  applyI18n();
});

// UI 바인딩 --------------------------------------------------------
function wireUI() {
  // 블록 추가
  $$(".block-btn").forEach(btn => {
    btn.addEventListener("click", () => addBlock(btn.dataset.type));
  });

  // 페이지 설정
  const titleInput = $("#site-title");
  const bgInput = $("#bg-color");
  const maxWidthInput = $("#max-width");

  titleInput.addEventListener("input", (e) => {
    state.meta.title = e.target.value || "";
    saveState();
  });
  bgInput.addEventListener("input", (e) => {
    state.meta.bg = e.target.value || "#ffffff";
    saveState();
    renderCanvas(); // 배경 반영
  });
  maxWidthInput.addEventListener("input", (e) => {
    const v = parseInt(e.target.value || "900", 10);
    state.meta.maxWidth = isNaN(v) ? 900 : v;
    saveState();
    renderCanvas();
  });

  // 언어 선택
  const langSelect = $("#lang-select");
  langSelect.value = state.meta.lang || "ko";
  langSelect.addEventListener("change", (e) => {
    setLanguage(e.target.value);
  });

  // 헤더 액션
  $("#clear-all").addEventListener("click", () => {
    if (!confirm(t("confirm.clearAll"))) return;
    state = structuredClone(defaultState);
    // 언어 유지
    state.meta.lang = $("#lang-select").value || "ko";
    saveState();
    renderAll();
    applyI18n();
  });

  $("#load-template").addEventListener("click", () => {
    if (!confirm(t("confirm.loadTemplate"))) return;
    state = sampleTemplate();
    // 현재 언어 유지
    state.meta.lang = $("#lang-select").value || state.meta.lang || "ko";
    saveState();
    renderAll();
    applyI18n();
  });

  $("#publish").addEventListener("click", onPublish);

  // 편집 모달
  $("#editor-close").addEventListener("click", closeEditor);
  $("#editor-cancel").addEventListener("click", closeEditor);
  $("#editor-save").addEventListener("click", saveEditor);

  // Publish 모달
  $("#publish-close").addEventListener("click", closePublish);
  $("#copy-code").addEventListener("click", copyExport);
  $("#download-code").addEventListener("click", downloadExport);
}

function setLanguage(lang) {
  state.meta.lang = (lang === "en") ? "en" : "ko";
  document.documentElement.lang = state.meta.lang;
  saveState();
  applyI18n();
  renderCanvas(); // 버튼 title 등 갱신
}

// 랜더링 -----------------------------------------------------------
function renderAll() {
  $("#site-title").value = state.meta.title ?? "";
  $("#bg-color").value = state.meta.bg ?? "#ffffff";
  $("#max-width").value = state.meta.maxWidth ?? 900;
  $("#lang-select").value = state.meta.lang ?? "ko";
  document.documentElement.lang = state.meta.lang ?? "ko";
  applyI18n();
  renderCanvas();
}

function renderCanvas() {
  const canvas = $("#canvas");
  canvas.style.maxWidth = `min(${state.meta.maxWidth || 900}px, 92vw)`;
  canvas.innerHTML = "";
  if (!state.blocks.length) {
    $(".canvas-hint").style.display = "block";
    $(".canvas-hint").textContent = t("canvas.hint");
    return;
  }
  $(".canvas-hint").style.display = "none";
  state.blocks.forEach((block, index) => {
    const el = document.createElement("div");
    el.className = "preview-block";
    el.dataset.index = index;

    const controls = document.createElement("div");
    controls.className = "controls";
    controls.innerHTML = `
      <button class="icon-btn" data-act="up" title="${sanitize(t("controls.up"))}">↑</button>
      <button class="icon-btn" data-act="down" title="${sanitize(t("controls.down"))}">↓</button>
      <button class="icon-btn" data-act="edit" title="${sanitize(t("controls.edit"))}">✎</button>
      <button class="icon-btn" data-act="del" title="${sanitize(t("controls.delete"))}">🗑</button>
    `;
    controls.addEventListener("click", (e) => {
      const act = e.target?.dataset?.act;
      if (!act) return;
      if (act === "up") moveBlock(index, -1);
      if (act === "down") moveBlock(index, +1);
      if (act === "edit") openEditor(index);
      if (act === "del") deleteBlock(index);
    });
    el.appendChild(controls);

    const body = document.createElement("div");
    switch (block.type) {
      case "heading": {
        const level = block.data.level || "h2";
        const tag = ["h1","h2","h3"].includes(level) ? level : "h2";
        const text = sanitize(block.data.text || (state.meta.lang==="en" ? "Heading" : "제목"));
        body.innerHTML = `<${tag} class="preview-heading block-heading ${tag}">${text}</${tag}>`;
        break;
      }
      case "paragraph": {
        const text = nl2br(block.data.text || (state.meta.lang==="en" ? "Paragraph content" : "문단 내용"));
        body.innerHTML = `<p class="preview-paragraph block-paragraph">${text}</p>`;
        break;
      }
      case "image": {
        const src = block.data.src || "";
        const alt = sanitize(block.data.alt || "");
        const radius = Number(block.data.radius ?? 10);
        body.innerHTML = src
          ? `<img class="preview-image" src="${sanitize(src)}" alt="${alt}" style="border-radius:${radius}px" />`
          : `<div style="color:#9fb0ff">${sanitize(t("preview.imagePlaceholder"))}</div>`;
        break;
      }
      case "button": {
        const label = sanitize(block.data.label || t("defaults.buttonLabel"));
        const href = sanitize(block.data.href || "#");
        const variant = block.data.variant || "primary";
        const styles = variant === "link"
          ? `style="background:transparent;color:#9cc0ff;text-decoration:underline;border:none;padding:0"`
          : ``;
        body.innerHTML = `<a href="${href}" class="preview-button" ${styles}>${label}</a>`;
        break;
      }
      case "divider": {
        body.innerHTML = `<hr class="preview-divider" />`;
        break;
      }
      case "spacer": {
        const h = Number(block.data.height ?? 24);
        body.innerHTML = `<div class="preview-spacer" style="height:${h}px"></div>`;
        break;
      }
      default:
        body.innerHTML = `<div>Unknown block</div>`;
    }

    el.appendChild(body);
    canvas.appendChild(el);
  });
}

// 블록 조작 --------------------------------------------------------
function addBlock(type) {
  const block = createDefaultBlock(type);
  if (!block) return;
  state.blocks.push(block);
  saveState();
  renderCanvas();
}

function createDefaultBlock(type) {
  switch (type) {
    case "heading":
      return { type, data: { level: "h2", text: t("defaults.headingText") } };
    case "paragraph":
      return { type, data: { text: t("defaults.paragraphText") } };
    case "image":
      return { type, data: { src: "", alt: "", radius: 10 } };
    case "button":
      return { type, data: { label: t("defaults.buttonLabel"), href: "#", variant: "primary" } };
    case "divider":
      return { type, data: {} };
    case "spacer":
      return { type, data: { height: 24 } };
    default:
      alert("Unsupported block.");
      return null;
  }
}

function moveBlock(index, delta) {
  const ni = index + delta;
  if (ni < 0 || ni >= state.blocks.length) return;
  const [b] = state.blocks.splice(index, 1);
  state.blocks.splice(ni, 0, b);
  saveState();
  renderCanvas();
}

function deleteBlock(index) {
  if (!confirm(t("confirm.deleteBlock"))) return;
  state.blocks.splice(index, 1);
  saveState();
  renderCanvas();
}

// 편집기 -----------------------------------------------------------
let editingIndex = null;

function openEditor(index) {
  editingIndex = index;
  const block = state.blocks[index];
  const body = $("#editor-body");
  body.innerHTML = "";
  const form = document.createElement("form");

  if (block.type === "heading") {
    form.innerHTML = `
      <div class="field">
        <label>${sanitize(t("editor.heading.level"))}</label>
        <select name="level">
          <option value="h1" ${block.data.level==="h1"?"selected":""}>H1</option>
          <option value="h2" ${block.data.level==="h2"?"selected":""}>H2</option>
          <option value="h3" ${block.data.level==="h3"?"selected":""}>H3</option>
        </select>
      </div>
      <div class="field">
        <label>${sanitize(t("editor.heading.text"))}</label>
        <input type="text" name="text" value="${sanitize(block.data.text || "")}" />
      </div>
    `;
  } else if (block.type === "paragraph") {
    form.innerHTML = `
      <div class="field">
        <label>${sanitize(t("editor.paragraph.text"))}</label>
        <textarea name="text" rows="6" placeholder="${sanitize(t("editor.paragraph.text"))}">${sanitize(block.data.text || "")}</textarea>
      </div>
    `;
  } else if (block.type === "image") {
    form.innerHTML = `
      <div class="field">
        <label>${sanitize(t("editor.image.url"))}</label>
        <input type="url" name="src" placeholder="https://..." value="${sanitize(block.data.src || "")}" />
      </div>
      <div class="field">
        <label>${sanitize(t("editor.image.alt"))}</label>
        <input type="text" name="alt" value="${sanitize(block.data.alt || "")}" />
      </div>
      <div class="field">
        <label>${sanitize(t("editor.image.radius"))}</label>
        <input type="number" name="radius" min="0" max="40" value="${Number(block.data.radius ?? 10)}" />
      </div>
    `;
  } else if (block.type === "button") {
    form.innerHTML = `
      <div class="field">
        <label>${sanitize(t("editor.button.label"))}</label>
        <input type="text" name="label" value="${sanitize(block.data.label || "")}" />
      </div>
      <div class="field">
        <label>${sanitize(t("editor.button.href"))}</label>
        <input type="url" name="href" placeholder="https://..." value="${sanitize(block.data.href || "")}" />
      </div>
      <div class="field">
        <label>${sanitize(t("editor.button.variant"))}</label>
        <select name="variant">
          <option value="primary" ${block.data.variant==="primary"?"selected":""}>${sanitize(t("editor.button.variant.primary"))}</option>
          <option value="link" ${block.data.variant==="link"?"selected":""}>${sanitize(t("editor.button.variant.link"))}</option>
        </select>
      </div>
    `;
  } else if (block.type === "spacer") {
    form.innerHTML = `
      <div class="field">
        <label>${sanitize(t("editor.spacer.height"))}</label>
        <input type="number" name="height" min="4" max="160" value="${Number(block.data.height ?? 24)}" />
      </div>
    `;
  } else if (block.type === "divider") {
    form.innerHTML = `<div class="field" style="color:#aab3da">${sanitize(t("editor.divider.none"))}</div>`;
  }

  body.appendChild(form);
  $("#editor-title").textContent = t("editor.title");
  $("#editor-close").setAttribute("aria-label", t("buttons.close"));
  $("#editor-cancel").textContent = t("buttons.cancel");
  $("#editor-save").textContent = t("buttons.save");

  $("#editor-modal").classList.remove("hidden");
}

function closeEditor() {
  $("#editor-modal").classList.add("hidden");
  editingIndex = null;
}

function saveEditor() {
  if (editingIndex == null) return;
  const block = state.blocks[editingIndex];
  const form = $("#editor-body form");
  const fd = new FormData(form);

  if (block.type === "heading") {
    block.data.level = fd.get("level") || "h2";
    block.data.text = (fd.get("text") || "").toString();
  } else if (block.type === "paragraph") {
    block.data.text = (fd.get("text") || "").toString();
  } else if (block.type === "image") {
    block.data.src = (fd.get("src") || "").toString();
    block.data.alt = (fd.get("alt") || "").toString();
    block.data.radius = Number(fd.get("radius") || 10);
  } else if (block.type === "button") {
    block.data.label = (fd.get("label") || "").toString();
    block.data.href = (fd.get("href") || "").toString();
    block.data.variant = (fd.get("variant") || "primary").toString();
  } else if (block.type === "spacer") {
    block.data.height = Number(fd.get("height") || 24);
  }

  saveState();
  renderCanvas();
  closeEditor();
}

// Publish ----------------------------------------------------------
function onPublish() {
  const html = buildExportHTML();
  $("#export-code").value = html;
  $("#publish-title").textContent = t("publish.title");
  $("#publish-close").setAttribute("aria-label", t("buttons.close"));
  $("#copy-code").textContent = t("publish.copy");
  $("#download-code").textContent = t("publish.download");
  $("#publish-modal").classList.remove("hidden");
}

function closePublish() {
  $("#publish-modal").classList.add("hidden");
}

async function copyExport() {
  const txt = $("#export-code").value;
  try {
    await navigator.clipboard.writeText(txt);
    alert(t("alerts.copySuccess"));
  } catch {
    $("#export-code").select();
    document.execCommand("copy");
    alert(t("alerts.copySuccess"));
  }
}

function downloadExport() {
  const blob = new Blob([$("#export-code").value], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "index.html";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// HTML 내보내기 -----------------------------------------------------
function buildExportHTML() {
  const title = sanitize(state.meta.title || (state.meta.lang==="en" ? "My website" : "내 웹사이트"));
  const bg = state.meta.bg || "#ffffff";
  const maxWidth = Number(state.meta.maxWidth || 900);
  const lang = state.meta.lang || "ko";

  const bodyContent = state.blocks.map(b => renderBlockHTML(b)).join("\n      ");

  // 인라인 CSS 포함: 배포 즉시 단일 파일 사용 가능
  const css = `
    :root{
      --text:#0c1222; --muted:#475069; --primary:#215cff;
    }
    *{box-sizing:border-box}
    body{margin:0; font-family: ui-sans-serif, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:var(--text); background:${bg}}
    main{max-width:${maxWidth}px; margin:0 auto; padding:24px 18px}
    h1{font-size:40px; margin:0 0 10px 0}
    h2{font-size:32px; margin:0 0 10px 0}
    h3{font-size:24px; margin:0 0 10px 0}
    p{font-size:16px; line-height:1.7; color:#2a3246}
    img{max-width:100%; height:auto; display:block}
    .btn{display:inline-block; padding:10px 16px; border-radius:999px; background:var(--primary); color:#fff; text-decoration:none}
    hr{border:none; border-top:1px solid #e6e8f0; margin:12px 0}
  `.trim();

  return [
    "<!doctype html>",
    `<html lang="${lang}">`,
    "<head>",
    `  <meta charset="utf-8" />`,
    `  <meta name="viewport" content="width=device-width, initial-scale=1" />`,
    `  <title>${title}</title>`,
    `  <style>${css}</style>`,
    "</head>",
    "<body>",
    "  <main>",
    `      ${bodyContent}`,
    "  </main>",
    "</body>",
    "</html>"
  ].join("\n");
}

function renderBlockHTML(block) {
  switch (block.type) {
    case "heading": {
      const level = ["h1","h2","h3"].includes(block.data.level) ? block.data.level : "h2";
      const text = sanitize(block.data.text || "");
      return `<${level}>${text}</${level}>`;
    }
    case "paragraph": {
      const text = (block.data.text || "").split("\n").map(sanitize).join("<br>");
      return `<p>${text}</p>`;
    }
    case "image": {
      const src = sanitize(block.data.src || "");
      const alt = sanitize(block.data.alt || "");
      const radius = Number(block.data.radius ?? 10);
      return src ? `<img src="${src}" alt="${alt}" style="border-radius:${radius}px" />` : "";
    }
    case "button": {
      const label = sanitize(block.data.label || t("defaults.buttonLabel"));
      const href = sanitize(block.data.href || "#");
      const variant = block.data.variant || "primary";
      if (variant === "link") {
        return `<a href="${href}" style="color:#215cff;text-decoration:underline">${label}</a>`;
      }
      return `<a class="btn" href="${href}">${label}</a>`;
    }
    case "divider":
      return `<hr />`;
    case "spacer": {
      const h = Number(block.data.height ?? 24);
      return `<div style="height:${h}px"></div>`;
    }
    default:
      return "";
  }
}

// 샘플 템플릿 -------------------------------------------------------
function sampleTemplate() {
  return {
    meta: { title: t("sample.title"), bg: "#ffffff", maxWidth: 900, lang: state.meta.lang || "ko" },
    blocks: [
      { type: "spacer", data: { height: 24 } },
      { type: "heading", data: { level: "h1", text: t("sample.h1") } },
      { type: "paragraph", data: { text: t("sample.p1") } },
      { type: "spacer", data: { height: 10 } },
      { type: "button", data: { label: t("sample.button"), href: "#", variant: "primary" } },
      { type: "spacer", data: { height: 18 } },
      { type: "image", data: { src: "https://images.unsplash.com/photo-1529336953121-a9a5478d4a5b?q=80&w=1200&auto=format&fit=crop", alt: t("sample.imgAlt"), radius: 12 } },
      { type: "spacer", data: { height: 16 } },
      { type: "divider", data: {} },
      { type: "paragraph", data: { text: t("sample.footer") } }
    ]
  };
}

// i18n 적용 --------------------------------------------------------
function applyI18n() {
  document.documentElement.lang = state.meta.lang || "ko";

  // 브랜드 제목
  const brandTitle = $(".brand .title");
  if (brandTitle) brandTitle.textContent = t("brand.title");

  // 헤더 버튼/라벨
  $("#load-template").textContent = t("buttons.sample");
  $("#clear-all").textContent = t("buttons.clear");
  $("#publish").textContent = t("buttons.publish");

  // 언어 선택 옵션 라벨
  const langSelect = $("#lang-select");
  const koOpt = langSelect.querySelector('option[value="ko"]');
  const enOpt = langSelect.querySelector('option[value="en"]');
  if (koOpt) koOpt.textContent = t("lang.ko");
  if (enOpt) enOpt.textContent = t("lang.en");

  // 팔레트 타이틀
  const pH2 = $(".palette h2"); if (pH2) pH2.textContent = t("palette.addBlocks");
  const pH3 = $(".palette h3"); if (pH3) pH3.textContent = t("palette.pageSettings");

  // 블록 추가 버튼 라벨
  $$(".block-btn").forEach(btn => {
    const type = btn.dataset.type;
    const map = {
      heading: "blocks.heading",
      paragraph: "blocks.paragraph",
      image: "blocks.image",
      button: "blocks.button",
      divider: "blocks.divider",
      spacer: "blocks.spacer"
    };
    if (map[type]) btn.textContent = t(map[type]);
  });

  // 설정 필드 라벨 + 플레이스홀더
  const titleField = $("#site-title")?.closest(".field");
  if (titleField) titleField.querySelector("span").textContent = t("fields.pageTitle");
  const bgField = $("#bg-color")?.closest(".field");
  if (bgField) bgField.querySelector("span").textContent = t("fields.bgColor");
  const mwField = $("#max-width")?.closest(".field");
  if (mwField) mwField.querySelector("span").textContent = t("fields.maxWidth");
  $("#site-title").placeholder = t("fields.pageTitlePlaceholder");

  // 캔버스 힌트
  $(".canvas-hint").textContent = t("canvas.hint");

  // 편집/퍼블리시 모달 기본 라벨
  $("#editor-title").textContent = t("editor.title");
  $("#editor-close").setAttribute("aria-label", t("buttons.close"));
  $("#editor-cancel").textContent = t("buttons.cancel");
  $("#editor-save").textContent = t("buttons.save");

  $("#publish-title").textContent = t("publish.title");
  $("#publish-close").setAttribute("aria-label", t("buttons.close"));
  $("#copy-code").textContent = t("publish.copy");
  $("#download-code").textContent = t("publish.download");
}