const chapters = [
  { id: "ch1", title: "第一章 有理数", count: 8, children: ["1.1 正数和负数", "1.2 有理数及其大小比较"] },
  { id: "ch2", title: "第二章 有理数的运算", count: 7, children: ["2.1 有理数的加减法", "2.2 有理数的乘除法"] },
  { id: "ch3", title: "第三章 代数式", count: 6, children: ["3.1 用字母表示数", "3.2 代数式"] },
  { id: "ch4", title: "第四章 整式的加减", count: 5, children: ["4.1 整式", "4.2 整式的加减"] },
  { id: "ch5", title: "第五章 一元一次方程", count: 4, children: ["5.1 从算式到方程", "5.2 解一元一次方程"] },
  { id: "ch6", title: "第六章 几何图形初步", count: 3, children: ["6.1 几何图形", "6.2 直线、射线、线段"] }
];

const knowledgeTree = [
  {
    title: "数与代数",
    items: [
      { id: "topic-expr", title: "数与式", knowledgeIds: ["k1", "k2"] },
      { id: "topic-eq", title: "方程与不等式", knowledgeIds: ["k3", "k5"] },
      { id: "topic-fn", title: "函数", knowledgeIds: [] }
    ]
  },
  {
    title: "图形与几何",
    items: [{ id: "topic-geo", title: "图形与几何", knowledgeIds: ["k6"] }]
  },
  {
    title: "统计与概率",
    items: [{ id: "topic-stat", title: "统计与概率", knowledgeIds: ["k4"] }]
  },
  {
    title: "综合与实践",
    items: [{ id: "topic-practice", title: "综合与实践", knowledgeIds: ["k5"] }]
  }
];

const knowledgeNavMap = Object.fromEntries(
  knowledgeTree.flatMap(group => group.items.map(item => [item.id, item.knowledgeIds]))
);

const knowledgePoints = [
  { id: "k1", title: "正负数的意义", meta: "数与式", count: 4 },
  { id: "k2", title: "有理数的大小比较", meta: "数与式", count: 4 },
  { id: "k3", title: "有理数的加减运算", meta: "方程与不等式", count: 5 },
  { id: "k4", title: "整式的加减", meta: "统计与概率", count: 5 },
  { id: "k5", title: "一元一次方程", meta: "综合与实践", count: 4 },
  { id: "k6", title: "几何图形的认识", meta: "图形与几何", count: 3 }
];

