(() => {
const paperCatalog = {
  t2: {
    title: "2026 北京市朝阳区初一上期末数学真题",
    shortTitle: "朝阳区期末卷",
    focus: "北京市朝阳区七年级上学期期末数学真题",
    reason: "朝阳区级真题",
    region: "朝阳区",
    grade: "七年级上册",
    examType: "期末",
    questionCount: 7,
    difficulty: "中等",
    usage: 1206
  },
  t14: {
    title: "2026 北京市朝阳区初一上期中数学真题",
    shortTitle: "朝阳区期中卷",
    focus: "北京市朝阳区七年级上学期期中数学真题",
    reason: "朝阳区级真题",
    region: "朝阳区",
    grade: "七年级上册",
    examType: "期中",
    questionCount: 6,
    difficulty: "中等",
    usage: 984
  },
  t25: {
    title: "2026 北京市朝阳区初一上期末数学真题",
    shortTitle: "朝阳区期末卷",
    focus: "北京市朝阳区七年级上学期期末数学真题",
    reason: "朝阳区级真题",
    region: "朝阳区",
    grade: "七年级上册",
    examType: "期末",
    questionCount: 4,
    difficulty: "中等",
    usage: 1458
  },
  t4: {
    title: "2024—2026 朝阳区期末真题汇编：轴对称",
    shortTitle: "轴对称汇编",
    focus: "把分散真题整理成可直接使用的课内专题",
    reason: "真题汇编",
    region: "朝阳区",
    grade: "七年级下册",
    examType: "期末",
    questionCount: 6,
    difficulty: "较难",
    usage: 1532
  },
  t6: {
    title: "初一期末高频易错周测题单",
    shortTitle: "期末易错周测",
    focus: "名校周测，适合分层选题与命题参考",
    reason: "名校资源",
    region: "朝阳区",
    grade: "七年级上册",
    examType: "周测",
    questionCount: 7,
    difficulty: "较难",
    usage: 1089
  },
  t27: {
    title: "期末选择题高频考法：审题与快速提分",
    shortTitle: "期末选择题",
    focus: "高频选择题与排除方法",
    reason: "本周热门",
    region: "朝阳区",
    grade: "七年级上册",
    examType: "期末",
    questionCount: 7,
    difficulty: "中等",
    usage: 1328
  },
  t33: {
    title: "期中压轴题：关键步骤分层拆解",
    shortTitle: "期中压轴题",
    focus: "按关键步骤拆解综合题",
    reason: "名校共建",
    region: "朝阳区",
    grade: "七年级上册",
    examType: "期中",
    questionCount: 6,
    difficulty: "较难",
    usage: 1036
  }
};

const sidebarPaperList = Object.entries(paperCatalog).map(([id, meta]) => ({
  id,
  ...meta,
  recommendScore: Number(meta.usage || 0),
  latestScore: id === "t14" ? 100 : id === "t25" ? 95 : id === "t2" ? 90 : 80
}));

const paperListState = {
  query: "",
  examType: "all"
};

const rightPanelSectionState = {
  selectedCollapsed: false
};

const MAX_OPEN_TABS = 6;
const HOME_FRAME_SRC = "./index.html?embed=1&v=20260811aibar";
const QUESTION_DRAG_MIME = "application/x-aiq-questions";
const CANVAS_DRAG_MIME = "application/x-aiq-canvas";
const BROWSE_FILTER_META = {
  chapter: { filter: "chapter", label: "同步练习", icon: "ri-book-open-line" },
  special: { filter: "special", label: "专题", icon: "ri-focus-3-line" },
  paper: { filter: "paper", label: "试卷", icon: "ri-file-list-3-line" },
  workbook: { filter: "workbook", label: "练习册", icon: "ri-book-shelf-line" }
};
const mobileLayoutQuery = window.matchMedia("(max-width: 980px)");
const expandedAnalysisIds = new Set();
const selectedExpandedAnalysisKeys = new Set();
const dragPickIds = new Set();
const collapsedCanvasGroupIds = new Set();
let questionDragActive = false;
let questionDragGhost = null;
let canvasDragKey = null;
let canvasHoverTimer = null;
let canvasFocusKey = null;
let canvasOrderByType = false;

let selectedPreviewTypeFilter = null;
let selectedPanelEnlarged = false;
let selectedShowAnswers = false;
let aiAssistantOpen = false;
let aiAssistantMessages = [];
let aiAssistantAttachment = null;
let aiAssistantTyping = false;

const paperQuestions = {
  t2: [
    { id:"1", num:1, section:"一、单项选择题", type:"选择题", difficulty:"较易", knowledge:"正负数意义", minutes:1, competency:"运算能力", badges:["AI 批改","AI 赋分"], stem:"如果向东走 3 米记作 +3 米，那么向西走 5 米应记作（　　）。", options:["A. +5 米","B. −5 米","C. +3 米","D. −3 米"], answer:"B", analysis:"向西与向东相反，应记作负数。" },
    { id:"2", num:2, section:"一、单项选择题", type:"选择题", difficulty:"较易", knowledge:"相反意义的量", minutes:1, competency:"抽象能力", badges:["创新题"], stem:"下列各组量中，具有相反意义的量是（　　）。", options:["A. 上升 5 米与向东 5 米","B. 收入 80 元与支出 50 元","C. 长大 2 岁与减少 2 千克","D. 购进 10 件与卖出 8 元"], answer:"B", analysis:"收入与支出具有相反意义。" },
    { id:"3", num:3, section:"一、单项选择题", type:"选择题", difficulty:"中等", knowledge:"负数概念", stem:"在 −3、0、2.5、−1/2 四个数中，负数共有（　　）。", options:["A. 1 个","B. 2 个","C. 3 个","D. 4 个"], answer:"B", analysis:"−3 和 −1/2 为负数。" },
    { id:"4", num:4, section:"一、单项选择题", type:"选择题", difficulty:"简单", knowledge:"温差计算", stem:"某天北京的最高气温为 18 ℃，最低气温为 7 ℃，这一天的温差是（　　）。", options:["A. 25 ℃","B. −25 ℃","C. 11 ℃","D. −11 ℃"], answer:"C", analysis:"温差 = 最高温 − 最低温 = 11 ℃。" },
    { id:"5", num:5, section:"二、填空题", type:"填空题", difficulty:"简单", knowledge:"正负数应用", stem:"如果水库水位上升 0.8 米记作 +0.8 米，那么水位下降 0.5 米记作 ______ 米。", options:[], answer:"−0.5", analysis:"下降记为负。" },
    { id:"6", num:6, section:"二、填空题", type:"填空题", difficulty:"中等", knowledge:"数轴", stem:"数轴上与原点距离为 4 个单位长度的点表示的数是 ______。", options:[], answer:"4 或 −4", analysis:"距离原点 4 个单位长度有两个点。" },
    { id:"7", num:7, section:"三、解答题", type:"解答题", difficulty:"中等", knowledge:"正负数应用", stem:"某食品包装袋上标有“净含量 500±5 g”。抽检 5 袋食品的质量分别为 497 g、503 g、506 g、500 g、495 g。请用正负数表示它们相对于标准质量的偏差，并判断哪些产品合格。", options:[], answer:"497→−3，503→+3，506→+6，500→0，495→−5；497/503/500/495 合格", analysis:"合格范围为 −5 到 +5。" }
  ],
  t14: [
    { id:"1", num:1, section:"一、单项选择题", type:"选择题", difficulty:"中等", knowledge:"整式运算", stem:"下列运算正确的是（　　）。", options:["A. 3a + 2a = 5a²","B. −(−2) = 2","C. 2³ = 6","D. |−3| = −3"], answer:"B", analysis:"−(−2)=2。" },
    { id:"2", num:2, section:"一、单项选择题", type:"选择题", difficulty:"简单", knowledge:"代数式求值", stem:"若 x = −1，则 2x − 3 的值是（　　）。", options:["A. −5","B. −1","C. 1","D. 5"], answer:"A", analysis:"代入 x=−1 得 −5。" },
    { id:"3", num:3, section:"一、单项选择题", type:"选择题", difficulty:"简单", knowledge:"一元一次方程", stem:"下列方程中，是一元一次方程的是（　　）。", options:["A. x² = 4","B. 2x + 1 = 0","C. 1/x = 2","D. x + y = 1"], answer:"B", analysis:"2x+1=0 符合定义。" },
    { id:"4", num:4, section:"二、填空题", type:"填空题", difficulty:"简单", knowledge:"合并同类项", stem:"合并同类项：3x − 2x + 5 = ______。", options:[], answer:"x + 5", analysis:"3x−2x=x。" },
    { id:"5", num:5, section:"二、填空题", type:"填空题", difficulty:"中等", knowledge:"解方程", stem:"若 2x + 5 = 11，则 x = ______。", options:[], answer:"3", analysis:"2x=6，x=3。" },
    { id:"6", num:6, section:"三、解答题", type:"解答题", difficulty:"中等", knowledge:"解方程", stem:"解方程：3(x − 2) = 2x + 1，并写出检验过程。", options:[], answer:"x = 7", analysis:"展开移项求解。" }
  ],
  t25: [
    { id:"1", num:1, section:"一、单项选择题", type:"选择题", difficulty:"简单", knowledge:"轴对称", stem:"下列图形中，是轴对称图形的是（　　）。", options:["A. 平行四边形","B. 等腰三角形","C. 直角梯形","D. 任意三角形"], answer:"B", analysis:"等腰三角形是轴对称图形。" },
    { id:"2", num:2, section:"一、单项选择题", type:"选择题", difficulty:"中等", knowledge:"不等式性质", stem:"若 a < b，则下列结论一定正确的是（　　）。", options:["A. a + 1 > b + 1","B. −a > −b","C. 2a > 2b","D. a − 2 < b − 2"], answer:"D", analysis:"同减 2 不等号方向不变。" },
    { id:"3", num:3, section:"二、填空题", type:"填空题", difficulty:"简单", knowledge:"余角", stem:"一个角的余角是 35°，则这个角是 ______。", options:[], answer:"55°", analysis:"90°−35°=55°。" },
    { id:"4", num:4, section:"三、解答题", type:"解答题", difficulty:"中等", knowledge:"角平分线", stem:"如图，已知 ∠AOB = 80°，OC 平分 ∠AOB，求 ∠AOC 的度数，并说明理由。", options:[], answer:"40°", analysis:"角平分线将角分成两个相等的角。" }
  ]
};

const params = new URLSearchParams(location.search);
const contextName = params.get("context") || "paper";
const isComposeMode = params.get("mode") === "compose";
const isRecordMode = params.get("mode") === "record";
const composePrompt = String(params.get("prompt") || "").trim();
const recordFileName = String(params.get("fileName") || "待录入试卷.pdf").trim();
const isWorkbook = contextName === "series";
const isCanvasShell = Boolean(document.querySelector("#aiSelectedPanel")) && !document.querySelector("#questionCardBoard");
const isHomeShell = isCanvasShell;
const initialTopicId = params.get("topic") || (isWorkbook ? "t9" : "t2");
// 试卷 / 专项 / 同步等共用同一工作台，避免从首页点不同类型资源时 tab 互相隔离
const STORAGE_KEY = "feixiang-ai-workspace-v5";
const CANVAS_COLLAPSE_KEY = "feixiang-ai-canvas-panel-v2";
const PENDING_TOAST_KEY = "feixiang-ai-pending-toast";
const NEW_CANVAS_DISPLAY_TITLE = "新题单（尚未创建）";
const LEGACY_STORAGE_KEYS = [
  "feixiang-ai-workspace-v4-paper",
  "feixiang-ai-workspace-v4-special",
  "feixiang-ai-workspace-v4-chapter",
  "feixiang-ai-workspace-v4-series",
  "feixiang-ai-workspace-v2",
  "feixiang-ai-workspace-v1"
];
try {
  sessionStorage.removeItem("feixiang-ai-workspace-v3");
} catch {}

const workbookCatalog = {
  t9: {
    title: "有理数运算基础过关配套题单",
    shortTitle: "有理数过关",
    source: "多维导学案",
    difficulty: "中等",
    questionCount: 20,
    usage: 1143
  },
  t7: {
    title: "整式运算高频易错巩固题单",
    shortTitle: "整式易错",
    source: "全品学练考",
    difficulty: "中等",
    questionCount: 14,
    usage: 522
  },
  t19: {
    title: "课内基础到探究题：进阶提升题单",
    shortTitle: "进阶提升",
    source: "常用提优训练系列",
    difficulty: "中等",
    questionCount: 18,
    usage: 831
  }
};

const workbookDirectory = {
  kicker: "练习册目录",
  title: "多维导学案 · 七年级上册",
  summary: "共 6 章 · 36 课时",
  breadcrumb: ["多维导学案", "第一章 丰富的图形世界"],
  chapters: [
    {
      id: "407962",
      title: "第一章 丰富的图形世界",
      expanded: false,
      lessons: [
        { title: "第 1 课时 生活中的立体图形（1）" },
        { title: "第 2 课时 生活中的立体图形（2）" },
        { title: "第 3 课时 从立体图形到平面图形（1）——正方体的展开与折叠" },
        { title: "第 4 课时 从立体图形到平面图形（2）——柱体、锥体的展开与折叠", active: true },
        { title: "第 5 课时 从立体图形到平面图形（3）——截一个几何体" },
        { title: "第 6 课时 从三个方向看物体的形状" }
      ]
    },
    { id: "407963", title: "第二章 有理数及其运算", expanded: false, lessons: [] },
    { id: "407964", title: "第三章 整式及其加减", expanded: false, lessons: [] },
    { id: "407965", title: "第四章 基本平面图形", expanded: false, lessons: [] },
    { id: "407966", title: "第五章 一元一次方程", expanded: false, lessons: [] },
    { id: "407967", title: "第六章 数据的收集与整理", expanded: false, lessons: [] }
  ]
};

let workspace = loadWorkspace();
let applyingRemoteWorkspace = false;
let canvasSyncChannel = null;
let tabCounter = workspace.tabs.reduce((max, tab) => {
  const n = Number.parseInt(String(tab.id).replace("tab-", ""), 10);
  return Number.isFinite(n) ? Math.max(max, n) : max;
}, 0);
let basketCount = workspace.basketCount || 0;

function getBaseTopicId(topicId) {
  return String(topicId || "").replace(/-q\d+$/, "");
}

function tabIsWorkbook(tab) {
  return (tab?.context || contextName) === "series";
}

function tabIsSpecial(tab) {
  return (tab?.context || contextName) === "special";
}

function tabContextLabel(tab) {
  const ctx = tab?.context || contextName;
  if (ctx === "series") return "练习册";
  if (ctx === "special") return "专题";
  if (ctx === "chapter") return "同步练习";
  return "试卷";
}

function tabDocIcon(tab) {
  if (tabIsWorkbook(tab)) return "ri-book-open-line";
  if (tabIsSpecial(tab)) return "ri-focus-3-line";
  if ((tab?.context || "") === "chapter") return "ri-book-open-line";
  return "ri-file-list-3-line";
}

function shortenTabTitle(title, max = 12) {
  const text = String(title || "").trim();
  if (!text) return "题单";
  if (text.length <= max) return text;
  const cut = text.split(/[：:·—-]/)[0].trim();
  if (cut && cut.length <= max) return cut;
  return `${text.slice(0, max)}…`;
}

function getTabBaseTitle(tab) {
  if (tab?.meta?.title) return tab.meta.title;
  return String(tab?.title || "")
    .replace(/\s*·\s*第 \d+ 题(?:\s*·\s*第 \d+ 题)*$/g, "")
    .trim();
}

function defaultWorkspace() {
  return {
    tabs: [],
    activeTabId: null,
    homeActive: false,
    browseTabs: [],
    activeBrowseFilter: null,
    basketCount: 0,
    showAnswers: false,
    paperFavorited: false,
    globalSelectedQuestions: [],
    favoriteQuestions: [],
    canvasTitle: "",
    canvasManuallyCollapsed: false,
    myQuestionLists: [],
    paperSaveSignatures: {}
  };
}

function parseWorkspaceRaw(saved) {
  if (!saved) return null;
  try {
    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== "object") return null;
    delete parsed.aiPanelHidden;
    if (Array.isArray(parsed.tabs)) {
      parsed.tabs = parsed.tabs.map(tab => ({
        ...tab,
        context: tab.context || contextName,
        topicId: tab.fromQuestionId ? tab.topicId : getBaseTopicId(tab.topicId)
      }));
    }
    return {
      ...defaultWorkspace(),
      ...parsed,
      browseTabs: Array.isArray(parsed.browseTabs) ? parsed.browseTabs : [],
      activeBrowseFilter: parsed.activeBrowseFilter || null,
      globalSelectedQuestions: Array.isArray(parsed.globalSelectedQuestions) ? parsed.globalSelectedQuestions : [],
      favoriteQuestions: Array.isArray(parsed.favoriteQuestions) ? parsed.favoriteQuestions : [],
      myQuestionLists: Array.isArray(parsed.myQuestionLists) ? parsed.myQuestionLists : [],
      paperSaveSignatures: parsed.paperSaveSignatures && typeof parsed.paperSaveSignatures === "object"
        ? parsed.paperSaveSignatures
        : {}
    };
  } catch {
    return null;
  }
}

function canvasQuestionCount(ws) {
  return Array.isArray(ws?.globalSelectedQuestions) ? ws.globalSelectedQuestions.length : 0;
}

function mergeWorkspaces(localWs, sessionWs) {
  if (!localWs) return sessionWs;
  if (!sessionWs) return localWs;
  const canvasSource = canvasQuestionCount(sessionWs) > canvasQuestionCount(localWs) ? sessionWs : localWs;
  const favoriteSource = (sessionWs.favoriteQuestions?.length || 0) > (localWs.favoriteQuestions?.length || 0) ? sessionWs : localWs;
  const resourceMap = new Map();
  [...(sessionWs.myQuestionLists || []), ...(localWs.myQuestionLists || [])].forEach(resource => {
    if (!resource?.id) return;
    const current = resourceMap.get(resource.id);
    if (!current || String(resource.updatedAt || "") >= String(current.updatedAt || "")) resourceMap.set(resource.id, resource);
  });
  return {
    ...sessionWs,
    ...localWs,
    tabs: (localWs.tabs?.length || 0) >= (sessionWs.tabs?.length || 0) ? localWs.tabs : sessionWs.tabs,
    globalSelectedQuestions: canvasSource.globalSelectedQuestions,
    canvasTitle: canvasSource.canvasTitle || localWs.canvasTitle || sessionWs.canvasTitle || "",
    favoriteQuestions: favoriteSource.favoriteQuestions,
    canvasManuallyCollapsed: Boolean(localWs.canvasManuallyCollapsed || sessionWs.canvasManuallyCollapsed),
    myQuestionLists: [...resourceMap.values()].sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""))),
    paperSaveSignatures: {
      ...(sessionWs.paperSaveSignatures || {}),
      ...(localWs.paperSaveSignatures || {})
    }
  };
}

function loadWorkspace() {
  try {
    let localWs = null;
    let sessionWs = null;
    try {
      sessionWs = parseWorkspaceRaw(sessionStorage.getItem(STORAGE_KEY));
    } catch {}
    try {
      localWs = parseWorkspaceRaw(localStorage.getItem(STORAGE_KEY));
    } catch {}
    const merged = mergeWorkspaces(localWs, sessionWs);
    if (merged) return merged;
    for (const legacyKey of LEGACY_STORAGE_KEYS) {
      const legacy = parseWorkspaceRaw(sessionStorage.getItem(legacyKey) || localStorage.getItem(legacyKey));
      if (legacy) {
        try { sessionStorage.removeItem(legacyKey); } catch {}
        return legacy;
      }
    }
  } catch {}
  return defaultWorkspace();
}

function saveWorkspace() {
  if (applyingRemoteWorkspace) return;
  const json = JSON.stringify(workspace);
  sessionStorage.setItem(STORAGE_KEY, json);
  try {
    localStorage.setItem(STORAGE_KEY, json);
  } catch {}
  broadcastCanvasSync();
}

function cloneWorkspaceValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function paperSaveKey(tab) {
  return `paper-copy:${tab?.id || `${tab?.context || contextName}:${getBaseTopicId(tab?.topicId || initialTopicId)}`}`;
}

function paperCopySignature(tab) {
  if (!tab) return "";
  const questions = (tab.questions || [])
    .filter(question => !(tab.removedQuestionIds || []).includes(question.id))
    .map(question => {
      const resolved = resolveTabQuestion(tab, question);
      return {
        id: question.id,
        stem: resolved.stem,
        options: resolved.options,
        answer: resolved.answer,
        analysis: resolved.analysis,
        knowledge: resolved.knowledge
      };
    });
  return JSON.stringify({ title: String(tab.title || "").trim(), questions });
}

function isCurrentPaperCopySaved(tab) {
  if (!tab || tab.isQuestionList) return false;
  return workspace.paperSaveSignatures?.[paperSaveKey(tab)] === paperCopySignature(tab);
}

