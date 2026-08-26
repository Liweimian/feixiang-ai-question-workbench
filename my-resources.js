(function () {
  const STORAGE_KEY = "feixiang-ai-workspace-v5";
  const FOLDER_KEY = "feixiang-ai-resource-folders-v1";
  const resourcesList = document.querySelector("#resourcesList");
  const folderGrid = document.querySelector("#resourcesFolderGrid");
  const searchInput = document.querySelector("#resourceSearch");
  const summary = document.querySelector("#resourceResultSummary");
  const selectAll = document.querySelector("#selectAllResources");
  let currentView = "created";
  let activeFolder = "all";
  let sortOrder = "desc";
  let toastTimer = null;

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    })[char]);
  }

  function parseJson(raw, fallback) {
    try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
  }

  function readWorkspace() {
    const local = parseJson(localStorage.getItem(STORAGE_KEY), null);
    const session = parseJson(sessionStorage.getItem(STORAGE_KEY), null);
    const resourceMap = new Map();
    [...(session?.myQuestionLists || []), ...(local?.myQuestionLists || [])].forEach(resource => {
      if (!resource?.id) return;
      const old = resourceMap.get(resource.id);
      if (!old || String(resource.updatedAt || "") >= String(old.updatedAt || "")) resourceMap.set(resource.id, resource);
    });
    return {
      ...(session || {}),
      ...(local || {}),
      tabs: (local?.tabs?.length || 0) >= (session?.tabs?.length || 0) ? (local?.tabs || []) : (session?.tabs || []),
      myQuestionLists: [...resourceMap.values()]
    };
  }

  function saveWorkspace(workspace) {
    const json = JSON.stringify(workspace);
    sessionStorage.setItem(STORAGE_KEY, json);
    try { localStorage.setItem(STORAGE_KEY, json); } catch {}
  }

  function registerDownload(resource, format = "Word") {
    if (!resource?.tab) return;
    const resourceKey = `resource:${resource.id}`;
    const record = {
      id: `download:${resourceKey}:${format.toLowerCase()}`,
      resourceKey,
      title: resource.title || "未命名题单",
      questionCount: Number(resource.questionCount || 0),
      format,
      downloadedAt: new Date().toISOString(),
      tab: JSON.parse(JSON.stringify(resource.tab))
    };
    const workspace = readWorkspace();
    workspace.downloadRecords = [
      record,
      ...(Array.isArray(workspace.downloadRecords) ? workspace.downloadRecords : []).filter(item => item.id !== record.id)
    ].slice(0, 30);
    saveWorkspace(workspace);
  }

  function readFolders() {
    const folders = parseJson(localStorage.getItem(FOLDER_KEY), []);
    return Array.isArray(folders) ? folders : [];
  }

  function formatTime(value) {
    const date = value ? new Date(value) : null;
    if (!date || Number.isNaN(date.getTime())) return "刚刚更新";
    const pad = number => String(number).padStart(2, "0");
    return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function showToast(message) {
    const toast = document.querySelector("#resourcesToast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function visibleResources() {
    const query = searchInput.value.trim().toLowerCase();
    if (currentView !== "created") return [];
    const resources = readWorkspace().myQuestionLists || [];
    return resources
      .filter(() => activeFolder === "all" || activeFolder === "uncategorized")
      .filter(resource => !query || String(resource.title || "").toLowerCase().includes(query))
      .sort((a, b) => sortOrder === "desc"
        ? String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""))
        : String(a.updatedAt || "").localeCompare(String(b.updatedAt || "")));
  }

  function renderFolders() {
    const resources = readWorkspace().myQuestionLists || [];
    const custom = readFolders();
    const folders = [
      { id: "all", name: "全部题单", icon: "ri-folder-5-fill", note: `${resources.length} 份题单` },
      { id: "uncategorized", name: "未分类", icon: "ri-folder-open-fill", note: `${resources.length} 份题单` },
      ...custom.map((name, index) => ({ id: `custom-${index}`, name, icon: "ri-folder-fill", note: "空文件夹" }))
    ];
    const query = searchInput.value.trim().toLowerCase();
    folderGrid.innerHTML = folders
      .filter(folder => !query || folder.name.toLowerCase().includes(query))
      .map(folder => `<button class="resources-folder-card ${folder.id === activeFolder ? "is-active" : ""}" type="button" data-folder-id="${escapeHtml(folder.id)}">
        <span><i class="${folder.icon}"></i></span>
        <p><strong>${escapeHtml(folder.name)}</strong><small>${escapeHtml(folder.note)}</small></p>
        <i class="ri-arrow-right-s-line"></i>
      </button>`).join("");
  }

  function resourceRow(resource) {
    const meta = resource.tab?.meta || {};
    const context = resource.tab?.context || "paper";
    const grade = meta.grade || (context === "paper" ? "初中" : "七年级");
    const subject = meta.subject || "数学";
    const questionCount = Number(resource.questionCount || 0);
    const difficulty = meta.difficulty || "中等";
    return `<article class="resource-row" data-resource-id="${escapeHtml(resource.id)}">
      <input class="resource-select" type="checkbox" aria-label="选择 ${escapeHtml(resource.title || "未命名题单")}" />
      <span class="resource-type-icon"><i class="ri-file-list-3-line"></i></span>
      <div class="resource-copy">
        <button class="resource-title-button" type="button" data-action="open">${escapeHtml(resource.title || "未命名题单")}</button>
        <div class="resource-meta"><span>${escapeHtml(grade)}</span><span>${escapeHtml(subject)}</span><span>${questionCount} 题</span><span>难度 ${escapeHtml(difficulty)}</span></div>
        <div class="resource-submeta"><span>题单</span><span>${escapeHtml(formatTime(resource.updatedAt))}</span></div>
      </div>
      <div class="resource-actions">
        <button class="resource-icon-action" type="button" data-action="download" title="下载" aria-label="下载"><i class="ri-download-2-line"></i></button>
        <button class="resource-icon-action" type="button" data-action="more" title="更多" aria-label="更多"><i class="ri-more-line"></i></button>
      </div>
    </article>`;
  }

  function renderResources() {
    const resources = visibleResources();
    const viewCopy = currentView === "favorites"
      ? { title: "我的收藏", icon: "ri-star-line", empty: "还没有收藏内容", hint: "收藏的试题和资源会显示在这里。" }
      : currentView === "downloads"
        ? { title: "我的下载", icon: "ri-download-cloud-2-line", empty: "还没有下载内容", hint: "下载过的题单和试卷会显示在这里。" }
        : { title: "题单", icon: "ri-file-list-3-line", empty: "这个文件夹还没有题单", hint: "保存题单后，会在这里显示。" };
    document.querySelector("#questionListTitle").textContent = viewCopy.title;
    document.querySelector(".resources-question-head > div > i").className = viewCopy.icon;
    summary.textContent = resources.length ? `${resources.length} 份题单` : "暂无内容";
    selectAll.checked = false;
    selectAll.indeterminate = false;
    if (!resources.length) {
      resourcesList.innerHTML = `<div class="resources-empty"><i class="${viewCopy.icon}"></i><strong>${viewCopy.empty}</strong><span>${viewCopy.hint}</span></div>`;
      return;
    }
    resourcesList.innerHTML = resources.map(resourceRow).join("");
  }

  function renderAll() {
    const folderSection = document.querySelector("#resourcesFolderSection");
    folderSection.hidden = currentView !== "created";
    if (currentView === "created") renderFolders();
    renderResources();
  }

  function openResource(resourceId) {
    const workspace = readWorkspace();
    const resource = (workspace.myQuestionLists || []).find(item => item.id === resourceId);
    if (!resource?.tab) return;
    let tab = (workspace.tabs || []).find(item => item.myResourceId === resource.id);
    if (!tab) {
      tab = {
        ...JSON.parse(JSON.stringify(resource.tab)),
        id: `tab-resource-${Date.now()}`,
        myResourceId: resource.id,
        fromTabId: null,
        isQuestionList: true
      };
      workspace.tabs = [...(workspace.tabs || []), tab];
    }
    workspace.activeTabId = tab.id;
    workspace.homeActive = false;
    saveWorkspace(workspace);
    location.href = `./detail-ai.html?tabId=${encodeURIComponent(tab.id)}&context=${encodeURIComponent(tab.context || "paper")}`;
  }

  folderGrid.addEventListener("click", event => {
    const folder = event.target.closest("[data-folder-id]");
    if (!folder) return;
    activeFolder = folder.dataset.folderId;
    renderAll();
  });

  document.querySelector(".resources-top-tabs").addEventListener("click", event => {
    const button = event.target.closest("[data-top-view]");
    if (!button) return;
    document.querySelectorAll("[data-top-view]").forEach(item => item.classList.toggle("is-active", item === button));
    currentView = button.dataset.topView;
    searchInput.value = "";
    searchInput.placeholder = currentView === "favorites" ? "搜索收藏内容" : currentView === "downloads" ? "搜索下载内容" : "搜索文件夹或题单";
    renderAll();
  });

  searchInput.addEventListener("input", renderAll);

  document.querySelector("#resourceSortButton").addEventListener("click", event => {
    const button = event.currentTarget;
    sortOrder = sortOrder === "desc" ? "asc" : "desc";
    button.dataset.order = sortOrder;
    button.innerHTML = sortOrder === "desc"
      ? '<i class="ri-sort-desc"></i><span>最近更新</span>'
      : '<i class="ri-sort-asc"></i><span>最早更新</span>';
    renderResources();
  });

  selectAll.addEventListener("change", () => {
    document.querySelectorAll(".resource-select").forEach(input => { input.checked = selectAll.checked; });
  });

  resourcesList.addEventListener("change", event => {
    if (!event.target.matches(".resource-select")) return;
    const boxes = [...document.querySelectorAll(".resource-select")];
    const checked = boxes.filter(box => box.checked).length;
    selectAll.checked = boxes.length > 0 && checked === boxes.length;
    selectAll.indeterminate = checked > 0 && checked < boxes.length;
  });

  resourcesList.addEventListener("click", event => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    const row = event.target.closest("[data-resource-id]");
    if (!action || !row) return;
    if (action === "open") openResource(row.dataset.resourceId);
    if (action === "download") {
      const resource = (readWorkspace().myQuestionLists || []).find(item => item.id === row.dataset.resourceId);
      registerDownload(resource);
      showToast("正在生成题单下载文件…");
    }
    if (action === "more") showToast("更多管理功能即将开放");
  });

  document.querySelector("#uploadResourceButton").addEventListener("click", () => document.querySelector("#resourceFileInput").click());
  document.querySelector("#resourceFileInput").addEventListener("change", event => {
    const file = event.target.files?.[0];
    if (!file) return;
    location.href = `./detail-ai.html?mode=record&fileName=${encodeURIComponent(file.name)}`;
  });

  document.querySelector("#newFolderButton").addEventListener("click", () => {
    const name = window.prompt("请输入文件夹名称");
    if (!name?.trim()) return;
    const folders = readFolders();
    folders.push(name.trim());
    localStorage.setItem(FOLDER_KEY, JSON.stringify(folders));
    renderFolders();
    showToast(`已新建文件夹「${name.trim()}」`);
  });

  const aiButton = document.querySelector("#resourcesAiButton");
  const aiPanel = document.querySelector("#resourcesAiPanel");
  function setAiPanel(open) {
    aiPanel.hidden = !open;
    aiButton.setAttribute("aria-expanded", open ? "true" : "false");
  }
  aiButton.addEventListener("click", () => setAiPanel(aiPanel.hidden));
  document.querySelector("#closeResourcesAi").addEventListener("click", () => setAiPanel(false));
  document.querySelector("[data-ai-upload]").addEventListener("click", () => document.querySelector("#resourceFileInput").click());
  document.querySelector("[data-ai-prompt]").addEventListener("click", () => {
    searchInput.value = "七年级数学";
    renderAll();
    setAiPanel(false);
    showToast("已按你的描述筛选题单");
  });
  document.querySelector("#resourcesAiForm").addEventListener("submit", event => {
    event.preventDefault();
    const value = document.querySelector("#resourcesAiInput").value.trim();
    if (!value) return;
    searchInput.value = value;
    renderAll();
    setAiPanel(false);
    showToast("已为你查找相关题单");
  });

  window.addEventListener("storage", event => {
    if (event.key === STORAGE_KEY || event.key === FOLDER_KEY) renderAll();
  });

  renderAll();
})();