const questions = [
  { id: "q1", chapter: "ch1", knowledge: "k1", source: "真题汇编", sourceDetail: "2026·北京东城区·七年级上期末", citation: 2, type: "填空题", difficulty: "中等", minutes: 1, title: "若一个角的补角等于它的余角的3倍，则这个角的度数为______。", skill: "余角和补角的计算", ability: "几何直观、运算能力", tone: "amber", updated: 6, tags: ["AI批改", "AI赋分"] },
  { id: "q2", chapter: "ch1", knowledge: "k2", source: "教材同步", sourceDetail: "26-27·七年级上全品作业本", citation: 3, type: "单项选择题", difficulty: "较易", minutes: 1, title: "下列各组有理数的大小关系中，正确的是（　　）\nA. 1＜−2　　　　 B. −3＜4　　　　 C. −5＜−6　　　　 D. 0＜−1", skill: "有理数直接比较大小", ability: "抽象能力", tone: "green", updated: 5, tags: ["创新题", "AI批改", "AI赋分"] },
  { id: "q3", chapter: "ch1", knowledge: "k2", source: "校本题库", sourceDetail: "望京实验学校·七（2）班错题重组", citation: 1, type: "解答题", difficulty: "中等", minutes: 4, title: "在数轴上表示数−3、0、2.5、−1/2，并按从小到大的顺序排列。", skill: "数轴与有理数大小比较", ability: "数形结合", tone: "blue", updated: 4, tags: ["班级错题"] },
  { id: "q4", chapter: "ch2", knowledge: "k3", source: "教材同步", sourceDetail: "人教版七年级上册·第二章", citation: 2, type: "单项选择题", difficulty: "简单", minutes: 1, title: "计算：−8＋3−(−5)的结果是（　　）", skill: "有理数加减法则", ability: "运算能力", tone: "green", updated: 3, tags: ["AI批改", "AI赋分"] },
  { id: "q5", chapter: "ch2", knowledge: "k3", source: "校本题库", sourceDetail: "七（1）班周末分层作业", citation: 1, type: "填空题", difficulty: "中等", minutes: 2, title: "若|a|=3，则a的值为______。", skill: "绝对值的意义", ability: "概念理解", tone: "violet", updated: 2, tags: ["高频错题"] },
  { id: "q6", chapter: "ch3", knowledge: "k4", source: "教材同步", sourceDetail: "人教版七年级上册·第三章", citation: 2, type: "解答题", difficulty: "中等", minutes: 4, title: "先化简，再求值：2(3x−1)−(x＋2)，其中x=−1。", skill: "整式化简与求值", ability: "符号运算", tone: "amber", updated: 1, tags: ["AI批改"] },
  { id: "q7", chapter: "ch4", knowledge: "k4", source: "真题汇编", sourceDetail: "2025·北京中考模拟题", citation: 3, type: "单项选择题", difficulty: "较难", minutes: 2, title: "若单项式−2x²y与3xᵐyⁿ是同类项，则m＋n的值为（　　）", skill: "同类项辨析", ability: "代数推理", tone: "blue", updated: 7, tags: ["创新题"] },
  { id: "q8", chapter: "ch5", knowledge: "k5", source: "校本题库", sourceDetail: "七（3）班高频失分题", citation: 2, type: "解答题", difficulty: "中等", minutes: 4, title: "解方程：3x−7=2x＋5，并写出检验过程。", skill: "一元一次方程的解法", ability: "规范表达", tone: "green", updated: 8, tags: ["班级错题", "AI赋分"] },
  { id: "q9", chapter: "ch6", knowledge: "k6", source: "教材同步", sourceDetail: "人教版七年级上册·第六章", citation: 1, type: "填空题", difficulty: "简单", minutes: 1, title: "经过两点有且只有______条直线。", skill: "直线的基本性质", ability: "空间观念", tone: "violet", updated: 9, tags: ["AI批改"] }
];

let sideView = "chapters";
let activeNav = "all";
let sortMode = "recommended";
const selectedQuestions = new Set();
const savedQuestions = new Set();

const bankNav = document.querySelector("#bankNav");
const questionList = document.querySelector("#questionList");
const questionEmpty = document.querySelector("#questionEmpty");
const questionCount = document.querySelector("#questionCount");
const bankNavCount = document.querySelector("#bankNavCount");
const bankSideSearchWrap = document.querySelector("#bankSideSearchWrap");
const scopePicker = document.querySelector("#scopePicker");
const toast = document.querySelector("#schoolToast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1600);
}

function renderBankNav() {
  const sideKeyword = document.querySelector("#bankSideSearch")?.value.trim().toLowerCase() || "";
  bankSideSearchWrap.hidden = sideView === "chapters";
  scopePicker.hidden = sideView === "knowledge";

  if (sideView === "chapters") {
    bankNav.innerHTML = `<button class="bank-nav-all ${activeNav === "all" ? "active" : ""}" type="button" data-nav-id="all"><i class="ri-folder-3-line"></i><span>全部资源</span><small>${questions.length} 题</small></button>${chapters.map(chapter => `<div class="chapter-group"><button class="chapter-nav ${activeNav === chapter.id ? "active" : ""}" type="button" data-nav-id="${chapter.id}"><i class="ri-arrow-right-s-line"></i><b>${chapter.title}</b><small>${chapter.count}</small></button><div class="chapter-children">${chapter.children.map(child => `<span>${child}</span>`).join("")}</div></div>`).join("")}`;
  } else {
    bankNav.innerHTML = `<button class="bank-nav-all ${activeNav === "all" ? "active" : ""}" type="button" data-nav-id="all"><i class="ri-folder-3-line"></i><span>全部资源</span><small>${questions.length} 题</small></button>${knowledgeTree.map(group => {
      const items = group.items.filter(item => !sideKeyword || `${group.title}${item.title}`.toLowerCase().includes(sideKeyword));
      if (!items.length) return "";
      return `<div class="knowledge-tree-group"><div class="knowledge-tree-title">${group.title}</div>${items.map(item => `<button class="knowledge-nav-item ${activeNav === item.id ? "active" : ""}" type="button" data-nav-id="${item.id}"><i class="ri-checkbox-blank-circle-fill"></i><b>${item.title}</b></button>`).join("")}</div>`;
    }).join("")}`;
  }
  bankNavCount.textContent = `${questions.length} 题`;
}