function formatResourceTime(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "刚刚创建";
  const pad = number => String(number).padStart(2, "0");
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function registerMyQuestionList(tab) {
  if (!tab) return null;
  const now = new Date().toISOString();
  const resourceId = tab.myResourceId || `resource-${Date.now()}-${tabCounter}`;
  tab.myResourceId = resourceId;
  const snapshot = cloneWorkspaceValue(tab);
  const existing = (workspace.myQuestionLists || []).find(item => item.id === resourceId);
  const resource = {
    id: resourceId,
    title: String(tab.title || "未命名题单").trim() || "未命名题单",
    questionCount: (tab.questions || []).filter(question => !(tab.removedQuestionIds || []).includes(question.id)).length,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    tab: snapshot
  };
  workspace.myQuestionLists = [resource, ...(workspace.myQuestionLists || []).filter(item => item.id !== resourceId)];
  renderMyResources();
  return resource;
}

function openMyQuestionList(resourceId) {
  const resource = (workspace.myQuestionLists || []).find(item => item.id === resourceId);
  if (!resource?.tab) return;
  let tab = workspace.tabs.find(item => item.myResourceId === resource.id);
  if (!tab) {
    tabCounter += 1;
    tab = {
      ...cloneWorkspaceValue(resource.tab),
      id: `tab-${tabCounter}`,
      myResourceId: resource.id,
      fromTabId: null,
      isQuestionList: true
    };
    workspace.tabs.push(tab);
  }
  workspace.activeTabId = tab.id;
  workspace.homeActive = false;
  pruneOverflowTabs();
  saveWorkspace();
  closeMyResources();
  location.href = `./detail-ai.html?tabId=${encodeURIComponent(tab.id)}&context=${encodeURIComponent(tab.context || contextName)}`;
}

function renderMyResources() {
  const list = document.querySelector("#myResourcesList");
  const count = document.querySelector("#myResourcesCount");
  const resources = workspace.myQuestionLists || [];
  if (count) {
    count.hidden = resources.length === 0;
    count.textContent = String(resources.length);
  }
  if (!list) return;
  if (!resources.length) {
    list.innerHTML = `<div class="my-resources-empty"><i class="ri-folder-open-line"></i><strong>还没有题单</strong><span>创建或另存题单后，会统一显示在这里</span></div>`;
    return;
  }
  list.innerHTML = resources.map(resource => `
    <button type="button" class="my-resource-card" data-resource-id="${escapeHtml(resource.id)}">
      <span class="my-resource-icon"><i class="ri-file-list-3-line"></i></span>
      <span class="my-resource-main">
        <strong>${escapeHtml(resource.title || "未命名题单")}</strong>
        <small>${Number(resource.questionCount || 0)} 题 · ${escapeHtml(formatResourceTime(resource.updatedAt))}</small>
      </span>
      <i class="ri-arrow-right-s-line my-resource-arrow"></i>
    </button>`).join("");
  list.querySelectorAll("[data-resource-id]").forEach(button => {
    button.addEventListener("click", () => openMyQuestionList(button.dataset.resourceId));
  });
}

function syncMyResourcesChrome(open) {
  const panel = document.querySelector("#myResourcesPanel");
  const button = document.querySelector("#myResourcesButton");
  if (panel) panel.hidden = !open;
  if (button) {
    button.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", open ? "true" : "false");
  }
}

function openMyResources() {
  closeAiAssistant();
  renderMyResources();
  syncMyResourcesChrome(true);
}

function closeMyResources() {
  syncMyResourcesChrome(false);
}

function toggleMyResources() {
  const panel = document.querySelector("#myResourcesPanel");
  if (panel?.hidden) openMyResources();
  else closeMyResources();
}

function getCanvasSyncSnapshot() {
  return {
    globalSelectedQuestions: Array.isArray(workspace.globalSelectedQuestions) ? workspace.globalSelectedQuestions : [],
    canvasTitle: workspace.canvasTitle || "",
    canvasManuallyCollapsed: Boolean(workspace.canvasManuallyCollapsed),
    favoriteQuestions: Array.isArray(workspace.favoriteQuestions) ? workspace.favoriteQuestions : []
  };
}

function applyRemoteCanvasState(parsed) {
  if (!parsed || typeof parsed !== "object") return;
  const incoming = Array.isArray(parsed.globalSelectedQuestions) ? parsed.globalSelectedQuestions : [];
  const current = Array.isArray(workspace.globalSelectedQuestions) ? workspace.globalSelectedQuestions : [];
  if (!incoming.length && current.length) {
    try {
      const stored = parseWorkspaceRaw(localStorage.getItem(STORAGE_KEY));
      if (canvasQuestionCount(stored) > 0) return;
    } catch {}
  }
  applyingRemoteWorkspace = true;
  workspace.globalSelectedQuestions = incoming;
  workspace.canvasTitle = parsed.canvasTitle || "";
  workspace.canvasManuallyCollapsed = Boolean(parsed.canvasManuallyCollapsed);
  if (Array.isArray(parsed.favoriteQuestions)) workspace.favoriteQuestions = parsed.favoriteQuestions;
  rightPanelSectionState.selectedCollapsed = shouldCanvasStartCollapsed();
  applySelectedPanelState();
  renderQuestionCards();
  window.dispatchEvent(new CustomEvent("aiq-canvas-change"));
  applyingRemoteWorkspace = false;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
  } catch {}
}

function broadcastCanvasSync() {
  try {
    canvasSyncChannel?.postMessage({ type: "canvas-sync", payload: getCanvasSyncSnapshot() });
  } catch {}
}

function bindCanvasSync() {
  window.addEventListener("storage", event => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        applyRemoteCanvasState(JSON.parse(event.newValue));
      } catch {}
      return;
    }
    if (event.key === CANVAS_COLLAPSE_KEY) {
      workspace.canvasManuallyCollapsed = event.newValue === "1";
      rightPanelSectionState.selectedCollapsed = shouldCanvasStartCollapsed();
      applySelectedPanelState();
    }
  });
  try {
    canvasSyncChannel = new BroadcastChannel("feixiang-ai-canvas-sync");
    canvasSyncChannel.addEventListener("message", event => {
      if (event.data?.type === "canvas-sync") applyRemoteCanvasState(event.data.payload);
    });
  } catch {}
}

function getQuestionSelectionKey(topicId, qId) {
  return `${getBaseTopicId(topicId)}::${qId}`;
}

function ensureGlobalSelected() {
  if (!Array.isArray(workspace.globalSelectedQuestions)) {
    workspace.globalSelectedQuestions = [];
  }
  if (workspace.globalSelectedQuestions.length) return;
  workspace.tabs.forEach(tab => {
    if (tab.isQuestionList || tab.fromQuestionId) return;
    (tab.selectedQuestionIds || []).forEach(qId => {
      const q = tab.questions.find(item => item.id === qId);
      if (!q) return;
      const entry = buildGlobalSelectedEntry(tab, q);
      if (!workspace.globalSelectedQuestions.some(item => item.selectionKey === entry.selectionKey)) {
        workspace.globalSelectedQuestions.push(entry);
      }
    });
  });
}

function getGlobalSelectedQuestions() {
  ensureGlobalSelected();
  return workspace.globalSelectedQuestions;
}

function isQuestionGloballySelected(topicId, qId) {
  const key = getQuestionSelectionKey(topicId, qId);
  return getGlobalSelectedQuestions().some(item => item.selectionKey === key);
}

function ensureFavoriteQuestions() {
  if (!Array.isArray(workspace.favoriteQuestions)) workspace.favoriteQuestions = [];
  return workspace.favoriteQuestions;
}

function isQuestionFavorited(topicId, qId) {
  return ensureFavoriteQuestions().includes(getQuestionSelectionKey(topicId, qId));
}

function toggleQuestionFavorite(qId, topicId) {
  const resolvedTopicId = topicId || getActiveTab()?.topicId;
  if (!resolvedTopicId) return false;
  const key = getQuestionSelectionKey(resolvedTopicId, qId);
  const list = ensureFavoriteQuestions();
  const index = list.indexOf(key);
  if (index >= 0) list.splice(index, 1);
  else list.push(key);
  saveWorkspace();
  renderQuestionCards();
  return index < 0;
}

function buildGlobalSelectedEntry(tab, q) {
  const topicId = getBaseTopicId(tab.topicId);
  const resolved = resolveTabQuestion(tab, q);
  return {
    selectionKey: getQuestionSelectionKey(topicId, q.id),
    topicId,
    sourceTitle: getTabBaseTitle(tab),
    question: { ...resolved }
  };
}

function matchesSelectedType(questionType, filterKey) {
  const type = questionType || "";
  if (filterKey === "选择") return type.includes("选择");
  if (filterKey === "填空") return type.includes("填空");
  if (filterKey === "解答") return type.includes("解答");
  return true;
}

function countSelectedTypes(items) {
  const counts = { 选择: 0, 填空: 0, 解答: 0 };
  items.forEach(item => {
    const type = item.question?.type || "";
    if (type.includes("选择")) counts.选择 += 1;
    else if (type.includes("填空")) counts.填空 += 1;
    else if (type.includes("解答")) counts.解答 += 1;
  });
  return counts;
}

function renderSelectedTypeSummaryHtml(items) {
  const counts = countSelectedTypes(items);
  return ["选择", "填空", "解答"]
    .filter(key => counts[key] > 0)
    .map(key => `<button type="button" class="ai-selected-summary-count ${selectedPreviewTypeFilter === key ? "active" : ""}" data-selected-type="${key}">${counts[key]}</button>道${key}`)
    .join(" ");
}

function getSelectableQuestions(tab) {
  if (!tab) return [];
  return tab.questions.filter(q => !(tab.removedQuestionIds || []).includes(q.id));
}

function getPaperSelectionState(tab) {
  const selectable = getSelectableQuestions(tab);
  if (!selectable.length) return "empty";
  const selectedCount = selectable.filter(q => isQuestionGloballySelected(tab.topicId, q.id)).length;
  if (selectedCount === 0) return "none";
  if (selectedCount === selectable.length) return "all";
  return "partial";
}

function getCanvasSourceLabel(item) {
  const meta = paperCatalog[item.topicId] || workbookCatalog[item.topicId];
  return meta?.shortTitle || item.sourceTitle || "未分组试卷";
}

function getCanvasGroups(items = getGlobalSelectedQuestions()) {
  const groups = [];
  const map = new Map();
  items.forEach(item => {
    const topicId = item.topicId || "unknown";
    if (!map.has(topicId)) {
      const group = {
        topicId,
        title: getCanvasSourceLabel(item),
        items: []
      };
      map.set(topicId, group);
      groups.push(group);
    }
    map.get(topicId).items.push(item);
  });
  return groups;
}

function canvasQuestionMinutes(q) {
  return Number(q?.minutes) || (q?.type === "解答题" ? 5 : q?.type === "填空题" ? 2 : 1);
}

function canvasDifficultyRank(label) {
  const text = String(label || "");
  if (/较难|困难/.test(text)) return 3;
  if (/较易|简单/.test(text)) return 1;
  return 2;
}

function canvasDifficultyLabel(rank) {
  if (rank <= 1.4) return "较易";
  if (rank >= 2.6) return "较难";
  return "中等";
}

function summarizeCanvasSelection(items = getGlobalSelectedQuestions()) {
  const count = items.length;
  if (!count) return { count: 0, difficulty: "", minutes: 0 };
  const labels = items.map(item => item.question?.difficulty).filter(Boolean);
  const unique = [...new Set(labels)];
  const avg = items.reduce((sum, item) => sum + canvasDifficultyRank(item.question?.difficulty), 0) / count;
  return {
    count,
    difficulty: unique.length === 1 ? unique[0] : canvasDifficultyLabel(avg),
    minutes: items.reduce((sum, item) => sum + canvasQuestionMinutes(item.question), 0)
  };
}

function renderCanvasStatsText(items = getGlobalSelectedQuestions()) {
  const { count, difficulty, minutes } = summarizeCanvasSelection(items);
  if (!count) return "";
  return [`${count}道`, difficulty || "中等", `${minutes}分钟`].join(" · ");
}

function findTabForTopic(topicId) {
  const baseId = getBaseTopicId(topicId);
  return workspace.tabs.find(tab =>
    getBaseTopicId(tab.topicId) === baseId && !tab.isQuestionList && !tab.fromQuestionId
  ) || workspace.tabs.find(tab => getBaseTopicId(tab.topicId) === baseId);
}

function syncCanvasEntry(topicId, qId) {
  const key = getQuestionSelectionKey(topicId, qId);
  const entry = getGlobalSelectedQuestions().find(item => item.selectionKey === key);
  const tab = findTabForTopic(topicId);
  if (!entry || !tab) return;
  const q = tab.questions.find(item => item.id === qId);
  if (!q) return;
  entry.question = { ...resolveTabQuestion(tab, q) };
  entry.sourceTitle = getTabBaseTitle(tab);
}

function syncTabSelectedQuestionIds(tab) {
  if (!tab) return;
  tab.selectedQuestionIds = tab.questions
    .filter(q => isQuestionGloballySelected(tab.topicId, q.id))
    .map(q => q.id);
}

function removeGlobalSelectedByKey(selectionKey) {
  workspace.globalSelectedQuestions = getGlobalSelectedQuestions().filter(item => item.selectionKey !== selectionKey);
  syncTabSelectedQuestionIds(getActiveTab());
  saveWorkspace();
  renderQuestionCards();
  collapseCanvasIfEmpty();
}

function getActiveTab() {
  return workspace.tabs.find(tab => tab.id === workspace.activeTabId) || workspace.tabs[0];
}

function getQuestions(topicId) {
  const baseId = getBaseTopicId(topicId);
  const questions = paperQuestions[baseId] || paperQuestions.t2;
  return questions.map(q => ({ ...q }));
}

function resolveTopicMeta(topicId, tabContext = contextName, overrides = {}) {
  const baseId = getBaseTopicId(topicId);
  let meta;
  if (tabContext === "series") {
    const catalog = workbookCatalog[baseId];
    meta = catalog
      ? { ...catalog }
      : {
        title: params.get("title") || "练习册题单",
        shortTitle: shortenTabTitle(params.get("title") || "题单"),
        source: params.get("source") || "系列题单",
        difficulty: params.get("difficulty") || "中等",
        questionCount: Number(params.get("questions") || 0),
        usage: Number(params.get("usage") || 0)
      };
  } else if (paperCatalog[baseId]) {
    meta = { ...paperCatalog[baseId] };
  } else {
    const fallbackTitle = params.get("title") || (tabContext === "special" ? "专题题单" : tabContext === "chapter" ? "同步练习" : "未命名试卷");
    meta = {
      title: fallbackTitle,
      shortTitle: shortenTabTitle(params.get("shortTitle") || fallbackTitle),
      focus: params.get("focus") || "",
      reason: params.get("reason") || (tabContext === "special" ? "专题" : tabContext === "chapter" ? "同步练习" : "试卷"),
      region: "朝阳区",
      grade: "七年级",
      examType: tabContext === "special" ? "专题" : tabContext === "chapter" ? "同步" : "试卷",
      questionCount: Number(params.get("questions") || 0),
      difficulty: params.get("difficulty") || "中等",
      usage: Number(params.get("usage") || 0),
      source: params.get("source") || ""
    };
  }

  if (overrides.title) {
    meta.title = overrides.title;
    meta.shortTitle = overrides.shortTitle || shortenTabTitle(overrides.title);
  } else if (overrides.shortTitle) {
    meta.shortTitle = overrides.shortTitle;
  } else if (!meta.shortTitle) {
    meta.shortTitle = shortenTabTitle(meta.title);
  }
  if (overrides.source) meta.source = overrides.source;
  if (overrides.difficulty) meta.difficulty = overrides.difficulty;
  if (overrides.reason) meta.reason = overrides.reason;
  if (overrides.focus) meta.focus = overrides.focus;
  if (overrides.questionCount != null) meta.questionCount = Number(overrides.questionCount);
  if (overrides.usage != null) meta.usage = Number(overrides.usage);
  return meta;
}

function favoriteResourceLabel(saved = false) {
  if (saved) return `<i class="ri-star-fill"></i><span id="favoritePaperLabel">已收藏整卷</span>`;
  return `<i class="ri-star-line"></i><span id="favoritePaperLabel">收藏整卷</span>`;
}

function createTab(topicId, tabContext = contextName, overrides = {}) {
  tabCounter += 1;
  const meta = resolveTopicMeta(topicId, tabContext, overrides);
  const questions = getQuestions(topicId).map(q => ({ ...q }));
  return {
    id: `tab-${tabCounter}`,
    topicId: getBaseTopicId(topicId),
    context: tabContext,
    title: meta.title,
    shortTitle: meta.shortTitle || meta.title.slice(0, 12),
    lessonKey: overrides.lessonKey || "",
    meta,
    selectedQuestionIds: [],
    removedQuestionIds: [],
    modifiedQuestions: {},
    questions
  };
}

function refreshMainTabFromSource(tab) {
  if (!tab || tab.fromQuestionId || tab.isQuestionList) return;
  const baseId = getBaseTopicId(tab.topicId);
  const fresh = getQuestions(baseId);
  const meta = resolveTopicMeta(baseId, tab.context);
  const customTitle = tab.customTitle ? tab.title : "";
  const modifiedQuestions = tab.modifiedQuestions || {};
  tab.questions = fresh.map(q => ({ ...q }));
  tab.removedQuestionIds = (tab.removedQuestionIds || []).filter(id => fresh.some(q => q.id === id));
  tab.modifiedQuestions = Object.fromEntries(Object.entries(modifiedQuestions).filter(([id]) => fresh.some(q => q.id === id)));
  tab.meta = meta;
  tab.title = customTitle || meta.title;
  tab.shortTitle = customTitle ? shortenTabTitle(customTitle) : (meta.shortTitle || meta.title.slice(0, 10));
  if (customTitle) {
    tab.meta.title = customTitle;
    tab.meta.shortTitle = shortenTabTitle(customTitle);
  }
  tab.selectedQuestionIds = tab.selectedQuestionIds.filter(id => fresh.some(q => q.id === id));
}

function hasSingleChoiceSection(tab) {
  if (!tab) return false;
  return tab.questions.some(q =>
    !tab.removedQuestionIds.includes(q.id) && String(q.section || "").includes("单项选择")
  );
}

function formatQuestionListTitle() {
  const now = new Date();
  const pad = value => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}题单`;
}

function formatQuestionListShortTitle() {
  return formatQuestionListTitle();
}

function isAutoCanvasTitle(title) {
  return /^\d{4}[./-]\d{1,2}[./-]\d{1,2}(题单|组题)$/.test(String(title || "").trim());
}

function isUserCanvasTitle(title) {
  const text = String(title || "").trim();
  return Boolean(text && text !== NEW_CANVAS_DISPLAY_TITLE && !isAutoCanvasTitle(text));
}

function getCanvasListTitle() {
  const title = String(workspace.canvasTitle || "").trim();
  if (isUserCanvasTitle(title)) return title;
  return formatQuestionListTitle();
}

function getCanvasDisplayTitle() {
  const title = String(workspace.canvasTitle || "").trim();
  return isUserCanvasTitle(title) ? title : NEW_CANVAS_DISPLAY_TITLE;
}

function setCanvasListTitle(next) {
  const title = String(next || "").trim();
  workspace.canvasTitle = !title || title === NEW_CANVAS_DISPLAY_TITLE ? "" : title;
  saveWorkspace();
  return getCanvasDisplayTitle();
}

function applyCanvasTitleToUi() {
  const title = getCanvasDisplayTitle();
  const head = document.querySelector("#canvasHeadTitle");
  const paper = document.querySelector("#canvasPaperTitle");
  const rail = document.querySelector("#canvasRailTitle");
  const expandBtn = document.querySelector("#aiSelectedExpand");
  const panel = document.querySelector("#aiSelectedPanel");
  if (head && document.activeElement !== head) head.textContent = title;
  if (paper && document.activeElement !== paper) paper.textContent = title;
  if (rail) rail.textContent = title;
  if (expandBtn) expandBtn.setAttribute("aria-label", `展开${title}`);
  if (panel) panel.setAttribute("aria-label", title);
}

function bindCanvasTitleEditor(node) {
  if (!node || node.dataset.bound) return;
  node.dataset.bound = "1";
  node.addEventListener("blur", () => {
    const next = setCanvasListTitle(node.textContent);
    node.textContent = next;
    applyCanvasTitleToUi();
  });
  node.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      node.blur();
    }
  });
}

function ensureInitialTab() {
  if (isComposeMode) {
    ensureComposeTab();
    return;
  }
  if (isRecordMode) {
    ensureRecordTab();
    return;
  }
  const baseId = getBaseTopicId(initialTopicId);
  const urlTitle = String(params.get("title") || "").trim();
  const urlLessonKey = String(params.get("lessonKey") || urlTitle || "").trim();
  let mainTab = workspace.tabs.find(tab =>
    getBaseTopicId(tab.topicId) === baseId
    && !tab.fromQuestionId
    && !tab.isQuestionList
    && (!urlLessonKey || tab.lessonKey === urlLessonKey || tab.title === urlLessonKey)
  );

  const freshCatalogEntry = Boolean(params.get("topic") && !params.get("tabId"));
  if (!mainTab) {
    mainTab = createTab(initialTopicId, contextName, {
      title: urlTitle || undefined,
      shortTitle: params.get("shortTitle") || urlTitle || undefined,
      lessonKey: urlLessonKey || undefined,
      source: params.get("source") || undefined,
      difficulty: params.get("difficulty") || undefined,
      reason: params.get("reason") || undefined,
      focus: params.get("focus") || undefined,
      questionCount: params.get("questions") || undefined,
      usage: params.get("usage") || undefined
    });
    workspace.tabs.push(mainTab);
  } else if (freshCatalogEntry) {
    mainTab.customTitle = false;
    mainTab.removedQuestionIds = [];
    mainTab.modifiedQuestions = {};
    refreshMainTabFromSource(mainTab);
    if (urlTitle) {
      mainTab.title = urlTitle;
      mainTab.shortTitle = params.get("shortTitle") || urlTitle;
      mainTab.lessonKey = urlLessonKey || mainTab.lessonKey;
      mainTab.meta = {
        ...(mainTab.meta || {}),
        title: urlTitle,
        shortTitle: mainTab.shortTitle
      };
    }
  } else if (!hasSingleChoiceSection(mainTab)) {
    refreshMainTabFromSource(mainTab);
  }

  workspace.homeActive = false;
  workspace.activeBrowseFilter = null;
  if (params.get("tabId")) {
    const urlTab = workspace.tabs.find(tab => tab.id === params.get("tabId"));
    workspace.activeTabId = urlTab?.id || mainTab.id;
  } else if (params.get("topic") || !workspace.activeTabId || !workspace.tabs.some(tab => tab.id === workspace.activeTabId)) {
    workspace.activeTabId = mainTab.id;
  }

  workspace.tabs = workspace.tabs.filter(tab => {
    if (tab.isQuestionList || tab.fromQuestionId) {
      if (tab.myResourceId) return true;
      return workspace.tabs.some(parent => parent.id === tab.fromTabId);
    }
    return true;
  });

  saveWorkspace();
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function resolveTabQuestion(tab, q) {
  const modified = tab.modifiedQuestions?.[q.id] || {};
  return {
    ...q,
    stem: modified.stem ?? q.stem,
    type: modified.type ?? q.type,
    difficulty: modified.difficulty ?? q.difficulty,
    options: modified.options ?? q.options ?? [],
    answer: modified.answer ?? q.answer,
    analysis: modified.analysis ?? q.analysis,
    knowledge: modified.knowledge ?? q.knowledge
  };
}

function buildEditorPayload(tab) {
  const visible = tab.questions
    .filter(q => !tab.removedQuestionIds.includes(q.id))
    .sort((a, b) => (a.num || 0) - (b.num || 0));

  return {
    tabId: tab.id,
    title: tab.title,
    isQuestionList: Boolean(tab.isQuestionList),
    context: tab.context || contextName,
    topicId: getBaseTopicId(tab.topicId),
    updatedAt: Date.now(),
    questions: visible.map((q, index) => {
      const resolved = resolveTabQuestion(tab, q);
      const meta = questionDefaults(resolved);
      return {
        id: String(resolved.id || `q-${index + 1}`),
        num: index + 1,
        section: resolved.section || (tab.isQuestionList ? "题单题目" : "试卷题目"),
        text: resolved.stem || "",
        options: [...(resolved.options || [])],
        answer: resolved.answer || "",
        path: `初中 / 数学 / ${resolved.type || "选择题"} / ${resolved.difficulty || "中等"} / ${meta.minutes} 分钟`,
        tags: [
          tab.meta?.source || "飞象题库",
          resolved.knowledge
        ].filter(Boolean),
        competency: resolved.competency || meta.competency || "运算能力",
        explanation: resolved.analysis || ""
      };
    })
  };
}

function encodePayloadHash(payload) {
  const json = JSON.stringify(payload);
  return `p=${encodeURIComponent(btoa(unescape(encodeURIComponent(json))))}`;
}

function saveEditorPayload(payload) {
  const json = JSON.stringify(payload);
  sessionStorage.setItem("feixiang-editor-payload", json);
  if (payload.tabId) {
    sessionStorage.setItem(`feixiang-editor-payload-${payload.tabId}`, json);
  }
  try {
    localStorage.setItem("feixiang-editor-payload", json);
    if (payload.tabId) {
      localStorage.setItem(`feixiang-editor-payload-${payload.tabId}`, json);
    }
  } catch {}
  return encodePayloadHash(payload);
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function queueToastAfterNavigation(message) {
  try {
    sessionStorage.setItem(PENDING_TOAST_KEY, String(message || ""));
  } catch {}
}

function showPendingToast() {
  let message = "";
  try {
    message = sessionStorage.getItem(PENDING_TOAST_KEY) || "";
    sessionStorage.removeItem(PENDING_TOAST_KEY);
  } catch {}
  if (message) setTimeout(() => showToast(message), 120);
}

function buildPaperFacts(tab) {
  const meta = tab.meta || {};
  const visibleCount = tab.questions.filter(q => !tab.removedQuestionIds.includes(q.id)).length;
  if (tab.isQuestionList) {
    return [meta.source || "我的题单", `${visibleCount} 题`, meta.createdAt ? `创建于 ${meta.createdAt}` : ""].filter(Boolean);
  }
  if (tabIsWorkbook(tab)) {
    return [
      meta.source || "练习册",
      "章节练习",
      `${visibleCount} 题`,
      meta.difficulty ? `难度 ${meta.difficulty}` : "",
      meta.usage ? `${meta.usage} 人使用` : ""
    ].filter(Boolean);
  }
  if (tabIsSpecial(tab)) {
    return [
      meta.reason || "专题",
      meta.source,
      `${visibleCount} 题`,
      meta.difficulty ? `难度 ${meta.difficulty}` : "",
      meta.usage ? `${meta.usage} 人使用` : ""
    ].filter(Boolean);
  }
  return [
    meta.reason || meta.source,
    meta.region,
    meta.grade,
    meta.examType,
    `${visibleCount} 题`,
    meta.difficulty ? `难度 ${meta.difficulty}` : "",
    meta.usage ? `${meta.usage} 次下载` : ""
  ].filter(Boolean);
}

function renderMeta(tab) {
  const displayTitle = tab.fromQuestionId
    ? `${getTabBaseTitle(tab)} · 第 ${tab.questions[0]?.num || ""} 题`
    : tab.title;
  const titleNode = document.querySelector("#topicTitle");
  if (titleNode && document.activeElement !== titleNode) titleNode.textContent = displayTitle;
  if (titleNode) titleNode.setAttribute("aria-label", tab.fromQuestionId ? "题目标题" : "试卷标题，可直接编辑");

  const facts = document.querySelector("#paperMetaFacts");
  if (facts) {
    facts.innerHTML = buildPaperFacts(tab).map(text => `<span>${escapeHtml(text)}</span>`).join("");
  }

  if (!isComposeMode) {
    renderDetailBreadcrumb(tab, selectedPanelEnlarged ? getCanvasDisplayTitle() : displayTitle);
  }
}

function renderDetailBreadcrumb(tab, displayTitle) {
  if (isComposeMode || isRecordMode) return;
  const trail = document.querySelector(".ai-detail-topbar .breadcrumb");
  if (!trail || !tab) return;
  if (tab.myResourceId || tab.isQuestionList) {
    trail.innerHTML = `
      <a href="./index.html">首页</a>
      <i class="ri-arrow-right-s-line"></i>
      <button type="button" class="breadcrumb-resource-link" data-open-my-resources>我的资源</button>
      <i class="ri-arrow-right-s-line"></i>
      <strong id="breadcrumbLeaf">${escapeHtml(displayTitle)}</strong>`;
    return;
  }
  trail.innerHTML = `
    <span id="breadcrumbContext">${escapeHtml(tabContextLabel(tab))}</span>
    <i class="ri-arrow-right-s-line"></i>
    <strong id="breadcrumbLeaf">${escapeHtml(displayTitle)}</strong>`;
}

function bindPaperTitleEditor() {
  const titleNode = document.querySelector("#topicTitle");
  const editButton = document.querySelector("#editPaperTitle");
  if (!titleNode || titleNode.dataset.bound) return;
  titleNode.dataset.bound = "1";
  let titleBeforeEdit = "";

  const beginEdit = () => {
    titleBeforeEdit = titleNode.textContent.trim();
    titleNode.focus();
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(titleNode);
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const commitTitle = () => {
    const tab = getActiveTab();
    if (!tab || tab.fromQuestionId) {
      renderMeta(tab);
      return;
    }
    const fallback = titleBeforeEdit || tab.title || tab.meta?.title || "未命名题单";
    const nextTitle = titleNode.textContent.replace(/\s+/g, " ").trim() || fallback;
    titleNode.textContent = nextTitle;
    if (nextTitle === tab.title) return;
    tab.title = nextTitle;
    tab.customTitle = true;
    tab.shortTitle = shortenTabTitle(nextTitle);
    tab.meta = {
      ...(tab.meta || {}),
      title: nextTitle,
      shortTitle: shortenTabTitle(nextTitle)
    };
    saveWorkspace();
    renderMeta(tab);
    renderPaperActionButtons(tab);
    renderTabs();
    document.title = `${nextTitle} · AI 试卷工作台`;
  };

  titleNode.addEventListener("focus", () => {
    titleBeforeEdit = titleNode.textContent.trim();
    titleNode.closest(".paper-title-edit-row")?.classList.add("is-editing");
  });
  titleNode.addEventListener("blur", () => {
    titleNode.closest(".paper-title-edit-row")?.classList.remove("is-editing");
    commitTitle();
  });
  titleNode.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      titleNode.blur();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      titleNode.textContent = titleBeforeEdit;
      titleNode.blur();
    }
  });
  titleNode.addEventListener("paste", event => {
    event.preventDefault();
    document.execCommand("insertText", false, event.clipboardData?.getData("text/plain") || "");
  });
  editButton?.addEventListener("click", beginEdit);
}

function renderWorkbookDirectory() {
  const tree = document.querySelector("#directoryTree");
  if (!tree) return;
  tree.innerHTML = workbookDirectory.chapters.map(chapter => `
    <section class="tree-group workbook-chapter ${chapter.expanded ? "open" : ""}">
      <button type="button" class="chapter-row">
        <i class="ri-arrow-${chapter.expanded ? "down" : "right"}-s-line"></i>
        <span>${escapeHtml(chapter.title)}</span>
      </button>
      <div class="tree-leaves"${chapter.expanded ? "" : " hidden"}>
        ${chapter.lessons.map(lesson => `
          <button class="tree-lesson ${lesson.active ? "active" : ""}" type="button">
            <span class="lesson-title">${escapeHtml(lesson.title)}</span>
          </button>`).join("")}
      </div>
    </section>`).join("");
}

function setDirectoryOpen(open, mobile = false) {
  const directoryPanel = document.querySelector("#directoryPanel");
  const workspace = document.querySelector("#aiWorkspace");
  const directoryToggle = document.querySelector("#directoryToggle");
  const directoryMask = document.querySelector("#directoryMask");
  if (!directoryPanel || !workspace) return;
  directoryPanel.classList.toggle("open", open);
  workspace.classList.toggle("directory-open", open && !mobile);
  directoryToggle?.setAttribute("aria-expanded", String(open));
  if (directoryMask) directoryMask.hidden = !open || !mobile;
}

function bindDirectoryEvents() {
  if (!isWorkbook) return;

  document.querySelector("#directoryToggle")?.addEventListener("click", () => {
    const directoryPanel = document.querySelector("#directoryPanel");
    setDirectoryOpen(!directoryPanel?.classList.contains("open"));
  });

  document.querySelector("#mobileDirectory")?.addEventListener("click", () => {
    setDirectoryOpen(true, true);
  });

  document.querySelector("#directoryMask")?.addEventListener("click", () => {
    setDirectoryOpen(false, true);
  });

  document.querySelectorAll(".workbook-chapter > .chapter-row").forEach(button => {
    button.addEventListener("click", () => {
      const icon = button.querySelector("i");
      const leaves = button.nextElementSibling;
      if (!leaves) return;
      const open = leaves.hidden;
      leaves.hidden = !open;
      button.closest(".workbook-chapter")?.classList.toggle("open", open);
      if (icon) icon.className = open ? "ri-arrow-down-s-line" : "ri-arrow-right-s-line";
    });
  });

  document.querySelectorAll(".tree-lesson").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tree-lesson").forEach(item => item.classList.toggle("active", item === button));
      const label = button.querySelector(".lesson-title")?.textContent.trim() || button.textContent.trim();
      document.querySelector("#breadcrumbLeaf").textContent = label;
      showToast(`已切换到「${label}」`);
    });
  });
}

function applyPageMode() {
  const workspace = document.querySelector("#aiWorkspace");
  const directoryPanel = document.querySelector("#directoryPanel");
  const mobileDirectory = document.querySelector("#mobileDirectory");
  const docTabs = document.querySelector("#docTabs");
  const favoriteLabel = document.querySelector("#favoritePaperLabel");

  // 练习册与试卷共用详情布局，不再展示左侧目录
  document.body.classList.remove("ai-workbook-page");
  workspace?.classList.remove("workbook-mode", "directory-open");
  directoryPanel?.setAttribute("hidden", "");
  mobileDirectory?.setAttribute("hidden", "");
  document.querySelector("#directoryMask")?.setAttribute("hidden", "");
  applyComposeMode();
  applyRecordMode();
  if (!isComposeMode && !isRecordMode) {
    document.querySelector("#breadcrumbContext") && (document.querySelector("#breadcrumbContext").textContent = isWorkbook ? "练习册" : "试卷");
    document.querySelector("#breadcrumbLeaf") && (document.querySelector("#breadcrumbLeaf").textContent = isWorkbook ? "章节练习" : "试卷详情");
  }
  if (favoriteLabel) favoriteLabel.textContent = "收藏整卷";
  if (docTabs) docTabs.setAttribute("aria-label", "已打开的题单");
}

function composePaperTitle(prompt) {
  const text = String(prompt || "");
  if (/期中/.test(text)) return "北京市朝阳区七年级上学期数学期中试卷";
  if (/月考/.test(text)) return "北京市朝阳区七年级上学期数学月考试卷";
  if (/单元/.test(text)) return "北京市朝阳区七年级上学期数学单元检测卷";
  return "北京市朝阳区七年级上学期数学期末试卷";
}

function openComposePage(prompt) {
  const text = String(prompt || "").trim();
  if (!text) return false;
  location.href = `./detail-ai.html?mode=compose&prompt=${encodeURIComponent(text)}&context=paper`;
  return true;
}

function openRecordPage(fileName) {
  const name = String(fileName || "待录入试卷.pdf").trim() || "待录入试卷.pdf";
  location.href = `./detail-ai.html?mode=record&fileName=${encodeURIComponent(name)}&context=paper`;
  return true;
}

function ensureRecordTab() {
  const existing = workspace.tabs.find(tab => tab.recordSession && tab.recordFileName === recordFileName);
  if (existing) {
    workspace.activeTabId = existing.id;
    saveWorkspace();
    return existing;
  }
  const cleanName = recordFileName.replace(/\.[^.]+$/, "").trim() || "AI 录入试卷";
  const title = `${cleanName} · AI录题`;
  const questions = (paperQuestions.t2 || []).map((question, index) => ({
    ...question,
    id: `record-${Date.now()}-${question.id}`,
    num: index + 1,
    badges: [index === 0 ? "飞象原题" : "AI识别"]
  }));
  tabCounter += 1;
  const tab = {
    id: `tab-${tabCounter}`,
    topicId: `record-${Date.now()}`,
    context: "paper",
    title,
    shortTitle: shortenTabTitle(cleanName),
    meta: {
      title,
      shortTitle: shortenTabTitle(cleanName),
      source: "AI 录题",
      region: "上传文件",
      grade: "七年级",
      examType: "试卷",
      difficulty: "中等",
      questionCount: questions.length,
      usage: 0
    },
    selectedQuestionIds: [],
    removedQuestionIds: [],
    modifiedQuestions: {},
    questions,
    recordSession: true,
    recordFileName,
    isQuestionList: false
  };
  workspace.tabs.push(tab);
  workspace.activeTabId = tab.id;
  pruneOverflowTabs();
  saveWorkspace();
  return tab;
}

function ensureComposeTab() {
  const title = composePaperTitle(composePrompt);
  const existing = workspace.tabs.find(tab => tab.composeSession && tab.meta?.aiPrompt === composePrompt);
  if (existing) {
    workspace.activeTabId = existing.id;
    saveWorkspace();
    return existing;
  }
  const sources = [
    "全品学练考 · 2025-2026学年人教版七年级上册",
    "多维导学案 · 2025-2026学年人教版七年级上册",
    "朝阳区期末真题 · 2025-2026学年七年级上学期"
  ];
  const questions = (paperQuestions.t2 || []).map((q, index) => ({
    ...q,
    id: `compose-${q.id}`,
    num: index + 1,
    sourceLabel: sources[index % sources.length]
  }));
  tabCounter += 1;
  const tab = {
    id: `tab-${tabCounter}`,
    topicId: `compose-${Date.now()}`,
    context: "paper",
    title,
    shortTitle: title.length > 12 ? `${title.slice(0, 12)}…` : title,
    meta: {
      title,
      shortTitle: title,
      source: "AI 组卷",
      difficulty: "中等",
      questionCount: questions.length,
      usage: 0,
      aiPrompt: composePrompt
    },
    selectedQuestionIds: [],
    removedQuestionIds: [],
    modifiedQuestions: {},
    questions,
    isQuestionList: true,
    aiGenerated: true,
    composeSession: true
  };
  workspace.tabs.push(tab);
  workspace.activeTabId = tab.id;
  pruneOverflowTabs();
  saveWorkspace();
  return tab;
}

function applyComposeMode() {
  const root = document.querySelector("#aiWorkspace");
  const chat = document.querySelector("#aiComposeChat");
  if (!isComposeMode) {
    root?.classList.remove("compose-mode");
    document.body.classList.remove("compose-mode");
    return;
  }
  root?.classList.add("compose-mode");
  document.body.classList.add("compose-mode");
  if (chat) chat.hidden = false;
  const title = composePaperTitle(composePrompt);
  const trail = document.querySelector(".ai-detail-topbar .breadcrumb");
  if (trail) {
    trail.innerHTML = `<a href="./index.html">首页</a><i class="ri-arrow-right-s-line"></i><span>AI助手</span><i class="ri-arrow-right-s-line"></i><strong>AI组题</strong>`;
  }
  document.title = `${title} · AI组题`;
  renderComposeThread();
  closeAiAssistant();
}

function recordSourceHtml() {
  return `
    <header class="ai-record-source-head">
      <div><i class="ri-file-pdf-2-fill"></i><strong>${escapeHtml(recordFileName)}</strong></div>
      <div class="ai-record-source-tools" aria-label="源文件工具">
        <button type="button" title="OCR 识别范围"><i class="ri-scan-2-line"></i></button>
        <button type="button" title="拖动页面"><i class="ri-hand"></i></button>
        <button type="button" title="缩小"><i class="ri-subtract-line"></i></button>
        <span>100%</span>
        <button type="button" title="放大"><i class="ri-add-line"></i></button>
      </div>
    </header>
    <div class="ai-record-source-scroll">
      <article class="ai-record-pdf-page">
        <h2>七年级数学试卷</h2>
        <p class="ai-record-paper-note">一、选择题：本题包括 4 小题，每小题只有一个正确答案。</p>
        <section class="ai-record-source-question is-matched"><em>Q1</em><p>1．如果向东走 3 米记作 +3 米，那么向西走 5 米应记作（　　）。</p><div>A．+5 米　　B．−5 米　　C．+3 米　　D．−3 米</div></section>
        <section class="ai-record-source-question"><em>Q2</em><p>2．下列各组量中，具有相反意义的量是（　　）。</p><div>A．上升与向东　 B．收入与支出　 C．长大与减少　 D．购进与卖出</div></section>
        <section class="ai-record-source-question"><em>Q3</em><p>3．在 −3、0、2.5、−1/2 四个数中，负数共有（　　）。</p><div>A．1 个　　B．2 个　　C．3 个　　D．4 个</div></section>
        <section class="ai-record-source-question"><em>Q4</em><p>4．某天最高气温 18 ℃，最低气温 7 ℃，温差是（　　）。</p><div>A．25 ℃　 B．−25 ℃　 C．11 ℃　 D．−11 ℃</div></section>
        <footer>第 1 页 / 共 2 页</footer>
      </article>
    </div>`;
}

function applyRecordMode() {
  const root = document.querySelector("#aiWorkspace");
  const sourcePanel = document.querySelector("#aiComposeChat");
  if (!isRecordMode) {
    root?.classList.remove("record-mode");
    document.body.classList.remove("record-mode");
    return;
  }
  root?.classList.add("record-mode");
  document.body.classList.add("record-mode");
  if (sourcePanel) {
    sourcePanel.hidden = false;
    sourcePanel.innerHTML = recordSourceHtml();
  }
  const tab = getActiveTab();
  const progress = document.querySelector("#aiRecordProgress");
  const preview = document.querySelector("#docPreviewScroll");
  if (progress) progress.hidden = false;
  if (preview) preview.hidden = true;
  const count = document.querySelector("#aiRecordQuestionCount");
  if (count) count.textContent = `（共 ${tab?.questions?.length || 0} 道题）`;
  const resultHead = document.querySelector("#aiRecordResultHead");
  if (resultHead) resultHead.hidden = false;
  const trail = document.querySelector(".ai-detail-topbar .breadcrumb");
  if (trail) {
    trail.innerHTML = `<a href="./index.html">首页</a><i class="ri-arrow-right-s-line"></i><span>AI助手</span><i class="ri-arrow-right-s-line"></i><strong>AI录题</strong>`;
  }
  document.title = `${recordFileName} · AI录题`;
  closeAiAssistant();
}

function showRecordResults() {
  if (!isRecordMode) return;
  const progress = document.querySelector("#aiRecordProgress");
  const preview = document.querySelector("#docPreviewScroll");
  if (progress) progress.hidden = true;
  if (preview) preview.hidden = false;
  preview?.classList.add("is-record-revealed");
  window.setTimeout(() => preview?.classList.remove("is-record-revealed"), 520);
}

function composeStepHtml() {
  const title = composePaperTitle(composePrompt);
  return `
    <div class="ai-compose-job">
      <div class="ai-compose-job-head"><i class="ri-sparkling-2-line"></i>AI作业星</div>
      <section class="ai-compose-step is-open">
        <button type="button" data-compose-step>
          <i class="ri-checkbox-circle-fill"></i>
          <span>命题参数定义与模型构建</span>
          <i class="ri-arrow-down-s-line"></i>
        </button>
        <div class="ai-compose-step-body">
          <p>场景：2025-2026学年北京市朝阳区七年级上学期期末检测，数学，闭卷 90 分钟。</p>
          <p>结构：选择题 4 题、填空题 2 题、解答题 1 题，覆盖正负数、数轴与实际应用。</p>
          <p>来源风格：区级真题 + 全品学练考 / 多维导学案同步题。</p>
        </div>
      </section>
      <section class="ai-compose-step is-open">
        <button type="button" data-compose-step>
          <i class="ri-checkbox-circle-fill"></i>
          <span>题库检索与初筛</span>
          <i class="ri-arrow-down-s-line"></i>
        </button>
        <div class="ai-compose-step-body">
          <p>已从朝阳区期末卷和同步教辅中初筛匹配题目，并完成去重。</p>
          <a class="ai-compose-source-link" href="./detail-ai.html?topic=t2&context=paper">${escapeHtml(title)}</a>
          <a class="ai-compose-source-link" href="./detail-ai.html?topic=t59&context=paper">2025-2026学年北京市朝阳区七年级（上）10月月考数学试卷</a>
        </div>
      </section>
    </div>`;
}

function renderComposeThread(extraMessages = []) {
  const thread = document.querySelector("#aiComposeThread");
  if (!thread) return;
  const prompt = composePrompt || "帮我出一份北京市朝阳区七年级上期末考试试卷";
  const extras = extraMessages.map(item => (
    item.role === "user"
      ? `<article class="ai-compose-msg is-user">${escapeHtml(item.text)}</article>`
      : `<article class="ai-compose-msg is-ai">${escapeHtml(item.text)}</article>`
  )).join("");
  thread.innerHTML = `<p class="ai-compose-user">${escapeHtml(prompt)}</p>${composeStepHtml()}${extras}`;
  thread.scrollTop = thread.scrollHeight;
}

let composeFollowups = [];

function bindComposeControls() {
  if (!isComposeMode) return;
  document.querySelector("#aiComposeSend")?.addEventListener("click", () => sendComposeFollowup());
  document.querySelector("#aiComposeInput")?.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendComposeFollowup();
    }
  });
  document.querySelector("#aiComposeThread")?.addEventListener("click", event => {
    const toggle = event.target.closest("[data-compose-step]");
    if (!toggle) return;
    const step = toggle.closest(".ai-compose-step");
    const body = step?.querySelector(".ai-compose-step-body");
    const arrow = toggle.querySelector(".ri-arrow-down-s-line, .ri-arrow-right-s-line");
    if (!body) return;
    const open = body.hidden;
    body.hidden = !open;
    if (arrow) arrow.className = open ? "ri-arrow-down-s-line" : "ri-arrow-right-s-line";
  });
  document.querySelector("#aiComposeEdit")?.addEventListener("click", () => {
    showToast("已进入编辑，题目可直接在试卷中选用到组题画布");
  });
  document.querySelector("#aiComposeDownload")?.addEventListener("click", () => {
    showToast("正在准备下载 Word");
  });
  document.querySelector("#aiComposeCloseDoc")?.addEventListener("click", () => {
    if (window.history.length > 1) window.history.back();
    else location.href = "./index.html";
  });
  document.querySelectorAll("[data-compose-file]").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-compose-file]").forEach(node => node.classList.toggle("is-active", node === button));
      const showAnswer = button.dataset.composeFile === "answer";
      workspace.showAnswers = showAnswer;
      const board = document.querySelector("#questionCardBoard");
      board?.classList.toggle("show-answers", showAnswer);
      const ansBtn = document.querySelector("#toggleShowAnswer");
      if (ansBtn) {
        ansBtn.innerHTML = showAnswer
          ? '<i class="ri-eye-off-line"></i><span>隐藏答案</span>'
          : '<i class="ri-eye-line"></i><span>显示答案</span>';
      }
    });
  });
}

function bindRecordControls() {
  if (!isRecordMode) return;
  document.querySelector("#aiRecordProgress")?.addEventListener("click", showRecordResults);
  document.querySelector("#aiRecordProgress")?.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      showRecordResults();
    }
  });
  document.querySelector("#showAiRecordResult")?.addEventListener("click", event => {
    event.stopPropagation();
    showRecordResults();
  });
  document.querySelectorAll(".ai-record-source-tools button").forEach(button => {
    button.addEventListener("click", () => showToast(button.title || "源文件工具"));
  });
}

function sendComposeFollowup() {
  const input = document.querySelector("#aiComposeInput");
  const text = String(input?.value || "").trim();
  if (!text) return;
  if (input) input.value = "";
  composeFollowups.push({ role: "user", text });
  composeFollowups.push({ role: "assistant", text: "已收到调整需求。你可以在右侧试卷中悬浮题目，选用到左侧组题画布继续编辑。" });
  renderComposeThread(composeFollowups);
}

function questionDefaults(q) {
  return {
    minutes: q.minutes || (q.type === "解答题" ? 5 : q.type === "填空题" ? 2 : 1),
    competency: q.competency || "运算能力",
    badges: q.badges || []
  };
}

function questionCardHtml(q, tab) {
  const skipped = tab.removedQuestionIds.includes(q.id);
  const selected = isQuestionGloballySelected(tab.topicId, q.id);
  const answerOpen = expandedAnalysisIds.has(q.id);
  const modified = tab.modifiedQuestions[q.id];
  const stem = modified?.stem || q.stem;
  const type = modified?.type || q.type;
  const difficulty = modified?.difficulty || q.difficulty;
  const meta = questionDefaults(q);
  const optionList = modified?.options || q.options || [];
  // 长选项并排会互相错位，超过阈值改单列排版
  const singleColumn = optionList.some(opt => String(opt).length > 20);
  const options = optionList.length
    ? `<div class="q-options ${singleColumn ? "q-options-single" : ""}">${optionList.map(opt => `<span>${escapeHtml(opt)}</span>`).join("")}</div>`
    : "";
  const badges = [
    ...(skipped ? [`<span class="q-badge is-paper-removed">${tab.isQuestionList ? "已从题单移除" : "已从本卷移除"}</span>`] : []),
    ...meta.badges.map(label => `<span class="q-badge ${label.includes("创新") ? "hot" : "ai"}">${escapeHtml(label)}</span>`)
  ].join("");
  const picked = dragPickIds.has(q.id);
  const favorited = isQuestionFavorited(tab.topicId, q.id);
  const selectLabel = selected ? "已加入画布，点击移出" : "加入画布";
  const paperRemoveLabel = tab.isQuestionList ? "从题单移除" : "从本卷移除";
  const paperRestoreLabel = tab.isQuestionList ? "恢复题单" : "恢复本卷";
  const sourceLine = isComposeMode && q.sourceLabel
    ? `<p class="q-compose-source">${escapeHtml(q.sourceLabel)}</p>`
    : "";
  return `
    <article class="question-item ${skipped ? "is-skipped" : ""} ${selected ? "selected" : ""} ${picked ? "drag-picked" : ""} ${modified ? "modified" : ""} ${answerOpen ? "answer-open" : ""}"
      data-q="${q.id}" data-topic-id="${escapeHtml(getBaseTopicId(tab.topicId))}" tabindex="0" aria-label="第 ${q.num} 题" draggable="${skipped ? "false" : "true"}" title="点「加入画布」可用于跨卷自由组题">
      <div class="q-card-top">
        <div class="q-badges">${badges}</div>
        <p class="q-trail">初中 / 数学 / ${escapeHtml(type)} / ${escapeHtml(difficulty)} / ${meta.minutes} 分钟</p>
      </div>
      <div class="q-body">
        <p class="q-stem">
          <button type="button" class="q-num-mark" data-card-action="select" data-q="${q.id}" aria-pressed="${selected}" title="${selectLabel}">
            ${selected ? '<i class="ri-check-line"></i>' : `${q.num}`}
          </button>
          <span class="q-stem-text">${escapeHtml(stem)}</span>
        </p>
        ${options}
        ${sourceLine}
      </div>
      <div class="q-answer-panel">
        <div class="q-inline-answer"><em>答案</em>${escapeHtml(modified?.answer || q.answer)}</div>
        <div class="q-inline-analysis"><em>解析</em>${escapeHtml(modified?.analysis || q.analysis)}</div>
      </div>
      <div class="q-card-bar">
        <span class="q-knowledge-foot">知识点：${escapeHtml(modified?.knowledge || q.knowledge)} / 核心素养：${escapeHtml(meta.competency)}</span>
        <div class="q-card-actions">
          <details class="q-more-actions">
            <summary class="q-action-ghost" title="更多操作"><i class="ri-more-line"></i><span>更多</span></summary>
            <div class="q-more-menu" role="menu">
              <button type="button" role="menuitem" data-card-action="fix" data-q="${q.id}"><i class="ri-error-warning-line"></i><span>纠错</span></button>
              <button type="button" role="menuitem" class="${favorited ? "saved" : ""}" data-card-action="favorite" data-q="${q.id}"><i class="${favorited ? "ri-star-fill" : "ri-star-line"}"></i><span>${favorited ? "已收藏" : "收藏"}</span></button>
              <button type="button" role="menuitem" data-card-action="similar" data-q="${q.id}"><i class="ri-stack-line"></i><span>相似题</span></button>
            </div>
          </details>
          <button type="button" class="q-action-ghost ${answerOpen ? "active" : ""}" data-card-action="analysis" data-q="${q.id}" aria-pressed="${answerOpen}">
            <i class="ri-file-text-line"></i><span>${answerOpen ? "收起解析" : "解析"}</span>
          </button>
          <button type="button" class="q-skip-btn ${skipped ? "is-restore" : ""}" data-card-action="paper-copy-remove" data-q="${q.id}" title="${skipped ? "恢复到本卷副本" : "仅从本卷副本移除，不影响原卷和左侧画布"}">
            <i class="${skipped ? "ri-arrow-go-back-line" : "ri-subtract-line"}"></i><span>${skipped ? paperRestoreLabel : paperRemoveLabel}</span>
          </button>
          ${selected
    ? `<button type="button" class="q-remove-btn" data-card-action="select" data-q="${q.id}" title="从左侧画布移出"><i class="ri-subtract-line"></i><span>移出画布</span></button>`
    : `<button type="button" class="q-add-btn" data-card-action="select" data-q="${q.id}" title="加入左侧画布"><i class="ri-add-line"></i><span>加入画布</span></button>`}
        </div>
      </div>
    </article>`;
}

function renderPaperActionButtons(tab) {
  const batchButton = document.querySelector("#batchAddAllQuestions");
  const saveButton = document.querySelector("#savePaperCopy");
  const saveLabel = document.querySelector("#savePaperCopyLabel");
  const copyNote = document.querySelector("#paperCopyNote");
  if (!tab) return;
  const selectable = getSelectableQuestions(tab);
  const selectedCount = selectable.filter(q => isQuestionGloballySelected(tab.topicId, q.id)).length;
  const missingCount = Math.max(0, selectable.length - selectedCount);
  const currentVersionSaved = isCurrentPaperCopySaved(tab);
  if (batchButton) {
    batchButton.disabled = selectable.length === 0 || missingCount === 0;
    batchButton.innerHTML = missingCount === 0
      ? `<i class="ri-checkbox-circle-fill"></i><span>已全部加入画布</span>`
      : `<i class="ri-layout-left-line"></i><span>${selectedCount ? `全部加入画布（+${missingCount}）` : `全部加入画布（${selectable.length}题）`}</span>`;
    batchButton.title = missingCount === 0
      ? "当前本卷内容已全部加入左侧画布"
      : `将当前本卷的 ${missingCount} 道未加入题目追加到左侧画布`;
  }
  if (saveButton) {
    saveButton.disabled = selectable.length === 0 || currentVersionSaved;
    saveButton.classList.toggle("is-saved", currentVersionSaved);
    saveButton.title = currentVersionSaved
      ? "当前版本已另存；修改标题或题目后可再次另存"
      : "按当前标题和题目内容另存为新的我的题单";
  }
  if (saveLabel) {
    saveLabel.textContent = tab.isQuestionList
      ? "保存修改"
      : currentVersionSaved
        ? `已另存为我的（${selectable.length}题）`
        : `另存为我的（${selectable.length}题）`;
  }
  if (copyNote) {
    copyNote.textContent = tab.isQuestionList
      ? "修改将保存到当前题单"
      : currentVersionSaved
        ? "当前版本已存入「我的资源」；修改后可再次另存"
        : `另存当前 ${selectable.length} 题到「我的题单」，原卷不受影响`;
  }
}

function renderQuestionCards() {
  const board = document.querySelector("#questionCardBoard");
  if (!board) {
    renderSelectedContext();
    return;
  }
  const tab = getActiveTab();
  if (!tab) return;
  syncTabSelectedQuestionIds(tab);
  if (!isComposeMode && !isRecordMode) document.title = `${tab.title} · AI 试卷工作台`;
  renderMeta(tab);
  renderPaperActionButtons(tab);

  const sections = [...new Set(tab.questions.map(q => q.section))];
  board.classList.toggle("show-answers", workspace.showAnswers);
  board.innerHTML = sections.map(section => {
    const items = tab.questions.filter(q => q.section === section);
    const selectable = items.filter(q => !tab.removedQuestionIds.includes(q.id));
    const qIds = selectable.map(q => q.id).join(",");
    return `
      <section class="question-section" data-section="${escapeHtml(section)}">
        <header class="question-section-head" draggable="true" data-section="${escapeHtml(section)}" data-q-ids="${qIds}" title="拖到左侧画布，可整组选用本大题">
          <div class="question-section-head-main">
            <i class="ri-draggable question-section-drag" aria-hidden="true"></i>
            <h3>${escapeHtml(section)}</h3>
          </div>
          <div class="question-section-head-actions">
            <span>${selectable.length} 题</span>
          </div>
        </header>
        <div class="paper-sheet">
          <div class="question-list-flow">${items.map(q => questionCardHtml(q, tab)).join("")}</div>
        </div>
      </section>`;
  }).join("");

  renderSelectedContext();
  bindQuestionCardEvents();
}

function renderSelectedFooter(count) {
  const button = document.querySelector("#createQuestionList");
  const label = document.querySelector("#createQuestionListLabel");
  const hint = document.querySelector("#aiSelectedHint");
  const railBadge = document.querySelector("#aiSelectedExpandCount");
  const stats = document.querySelector("#aiCanvasStats");
  const previewBtn = document.querySelector("#previewQuestionList");
  const previewLabel = document.querySelector("#previewQuestionListLabel");
  const scoreBtn = document.querySelector("#scoreQuestionList");
  const extraBtns = document.querySelectorAll(".ai-canvas-wide-btn");
  const selected = getGlobalSelectedQuestions();
  if (button) button.disabled = count === 0;
  if (label) label.textContent = "创建题单";
  applyCanvasTitleToUi();
  bindCanvasTitleEditor(document.querySelector("#canvasHeadTitle"));
  bindCanvasTitleEditor(document.querySelector("#canvasPaperTitle"));
  if (hint) {
    if (selectedPanelEnlarged) {
      hint.hidden = true;
      hint.classList.remove("is-count");
    } else if (count > 0) {
      hint.hidden = false;
      hint.textContent = renderCanvasStatsText(selected);
      hint.classList.add("is-count");
    } else {
      hint.hidden = false;
      hint.textContent = "加入画布后创建题单";
      hint.classList.remove("is-count");
    }
  }
  if (railBadge) {
    railBadge.textContent = count > 99 ? "99+" : String(count);
    railBadge.hidden = count === 0;
  }
  if (stats) {
    stats.hidden = true;
  }
  if (previewBtn) previewBtn.disabled = count === 0;
  if (previewLabel) previewLabel.textContent = "预览";
  if (scoreBtn) scoreBtn.disabled = count === 0;
  extraBtns.forEach(btn => {
    btn.disabled = count === 0;
    btn.hidden = !selectedPanelEnlarged;
  });
  const clearBtn = document.querySelector("#clearSelectedQuestions");
  if (clearBtn) {
    clearBtn.disabled = count === 0;
    clearBtn.hidden = false;
  }
}

function syncSelectedPanelChrome() {
  const root = document.querySelector("#aiWorkspace");
  root?.classList.toggle("selected-panel-enlarged", selectedPanelEnlarged);
  document.querySelector("#aiSelectedPanel")?.classList.toggle("is-enlarged", selectedPanelEnlarged);
  const enlargeBtn = document.querySelector("#enlargeSelectedPanel");
  const answerBtn = document.querySelector("#toggleSelectedAnswers");
  const preview = document.querySelector("#aiSelectedPreview");
  if (enlargeBtn) {
    enlargeBtn.textContent = "高级编辑";
    enlargeBtn.hidden = selectedPanelEnlarged;
    enlargeBtn.setAttribute("aria-pressed", selectedPanelEnlarged ? "true" : "false");
    enlargeBtn.title = "高级编辑组题画布";
  }
  const compactCollapse = document.querySelector("#collapseSelectedPanel");
  const topbarCollapse = document.querySelector("#topbarCollapseCanvas");
  if (compactCollapse) compactCollapse.hidden = false;
  if (topbarCollapse) topbarCollapse.hidden = true;
  const leaf = document.querySelector("#breadcrumbLeaf");
  if (selectedPanelEnlarged && leaf) leaf.textContent = getCanvasDisplayTitle();
  if (answerBtn) {
    answerBtn.hidden = true;
  }
  preview?.classList.toggle("show-answers", selectedPanelEnlarged && selectedShowAnswers);
  preview?.classList.toggle("is-enlarged", selectedPanelEnlarged);
  const studio = document.querySelector("#aiCanvasStudio");
  if (studio) studio.hidden = !selectedPanelEnlarged;
  const footer = document.querySelector("#aiSelectedFooter");
  const collapseBtn = document.querySelector("#collapseSelectedPanel");
  const panelBody = document.querySelector(".ai-selected-body");
  const headActions = document.querySelector("#selectedSectionHead .ai-section-head-actions");
  if (footer && panelBody) {
    if (selectedPanelEnlarged && headActions && collapseBtn) {
      headActions.insertBefore(footer, collapseBtn);
    } else {
      panelBody.appendChild(footer);
    }
  }
}

function setSelectedPanelEnlarged(next) {
  selectedPanelEnlarged = Boolean(next);
  if (selectedPanelEnlarged) {
    rightPanelSectionState.selectedCollapsed = false;
    applySelectedPanelState();
  } else {
    selectedShowAnswers = false;
    selectedExpandedAnalysisKeys.clear();
  }
  syncSelectedPanelChrome();
  renderSelectedContext();
}

function toggleSelectedPanelEnlarge() {
  setSelectedPanelEnlarged(!selectedPanelEnlarged);
}

function toggleSelectedShowAnswers() {
  if (!selectedPanelEnlarged) return;
  selectedShowAnswers = !selectedShowAnswers;
  syncSelectedPanelChrome();
  renderSelectedContext();
}

function toggleSelectedQuestionAnalysis(selectionKey) {
  if (selectedExpandedAnalysisKeys.has(selectionKey)) selectedExpandedAnalysisKeys.delete(selectionKey);
  else selectedExpandedAnalysisKeys.add(selectionKey);
  renderSelectedContext();
}

function selectedPreviewCompactHtml(item, index) {
  return `
    <article class="ai-canvas-item" draggable="true" data-selection-key="${item.selectionKey}" data-topic-id="${escapeHtml(item.topicId)}" data-q="${escapeHtml(item.question.id)}" tabindex="0">
      <i class="ri-draggable ai-canvas-drag" aria-hidden="true" title="拖动排序"></i>
      <span class="ai-canvas-index">${index + 1}</span>
      <p class="ai-canvas-stem" data-canvas-stem>${escapeHtml(item.question.stem)}</p>
      <button type="button" class="ai-canvas-minus" data-selected-action="remove" data-selection-key="${item.selectionKey}" aria-label="移出" title="移出">
        <i class="ri-subtract-line"></i>
      </button>
    </article>`;
}

function selectedPreviewEnlargedHtml(item, index) {
  const q = item.question;
  const meta = questionDefaults(q);
  const favorited = isQuestionFavorited(item.topicId, q.id);
  const answerOpen = selectedExpandedAnalysisKeys.has(item.selectionKey);
  const optionList = q.options || [];
  const singleColumn = optionList.some(opt => String(opt).length > 20);
  const options = optionList.length
    ? `<div class="q-options ${singleColumn ? "q-options-single" : ""}">${optionList.map(opt => `<span>${escapeHtml(opt)}</span>`).join("")}</div>`
    : "";
  const badges = meta.badges.map(label => `<span class="q-badge ${label.includes("创新") ? "hot" : "ai"}">${escapeHtml(label)}</span>`).join("");
  const displayNum = q.num || index + 1;
  return `
    <article class="question-item ai-selected-enlarged-item ${answerOpen ? "answer-open" : ""}"
      data-selection-key="${item.selectionKey}" data-topic-id="${escapeHtml(item.topicId)}" data-q="${escapeHtml(q.id)}" tabindex="0"
      aria-label="已选第 ${displayNum} 题">
      <div class="q-card-top">
        <div class="q-badges">${badges}</div>
        <p class="q-trail">初中 / 数学 / ${escapeHtml(q.type)} / ${escapeHtml(q.difficulty || "中等")} / ${meta.minutes} 分钟</p>
      </div>
      <div class="q-body">
        <p class="q-stem"><b>${displayNum}.</b> ${escapeHtml(q.stem)}</p>
        ${options}
      </div>
      <div class="q-answer-panel">
        <div class="q-inline-answer"><em>答案</em>${escapeHtml(q.answer || "暂无")}</div>
        <div class="q-inline-analysis"><em>解析</em>${escapeHtml(q.analysis || "暂无")}</div>
      </div>
      <div class="q-card-bar">
        <span class="q-knowledge-foot">知识点：${escapeHtml(q.knowledge || "未标注")} / 核心素养：${escapeHtml(meta.competency)}</span>
        <div class="q-card-actions">
          <button type="button" class="q-action-ghost ${answerOpen ? "active" : ""}" data-selected-action="analysis" data-selection-key="${item.selectionKey}" aria-pressed="${answerOpen}">
            <i class="ri-file-text-line"></i><span>${answerOpen ? "收起解析" : "解析"}</span>
          </button>
          <button type="button" class="q-action-ghost ${favorited ? "saved" : ""}" data-selected-action="favorite" data-selection-key="${item.selectionKey}" data-topic-id="${escapeHtml(item.topicId)}" data-q="${escapeHtml(q.id)}">
            <i class="${favorited ? "ri-star-fill" : "ri-star-line"}"></i><span>${favorited ? "已收藏" : "收藏"}</span>
          </button>
          <button type="button" class="q-action-ghost" data-selected-action="similar" data-q="${escapeHtml(q.id)}">
            <i class="ri-stack-line"></i><span>相似题</span>
          </button>
          <button type="button" class="q-action-ghost" data-selected-action="fix" data-q="${escapeHtml(q.id)}">
            <i class="ri-error-warning-line"></i><span>纠错</span>
          </button>
          <button type="button" class="q-remove-btn" data-selected-action="remove" data-selection-key="${item.selectionKey}" title="移出已选题目">
            <i class="ri-close-line"></i><span>移出</span>
          </button>
        </div>
      </div>
    </article>`;
}

function renderCanvasGroupHtml(group, startIndex) {
  const collapsed = collapsedCanvasGroupIds.has(group.topicId);
  const itemsHtml = selectedPanelEnlarged
    ? group.items.map((item, index) => selectedPreviewEnlargedHtml(item, startIndex + index)).join("")
    : group.items.map((item, index) => selectedPreviewCompactHtml(item, startIndex + index)).join("");
  return `
    <section class="ai-canvas-group ${collapsed ? "is-collapsed" : ""}" data-canvas-group="${escapeHtml(group.topicId)}">
      <header class="ai-canvas-group-head">
        <button type="button" class="ai-canvas-group-toggle" data-selected-action="toggle-group" data-topic-id="${escapeHtml(group.topicId)}">
          <i class="${collapsed ? "ri-arrow-right-s-line" : "ri-arrow-down-s-line"}"></i>
          <span>${escapeHtml(group.title)}</span>
          <span class="ai-canvas-group-count">(${group.items.length})</span>
        </button>
        <button type="button" class="ai-canvas-group-delete" data-selected-action="remove-group" data-topic-id="${escapeHtml(group.topicId)}">整组删</button>
      </header>
      <div class="ai-canvas-group-body">${itemsHtml}</div>
    </section>`;
}

function flashQuestionNode(node) {
  if (!node) return;
  node.classList.remove("focus-flash");
  void node.offsetWidth;
  node.classList.add("focus-flash");
  window.setTimeout(() => node.classList.remove("focus-flash"), 1200);
}

function locateCanvasQuestion(item, options = {}) {
  const { switchTabIfNeeded = false } = options;
  if (!item) return;
  const active = getActiveTab();
  const samePaper = active && getBaseTopicId(active.topicId) === getBaseTopicId(item.topicId) && !active.isQuestionList;
  if (!samePaper) {
    if (!switchTabIfNeeded) return;
    workspace.homeActive = false;
    workspace.activeBrowseFilter = null;
    const existing = findTabForTopic(item.topicId);
    if (existing) workspace.activeTabId = existing.id;
    else openTab(item.topicId);
    saveWorkspace();
    renderAll();
  }
  const node = document.querySelector(`#questionCardBoard .question-item[data-q="${item.question.id}"]`);
  if (!node) return;
  node.scrollIntoView({ behavior: "smooth", block: "center" });
  flashQuestionNode(node);
}