function schoolSelectionKey(id) {
  return `school::${id}`;
}

function isQuestionSelected(id) {
  return window.AiqCanvas?.has(schoolSelectionKey(id)) || selectedQuestions.has(id);
}

function toCanvasQuestion(question) {
  const index = questions.findIndex(item => item.id === question.id);
  return {
    selectionKey: schoolSelectionKey(question.id),
    topicId: "school",
    sourceTitle: "章节/知识点选题",
    question: {
      id: question.id,
      num: index >= 0 ? index + 1 : 1,
      section: "章节/知识点选题",
      type: question.type,
      difficulty: question.difficulty,
      knowledge: question.skill,
      minutes: question.minutes,
      competency: question.ability,
      badges: question.tags || [],
      stem: question.title.replaceAll("\n", " "),
      options: [],
      answer: "",
      analysis: ""
    }
  };
}

function syncSelectedFromCanvas() {
  selectedQuestions.clear();
  (window.AiqCanvas?.keys?.() || []).forEach(key => {
    if (String(key).startsWith("school::")) selectedQuestions.add(String(key).slice(8));
  });
}

function questionCard(question) {
  const selected = isQuestionSelected(question.id);
  const saved = savedQuestions.has(question.id);
  return `<article class="question-card ${selected ? "selected" : ""}" data-question-id="${question.id}">
    <div class="question-card-body">
      <div class="question-source-tags"><span class="question-source-type">${question.source}</span><span class="question-source-detail">${question.sourceDetail}</span><span class="question-source-cite"><i class="ri-link-m"></i>引用 ${question.citation}</span></div>
      <div class="question-tags">${question.tags.map(tag => `<span class="question-tag">${tag}</span>`).join("")}<span class="question-meta">${question.type} / ${question.difficulty} / ${question.minutes}分钟</span></div>
      <p class="question-text">${question.title.replaceAll("\n", "<br />")}</p>
      <footer class="question-card-foot">
        <span class="question-knowledge">知识点：${question.skill} <i>/</i> 核心素养：${question.ability}</span>
        <div class="question-actions">
          <button type="button" data-question-action="wrong"><i class="ri-close-circle-line"></i>纠错</button>
          <button class="${saved ? "saved" : ""}" type="button" data-question-action="save"><i class="${saved ? "ri-star-fill" : "ri-star-line"}"></i>${saved ? "已收藏" : "收藏"}</button>
          <button type="button" data-question-action="explain"><i class="ri-book-open-line"></i>解析</button>
          <button type="button" data-question-action="similar"><i class="ri-file-copy-2-line"></i>相似题</button>
          <button class="add-question ${selected ? "selected" : ""}" type="button" data-question-action="select"><i class="${selected ? "ri-check-line" : "ri-add-line"}"></i>${selected ? "已添加" : "添加"}</button>
        </div>
      </footer>
    </div>
  </article>`;
}