function reorderCanvasItem(fromKey, targetKey, place = "before") {
  if (!fromKey || fromKey === targetKey) return;
  const list = [...getGlobalSelectedQuestions()];
  const fromIdx = list.findIndex(item => item.selectionKey === fromKey);
  if (fromIdx < 0) return;
  const [moved] = list.splice(fromIdx, 1);
  let toIdx = list.findIndex(item => item.selectionKey === targetKey);
  if (toIdx < 0) list.push(moved);
  else {
    if (place === "after") toIdx += 1;
    list.splice(toIdx, 0, moved);
  }
  workspace.globalSelectedQuestions = list;
  saveWorkspace();
  renderSelectedContext();
}

function removeCanvasGroup(topicId) {
  workspace.globalSelectedQuestions = getGlobalSelectedQuestions().filter(item => item.topicId !== topicId);
  collapsedCanvasGroupIds.delete(topicId);
  syncTabSelectedQuestionIds(getActiveTab());
  saveWorkspace();
  renderQuestionCards();
}

function persistCanvasStemEdit(item, nextStem) {
  const stem = String(nextStem || "").trim();
  if (!item || !stem || stem === item.question.stem) return false;
  item.question.stem = stem;
  const tab = findTabForTopic(item.topicId);
  if (tab) {
    tab.modifiedQuestions = tab.modifiedQuestions || {};
    tab.modifiedQuestions[item.question.id] = {
      ...(tab.modifiedQuestions[item.question.id] || {}),
      stem
    };
  }
  saveWorkspace();
  return true;
}

function startCanvasStemEdit(selectionKey) {
  const preview = document.querySelector("#aiSelectedPreview");
  const itemNode = preview?.querySelector(`[data-selection-key="${selectionKey}"]`);
  const stemNode = itemNode?.querySelector("[data-canvas-stem], .q-stem-text, .q-stem");
  const item = getGlobalSelectedQuestions().find(entry => entry.selectionKey === selectionKey);
  if (!stemNode || !item) return;
  stemNode.contentEditable = "true";
  stemNode.classList.add("is-editing");
  stemNode.focus();
  const range = document.createRange();
  range.selectNodeContents(stemNode);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  const finish = () => {
    stemNode.contentEditable = "false";
    stemNode.classList.remove("is-editing");
    const changed = persistCanvasStemEdit(item, stemNode.textContent);
    renderQuestionCards();
    if (changed) showToast("已修改画布中的题目");
  };
  stemNode.addEventListener("blur", finish, { once: true });
  stemNode.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      stemNode.blur();
    }
    if (event.key === "Escape") {
      stemNode.textContent = item.question.stem;
      stemNode.blur();
    }
  }, { once: true });
}

function bindCanvasItemInteractions(preview) {
  preview.querySelectorAll(".ai-canvas-item, .ai-selected-enlarged-item").forEach(node => {
    const selectionKey = node.dataset.selectionKey;
    const item = getGlobalSelectedQuestions().find(entry => entry.selectionKey === selectionKey);
    if (!item) return;

    node.addEventListener("mouseenter", () => {
      if (selectedPanelEnlarged) return;
      clearTimeout(canvasHoverTimer);
      canvasHoverTimer = window.setTimeout(() => locateCanvasQuestion(item), 280);
    });
    node.addEventListener("mouseleave", () => clearTimeout(canvasHoverTimer));
    node.addEventListener("click", event => {
      if (event.target.closest("[data-selected-action], [contenteditable='true']")) return;
      locateCanvasQuestion(item, { switchTabIfNeeded: true });
    });

    if (!node.matches(".ai-canvas-item")) return;
    node.addEventListener("dragstart", event => {
      if (event.target.closest("button, [contenteditable='true']")) {
        event.preventDefault();
        return;
      }
      canvasDragKey = selectionKey;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData(CANVAS_DRAG_MIME, selectionKey);
      event.dataTransfer.setData("text/plain", selectionKey);
      node.classList.add("is-dragging");
    });
    node.addEventListener("dragend", () => {
      canvasDragKey = null;
      node.classList.remove("is-dragging");
      preview.querySelectorAll(".is-drop-before, .is-drop-after").forEach(el => el.classList.remove("is-drop-before", "is-drop-after"));
    });
    node.addEventListener("dragover", event => {
      if (!canvasDragKey || canvasDragKey === selectionKey) return;
      event.preventDefault();
      const rect = node.getBoundingClientRect();
      const place = event.clientY > rect.top + rect.height / 2 ? "after" : "before";
      node.classList.toggle("is-drop-before", place === "before");
      node.classList.toggle("is-drop-after", place === "after");
    });
    node.addEventListener("dragleave", () => node.classList.remove("is-drop-before", "is-drop-after"));
    node.addEventListener("drop", event => {
      event.preventDefault();
      event.stopPropagation();
      const fromKey = event.dataTransfer.getData(CANVAS_DRAG_MIME) || canvasDragKey;
      const rect = node.getBoundingClientRect();
      const place = event.clientY > rect.top + rect.height / 2 ? "after" : "before";
      node.classList.remove("is-drop-before", "is-drop-after");
      reorderCanvasItem(fromKey, selectionKey, place);
    });
  });
}

function bindSelectedPreviewEvents() {
  const preview = document.querySelector("#aiSelectedPreview");
  if (!preview) return;
  preview.querySelectorAll("[data-selected-action]").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      const action = button.dataset.selectedAction;
      const selectionKey = button.dataset.selectionKey;
      const topicId = button.dataset.topicId;
      const qId = button.dataset.q;
      const item = getGlobalSelectedQuestions().find(entry => entry.selectionKey === selectionKey);
      const q = item?.question;

      if (action === "remove" && selectionKey) {
        removeGlobalSelectedByKey(selectionKey);
        return;
      }
      if (action === "remove-group" && topicId) {
        removeCanvasGroup(topicId);
        showToast("已删除该卷在画布中的题目");
        return;
      }
      if (action === "toggle-group" && topicId) {
        if (collapsedCanvasGroupIds.has(topicId)) collapsedCanvasGroupIds.delete(topicId);
        else collapsedCanvasGroupIds.add(topicId);
        renderSelectedContext();
        return;
      }
      if (action === "edit" && selectionKey) {
        startCanvasStemEdit(selectionKey);
        return;
      }
      if (action === "analysis" && selectionKey) {
        toggleSelectedQuestionAnalysis(selectionKey);
        return;
      }
      if (action === "favorite" && topicId && qId) {
        const added = toggleQuestionFavorite(qId, topicId);
        showToast(added ? `已收藏第 ${q?.num || ""} 题` : `已取消收藏第 ${q?.num || ""} 题`);
        return;
      }
      if (action === "similar") showToast(`正在查找第 ${q?.num || ""} 题的相似题…`);
      if (action === "fix") showToast(`已记录第 ${q?.num || ""} 题的纠错反馈，教研会尽快核对`);
    });
  });
  bindCanvasItemInteractions(preview);
}

function getCanvasOrderedItems() {
  const items = getGlobalSelectedQuestions();
  if (!canvasOrderByType) return items;
  const rank = type => (String(type).includes("选择") ? 0 : String(type).includes("填空") ? 1 : 2);
  return [...items].sort((a, b) => rank(a.question?.type) - rank(b.question?.type));
}

function ensureCanvasFocus() {
  const items = getCanvasOrderedItems();
  if (!items.length) {
    canvasFocusKey = null;
    return null;
  }
  if (!items.some(item => item.selectionKey === canvasFocusKey)) {
    canvasFocusKey = items[0].selectionKey;
  }
  return items.find(item => item.selectionKey === canvasFocusKey) || items[0];
}

function canvasPaperItemHtml(item, index) {
  const q = item.question;
  const optionList = q.options || [];
  const options = optionList.length
    ? `<div class="q-options">${optionList.map(opt => `<span>${escapeHtml(opt)}</span>`).join("")}</div>`
    : "";
  return `
    <article class="canvas-paper-item ${item.selectionKey === canvasFocusKey ? "is-active" : ""}" draggable="true" data-selection-key="${item.selectionKey}" data-topic-id="${escapeHtml(item.topicId)}" data-q="${escapeHtml(q.id)}">
      <i class="ri-draggable canvas-paper-drag" aria-hidden="true" title="拖动排序"></i>
      <p class="q-stem"><b>${index + 1}.</b> ${escapeHtml(q.stem)}</p>
      ${options}
      <button type="button" class="canvas-paper-item-remove" data-selected-action="remove" data-selection-key="${item.selectionKey}" aria-label="移出" title="移出"><i class="ri-subtract-line"></i></button>
    </article>`;
}

function renderCanvasOrderList(items) {
  const wrap = document.querySelector("#aiCanvasOrderList");
  if (!wrap) return;
  if (!items.length) {
    wrap.innerHTML = `<p class="ai-canvas-info-empty">还没有选用题目</p>`;
    return;
  }
  const sections = canvasOrderByType
    ? [...new Set(items.map(item => item.question.type || "题目"))].map(type => ({
      title: type,
      items: items.filter(item => (item.question.type || "题目") === type)
    }))
    : [{ title: "画布题目", items }];
  let offset = 0;
  wrap.innerHTML = sections.map(section => {
    const chips = section.items.map((item, index) => {
      const num = offset + index + 1;
      return `<button type="button" class="ai-canvas-order-item ${item.selectionKey === canvasFocusKey ? "is-active" : ""}" data-canvas-focus="${item.selectionKey}">${num}</button>`;
    }).join("");
    offset += section.items.length;
    return `<section class="ai-canvas-order-section"><h3>${escapeHtml(section.title)}</h3><div class="ai-canvas-order-items">${chips}</div></section>`;
  }).join("");
}

function renderCanvasInfo(item) {
  const wrap = document.querySelector("#aiCanvasInfo");
  if (!wrap) return;
  if (!item) {
    wrap.innerHTML = `<p class="ai-canvas-info-empty">选用题目后，这里会显示答案、解析和知识点。</p>`;
    return;
  }
  const q = item.question;
  const meta = questionDefaults(q);
  wrap.innerHTML = `
    <p class="ai-canvas-info-meta">初中 / 数学 / ${escapeHtml(q.type || "题目")} / ${escapeHtml(q.difficulty || "中等")} / ${meta.minutes} 分钟</p>
    <p class="ai-canvas-info-meta">来源：${escapeHtml(getCanvasSourceLabel(item))}</p>
    <p class="ai-canvas-info-label">知识点</p>
    <p>${escapeHtml(q.knowledge || "未标注")}</p>
    <p class="ai-canvas-info-label">核心素养</p>
    <p>${escapeHtml(meta.competency)}</p>
    <p class="ai-canvas-info-label">答案</p>
    <p class="ai-canvas-info-answer">${escapeHtml(q.answer || "暂无")}</p>
    <p class="ai-canvas-info-label">解析</p>
    <p class="ai-canvas-info-analysis">${escapeHtml(q.analysis || "暂无")}</p>`;
}

function bindCanvasStudioEvents() {
  const studio = document.querySelector("#aiCanvasStudio");
  if (!studio) return;

  studio.querySelectorAll("[data-canvas-order]").forEach(button => {
    button.classList.toggle("is-active", button.dataset.canvasOrder === (canvasOrderByType ? "type" : "drag"));
    button.onclick = () => {
      canvasOrderByType = button.dataset.canvasOrder === "type";
      renderCanvasStudio();
    };
  });

  studio.querySelectorAll("[data-canvas-focus]").forEach(button => {
    button.addEventListener("click", () => {
      canvasFocusKey = button.dataset.canvasFocus;
      renderCanvasStudio();
    });
  });

  studio.querySelectorAll(".canvas-paper-item").forEach(node => {
    const selectionKey = node.dataset.selectionKey;
    node.addEventListener("click", event => {
      if (event.target.closest("[data-selected-action]")) return;
      canvasFocusKey = selectionKey;
      renderCanvasStudio();
    });
    node.addEventListener("dragstart", event => {
      if (event.target.closest("button, [contenteditable='true']")) {
        event.preventDefault();
        return;
      }
      canvasDragKey = selectionKey;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData(CANVAS_DRAG_MIME, selectionKey);
      event.dataTransfer.setData("text/plain", selectionKey);
      node.classList.add("is-dragging");
    });
    node.addEventListener("dragend", () => {
      canvasDragKey = null;
      node.classList.remove("is-dragging");
      studio.querySelectorAll(".is-drop-before, .is-drop-after").forEach(el => el.classList.remove("is-drop-before", "is-drop-after"));
    });
    node.addEventListener("dragover", event => {
      if (!canvasDragKey || canvasDragKey === selectionKey) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      const rect = node.getBoundingClientRect();
      const place = event.clientY > rect.top + rect.height / 2 ? "after" : "before";
      node.classList.toggle("is-drop-before", place === "before");
      node.classList.toggle("is-drop-after", place === "after");
    });
    node.addEventListener("dragleave", () => node.classList.remove("is-drop-before", "is-drop-after"));
    node.addEventListener("drop", event => {
      event.preventDefault();
      event.stopPropagation();
      const fromKey = event.dataTransfer.getData(CANVAS_DRAG_MIME) || canvasDragKey;
      const rect = node.getBoundingClientRect();
      const place = event.clientY > rect.top + rect.height / 2 ? "after" : "before";
      node.classList.remove("is-drop-before", "is-drop-after");
      reorderCanvasItem(fromKey, selectionKey, place);
    });
  });

  studio.querySelectorAll("[data-selected-action='remove']").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      removeGlobalSelectedByKey(button.dataset.selectionKey);
    });
  });

  bindCanvasTitleEditor(document.querySelector("#canvasPaperTitle"));

  if (!studio.dataset.toolBound) {
    studio.dataset.toolBound = "1";
    studio.querySelectorAll("[data-canvas-action]").forEach(button => {
      button.addEventListener("click", () => handleCanvasFooterAction(button.dataset.canvasAction));
    });
  }
}

function renderCanvasStudio() {
  const studio = document.querySelector("#aiCanvasStudio");
  if (!studio) return;
  const items = getCanvasOrderedItems();
  ensureCanvasFocus();
  applyCanvasTitleToUi();
  renderCanvasOrderList(items);
  const paper = document.querySelector("#aiCanvasPaperList");
  if (paper) {
    paper.innerHTML = items.length
      ? items.map((item, index) => canvasPaperItemHtml(item, index)).join("")
      : `<p class="ai-canvas-info-empty">画布还是空的，先在右侧选用题目。</p>`;
  }
  renderCanvasInfo(items.find(item => item.selectionKey === canvasFocusKey) || null);
  bindCanvasStudioEvents();
}

function previewCanvas() {
  if (!getGlobalSelectedQuestions().length) {
    showToast("请先选用题目");
    return;
  }
  openPrintPreview();
}

function canvasPrintPageHtml() {
  const items = getCanvasOrderedItems();
  const questions = items.map((item, index) => {
    const q = item.question;
    const options = (q.options || []).length
      ? `<div class="q-options">${q.options.map(opt => `<span>${escapeHtml(opt)}</span>`).join("")}</div>`
      : "";
    return `<article class="canvas-print-item"><p class="q-stem"><b>${index + 1}.</b> ${escapeHtml(q.stem)}</p>${options}</article>`;
  }).join("");
  return `<h1>${escapeHtml(getCanvasListTitle())}</h1>${questions || "<p>还没有选用题目</p>"}`;
}

function openPrintPreview() {
  const modal = document.querySelector("#canvasPrintPreview");
  const page = document.querySelector("#canvasPrintPage");
  if (!modal || !page) return;
  page.innerHTML = canvasPrintPageHtml();
  modal.hidden = false;
}

function closePrintPreview() {
  const modal = document.querySelector("#canvasPrintPreview");
  if (modal) modal.hidden = true;
}

function printCanvasPreview() {
  const modal = document.querySelector("#canvasPrintPreview");
  if (!modal || modal.hidden) openPrintPreview();
  document.body.classList.add("is-canvas-printing");
  window.print();
  window.setTimeout(() => document.body.classList.remove("is-canvas-printing"), 300);
}

function handleCanvasFooterAction(action) {
  if (action === "assign") showToast("布置功能即将开放");
  else if (action === "print") printCanvasPreview();
  else if (action === "download") showToast("正在生成可下载文件…");
  else if (action === "paper-settings") showToast("卷参设置即将开放");
  else if (action === "question-frame") showToast("题目框显示即将开放");
  else if (action === "analyze") showToast("题单分析即将开放");
}

function renderSelectedContext() {
  const wrap = document.querySelector("#aiSelectedContext");
  const summary = document.querySelector("#aiSelectedSummary");
  const preview = document.querySelector("#aiSelectedPreview");
  const empty = document.querySelector("#aiSelectedEmpty");
  if (!wrap || !preview) return;
  const selected = getGlobalSelectedQuestions();
  const visible = selectedPreviewTypeFilter
    ? selected.filter(item => matchesSelectedType(item.question.type, selectedPreviewTypeFilter))
    : selected;
  wrap.classList.toggle("has-selection", selected.length > 0);
  document.querySelector("#aiSelectedPanel")?.classList.toggle("has-selection", selected.length > 0);
  renderSelectedFooter(selected.length);
  syncSelectedPanelChrome();
  if (summary) {
    summary.hidden = true;
  }
  if (empty) empty.hidden = selected.length > 0;
  preview.innerHTML = visible.map((item, index) => selectedPreviewCompactHtml(item, index)).join("");
  bindSelectedPreviewEvents();
  if (selectedPanelEnlarged) renderCanvasStudio();
  window.dispatchEvent(new CustomEvent("aiq-canvas-change"));
}

function getFilteredSidebarPapers() {
  const query = paperListState.query.trim().toLowerCase();
  let list = sidebarPaperList.filter(paper => {
    if (query && !`${paper.title} ${paper.region} ${paper.grade} ${paper.examType}`.toLowerCase().includes(query)) {
      return false;
    }
    if (paperListState.examType !== "all" && paper.examType !== paperListState.examType) return false;
    return true;
  });

  list = [...list].sort((a, b) => b.recommendScore - a.recommendScore);
  return list;
}

function renderPaperList() {
  const scroll = document.querySelector("#paperListScroll");
  if (!scroll || isWorkbook) return;

  const activeTopicId = getBaseTopicId(getActiveTab()?.topicId);
  const list = getFilteredSidebarPapers();

  if (!list.length) {
    scroll.innerHTML = `<p class="paper-list-empty">没有找到匹配的试卷，试试调整筛选条件。</p>`;
    return;
  }

  scroll.innerHTML = list.map(paper => `
      <button type="button" class="paper-list-card ${paper.id === activeTopicId ? "active" : ""}" data-paper-id="${paper.id}">
        <p class="paper-list-card-title"><span class="paper-list-card-tag">${escapeHtml(paper.examType)}</span>${escapeHtml(paper.title)}</p>
      </button>`).join("");

  scroll.querySelectorAll("[data-paper-id]").forEach(button => {
    button.addEventListener("click", () => {
      openTab(button.dataset.paperId);
      if (isMobileLayout()) setMobileDrawer("paper", false);
    });
  });
}