function renderQuestions() {
  const type = document.querySelector("#typeFilter").value;
  const difficulty = document.querySelector("#difficultyFilter").value;
  const source = document.querySelector("#sourceFilter")?.value || "all";
  const keyword = document.querySelector("#questionSearch").value.trim().toLowerCase();
  const visible = questions.filter(question => {
    const navMatch = activeNav === "all"
      ? true
      : sideView === "chapters"
        ? question.chapter === activeNav
        : (knowledgeNavMap[activeNav] || []).includes(question.knowledge);
    const searchMatch = !keyword || `${question.title}${question.skill}${question.ability}${question.sourceDetail}`.toLowerCase().includes(keyword);
    return navMatch && searchMatch && (type === "all" || question.type === type) && (difficulty === "all" || question.difficulty === difficulty) && (source === "all" || question.source === source);
  }).sort((a, b) => sortMode === "latest" ? b.updated - a.updated : questions.indexOf(a) - questions.indexOf(b));
  questionList.innerHTML = visible.map(questionCard).join("");
  questionList.hidden = visible.length === 0;
  questionEmpty.hidden = visible.length > 0;
  questionCount.textContent = `共 ${visible.length} 道题`;
}

function renderBasket() {
  syncSelectedFromCanvas();
}

function renderAll() {
  renderBankNav();
  renderQuestions();
  renderBasket();
}

document.querySelectorAll("[data-side-view]").forEach(button => button.addEventListener("click", () => {
  sideView = button.dataset.sideView;
  activeNav = "all";
  document.querySelectorAll("[data-side-view]").forEach(item => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-selected", String(active));
  });
  renderAll();
}));

bankNav.addEventListener("click", event => {
  const button = event.target.closest("[data-nav-id]");
  if (!button) return;
  activeNav = button.dataset.navId;
  renderAll();
});

document.querySelector("#bankSideSearch")?.addEventListener("input", renderBankNav);

["#typeFilter", "#difficultyFilter", "#paperTypeFilter", "#seriesFilter"].forEach(selector => {
  const node = document.querySelector(selector);
  if (node) node.addEventListener("change", renderQuestions);
});

document.querySelector("#questionSearch").addEventListener("input", renderQuestions);

document.querySelectorAll("[data-sort]").forEach(button => button.addEventListener("click", () => {
  sortMode = button.dataset.sort;
  document.querySelectorAll("[data-sort]").forEach(item => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-selected", String(active));
  });
  renderQuestions();
}));

questionList.addEventListener("click", event => {
  const button = event.target.closest("[data-question-action]");
  if (!button) return;
  const card = button.closest("[data-question-id]");
  const id = card.dataset.questionId;
  const question = questions.find(item => item.id === id);
  const action = button.dataset.questionAction;
  if (action === "select") {
    if (window.AiqCanvas?.toggleQuestion) {
      const added = window.AiqCanvas.toggleQuestion(toCanvasQuestion(question));
      if (added) selectedQuestions.add(id);
      else selectedQuestions.delete(id);
    } else if (selectedQuestions.has(id)) {
      selectedQuestions.delete(id);
    } else {
      selectedQuestions.add(id);
    }
  }
  if (action === "save") savedQuestions.has(id) ? savedQuestions.delete(id) : savedQuestions.add(id);
  if (action === "wrong") showToast("已记录为待纠错题");
  if (action === "explain") showToast(`${question.skill}解析已打开`);
  if (action === "similar") showToast("正在查找相似题");
  renderQuestions();
  renderBasket();
});

document.querySelectorAll("[data-basket-action]").forEach(button => button.addEventListener("click", () => {
  const messages = {
    preview: "题目篮已打开",
    group: "正在进入组题",
    paper: "正在进入组卷"
  };
  showToast(messages[button.dataset.basketAction]);
}));

document.querySelector("#scopePicker").addEventListener("click", () => showToast("教材范围可在此切换"));
document.querySelector("#filterMore")?.addEventListener("click", () => showToast("更多筛选条件即将开放"));
document.querySelector("#imageSearch")?.addEventListener("click", () => showToast("图片搜题功能即将开放"));

renderAll();

function syncWhenCanvasReady() {
  syncSelectedFromCanvas();
  renderQuestions();
}
if (window.AiqCanvas) syncWhenCanvasReady();
window.addEventListener("aiq-canvas-ready", syncWhenCanvasReady);
window.addEventListener("aiq-canvas-change", syncWhenCanvasReady);