function bindPaperListControls() {
  if (isWorkbook) return;

  const workspace = document.querySelector("#aiWorkspace");
  const panel = document.querySelector("#paperListPanel");
  const collapseBtn = document.querySelector("#collapsePaperList");
  const expandBtn = document.querySelector("#paperListExpand");
  const topbarExpandBtn = document.querySelector("#topbarExpandPaperList");
  const searchInput = document.querySelector("#paperListSearch");
  const typeBtn = document.querySelector("#paperListTypeBtn");
  const filterBtn = document.querySelector("#paperListFilterBtn");

  const typeOptions = ["all", "期末", "期中", "周测"];

  const setCollapsed = collapsed => {
    workspace?.classList.toggle("paper-list-collapsed", collapsed);
    applyResponsiveChrome();
  };

  const expandPanel = () => {
    if (isMobileLayout()) setMobileDrawer("paper", true);
    else setCollapsed(false);
  };

  collapseBtn?.addEventListener("click", () => {
    if (isMobileLayout()) setMobileDrawer("paper", false);
    else setCollapsed(true);
  });
  expandBtn?.addEventListener("click", expandPanel);
  topbarExpandBtn?.addEventListener("click", expandPanel);
  panel?.addEventListener("click", event => {
    if (isMobileLayout()) return;
    if (!workspace?.classList.contains("paper-list-collapsed")) return;
    if (event.target.closest(".paper-list-expand") || event.target === panel) expandPanel();
  });

  searchInput?.addEventListener("input", () => {
    paperListState.query = searchInput.value;
    renderPaperList();
  });

  typeBtn?.addEventListener("click", () => {
    const index = typeOptions.indexOf(paperListState.examType);
    paperListState.examType = typeOptions[(index + 1) % typeOptions.length];
    document.querySelector("#paperListTypeLabel").textContent =
      paperListState.examType === "all" ? "类型" : paperListState.examType;
    renderPaperList();
  });

  filterBtn?.addEventListener("click", () => showToast("更多筛选即将开放"));
}

function isMobileLayout() {
  return mobileLayoutQuery.matches;
}

function setMobileDrawer(name, open) {
  const root = document.querySelector("#aiWorkspace");
  if (!root) return;
  if (name === "selected") root.classList.toggle("mobile-selected-open", open);
  const anyOpen = root.classList.contains("mobile-selected-open");
  const mask = document.querySelector("#panelMask");
  if (mask) mask.hidden = !anyOpen;
}

function closeMobileDrawers() {
  setMobileDrawer("selected", false);
}

function applyResponsiveChrome() {
  const selectedBtn = document.querySelector("#topbarExpandSelected");
  if (isMobileLayout()) {
    if (selectedBtn) selectedBtn.hidden = false;
    return;
  }
  closeMobileDrawers();
  if (selectedBtn) selectedBtn.hidden = true;
}

function applySelectedPanelState() {
  const root = document.querySelector("#aiWorkspace");
  root?.classList.toggle("selected-panel-collapsed", rightPanelSectionState.selectedCollapsed);
  if (rightPanelSectionState.selectedCollapsed && selectedPanelEnlarged) {
    selectedPanelEnlarged = false;
    selectedShowAnswers = false;
    selectedExpandedAnalysisKeys.clear();
  }
  syncSelectedPanelChrome();
  applyResponsiveChrome();
}

function bindSelectedPanelControls() {
  const panel = document.querySelector("#aiSelectedPanel");
  const collapseBtn = document.querySelector("#collapseSelectedPanel");
  const expandBtn = document.querySelector("#aiSelectedExpand");
  const topbarExpandBtn = document.querySelector("#topbarExpandSelected");

  // 双容器在桌面端默认同时可见；用户手动收起后继续尊重其选择
  rightPanelSectionState.selectedCollapsed = shouldCanvasStartCollapsed();

  collapseBtn?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    if (selectedPanelEnlarged) {
      setSelectedPanelEnlarged(false);
      return;
    }
    if (isMobileLayout()) {
      setMobileDrawer("selected", false);
      collapseSelectedPanel({ manual: true });
      return;
    }
    collapseSelectedPanel({ manual: true });
    renderSelectedContext();
  });

  document.querySelector("#enlargeSelectedPanel")?.addEventListener("click", event => {
    event.stopPropagation();
    toggleSelectedPanelEnlarge();
  });

  document.querySelector("#topbarCollapseCanvas")?.addEventListener("click", event => {
    event.stopPropagation();
    setSelectedPanelEnlarged(false);
  });

  document.querySelector("#toggleSelectedAnswers")?.addEventListener("click", event => {
    event.stopPropagation();
    toggleSelectedShowAnswers();
  });

  const openPanel = event => {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    if (isMobileLayout()) setMobileDrawer("selected", true);
    expandSelectedPanel();
  };

  expandBtn?.addEventListener("click", openPanel);
  topbarExpandBtn?.addEventListener("click", openPanel);
  panel?.addEventListener("click", event => {
    if (!document.querySelector("#aiWorkspace")?.classList.contains("selected-panel-collapsed")) return;
    openPanel(event);
  });
  document.addEventListener("click", event => {
    if (!event.target.closest("#aiSelectedExpand, #aiSelectedPanel")) return;
    if (!document.querySelector("#aiWorkspace")?.classList.contains("selected-panel-collapsed")) return;
    if (event.target.closest("#collapseSelectedPanel, #enlargeSelectedPanel, #topbarCollapseCanvas")) return;
    openPanel(event);
  });

  applySelectedPanelState();
}

function openSelectedAsQuestionList() {
  const selectedItems = getGlobalSelectedQuestions();
  if (!selectedItems.length) {
    showToast("请先选择题目");
    return;
  }

  const selectedQuestions = getCanvasGroups(selectedItems).flatMap(group => group.items).map(item => ({ ...item.question }));
  if (!selectedQuestions.length) return;

  tabCounter += 1;
  const title = getCanvasListTitle();
  const now = new Date();
  const pad = value => String(value).padStart(2, "0");
  const createdAt = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const questions = selectedQuestions.map((q, index) => ({
    ...q,
    id: `${q.id}-list-${tabCounter}-${index}`,
    num: index + 1
  }));

  const newTab = {
    id: `tab-${tabCounter}`,
    topicId: `list-${Date.now()}`,
    context: getActiveTab()?.context || contextName,
    title,
    shortTitle: formatQuestionListShortTitle(),
    meta: {
      title,
      shortTitle: formatQuestionListShortTitle(),
      source: "自定义题单",
      difficulty: "中等",
      questionCount: questions.length,
      usage: 0,
      createdAt
    },
    selectedQuestionIds: questions.map(q => q.id),
    removedQuestionIds: [],
    modifiedQuestions: {},
    questions,
    fromTabId: getActiveTab()?.id || null,
    isQuestionList: true,
    selectionKey: selectedItems.map(item => item.selectionKey).sort().join(",")
  };

  registerMyQuestionList(newTab);
  workspace.tabs.push(newTab);
  workspace.activeTabId = newTab.id;
  pruneOverflowTabs();
  clearSelectedQuestionsState();
  saveWorkspace();
  if (isMobileLayout()) setMobileDrawer("selected", false);
  queueToastAfterNavigation("题单已创建，已保存至「我的题单」");
  location.href = `./detail-ai.html?tabId=${encodeURIComponent(newTab.id)}&context=${encodeURIComponent(newTab.context || contextName)}`;
}

function savePaperCopyAsQuestionList() {
  const tab = getActiveTab();
  if (!tab) return;
  if (tab.isQuestionList) {
    registerMyQuestionList(tab);
    saveWorkspace();
    renderPaperActionButtons(tab);
    showToast("修改已保存至「我的资源」");
    return;
  }

  const visibleQuestions = tab.questions
    .filter(q => !tab.removedQuestionIds.includes(q.id))
    .map(q => ({ ...resolveTabQuestion(tab, q) }));
  if (!visibleQuestions.length) {
    showToast("本卷没有可另存的题目");
    return;
  }

  tabCounter += 1;
  const now = new Date();
  const pad = value => String(value).padStart(2, "0");
  const createdAt = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const title = tab.title;
  const questions = visibleQuestions.map((q, index) => ({
    ...q,
    id: `${q.id}-copy-${tabCounter}-${index}`,
    num: index + 1
  }));
  const newTab = {
    id: `tab-${tabCounter}`,
    topicId: `list-${Date.now()}`,
    context: tab.context || contextName,
    title,
    shortTitle: shortenTabTitle(title),
    meta: {
      ...tab.meta,
      title,
      shortTitle: shortenTabTitle(title),
      source: "我的题单",
      questionCount: questions.length,
      createdAt
    },
    selectedQuestionIds: [],
    removedQuestionIds: [],
    modifiedQuestions: {},
    questions,
    fromTabId: tab.id,
    sourceTopicId: getBaseTopicId(tab.topicId),
    isQuestionList: true
  };

  registerMyQuestionList(newTab);
  workspace.paperSaveSignatures[paperSaveKey(tab)] = paperCopySignature(tab);
  saveWorkspace();
  renderPaperActionButtons(tab);
  animateSaveToMyResources();
  showToast("已另存至「我的资源」，可再次编辑、布置或下载");
}

function animateSaveToMyResources() {
  const source = document.querySelector("#savePaperCopy");
  const target = document.querySelector("#myResourcesButton");
  if (!source || !target) return;

  const finish = () => {
    target.classList.remove("is-receiving");
    void target.offsetWidth;
    target.classList.add("is-receiving");
    window.setTimeout(() => target.classList.remove("is-receiving"), 720);
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    finish();
    return;
  }

  const sourceRect = source.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const flight = document.createElement("div");
  flight.className = "resource-save-flight";
  flight.setAttribute("aria-hidden", "true");
  flight.innerHTML = '<i class="ri-file-list-3-line"></i><span>已另存</span>';
  flight.style.left = `${sourceRect.left + sourceRect.width / 2}px`;
  flight.style.top = `${sourceRect.top + sourceRect.height / 2}px`;
  flight.style.setProperty("--resource-flight-x", `${targetRect.left + targetRect.width / 2 - sourceRect.left - sourceRect.width / 2}px`);
  flight.style.setProperty("--resource-flight-y", `${targetRect.top + targetRect.height / 2 - sourceRect.top - sourceRect.height / 2}px`);
  document.body.appendChild(flight);
  flight.addEventListener("animationend", () => {
    flight.remove();
    finish();
  }, { once: true });
}

const AI_CREATE_CHIPS_WITH_BASE = ["再补 5 道同类型", "补 2 道压轴题", "删掉太简单的", "总共控制在 10 题"];
const AI_CREATE_CHIPS_EMPTY = ["七上有理数易错题 15 题", "期末选择题专练 12 题", "中等难度综合练习 20 题"];
const AI_TOPIC_KEYWORDS = ["有理数", "整式", "一元一次方程", "轴对称", "数轴", "正负数", "不等式", "角平分线", "几何"];

function aiCreateUsesSelected() {
  const checkbox = document.querySelector("#aiCreateUseSelected");
  return Boolean(checkbox && !checkbox.disabled && checkbox.checked);
}

function renderAiCreateChips() {
  const wrap = document.querySelector("#aiCreateChips");
  if (!wrap) return;
  const chips = aiCreateUsesSelected() ? AI_CREATE_CHIPS_WITH_BASE : AI_CREATE_CHIPS_EMPTY;
  wrap.innerHTML = chips
    .map(text => `<button type="button" class="ai-create-chip" data-ai-chip="${escapeHtml(text)}">${escapeHtml(text)}</button>`)
    .join("");
  wrap.querySelectorAll("[data-ai-chip]").forEach(chip => {
    chip.addEventListener("click", () => {
      const input = document.querySelector("#aiCreatePrompt");
      if (!input) return;
      const value = input.value.trim();
      input.value = value ? `${value}，${chip.dataset.aiChip}` : chip.dataset.aiChip;
      input.focus();
    });
  });
}

function openAiCreateModal() {
  const modal = document.querySelector("#aiCreateModal");
  if (!modal) return;
  const selected = getGlobalSelectedQuestions();
  const context = document.querySelector("#aiCreateContext");
  const checkbox = document.querySelector("#aiCreateUseSelected");
  const countNode = document.querySelector("#aiCreateSelectedCount");
  const summary = document.querySelector("#aiCreateContextSummary");

  if (context) context.hidden = selected.length === 0;
  if (checkbox) {
    checkbox.disabled = selected.length === 0;
    checkbox.checked = selected.length > 0;
  }
  if (countNode) countNode.textContent = String(selected.length);
  if (summary) {
    const counts = { 选择: 0, 填空: 0, 解答: 0 };
    selected.forEach(item => {
      const type = item.question?.type || "";
      if (type.includes("选择")) counts.选择 += 1;
      else if (type.includes("填空")) counts.填空 += 1;
      else if (type.includes("解答")) counts.解答 += 1;
    });
    const parts = ["选择", "填空", "解答"].filter(key => counts[key] > 0).map(key => `${counts[key]} 道${key}`);
    summary.textContent = parts.length ? parts.join(" · ") : "";
  }

  renderAiCreateChips();
  modal.hidden = false;
  document.querySelector("#aiCreatePrompt")?.focus();
}

function closeAiCreateModal() {
  const modal = document.querySelector("#aiCreateModal");
  if (!modal) return;
  modal.hidden = true;
  const input = document.querySelector("#aiCreatePrompt");
  if (input) input.value = "";
}

function collectAiCandidateQuestions(excludeKeys) {
  const pool = [];
  Object.entries(paperQuestions).forEach(([topicId, list]) => {
    list.forEach(q => {
      const key = getQuestionSelectionKey(topicId, q.id);
      if (excludeKeys.has(key)) return;
      pool.push({ ...q, sourceTopicId: topicId });
    });
  });
  return pool;
}

function rankAiCandidates(pool, prompt) {
  const wantsHard = /难|压轴|提高|拔高|挑战/.test(prompt);
  const wantsEasy = /简单|基础|容易|入门/.test(prompt);
  const topic = AI_TOPIC_KEYWORDS.find(word => prompt.includes(word));
  const typeHint = ["选择", "填空", "解答"].find(word => prompt.includes(word));

  return [...pool].sort((a, b) => aiCandidateScore(b) - aiCandidateScore(a));

  function aiCandidateScore(q) {
    let score = 0;
    if (topic && `${q.knowledge || ""}${q.stem || ""}`.includes(topic)) score += 6;
    if (typeHint && String(q.type || "").includes(typeHint)) score += 3;
    if (wantsHard && /较难|中等/.test(q.difficulty || "")) score += 2;
    if (wantsEasy && /简单|较易/.test(q.difficulty || "")) score += 2;
    return score;
  }
}

function resolveAiTargetCount(prompt, baseCount) {
  const total = prompt.match(/(?:控制在|总共|一共|共)\s*(\d+)/);
  if (total) return Math.max(1, Number(total[1]));
  const append = prompt.match(/(?:补|加|增|再来)\s*(\d+)/);
  if (append) return baseCount + Math.max(1, Number(append[1]));
  const plain = prompt.match(/(\d+)\s*(?:道|题)/);
  if (plain) return Math.max(1, Number(plain[1]));
  return baseCount ? baseCount + 4 : 8;
}

function buildAiListTitle(prompt, baseCount) {
  const topic = AI_TOPIC_KEYWORDS.find(word => prompt.includes(word));
  const now = new Date();
  const stamp = `${now.getMonth() + 1}.${now.getDate()}`;
  if (topic) return `七上${topic}专项巩固题单`;
  if (baseCount) return `精选巩固题单 · ${stamp}`;
  return `AI 生成题单 · ${stamp}`;
}

function generateAiQuestionList() {
  const promptInput = document.querySelector("#aiCreatePrompt");
  const prompt = (promptInput?.value || "").trim();
  const useSelected = aiCreateUsesSelected();
  const selected = useSelected ? getGlobalSelectedQuestions() : [];

  if (!prompt && !selected.length) {
    showToast("先描述一下想要什么样的题单");
    promptInput?.focus();
    return;
  }

  const baseQuestions = selected.map(item => ({ ...item.question }));
  const excludeKeys = new Set(selected.map(item => item.selectionKey));
  const targetCount = resolveAiTargetCount(prompt, baseQuestions.length);

  let questions = baseQuestions;
  if (targetCount < baseQuestions.length) {
    questions = baseQuestions.slice(0, targetCount);
  } else if (targetCount > baseQuestions.length) {
    const need = targetCount - baseQuestions.length;
    const supplement = rankAiCandidates(collectAiCandidateQuestions(excludeKeys), prompt)
      .slice(0, need)
      .map(q => ({ ...q, badges: ["AI 补充"] }));
    questions = [...baseQuestions, ...supplement];
  }

  if (!questions.length) {
    showToast("没有找到合适的题目，换个描述试试");
    return;
  }

  tabCounter += 1;
  const title = buildAiListTitle(prompt, baseQuestions.length);
  const now = new Date();
  const pad = value => String(value).padStart(2, "0");
  const createdAt = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const aiCount = questions.filter(q => (q.badges || []).includes("AI 补充")).length;
  const listQuestions = questions.map((q, index) => ({
    ...q,
    id: `${q.id}-ai-${tabCounter}-${index}`,
    num: index + 1
  }));

  const newTab = {
    id: `tab-${tabCounter}`,
    topicId: `list-${Date.now()}`,
    context: getActiveTab()?.context || contextName,
    title,
    shortTitle: title.length > 8 ? `${title.slice(0, 8)}…` : title,
    meta: {
      title,
      shortTitle: title,
      source: "AI 生成题单",
      difficulty: "中等",
      questionCount: listQuestions.length,
      usage: 0,
      createdAt,
      aiPrompt: prompt
    },
    selectedQuestionIds: [],
    removedQuestionIds: [],
    modifiedQuestions: {},
    questions: listQuestions,
    fromTabId: getActiveTab()?.id || null,
    isQuestionList: true,
    aiGenerated: true
  };

  registerMyQuestionList(newTab);
  workspace.tabs.push(newTab);
  workspace.activeTabId = newTab.id;
  pruneOverflowTabs();
  saveWorkspace();
  closeAiCreateModal();
  if (isMobileLayout()) setMobileDrawer("selected", false);
  location.href = `./detail-ai.html?tabId=${encodeURIComponent(newTab.id)}&context=${encodeURIComponent(newTab.context || contextName)}`;
}

function fillAiAssistantPrompt(text) {
  const input = document.querySelector("#aiAssistantInput");
  if (!input) return;
  input.value = String(text || "");
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
}

function syncAiAssistantChrome() {
  const panel = document.querySelector("#aiAssistantPanel");
  const btn = document.querySelector("#docTabAiAssistant");
  if (panel) panel.hidden = !aiAssistantOpen;
  if (btn) {
    btn.classList.toggle("is-open", aiAssistantOpen);
    btn.setAttribute("aria-expanded", aiAssistantOpen ? "true" : "false");
  }
}

function openAiAssistant() {
  closeMyResources();
  aiAssistantOpen = true;
  syncAiAssistantChrome();
  renderAiAssistantThread();
  document.querySelector("#aiAssistantInput")?.focus();
}

function closeAiAssistant() {
  aiAssistantOpen = false;
  syncAiAssistantChrome();
}

function toggleAiAssistant() {
  if (aiAssistantOpen) closeAiAssistant();
  else openAiAssistant();
}

function setAiAssistantAttachment(file) {
  aiAssistantAttachment = file || null;
  const chip = document.querySelector("#aiAssistantFileChip");
  if (!chip) return;
  if (!aiAssistantAttachment) {
    chip.hidden = true;
    chip.textContent = "";
    return;
  }
  chip.hidden = false;
  chip.textContent = aiAssistantAttachment.name;
}

function aiAssistantEmptyHtml() {
  return `
    <div class="ai-assistant-empty">
      <article class="ai-assistant-msg is-ai">
        <div class="ai-assistant-author"><i class="ri-sparkling-2-line"></i>飞象题库AI</div>
        <div class="ai-assistant-bubble">
          <p>你好，我是飞象题库AI。</p>
          <p>可以直接告诉我你想组什么题、组什么卷，或把试卷发给我录入。</p>
        </div>
      </article>
    </div>`;
}

function aiAssistantMessageHtml(item) {
  if (item.role === "user") {
    const file = item.fileName ? `<span class="ai-assistant-msg-file"><i class="ri-attachment-2"></i>${escapeHtml(item.fileName)}</span>` : "";
    return `<article class="ai-assistant-msg is-user"><div class="ai-assistant-bubble">${file}${escapeHtml(item.text || "")}</div></article>`;
  }
  return `<article class="ai-assistant-msg is-ai">
    <div class="ai-assistant-author"><i class="ri-sparkling-2-line"></i>AI 助手</div>
    <div class="ai-assistant-bubble">${escapeHtml(item.text || "")}</div>
  </article>`;
}

function renderAiAssistantThread() {
  const thread = document.querySelector("#aiAssistantThread");
  if (!thread) return;
  if (!aiAssistantMessages.length && !aiAssistantTyping) {
    thread.innerHTML = aiAssistantEmptyHtml();
    bindAiAssistantEmptyEvents();
    return;
  }
  const typing = aiAssistantTyping
    ? `<article class="ai-assistant-msg is-ai is-typing"><div class="ai-assistant-author"><i class="ri-sparkling-2-line"></i>AI 助手</div><div class="ai-assistant-bubble">正在思考…</div></article>`
    : "";
  thread.innerHTML = aiAssistantMessages.map(aiAssistantMessageHtml).join("") + typing;
  thread.scrollTop = thread.scrollHeight;
}

function bindAiAssistantEmptyEvents() {}

function mockAiAssistantReply(text, fileName) {
  if (fileName) {
    return `已收到附件「${fileName}」。我会按录题流程识别题目、拆分题干和选项，识别完成后可以把题目同步到组题画布。`;
  }
  if (/找卷|试卷/.test(text) && !/组/.test(text)) {
    return "正在帮你检索匹配的试卷。找到后可以在标签页打开，也可以把整卷题目选用进组题画布。";
  }
  if (/找题|帮我找/.test(text)) {
    return "正在按知识点、题型和难度检索题目。找到后可以直接加入左侧组题画布。";
  }
  if (/组试卷|组卷/.test(text)) {
    return "可以按年级、题型和难度帮你组一套试卷。确认要求后，我会生成可预览、可打印的试卷草稿。";
  }
  if (/组题单/.test(text)) {
    return "会按专项和题量帮你组一份题单，保存后会出现在标签栏，也能继续精编。";
  }
  if (/组题|出\d+道/.test(text)) {
    return "收到组题需求。我会按知识点生成题目，并支持加入组题画布继续调整。";
  }
  if (/录题|上传/.test(text)) {
    return "可以把试卷图片、PDF 或 Word 发给我。点左侧附件按钮上传，我会帮你拆题入库。";
  }
  return "已收到。点下方「AI组题 / AI组卷 / AI录题」可把指令填进输入框，也可以直接输入需求。";
}

function sendAiAssistantMessage(rawText) {
  const input = document.querySelector("#aiAssistantInput");
  const text = String(rawText ?? input?.value ?? "").trim();
  const fileName = aiAssistantAttachment?.name || "";
  if (!text && !fileName) return;
  if (!isComposeMode) {
    openComposePage(text || `请根据附件「${fileName}」录题`);
    return;
  }
  aiAssistantMessages.push({
    role: "user",
    text: text || "请根据附件录题",
    fileName
  });
  if (input) input.value = "";
  setAiAssistantAttachment(null);
  aiAssistantTyping = true;
  renderAiAssistantThread();
  const reply = mockAiAssistantReply(text, fileName);
  window.setTimeout(() => {
    aiAssistantTyping = false;
    aiAssistantMessages.push({ role: "assistant", text: reply });
    renderAiAssistantThread();
  }, 420);
}

function bindAiAssistantControls() {
  document.querySelector("#docTabAiAssistant")?.addEventListener("click", event => {
    event.stopPropagation();
    toggleAiAssistant();
  });
  document.querySelector("#aiAssistantClose")?.addEventListener("click", closeAiAssistant);
  document.querySelector("#aiAssistantSend")?.addEventListener("click", () => sendAiAssistantMessage());
  document.querySelector("#aiAssistantAttach")?.addEventListener("click", () => {
    document.querySelector("#aiAssistantFile")?.click();
  });
  document.querySelector("#aiAssistantFile")?.addEventListener("change", event => {
    const file = event.target.files && event.target.files[0];
    if (file && !isComposeMode && !isRecordMode) {
      openRecordPage(file.name);
      return;
    }
    setAiAssistantAttachment(file || null);
    event.target.value = "";
  });
  document.querySelector("#aiAssistantInput")?.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendAiAssistantMessage();
    }
  });
  document.querySelector("#aiAssistantFileChip")?.addEventListener("click", () => setAiAssistantAttachment(null));
  document.querySelectorAll("[data-ai-fill]").forEach(node => {
    node.addEventListener("click", () => fillAiAssistantPrompt(node.dataset.aiFill));
  });
}

function bindMyResourcesControls() {
  document.querySelector("#myResourcesButton")?.addEventListener("click", event => {
    event.stopPropagation();
    toggleMyResources();
  });
  document.querySelector("#myResourcesClose")?.addEventListener("click", closeMyResources);
  document.querySelector("#myResourcesPanel")?.addEventListener("click", event => event.stopPropagation());
  document.addEventListener("click", event => {
    const trigger = event.target.closest("[data-open-my-resources]");
    if (!trigger) return;
    event.preventDefault();
    event.stopPropagation();
    openMyResources();
  });
  document.addEventListener("click", event => {
    if (!event.target.closest("#myResourcesButton, #myResourcesPanel")) closeMyResources();
  });
  renderMyResources();
}

function bindAiCreateControls() {
  document.querySelector("#openAiCreate")?.addEventListener("click", openAiCreateModal);
  document.querySelector("#aiCreateSubmit")?.addEventListener("click", generateAiQuestionList);
  document.querySelector("#aiCreateUseSelected")?.addEventListener("change", renderAiCreateChips);
  document.querySelectorAll("[data-ai-create-close]").forEach(node => {
    node.addEventListener("click", closeAiCreateModal);
  });
  document.querySelector("#aiCreatePrompt")?.addEventListener("keydown", event => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) generateAiQuestionList();
  });
}

function openQuestionInNewTab(qId) {
  const sourceTab = getActiveTab();
  if (!sourceTab) return;
  const q = sourceTab.questions.find(item => item.id === qId);
  if (!q) return;

  const existing = workspace.tabs.find(tab => tab.fromTabId === sourceTab.id && tab.fromQuestionId === qId);
  if (existing) {
    switchTab(existing.id);
    showToast(`已切换到第 ${q.num} 题标签页`);
    focusQuestionInView(existing.questions[0]?.id);
    return;
  }

  tabCounter += 1;
  const questionCopy = { ...q, id: `${q.id}-view-${tabCounter}` };
  const baseTitle = getTabBaseTitle(sourceTab);
  const newTab = {
    id: `tab-${tabCounter}`,
    topicId: `${getBaseTopicId(sourceTab.topicId)}-q${q.num}`,
    context: sourceTab.context || contextName,
    title: `${baseTitle} · 第 ${q.num} 题`,
    shortTitle: `第 ${q.num} 题`,
    meta: { ...sourceTab.meta, title: baseTitle, questionCount: 1 },
    selectedQuestionIds: [questionCopy.id],
    removedQuestionIds: [],
    modifiedQuestions: {},
    questions: [questionCopy],
    fromTabId: sourceTab.id,
    fromQuestionId: qId
  };

  workspace.tabs.push(newTab);
  workspace.activeTabId = newTab.id;
  saveWorkspace();
  renderAll();
  showToast(`已在新标签页打开第 ${q.num} 题`);
  focusQuestionInView(questionCopy.id);
}

function focusQuestionInView(qId) {
  if (!qId) return;
  requestAnimationFrame(() => {
    const node = document.querySelector(`.question-item[data-q="${qId}"]`);
    node?.scrollIntoView({ behavior: "smooth", block: "center" });
    node?.classList.add("focus-flash");
    setTimeout(() => node?.classList.remove("focus-flash"), 1200);
  });
}

function getCanvasCollapsePref() {
  try {
    const saved = localStorage.getItem(CANVAS_COLLAPSE_KEY) ?? sessionStorage.getItem(CANVAS_COLLAPSE_KEY);
    if (saved === "1") return true;
    if (saved === "0") return false;
  } catch {}
  return null;
}

function isCanvasManuallyCollapsed() {
  return getCanvasCollapsePref() === true;
}

function setCanvasManuallyCollapsed(value) {
  const next = Boolean(value);
  workspace.canvasManuallyCollapsed = next;
  try {
    localStorage.setItem(CANVAS_COLLAPSE_KEY, next ? "1" : "0");
  } catch {}
  try {
    sessionStorage.setItem(CANVAS_COLLAPSE_KEY, next ? "1" : "0");
  } catch {}
}

function shouldCanvasStartCollapsed() {
  return getCanvasCollapsePref() === true;
}

function expandSelectedPanel(options = {}) {
  const persist = options.persist !== false;
  if (persist) setCanvasManuallyCollapsed(false);
  rightPanelSectionState.selectedCollapsed = false;
  applySelectedPanelState();
  if (persist) saveWorkspace();
}

function collapseSelectedPanel(options = {}) {
  const persist = options.manual !== false && options.persist !== false;
  selectedPanelEnlarged = false;
  selectedShowAnswers = false;
  selectedExpandedAnalysisKeys.clear();
  rightPanelSectionState.selectedCollapsed = true;
  if (persist) setCanvasManuallyCollapsed(true);
  applySelectedPanelState();
  saveWorkspace();
}

function collapseCanvasIfEmpty() {
  if (getGlobalSelectedQuestions().length) return;
  if (getCanvasCollapsePref() !== true) return;
  collapseSelectedPanel({ manual: false, persist: false });
}

function maybeOpenCanvasOnFirstAdd(wasEmpty) {
  if (getCanvasCollapsePref() === true) return false;
  if (!wasEmpty && getCanvasCollapsePref() !== null) return false;
  expandSelectedPanel({ persist: false });
  if (isMobileLayout()) setMobileDrawer("selected", true);
  return true;
}

function snapshotQuestionEnterSource(sourceEl) {
  const source = sourceEl?.closest?.(".question-item") || sourceEl;
  if (!source?.getBoundingClientRect) return null;
  const rect = source.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  return {
    rect: {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: Math.min(rect.height, 88)
    },
    num: source.querySelector(".q-num-mark")?.textContent?.trim() || "",
    stem: source.querySelector(".q-stem-text")?.textContent?.trim()
      || source.querySelector(".q-stem")?.textContent?.trim()
      || ""
  };
}

function findCanvasEnterItem(qId, selectionKey) {
  const preview = document.querySelector("#aiSelectedPreview");
  if (!preview) return null;
  const attr = value => String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  if (selectionKey) {
    const byKey = preview.querySelector(`.ai-canvas-item[data-selection-key="${attr(selectionKey)}"]`);
    if (byKey) return byKey;
  }
  if (qId) {
    const byId = preview.querySelector(`.ai-canvas-item[data-q="${attr(qId)}"]`);
    if (byId) return byId;
  }
  return preview.querySelector(".ai-canvas-item:last-child");
}

function getCanvasEnterTarget(qId, selectionKey) {
  const collapsed = document.querySelector("#aiWorkspace")?.classList.contains("selected-panel-collapsed");
  if (collapsed) {
    return document.querySelector("#aiSelectedExpand") || document.querySelector("#aiSelectedPanel");
  }
  return findCanvasEnterItem(qId, selectionKey)
    || document.querySelector("#aiSelectedExpand")
    || document.querySelector("#aiSelectedPanel");
}

function settleCanvasArrival(target, collapsed) {
  if (collapsed) {
    const rail = document.querySelector("#aiSelectedExpand");
    const count = document.querySelector("#aiSelectedExpandCount");
    rail?.classList.add("is-receiving");
    count?.classList.add("is-receiving");
    window.setTimeout(() => {
      rail?.classList.remove("is-receiving");
      count?.classList.remove("is-receiving");
    }, 420);
    return;
  }
  const item = target?.classList?.contains("ai-canvas-item") ? target : target?.closest?.(".ai-canvas-item");
  if (!item) return;
  item.classList.remove("is-entering");
  item.classList.remove("is-arriving");
  void item.offsetWidth;
  item.classList.add("is-arriving");
  item.scrollIntoView({ block: "nearest", inline: "nearest" });
  window.setTimeout(() => item.classList.remove("is-arriving"), 480);
}

function playQuestionEnterCanvas(snapshot, meta = {}) {
  const collapsed = document.querySelector("#aiWorkspace")?.classList.contains("selected-panel-collapsed");
  const target = getCanvasEnterTarget(meta.qId, meta.selectionKey);
  if (target?.classList?.contains("ai-canvas-item") && !collapsed) {
    target.classList.add("is-entering");
  }
  const finish = () => settleCanvasArrival(target, collapsed);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!snapshot?.rect || reduced) {
    finish();
    return;
  }
  const from = snapshot.rect;
  const to = target?.getBoundingClientRect();
  if (!to?.width) {
    finish();
    return;
  }

  const ghost = document.createElement("div");
  ghost.className = "q-enter-canvas-ghost";
  ghost.innerHTML = `<span class="q-enter-canvas-num">${escapeHtml(snapshot.num || "")}</span><span class="q-enter-canvas-stem">${escapeHtml(snapshot.stem || "")}</span>`;
  const startH = Math.max(36, from.height);
  Object.assign(ghost.style, {
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${startH}px`
  });
  document.body.appendChild(ghost);

  const destW = collapsed ? Math.min(to.width, 44) : Math.min(Math.max(to.width, 140), from.width);
  const destH = collapsed ? Math.min(to.height, 44) : Math.min(Math.max(to.height, 34), 48);
  const destX = collapsed ? to.left + (to.width - destW) / 2 : to.left;
  const destY = collapsed ? to.top + (to.height - destH) / 2 : to.top;
  const dx = destX - from.left;
  const dy = destY - from.top;
  const sx = destW / from.width;
  const sy = destH / startH;
  const midX = dx * 0.48;
  const midY = dy * 0.36 - 18;

  const done = () => {
    ghost.remove();
    finish();
  };
  try {
    const anim = ghost.animate(
      [
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        { transform: `translate(${midX}px, ${midY}px) scale(${Math.min(0.92, Math.max(sx, 0.46) + 0.12)})`, opacity: 0.96 },
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.12 }
      ],
      { duration: 540, easing: "cubic-bezier(.22,.72,.16,1)", fill: "forwards" }
    );
    if (!anim) {
      done();
      return;
    }
    anim.addEventListener("finish", done);
    anim.addEventListener("cancel", done);
  } catch {
    done();
  }
}

function clearDragPicks() {
  if (!dragPickIds.size) return;
  dragPickIds.clear();
  document.querySelectorAll(".question-item.drag-picked").forEach(node => node.classList.remove("drag-picked"));
}

function toggleDragPick(qId) {
  if (!qId) return;
  if (dragPickIds.has(qId)) dragPickIds.delete(qId);
  else dragPickIds.add(qId);
  document.querySelector(`.question-item[data-q="${qId}"]`)?.classList.toggle("drag-picked", dragPickIds.has(qId));
}

function getDragPayloadQuestionIds(primaryQId) {
  if (primaryQId && dragPickIds.has(primaryQId) && dragPickIds.size > 1) {
    return [...dragPickIds];
  }
  return primaryQId ? [primaryQId] : [];
}

function destroyQuestionDragGhost() {
  questionDragGhost?.remove();
  questionDragGhost = null;
}

function createQuestionDragGhost(qIds, label = "") {
  destroyQuestionDragGhost();
  const tab = getActiveTab();
  const first = tab?.questions.find(item => item.id === qIds[0]);
  const ghost = document.createElement("div");
  ghost.className = "question-drag-ghost";
  if (label && qIds.length > 1) {
    ghost.innerHTML = `<strong>${escapeHtml(label)}</strong><span>整组拖入 ${qIds.length} 题</span>`;
  } else if (qIds.length > 1) {
    ghost.innerHTML = `<strong>拖入 ${qIds.length} 题</strong><span>到左侧已选题目</span>`;
  } else {
    ghost.innerHTML = `<strong>第 ${first?.num || ""} 题</strong><span>拖到左侧已选题目</span>`;
  }
  document.body.appendChild(ghost);
  questionDragGhost = ghost;
  return ghost;
}

function setQuestionDropTargetActive(active) {
  document.querySelector("#aiSelectedPanel")?.classList.toggle("is-drop-target", active);
  document.body.classList.toggle("is-question-dragging", questionDragActive);
}

function startQuestionDrag(event, qIds, options = {}) {
  const ids = [...new Set((qIds || []).map(String).filter(Boolean))];
  if (!ids.length) {
    event.preventDefault();
    return false;
  }
  questionDragActive = true;
  const payload = JSON.stringify({ qIds: ids, section: options.section || "" });
  event.dataTransfer.effectAllowed = "copy";
  event.dataTransfer.setData(QUESTION_DRAG_MIME, payload);
  event.dataTransfer.setData("text/plain", payload);
  const ghost = createQuestionDragGhost(ids, options.label || "");
  event.dataTransfer.setDragImage(ghost, 24, 18);
  ids.forEach(id => document.querySelector(`.question-item[data-q="${id}"]`)?.classList.add("is-drag-group"));
  if (options.sourceEl) options.sourceEl.classList.add("is-dragging");
  setQuestionDropTargetActive(true);
  return true;
}

function endQuestionDrag() {
  questionDragActive = false;
  destroyQuestionDragGhost();
  setQuestionDropTargetActive(false);
  document.querySelectorAll(".question-item.is-dragging, .question-item.is-drag-group, .question-section-head.is-dragging").forEach(node => {
    node.classList.remove("is-dragging", "is-drag-group");
  });
  if (isCanvasManuallyCollapsed()) {
    rightPanelSectionState.selectedCollapsed = true;
    applySelectedPanelState();
  }
}

function addQuestionsToSelected(qIds, options = {}) {
  const tab = getActiveTab();
  if (!tab || !Array.isArray(qIds) || !qIds.length) return 0;
  const wasEmpty = !getGlobalSelectedQuestions().length;
  const snapshot = options.animate === false ? null : snapshotQuestionEnterSource(options.sourceEl);
  let added = 0;
  let lastEntry = null;
  qIds.forEach(qId => {
    const q = tab.questions.find(item => item.id === qId);
    if (!q) return;
    if (isQuestionGloballySelected(tab.topicId, qId)) return;
    if (!workspace.canvasTitle) workspace.canvasTitle = formatQuestionListTitle();
    lastEntry = buildGlobalSelectedEntry(tab, q);
    workspace.globalSelectedQuestions.push(lastEntry);
    added += 1;
  });
  if (!added) return 0;
  syncTabSelectedQuestionIds(tab);
  saveWorkspace();
  clearDragPicks();
  maybeOpenCanvasOnFirstAdd(wasEmpty);
  renderQuestionCards();
  if (snapshot && added === 1 && lastEntry) {
    playQuestionEnterCanvas(snapshot, { qId: lastEntry.question.id, selectionKey: lastEntry.selectionKey });
  }
  return added;
}

function addQuestionToSelected(qId, options = {}) {
  const added = addQuestionsToSelected([qId], options);
  const q = getActiveTab()?.questions.find(item => item.id === qId);
  if (!added) {
    showToast(`第 ${q?.num || ""} 题已在画布中`);
    return;
  }
  showToast(`已选用第 ${q?.num || ""} 题`);
}

function bindQuestionDragEvents() {
  document.querySelectorAll(".question-item[draggable='true']").forEach(card => {
    card.addEventListener("dragstart", event => {
      if (event.target.closest("button, a, input, textarea, [data-card-action]")) {
        event.preventDefault();
        return;
      }
      const qId = card.dataset.q;
      const qIds = getDragPayloadQuestionIds(qId);
      startQuestionDrag(event, qIds, { sourceEl: card });
    });
    card.addEventListener("dragend", endQuestionDrag);
  });

  document.querySelectorAll(".question-section-head[draggable='true']").forEach(head => {
    head.addEventListener("dragstart", event => {
      if (event.target.closest("[data-section-action]")) {
        event.preventDefault();
        return;
      }
      const qIds = String(head.dataset.qIds || "").split(",").filter(Boolean);
      const section = head.dataset.section || "本模块";
      startQuestionDrag(event, qIds, {
        sourceEl: head,
        section,
        label: section
      });
      head.closest(".question-section")?.classList.add("is-section-dragging");
    });
    head.addEventListener("dragend", () => {
      document.querySelectorAll(".question-section.is-section-dragging").forEach(node => {
        node.classList.remove("is-section-dragging");
      });
      endQuestionDrag();
    });
  });
}

function bindSelectedDropZone() {
  const panel = document.querySelector("#aiSelectedPanel");
  if (!panel || panel.dataset.dropBound === "1") return;
  panel.dataset.dropBound = "1";

  const onDragOver = event => {
    if ([...event.dataTransfer.types].includes(CANVAS_DRAG_MIME)) return;
    if (!questionDragActive && ![...event.dataTransfer.types].includes(QUESTION_DRAG_MIME) && ![...event.dataTransfer.types].includes("text/plain")) {
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    panel.classList.add("is-drag-over");
  };

  const onDragLeave = event => {
    if (panel.contains(event.relatedTarget)) return;
    panel.classList.remove("is-drag-over");
  };

  const onDrop = event => {
    if ([...event.dataTransfer.types].includes(CANVAS_DRAG_MIME) || canvasDragKey) return;
    event.preventDefault();
    panel.classList.remove("is-drag-over");
    let qIds = [];
    let section = "";
    try {
      const raw = event.dataTransfer.getData(QUESTION_DRAG_MIME) || event.dataTransfer.getData("text/plain");
      const parsed = JSON.parse(raw || "{}");
      qIds = Array.isArray(parsed.qIds) ? parsed.qIds.map(String) : [];
      section = String(parsed.section || "");
    } catch {
      qIds = [];
    }
    if (!qIds.length) return;
    const added = addQuestionsToSelected(qIds);
    if (!added) showToast("这些题目已在已选题目中");
    else if (section) showToast(`已拖入「${section}」${added} 题到已选题目`);
    else showToast(added === 1 ? "已拖入 1 题到已选题目" : `已拖入 ${added} 题到已选题目`);
  };

  panel.addEventListener("dragenter", onDragOver);
  panel.addEventListener("dragover", onDragOver);
  panel.addEventListener("dragleave", onDragLeave);
  panel.addEventListener("drop", onDrop);
}

function restoreSkippedQuestion(qId, options = {}) {
  const tab = getActiveTab();
  if (!tab) return false;
  const index = tab.removedQuestionIds.indexOf(qId);
  if (index < 0) return false;
  tab.removedQuestionIds.splice(index, 1);
  if (!options.silent) {
    saveWorkspace();
    renderQuestionCards();
  }
  return true;
}

function togglePaperCopyQuestion(qId) {
  const tab = getActiveTab();
  if (!tab) return;
  const q = tab.questions.find(item => item.id === qId);
  if (!q) return;
  const removed = tab.removedQuestionIds.includes(qId);
  if (removed) {
    restoreSkippedQuestion(qId, { silent: true });
    saveWorkspace();
    renderQuestionCards();
    showToast(tab.isQuestionList ? `第 ${q.num} 题已恢复到题单` : `第 ${q.num} 题已恢复到本卷副本`);
    return;
  }
  tab.removedQuestionIds.push(qId);
  saveWorkspace();
  renderQuestionCards();
  showToast(tab.isQuestionList
    ? `第 ${q.num} 题已从题单移除`
    : `第 ${q.num} 题已从本卷副本移除，原卷和左侧画布不受影响`);
}

function toggleSelectWholePaper() {
  const tab = getActiveTab();
  if (!tab) return;
  const selectable = getSelectableQuestions(tab);
  if (!selectable.length) {
    showToast("当前本卷没有可加入的题目");
    return;
  }
  const added = addQuestionsToSelected(selectable.map(q => q.id));
  showToast(added ? `已将 ${added} 题加入画布` : "当前本卷内容已全部在画布中");
}

function batchAddAllQuestionsToSelected() {
  toggleSelectWholePaper();
}

function removeQuestionFromSelected(qId) {
  const tab = getActiveTab();
  if (!tab) return;
  removeGlobalSelectedByKey(getQuestionSelectionKey(tab.topicId, qId));
  const q = tab.questions.find(item => item.id === qId);
  showToast(`第 ${q?.num || ""} 题已移出已选题目`);
}

function toggleQuestionSelection(qId, force, options = {}) {
  const tab = getActiveTab();
  if (!tab) return;
  const q = tab.questions.find(item => item.id === qId);
  if (!q) return;
  const key = getQuestionSelectionKey(tab.topicId, qId);
  const has = isQuestionGloballySelected(tab.topicId, qId);
  const next = typeof force === "boolean" ? force : !has;
  if (next && !has) {
    const wasEmpty = !getGlobalSelectedQuestions().length;
    const snapshot = snapshotQuestionEnterSource(options.sourceEl);
    if (!workspace.canvasTitle) workspace.canvasTitle = formatQuestionListTitle();
    workspace.globalSelectedQuestions.push(buildGlobalSelectedEntry(tab, q));
    syncTabSelectedQuestionIds(tab);
    saveWorkspace();
    maybeOpenCanvasOnFirstAdd(wasEmpty);
    renderQuestionCards();
    playQuestionEnterCanvas(snapshot, { qId, selectionKey: key });
    showToast(`第 ${q.num} 题已加入画布`);
    return;
  }
  if (!next) {
    workspace.globalSelectedQuestions = getGlobalSelectedQuestions().filter(item => item.selectionKey !== key);
  }
  syncTabSelectedQuestionIds(tab);
  saveWorkspace();
  renderQuestionCards();
  collapseCanvasIfEmpty();
  showToast(`第 ${q.num} 题已移出画布`);
}

function addToBasket(qId) {
  basketCount += 1;
  workspace.basketCount = basketCount;
  saveWorkspace();
  const q = getActiveTab()?.questions.find(item => item.id === qId);
  showToast(`第 ${q?.num || ""} 题已加入组卷（${basketCount}）`);
}

function toggleShowAnswers() {
  workspace.showAnswers = !workspace.showAnswers;
  saveWorkspace();
  const btn = document.querySelector("#toggleShowAnswer");
  if (btn) {
    btn.innerHTML = workspace.showAnswers
      ? '<i class="ri-eye-off-line"></i><span>隐藏答案</span>'
      : '<i class="ri-eye-line"></i><span>显示答案</span>';
  }
  renderQuestionCards();
}

function isHomeViewActive() {
  return false;
}

function isBrowseViewActive() {
  return false;
}

function isShellFrameActive() {
  return false;
}

function getBrowseMeta(filter) {
  return BROWSE_FILTER_META[filter] || null;
}

function ensureBrowseTabs() {
  if (!Array.isArray(workspace.browseTabs)) workspace.browseTabs = [];
  workspace.browseTabs = workspace.browseTabs.filter(filter => getBrowseMeta(filter));
  if (workspace.activeBrowseFilter && !getBrowseMeta(workspace.activeBrowseFilter)) {
    workspace.activeBrowseFilter = null;
  }
}

let pendingBrowseOrigin = "";

function syncHomeFrameFilter(filter, options = {}) {
  const frame = document.querySelector("#homeFrame");
  if (!frame?.contentWindow || frame.dataset.loaded !== "1") return;
  const payload = { type: "aiq-set-filter", filter: filter || "all" };
  const origin = options.origin || pendingBrowseOrigin || frame.dataset.origin || "";
  if (origin) payload.origin = origin;
  frame.dataset.origin = origin;
  if (!origin) delete frame.dataset.origin;
  pendingBrowseOrigin = "";
  frame.contentWindow.postMessage(payload, "*");
}

// 首页 / 分类浏览共用 iframe；分类 tab 紧挨在「首页」后
function applyHomeView() {
  const root = document.querySelector("#aiWorkspace");
  const homeView = document.querySelector("#homeView");
  root?.classList.remove("home-view");
  if (homeView) homeView.hidden = true;
  applyResponsiveChrome();
}

function setHomeView(active) {
  const next = Boolean(active);
  if (next) {
    workspace.homeActive = true;
    workspace.activeBrowseFilter = null;
  } else if (workspace.homeActive) {
    workspace.homeActive = false;
  } else {
    applyHomeView();
    return;
  }
  saveWorkspace();
  if (!next && !isBrowseViewActive()) syncPageChromeForTab(getActiveTab());
  renderAll();
}

function openBrowseTab(filter, options = {}) {
  const meta = getBrowseMeta(filter);
  if (!meta) return;
  ensureBrowseTabs();
  if (!workspace.browseTabs.includes(filter)) workspace.browseTabs.push(filter);
  workspace.homeActive = false;
  workspace.activeBrowseFilter = filter;
  pendingBrowseOrigin = options.origin || "";
  saveWorkspace();
  renderAll();
  showToast(`已打开「${meta.label}」`);
}

function closeBrowseTab(filter) {
  ensureBrowseTabs();
  workspace.browseTabs = workspace.browseTabs.filter(item => item !== filter);
  if (workspace.activeBrowseFilter === filter) {
    workspace.activeBrowseFilter = null;
    workspace.homeActive = true;
  }
  saveWorkspace();
  renderAll();
}

function setBrowseView(filter) {
  if (!getBrowseMeta(filter)) return;
  ensureBrowseTabs();
  if (!workspace.browseTabs.includes(filter)) workspace.browseTabs.push(filter);
  workspace.homeActive = false;
  workspace.activeBrowseFilter = filter;
  saveWorkspace();
  renderAll();
}

function bindHomeFrameBridge() {
  window.addEventListener("message", event => {
    const frame = document.querySelector("#homeFrame");
    if (!frame || event.source !== frame.contentWindow) return;
    const data = event.data;
    if (!data || typeof data !== "object") return;

    if (data.type === "aiq-open-filter") {
      openBrowseTab(String(data.filter || ""), { origin: data.origin || "" });
      return;
    }

    if (data.type !== "aiq-open-topic") return;

    const topicId = getBaseTopicId(String(data.topicId || ""));
    if (!topicId) return;

    const query = new URLSearchParams(data.query || "");
    const title = String(data.title || query.get("title") || "").trim();
    const shortTitle = String(data.shortTitle || query.get("shortTitle") || title).trim();
    const tabContext = String(data.context || query.get("context") || "paper");
    const lessonKey = String(data.lessonKey || query.get("lessonKey") || title || topicId);

    openTab(topicId, {
      context: tabContext,
      title: title || undefined,
      shortTitle: shortTitle || undefined,
      lessonKey,
      source: query.get("source") || undefined,
      difficulty: query.get("difficulty") || undefined,
      reason: query.get("reason") || undefined,
      focus: query.get("focus") || undefined,
      questionCount: query.get("questions") || undefined,
      usage: query.get("usage") || undefined
    });
  });
}

function renderTabs() {
  const bar = document.querySelector("#docTabs");
  if (bar) bar.hidden = true;
}

function buildDetailPageUrl(topicId, options = {}) {
  const qs = new URLSearchParams({
    topic: getBaseTopicId(topicId),
    context: options.context || contextName
  });
  if (options.tabId) qs.set("tabId", options.tabId);
  if (options.title) qs.set("title", options.title);
  if (options.shortTitle) qs.set("shortTitle", options.shortTitle);
  if (options.lessonKey) qs.set("lessonKey", options.lessonKey);
  if (options.focus) qs.set("focus", options.focus);
  if (options.reason) qs.set("reason", options.reason);
  if (options.source) qs.set("source", options.source);
  if (options.difficulty) qs.set("difficulty", options.difficulty);
  if (options.questionCount) qs.set("questions", String(options.questionCount));
  if (options.usage) qs.set("usage", String(options.usage));
  return `./detail-ai.html?${qs.toString()}`;
}

function openDetailPage(url) {
  const opened = window.open(url, "_blank");
  if (opened) {
    opened.opener = null;
    return;
  }
  location.href = url;
}

function switchTab(tabId) {
  const tab = workspace.tabs.find(item => item.id === tabId);
  if (!tab) return;
  if (tab.isQuestionList) {
    openDetailPage(`./detail-ai.html?tabId=${encodeURIComponent(tab.id)}&context=${encodeURIComponent(tab.context || contextName)}`);
    return;
  }
  openDetailPage(buildDetailPageUrl(tab.topicId, {
    context: tab.context,
    title: tab.title,
    shortTitle: tab.shortTitle,
    lessonKey: tab.lessonKey
  }));
}

function syncPageChromeForTab(tab) {
  const favoriteLabel = document.querySelector("#favoritePaperLabel");
  if (!tab || !favoriteLabel) return;
  favoriteLabel.textContent = "收藏整卷";
}

function closeTab(tabId) {
  if (workspace.tabs.length === 1) return showToast("至少保留一个试卷标签页");
  const index = workspace.tabs.findIndex(tab => tab.id === tabId);
  workspace.tabs.splice(index, 1);
  if (workspace.activeTabId === tabId) workspace.activeTabId = workspace.tabs[Math.max(0, index - 1)].id;
  saveWorkspace();
  renderAll();
}

function openTab(topicId, options = {}) {
  const baseId = getBaseTopicId(topicId);
  const tabContext = options.context || contextName;
  const currentTopic = getBaseTopicId(params.get("topic") || "");
  if (!isHomeShell && !params.get("tabId") && currentTopic === baseId && contextName === tabContext) {
    return getActiveTab();
  }
  openDetailPage(buildDetailPageUrl(baseId, {
    context: tabContext,
    title: options.title,
    shortTitle: options.shortTitle,
    lessonKey: options.lessonKey,
    source: options.source,
    difficulty: options.difficulty,
    reason: options.reason,
    focus: options.focus,
    questionCount: options.questionCount,
    usage: options.usage
  }));
}

// 标签页无限增长会让标题被挤成一串省略号，超出上限时回收最早打开且未激活的一个
function pruneOverflowTabs() {
  while (workspace.tabs.length > MAX_OPEN_TABS) {
    const index = workspace.tabs.findIndex(tab =>
      tab.id !== workspace.activeTabId
      && !tab.isQuestionList
      && !tab.fromQuestionId
      && !workspace.tabs.some(child => child.fromTabId === tab.id)
    );
    if (index < 0) return;
    workspace.tabs.splice(index, 1);
  }
}

function openPaperPicker() {
  const currentId = getBaseTopicId(getActiveTab()?.topicId);
  if (isWorkbook) {
    const nextId = ["t9", "t7", "t19"].find(id => id !== currentId) || "t9";
    openTab(nextId);
    return;
  }
  const nextId = ["t14", "t25", "t2"].find(id => id !== currentId) || "t14";
  openTab(nextId);
}

function deleteQuestionById(qId) {
  const tab = getActiveTab();
  if (!tab) return;
  const q = tab.questions.find(item => item.id === qId);
  if (!q || tab.removedQuestionIds.includes(qId)) return;
  tab.removedQuestionIds.push(qId);
  removeGlobalSelectedByKey(getQuestionSelectionKey(tab.topicId, qId));
  saveWorkspace();
  renderQuestionCards();
  showToast(`已删除第 ${q.num} 题`);
}

function insertQuestionAfter(qId) {
  const tab = getActiveTab();
  if (!tab) return;
  const idx = tab.questions.findIndex(item => item.id === qId);
  if (idx < 0) return;
  const ref = tab.questions[idx];
  const newQ = {
    id: `new-${Date.now()}`,
    num: ref.num + 1,
    section: ref.section,
    type: ref.type,
    difficulty: ref.difficulty || "中等",
    knowledge: ref.knowledge || "待补充",
    minutes: ref.minutes || 2,
    competency: ref.competency || "运算能力",
    badges: [],
    stem: "（新增）请在此补充题目内容。",
    options: ref.type === "选择题" ? ["A. 待补充", "B. 待补充", "C. 待补充", "D. 待补充"] : [],
    answer: "待补充",
    analysis: "待补充"
  };
  tab.questions.splice(idx + 1, 0, newQ);
  tab.questions.forEach((item, i) => { item.num = i + 1; });
  saveWorkspace();
  renderQuestionCards();
  showToast(`已在第 ${ref.num} 题后新增加题`);
}

function clearSelectedQuestionsState(options = {}) {
  const { collapsePanel = true } = options;
  workspace.globalSelectedQuestions = [];
  workspace.canvasTitle = "";
  selectedPreviewTypeFilter = null;
  canvasFocusKey = null;
  clearDragPicks();
  workspace.tabs.forEach(tab => {
    tab.selectedQuestionIds = [];
  });
  if (selectedPanelEnlarged) setSelectedPanelEnlarged(false);
  if (collapsePanel) {
    collapseSelectedPanel({ manual: false });
  }
}

function openClearCanvasModal() {
  if (!getGlobalSelectedQuestions().length) return;
  const modal = document.querySelector("#clearCanvasModal");
  if (modal) modal.hidden = false;
}

function closeClearCanvasModal() {
  const modal = document.querySelector("#clearCanvasModal");
  if (modal) modal.hidden = true;
}

function clearAllSelectedQuestions() {
  closeClearCanvasModal();
  clearSelectedQuestionsState();
  saveWorkspace();
  renderQuestionCards();
  showToast("已清空组题画布");
}

function toggleQuestionAnalysis(qId) {
  if (expandedAnalysisIds.has(qId)) expandedAnalysisIds.delete(qId);
  else expandedAnalysisIds.add(qId);
  renderQuestionCards();
}

function bindQuestionCardEvents() {
  document.querySelectorAll("#questionCardBoard .question-item").forEach(card => {
    card.addEventListener("click", event => {
      if (event.target.closest("[data-card-action], .q-card-actions, .q-num-mark")) return;
      if (window.getSelection()?.toString()) return;
      if (event.shiftKey || event.metaKey || event.ctrlKey) {
        event.preventDefault();
        toggleDragPick(card.dataset.q);
        return;
      }
      if (card.classList.contains("is-skipped")) return;
    });
  });

  document.querySelectorAll("#questionCardBoard [data-card-action]").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      button.closest("details")?.removeAttribute("open");
      const qId = button.dataset.q;
      const action = button.dataset.cardAction;
      const q = getActiveTab()?.questions.find(item => item.id === qId);

      if (action === "fix") showToast(`已记录第 ${q?.num} 题的纠错反馈，教研会尽快核对`);
      if (action === "favorite") {
        const added = toggleQuestionFavorite(qId);
        showToast(added ? `已收藏第 ${q?.num} 题` : `已取消收藏第 ${q?.num} 题`);
      }
      if (action === "similar") showToast(`正在查找第 ${q?.num} 题的相似题…`);
      if (action === "paper-copy-remove") togglePaperCopyQuestion(qId);
      if (action === "select") toggleQuestionSelection(qId, undefined, { sourceEl: button.closest(".question-item") || button });
      if (action === "add-selected") addQuestionToSelected(qId, { sourceEl: button.closest(".question-item") || button });
      if (action === "remove-selected") removeQuestionFromSelected(qId);
      if (action === "analysis") toggleQuestionAnalysis(qId);
    });
  });

  bindQuestionDragEvents();
}

function renderAll() {
  renderQuestionCards();
  renderTabs();
  renderMyResources();
  const favBtn = document.querySelector("#favoritePaper");
  if (favBtn && workspace.paperFavorited) {
    favBtn.classList.add("saved");
    favBtn.innerHTML = favoriteResourceLabel(true);
  }
  syncPageChromeForTab(getActiveTab());
  const ansBtn = document.querySelector("#toggleShowAnswer");
  if (ansBtn && workspace.showAnswers) {
    ansBtn.innerHTML = '<i class="ri-eye-off-line"></i><span>隐藏答案</span>';
  }
  applyHomeView();
}

function bindEvents() {
  document.querySelector("#createQuestionList")?.addEventListener("click", openSelectedAsQuestionList);
  document.querySelector("#savePaperCopy")?.addEventListener("click", savePaperCopyAsQuestionList);
  document.querySelector("#previewQuestionList")?.addEventListener("click", previewCanvas);
  document.querySelector("#scoreQuestionList")?.addEventListener("click", () => {
    if (!getGlobalSelectedQuestions().length) return;
    showToast("赋分功能即将开放");
  });
  document.querySelectorAll(".ai-selected-footer [data-canvas-action]").forEach(button => {
    button.addEventListener("click", () => handleCanvasFooterAction(button.dataset.canvasAction));
  });
  document.querySelectorAll("[data-print-preview-close]").forEach(node => {
    node.addEventListener("click", closePrintPreview);
  });
  document.querySelector("#canvasPrintConfirm")?.addEventListener("click", printCanvasPreview);

  document.querySelector("#clearSelectedQuestions")?.addEventListener("click", event => {
    event.stopPropagation();
    openClearCanvasModal();
  });
  document.querySelectorAll("[data-clear-canvas-close]").forEach(node => {
    node.addEventListener("click", closeClearCanvasModal);
  });
  document.querySelector("#confirmClearCanvas")?.addEventListener("click", clearAllSelectedQuestions);

  document.querySelector("#batchAddAllQuestions")?.addEventListener("click", batchAddAllQuestionsToSelected);

  const paperMoreButton = document.querySelector("#paperMoreActions");
  const paperMoreMenu = document.querySelector("#paperMoreMenu");
  const setPaperMoreOpen = open => {
    if (!paperMoreButton || !paperMoreMenu) return;
    paperMoreMenu.hidden = !open;
    paperMoreButton.setAttribute("aria-expanded", String(open));
  };
  paperMoreButton?.addEventListener("click", event => {
    event.stopPropagation();
    setPaperMoreOpen(paperMoreMenu?.hidden !== false);
  });
  paperMoreMenu?.addEventListener("click", () => setPaperMoreOpen(false));

  document.querySelector("#toggleShowAnswer")?.addEventListener("click", toggleShowAnswers);

  document.querySelector("#favoritePaper")?.addEventListener("click", event => {
    workspace.paperFavorited = !workspace.paperFavorited;
    saveWorkspace();
    const btn = event.currentTarget;
    btn.classList.toggle("saved", workspace.paperFavorited);
    btn.innerHTML = workspace.paperFavorited
      ? favoriteResourceLabel(true)
      : favoriteResourceLabel(false);
    showToast(workspace.paperFavorited ? "已收藏" : "已取消收藏");
  });

  document.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (action === "download") showToast("正在生成可打印文件…");
    });
  });

  document.querySelector("#panelMask")?.addEventListener("click", closeMobileDrawers);

  document.addEventListener("click", event => {
    if (!event.target.closest(".paper-action-more")) setPaperMoreOpen(false);
    document.querySelectorAll("#questionCardBoard .q-more-actions[open]").forEach(menu => {
      if (!menu.contains(event.target)) menu.removeAttribute("open");
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      clearDragPicks();
      closeAiCreateModal();
      closeClearCanvasModal();
      closePrintPreview();
      closeAiAssistant();
      closeMyResources();
      closeMobileDrawers();
      setPaperMoreOpen(false);
      document.querySelectorAll("#questionCardBoard .q-more-actions[open]").forEach(menu => menu.removeAttribute("open"));
      return;
    }
  });

  bindSelectedDropZone();

  const handleLayoutChange = () => applyResponsiveChrome();
  if (typeof mobileLayoutQuery.addEventListener === "function") {
    mobileLayoutQuery.addEventListener("change", handleLayoutChange);
  } else {
    mobileLayoutQuery.addListener(handleLayoutChange);
  }
}

if (isHomeShell) {
  bindEvents();
  bindSelectedPanelControls();
  bindAiCreateControls();
  renderSelectedContext();
  bindCanvasSync();
} else {
  applyPageMode();
  ensureInitialTab();
  if (isRecordMode) applyRecordMode();
  renderAll();
  bindEvents();
  bindPaperTitleEditor();
  bindSelectedPanelControls();
  bindAiAssistantControls();
  bindMyResourcesControls();
  bindComposeControls();
  bindRecordControls();
  bindAiCreateControls();
  bindDirectoryEvents();
  bindCanvasSync();
}
showPendingToast();

function toggleExternalCanvasQuestion(item) {
  ensureGlobalSelected();
  const key = item?.selectionKey;
  if (!key) return false;
  const has = getGlobalSelectedQuestions().some(entry => entry.selectionKey === key);
  if (has) {
    workspace.globalSelectedQuestions = getGlobalSelectedQuestions().filter(entry => entry.selectionKey !== key);
    saveWorkspace();
    renderSelectedContext();
    collapseCanvasIfEmpty();
    return false;
  }
  if (!workspace.canvasTitle) workspace.canvasTitle = formatQuestionListTitle();
  const wasEmpty = !getGlobalSelectedQuestions().length;
  workspace.globalSelectedQuestions.push(item);
  saveWorkspace();
  maybeOpenCanvasOnFirstAdd(wasEmpty);
  renderSelectedContext();
  return true;
}

window.AiqCanvas = {
  toggleQuestion: toggleExternalCanvasQuestion,
  expand: expandSelectedPanel,
  collapse(manual = true) {
    if (selectedPanelEnlarged) {
      setSelectedPanelEnlarged(false);
      return;
    }
    collapseSelectedPanel({ manual });
  },
  has(key) {
    return getGlobalSelectedQuestions().some(entry => entry.selectionKey === key);
  },
  keys() {
    return getGlobalSelectedQuestions().map(entry => entry.selectionKey);
  }
};
window.dispatchEvent(new Event("aiq-canvas-ready"));
})();
