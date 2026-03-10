(function () {
  const STORAGE_USER = "bms_user_v4";
  const STORAGE_RECORDS = "bms_records_v1";
  const STORAGE_LANG = "bms_lang_v1";

  const I18N = {
    en: {
      productName: "DayGing",
      languageLabel: "Language",
      tabHome: "Home",
      tabRecord: "Record",
      tabReport: "Report",
      tabSettings: "Settings",
      homeTitle: "Welcome Back",
      statTotal: "Total Records",
      statWeek: "Records in Last 7 Days",
      statLast: "Latest Record",
      recordTitle: "Add New Symptom Record",
      occurredAtLabel: "Symptom Time (Backfill supported)",
      bodyPartLabel: "Body Part",
      symptomLabel: "Symptom Description (Optional)",
      symptomPlaceholder: "e.g., dizziness, cramp, soreness",
      noteLabel: "Note (Optional)",
      notePlaceholder: "Trigger, context, or duration",
      submitRecord: "Submit Record",
      quickPickTitle: "Quick Body-Part Pick",
      quickPickHint: "Click any point on front / side / back maps to fill Body Part instantly.",
      recordListTitle: "Record List (Delete duplicates if needed)",
      reportTitle: "Visualization Report",
      range3: "3 Days",
      range7: "1 Week",
      range30: "1 Month",
      heatmapTitle: "Body Heatmap",
      freqTitle: "Body Part Frequency",
      settingsTitle: "Account Settings",
      nicknameLabel: "Nickname",
      nicknamePlaceholder: "e.g., Alex",
      emailLabel: "Email",
      phoneLabel: "Phone Number",
      saveSettings: "Save Account Info",
      defaultWelcome: "Hi {name} 👋 Tell me anytime if your body feels off.",
      none: "None",
      noRecords: "No records.",
      noNote: "No note",
      noSymptom: "Not specified",
      chooseTimePart: "Please provide time and body part.",
      recordSaved: "Record saved.",
      settingsSaved: "Account info saved.",
      settingsRequired: "Please complete nickname, email, and phone.",
      rangeHint: "Window: last {days} days, heat by record count.",
      countTimes: "{part}: {count} times",
      confirmTitle: "Submitted",
      confirmSubmit: "Sucessfully submitted! Stay Healthy!",
      modalButton: "Got it",
      selectedPart: "Selected body part: ",
      deleteLabel: "Delete",
      viewFront: "Front",
      viewSide: "Side",
      viewBack: "Back",
    },
    zh: {
      productName: "得劲",
      languageLabel: "语言",
      tabHome: "首页",
      tabRecord: "记录",
      tabReport: "报告",
      tabSettings: "设置",
      homeTitle: "欢迎回来",
      statTotal: "累计记录",
      statWeek: "近 7 天记录",
      statLast: "最近一次记录",
      recordTitle: "新增不适记录",
      occurredAtLabel: "不适时间（可补录）",
      bodyPartLabel: "不适部位",
      symptomLabel: "症状描述（选填）",
      symptomPlaceholder: "例如：头晕、抽筋、酸痛",
      noteLabel: "备注（选填）",
      notePlaceholder: "可记录诱因、持续时长、当天状态",
      submitRecord: "提交记录",
      quickPickTitle: "快速点击人体部位",
      quickPickHint: "可直接点击前 / 侧 / 后视图中的部位点，快速填入不适部位。",
      recordListTitle: "记录列表（可删除重复项）",
      reportTitle: "可视化报告",
      range3: "3天",
      range7: "1周",
      range30: "1月",
      heatmapTitle: "人体热区",
      freqTitle: "部位频次",
      settingsTitle: "账户设置",
      nicknameLabel: "昵称",
      nicknamePlaceholder: "例如：小李",
      emailLabel: "邮箱",
      phoneLabel: "手机号",
      saveSettings: "保存账户信息",
      defaultWelcome: "Hi {name} 👋 身体有什么不得劲随时跟我说吧！",
      none: "暂无",
      noRecords: "暂无记录。",
      noNote: "无备注",
      noSymptom: "未填写症状",
      chooseTimePart: "请填写时间和部位。",
      recordSaved: "记录已保存。",
      settingsSaved: "账户信息已保存。",
      settingsRequired: "请完整填写昵称、邮箱和手机号。",
      rangeHint: "统计窗口：近 {days} 天，按记录次数计算热区。",
      countTimes: "{part}：{count} 次",
      confirmTitle: "提交成功",
      confirmSubmit: "提交成功，祝您得劲",
      modalButton: "知道了",
      selectedPart: "已选择部位：",
      deleteLabel: "删除",
      viewFront: "前视",
      viewSide: "侧视",
      viewBack: "后视",
    },
  };

  const BODY_PARTS = [
    { key: "forehead", en: "Forehead", zh: "额头", x: 78, y: 32 },
    { key: "left_temple", en: "Left Temple", zh: "左太阳穴", x: 66, y: 36 },
    { key: "right_temple", en: "Right Temple", zh: "右太阳穴", x: 90, y: 36 },
    { key: "left_eye", en: "Left Eye", zh: "左眼", x: 70, y: 42 },
    { key: "right_eye", en: "Right Eye", zh: "右眼", x: 86, y: 42 },
    { key: "nose", en: "Nose", zh: "鼻子", x: 78, y: 48 },
    { key: "left_lower_gum", en: "Left Lower Gum", zh: "左下牙龈", x: 72, y: 56 },
    { key: "right_lower_gum", en: "Right Lower Gum", zh: "右下牙龈", x: 84, y: 56 },
    { key: "jaw", en: "Jaw", zh: "下颌", x: 78, y: 60 },
    { key: "neck", en: "Neck", zh: "颈部", x: 78, y: 70 },
    { key: "left_shoulder", en: "Left Shoulder", zh: "左肩", x: 60, y: 82 },
    { key: "right_shoulder", en: "Right Shoulder", zh: "右肩", x: 96, y: 82 },
    { key: "chest", en: "Chest", zh: "胸部", x: 78, y: 94 },
    { key: "left_ribs", en: "Left Ribs", zh: "左肋", x: 68, y: 104 },
    { key: "right_ribs", en: "Right Ribs", zh: "右肋", x: 88, y: 104 },
    { key: "abdomen", en: "Abdomen", zh: "腹部", x: 78, y: 114 },
    { key: "pelvis", en: "Pelvis", zh: "骨盆", x: 78, y: 132 },
    { key: "left_arm", en: "Left Upper Arm", zh: "左上臂", x: 48, y: 100 },
    { key: "right_arm", en: "Right Upper Arm", zh: "右上臂", x: 108, y: 100 },
    { key: "left_elbow", en: "Left Elbow", zh: "左手肘", x: 44, y: 116 },
    { key: "right_elbow", en: "Right Elbow", zh: "右手肘", x: 112, y: 116 },
    { key: "left_wrist", en: "Left Wrist", zh: "左手腕", x: 42, y: 132 },
    { key: "right_wrist", en: "Right Wrist", zh: "右手腕", x: 114, y: 132 },
    { key: "left_fingers", en: "Left Fingers", zh: "左手手指", x: 38, y: 146 },
    { key: "right_fingers", en: "Right Fingers", zh: "右手手指", x: 118, y: 146 },
    { key: "left_thigh", en: "Left Thigh", zh: "左大腿", x: 70, y: 156 },
    { key: "right_thigh", en: "Right Thigh", zh: "右大腿", x: 86, y: 156 },
    { key: "left_knee", en: "Left Knee", zh: "左膝盖", x: 70, y: 178 },
    { key: "right_knee", en: "Right Knee", zh: "右膝盖", x: 86, y: 178 },
    { key: "left_calf", en: "Left Calf", zh: "左小腿", x: 70, y: 198 },
    { key: "right_calf", en: "Right Calf", zh: "右小腿", x: 86, y: 198 },
    { key: "left_ankle", en: "Left Ankle", zh: "左脚踝", x: 70, y: 218 },
    { key: "right_ankle", en: "Right Ankle", zh: "右脚踝", x: 86, y: 218 },
    { key: "left_foot", en: "Left Foot", zh: "左脚掌", x: 68, y: 236 },
    { key: "right_foot", en: "Right Foot", zh: "右脚掌", x: 88, y: 236 },
    { key: "left_toes", en: "Left Toes", zh: "左脚趾", x: 66, y: 246 },
    { key: "right_toes", en: "Right Toes", zh: "右脚趾", x: 90, y: 246 },

    { key: "side_head", en: "Head (Side)", zh: "头部（侧）", x: 300, y: 36 },
    { key: "side_neck", en: "Neck (Side)", zh: "颈部（侧）", x: 300, y: 68 },
    { key: "side_shoulder", en: "Shoulder (Side)", zh: "肩部（侧）", x: 292, y: 84 },
    { key: "side_chest", en: "Chest (Side)", zh: "胸部（侧）", x: 296, y: 100 },
    { key: "side_back", en: "Back (Side)", zh: "背部（侧）", x: 292, y: 110 },
    { key: "side_waist", en: "Waist (Side)", zh: "腰部（侧）", x: 296, y: 128 },
    { key: "side_hip", en: "Hip (Side)", zh: "髋部（侧）", x: 302, y: 146 },
    { key: "side_knee", en: "Knee (Side)", zh: "膝盖（侧）", x: 304, y: 182 },
    { key: "side_calf", en: "Calf (Side)", zh: "小腿（侧）", x: 304, y: 202 },
    { key: "side_ankle", en: "Ankle (Side)", zh: "脚踝（侧）", x: 306, y: 224 },

    { key: "back_head", en: "Head (Back)", zh: "头部（后）", x: 520, y: 36 },
    { key: "back_neck", en: "Neck (Back)", zh: "颈部（后）", x: 520, y: 68 },
    { key: "upper_back", en: "Upper Back", zh: "上背", x: 520, y: 92 },
    { key: "left_scapula", en: "Left Scapula", zh: "左肩胛", x: 506, y: 96 },
    { key: "right_scapula", en: "Right Scapula", zh: "右肩胛", x: 534, y: 96 },
    { key: "lower_back", en: "Lower Back", zh: "下背", x: 520, y: 122 },
    { key: "back_hip", en: "Hip (Back)", zh: "臀部（后）", x: 520, y: 146 },
    { key: "back_left_arm", en: "Left Arm (Back)", zh: "左臂（后）", x: 492, y: 104 },
    { key: "back_right_arm", en: "Right Arm (Back)", zh: "右臂（后）", x: 548, y: 104 },
    { key: "back_left_elbow", en: "Left Elbow (Back)", zh: "左手肘（后）", x: 488, y: 120 },
    { key: "back_right_elbow", en: "Right Elbow (Back)", zh: "右手肘（后）", x: 552, y: 120 },
    { key: "back_left_wrist", en: "Left Wrist (Back)", zh: "左手腕（后）", x: 486, y: 136 },
    { key: "back_right_wrist", en: "Right Wrist (Back)", zh: "右手腕（后）", x: 554, y: 136 },
    { key: "back_left_thigh", en: "Left Thigh (Back)", zh: "左大腿（后）", x: 512, y: 160 },
    { key: "back_right_thigh", en: "Right Thigh (Back)", zh: "右大腿（后）", x: 528, y: 160 },
    { key: "back_left_knee", en: "Left Knee (Back)", zh: "左膝盖（后）", x: 512, y: 182 },
    { key: "back_right_knee", en: "Right Knee (Back)", zh: "右膝盖（后）", x: 528, y: 182 },
    { key: "back_left_calf", en: "Left Calf (Back)", zh: "左小腿（后）", x: 512, y: 202 },
    { key: "back_right_calf", en: "Right Calf (Back)", zh: "右小腿（后）", x: 528, y: 202 },
    { key: "back_left_ankle", en: "Left Ankle (Back)", zh: "左脚踝（后）", x: 512, y: 224 },
    { key: "back_right_ankle", en: "Right Ankle (Back)", zh: "右脚踝（后）", x: 528, y: 224 },
  ];

  const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
  const tabs = {
    home: document.getElementById("tab-home"),
    record: document.getElementById("tab-record"),
    report: document.getElementById("tab-report"),
    settings: document.getElementById("tab-settings"),
  };

  const appName = document.getElementById("appName");
  const langSelect = document.getElementById("langSelect");
  const helloText = document.getElementById("helloText");
  const welcomeText = document.getElementById("welcomeText");
  const totalCount = document.getElementById("totalCount");
  const weekCount = document.getElementById("weekCount");
  const lastRecord = document.getElementById("lastRecord");

  const bodyPartSelect = document.getElementById("bodyPart");
  const occurredAt = document.getElementById("occurredAt");
  const symptom = document.getElementById("symptom");
  const note = document.getElementById("note");
  const recordForm = document.getElementById("recordForm");
  const recordStatus = document.getElementById("recordStatus");
  const recordList = document.getElementById("recordList");
  const bodyMapInput = document.getElementById("bodyMapInput");

  const rangeButtons = Array.from(document.querySelectorAll(".range-btn"));
  const reportHint = document.getElementById("reportHint");
  const topList = document.getElementById("topList");
  const bodyMapHeat = document.getElementById("bodyMapHeat");

  const settingsForm = document.getElementById("settingsForm");
  const nicknameInput = document.getElementById("nickname");
  const emailInput = document.getElementById("email");
  const phoneCodeInput = document.getElementById("phoneCode");
  const phoneInput = document.getElementById("phone");
  const settingsStatus = document.getElementById("settingsStatus");

  const confirmModal = document.getElementById("confirmModal");
  const confirmTitle = document.getElementById("confirmTitle");
  const confirmMessage = document.getElementById("confirmMessage");
  const confirmCloseBtn = document.getElementById("confirmCloseBtn");

  let activeDays = 7;
  let lang = localStorage.getItem(STORAGE_LANG) || "en";

  init();

  function init() {
    initTabs();
    initLanguageSwitch();
    initBodyPartSelect();
    initDefaults();
    initForms();
    applyLanguage();
    renderBodyMap(bodyMapInput, {}, true);
    refreshAll();
  }

  function t(key) {
    return I18N[lang][key] || I18N.en[key] || key;
  }

  function initTabs() {
    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.tab;
        tabButtons.forEach((b) => b.classList.toggle("active", b === btn));
        Object.keys(tabs).forEach((k) => tabs[k].classList.toggle("active", k === target));
      });
    });
  }

  function initLanguageSwitch() {
    langSelect.value = lang;
    langSelect.addEventListener("change", () => {
      lang = langSelect.value === "zh" ? "zh" : "en";
      localStorage.setItem(STORAGE_LANG, lang);
      applyLanguage();
      renderBodyPartOptions();
      renderBodyMap(bodyMapInput, {}, true);
      refreshAll();
    });
  }

  function initBodyPartSelect() {
    renderBodyPartOptions();
  }

  function renderBodyPartOptions() {
    const current = bodyPartSelect.value;
    bodyPartSelect.innerHTML = "";
    BODY_PARTS.forEach((part) => {
      const option = document.createElement("option");
      option.value = part.key;
      option.textContent = part[lang];
      bodyPartSelect.appendChild(option);
    });
    if (current) bodyPartSelect.value = current;
  }

  function initDefaults() {
    occurredAt.value = toDateTimeLocal(new Date());
    helloText.textContent = lang === "zh" ? generatePoemZh() : generatePoemEn();

    const user = getUser();
    if (user) {
      nicknameInput.value = user.nickname || "";
      emailInput.value = user.email || "";
      phoneCodeInput.value = user.phoneCode || "+86";
      phoneInput.value = user.phone || "";
      renderWelcome(user.nickname || defaultName());
    } else {
      renderWelcome(defaultName());
    }
  }

  function initForms() {
    recordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const part = bodyPartSelect.value;
      const at = occurredAt.value;
      const sym = symptom.value.trim();
      const memo = note.value.trim();
      if (!part || !at) {
        recordStatus.textContent = t("chooseTimePart");
        return;
      }

      const records = getRecords();
      records.push({
        id: createId(),
        timestamp: new Date(at).toISOString(),
        body_part: part,
        symptom: sym,
        note: memo,
      });
      saveRecords(records);
      recordStatus.textContent = t("recordSaved");
      symptom.value = "";
      note.value = "";
      refreshAll();
      openConfirmModal(t("confirmTitle"), t("confirmSubmit"));
    });

    settingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nickname = nicknameInput.value.trim();
      const email = emailInput.value.trim();
      const phoneCode = phoneCodeInput.value.trim();
      const phone = phoneInput.value.trim();
      if (!nickname || !email || !phoneCode || !phone) {
        settingsStatus.textContent = t("settingsRequired");
        return;
      }
      localStorage.setItem(STORAGE_USER, JSON.stringify({ nickname, email, phoneCode, phone }));
      settingsStatus.textContent = t("settingsSaved");
      renderWelcome(nickname);
    });

    rangeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        activeDays = Number(btn.dataset.days);
        rangeButtons.forEach((b) => b.classList.toggle("active", b === btn));
        renderReport();
      });
    });

    confirmCloseBtn.addEventListener("click", closeConfirmModal);
    confirmModal.addEventListener("click", (e) => {
      if (e.target === confirmModal) closeConfirmModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeConfirmModal();
    });
  }

  function openConfirmModal(title, message) {
    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    confirmCloseBtn.textContent = t("modalButton");
    confirmModal.classList.add("show");
    confirmModal.setAttribute("aria-hidden", "false");
  }

  function closeConfirmModal() {
    confirmModal.classList.remove("show");
    confirmModal.setAttribute("aria-hidden", "true");
  }

  function applyLanguage() {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    appName.textContent = t("productName");
    document.title = t("productName");
    helloText.textContent = lang === "zh" ? generatePoemZh() : generatePoemEn();

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      el.setAttribute("placeholder", t(key));
    });

    const user = getUser();
    renderWelcome((user && user.nickname) || defaultName());
  }

  function renderWelcome(nickname) {
    welcomeText.textContent = t("defaultWelcome").replace("{name}", nickname);
  }

  function defaultName() {
    return lang === "zh" ? "朋友" : "friend";
  }

  function generatePoemZh() {
    const lines = [
      ["愿你今天的骨骼，像晨光一样松弛。", "愿你每一次呼吸，都把疲惫轻轻放下。"],
      ["把紧绷交给夜色，把轻盈留给自己。", "愿你的身体，始终站在你这一边。"],
      ["愿疼痛只是路过，恢复成为常态。", "愿你在忙碌里，也听见身体的求救与和解。"],
    ];
    const pick = lines[Math.floor(Math.random() * lines.length)];
    return pick[0] + "\n" + pick[1];
  }

  function generatePoemEn() {
    const lines = [
      ["May your muscles soften in morning light,", "and each breath release a little fatigue."],
      ["Let the tension settle with dusk,", "keep the gentleness for yourself tonight."],
      ["May pain only pass by,", "and recovery become your everyday rhythm."],
    ];
    const pick = lines[Math.floor(Math.random() * lines.length)];
    return pick[0] + "\n" + pick[1];
  }

  function refreshAll() {
    renderSummary();
    renderRecordList();
    renderReport();
  }

  function renderSummary() {
    const records = getRecords();
    totalCount.textContent = String(records.length);
    weekCount.textContent = String(filterByDays(records, 7).length);
    if (!records.length) {
      lastRecord.textContent = t("none");
      return;
    }
    const latest = records.slice().sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))[0];
    lastRecord.textContent = formatDate(latest.timestamp) + " · " + partLabel(latest.body_part);
  }

  function renderRecordList() {
    const records = getRecords().slice().sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
    recordList.innerHTML = "";
    if (!records.length) {
      recordList.innerHTML = "<p class='muted'>" + escapeHtml(t("noRecords")) + "</p>";
      return;
    }
    records.forEach((r) => {
      const item = document.createElement("article");
      item.className = "record-item";
      item.innerHTML =
        "<div>" +
        "<p><strong>" +
        escapeHtml(partLabel(r.body_part)) +
        "</strong> · " +
        escapeHtml(r.symptom || t("noSymptom")) +
        "</p>" +
        "<p>" +
        escapeHtml(formatDate(r.timestamp)) +
        "</p>" +
        "<p>" +
        escapeHtml(r.note || t("noNote")) +
        "</p>" +
        "</div>";
      const del = document.createElement("button");
      del.className = "danger-btn";
      del.textContent = t("deleteLabel");
      del.addEventListener("click", () => deleteRecord(r.id));
      item.appendChild(del);
      recordList.appendChild(item);
    });
  }

  function deleteRecord(id) {
    const records = getRecords().filter((r) => r.id !== id);
    saveRecords(records);
    refreshAll();
  }

  function renderReport() {
    const records = filterByDays(getRecords(), activeDays);
    const counts = countByPart(records);
    renderBodyMap(bodyMapHeat, counts, false);
    reportHint.textContent = t("rangeHint").replace("{days}", String(activeDays));

    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    topList.innerHTML = "";
    if (!entries.length) {
      topList.innerHTML = "<li>" + escapeHtml(t("noRecords")) + "</li>";
      return;
    }
    entries.forEach(([key, value]) => {
      const li = document.createElement("li");
      li.textContent = t("countTimes").replace("{part}", partLabel(key)).replace("{count}", String(value));
      topList.appendChild(li);
    });
  }

  function renderBodyMap(svg, counts, selectable) {
    svg.innerHTML = "";
    addFigure(svg, "front", 38, 20, t("viewFront"));
    addFigure(svg, "side", 258, 20, t("viewSide"));
    addFigure(svg, "back", 478, 20, t("viewBack"));

    const max = Math.max(1, ...Object.values(counts));
    BODY_PARTS.forEach((part) => {
      const count = counts[part.key] || 0;
      const intensity = count / max;
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", part.x);
      circle.setAttribute("cy", part.y);
      circle.setAttribute("r", selectable ? 5.7 : 5 + intensity * 8.6);
      circle.setAttribute("fill", selectable ? "#f0977c" : "rgba(220,67,106," + (0.18 + intensity * 0.72) + ")");
      circle.setAttribute("stroke", selectable ? "#cd7257" : "rgba(150,28,62,0.86)");
      circle.setAttribute("stroke-width", "1.05");

      if (selectable) {
        circle.style.cursor = "pointer";
        circle.addEventListener("click", () => {
          bodyPartSelect.value = part.key;
          recordStatus.textContent = t("selectedPart") + partLabel(part.key);
        });
      }
      svg.appendChild(circle);

      if (!selectable && count > 0) {
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", part.x + 7);
        text.setAttribute("y", part.y + 3);
        text.setAttribute("font-size", "8.8");
        text.setAttribute("fill", "#7a1230");
        text.textContent = String(count);
        svg.appendChild(text);
      }
    });
  }

  function addFigure(svg, view, x, y, label) {
    const ns = "http://www.w3.org/2000/svg";
    const g = document.createElementNS(ns, "g");
    g.setAttribute("transform", "translate(" + x + "," + y + ")");

    const skin = document.createElementNS(ns, "g");
    skin.setAttribute("fill", "#f8ccb9");
    skin.setAttribute("stroke", "#d49a89");
    skin.setAttribute("stroke-width", "1");

    const details = document.createElementNS(ns, "g");
    details.setAttribute("fill", "none");
    details.setAttribute("stroke", "#cc8f7d");
    details.setAttribute("stroke-width", "0.8");
    details.setAttribute("opacity", "0.65");

    if (view === "front") {
      skin.innerHTML =
        "<ellipse cx='40' cy='22' rx='16' ry='18'></ellipse>" +
        "<path d='M24,42 C24,36 56,36 56,42 L55,66 C62,73 65,90 62,108 L58,136 C56,146 52,150 48,152 L50,232 L38,232 L34,152 C30,149 26,146 24,136 L18,108 C16,90 19,73 26,66 Z'></path>" +
        "<path d='M18,70 C10,78 7,96 10,116 C11,123 15,130 20,134 L24,128 C20,122 19,110 20,100 C20,90 22,79 28,72 Z'></path>" +
        "<path d='M62,70 C70,78 73,96 70,116 C69,123 65,130 60,134 L56,128 C60,122 61,110 60,100 C60,90 58,79 52,72 Z'></path>" +
        "<path d='M30,150 C24,170 22,196 26,232 L36,232 C36,202 37,176 42,154 Z'></path>" +
        "<path d='M50,150 C56,170 58,196 54,232 L44,232 C44,202 43,176 38,154 Z'></path>";

      details.innerHTML =
        "<path d='M31,80 C36,86 44,86 49,80'></path>" +
        "<path d='M30,94 C36,100 44,100 50,94'></path>" +
        "<path d='M34,112 C38,117 42,117 46,112'></path>" +
        "<path d='M22,96 L28,108'></path><path d='M58,96 L52,108'></path>" +
        "<path d='M31,170 C33,182 33,194 31,208'></path><path d='M49,170 C47,182 47,194 49,208'></path>";
    } else if (view === "side") {
      skin.innerHTML =
        "<ellipse cx='40' cy='22' rx='14' ry='18'></ellipse>" +
        "<path d='M34,42 C47,42 54,56 54,78 C54,92 50,110 47,130 C46,142 46,150 47,160 L49,232 L38,232 L34,166 C31,154 27,142 24,130 C21,112 21,94 24,76 C27,56 30,42 34,42 Z'></path>" +
        "<path d='M25,78 C17,88 15,106 18,124 C19,132 24,138 30,141 L32,136 C28,132 26,124 26,112 C26,101 27,89 31,82 Z'></path>" +
        "<path d='M40,160 C43,176 44,202 44,232 L35,232 C34,202 33,176 31,160 Z'></path>";
      details.innerHTML =
        "<path d='M37,82 C43,88 44,98 43,108'></path>" +
        "<path d='M34,108 C37,114 41,116 45,115'></path>" +
        "<path d='M38,174 C39,189 39,204 38,219'></path>";
    } else {
      skin.innerHTML =
        "<ellipse cx='40' cy='22' rx='16' ry='18'></ellipse>" +
        "<path d='M24,42 C24,36 56,36 56,42 L55,66 C62,73 65,90 62,108 L58,136 C56,146 52,150 48,152 L50,232 L38,232 L34,152 C30,149 26,146 24,136 L18,108 C16,90 19,73 26,66 Z'></path>" +
        "<path d='M18,70 C10,78 7,96 10,116 C11,123 15,130 20,134 L24,128 C20,122 19,110 20,100 C20,90 22,79 28,72 Z'></path>" +
        "<path d='M62,70 C70,78 73,96 70,116 C69,123 65,130 60,134 L56,128 C60,122 61,110 60,100 C60,90 58,79 52,72 Z'></path>" +
        "<path d='M30,150 C24,170 22,196 26,232 L36,232 C36,202 37,176 42,154 Z'></path>" +
        "<path d='M50,150 C56,170 58,196 54,232 L44,232 C44,202 43,176 38,154 Z'></path>";
      details.innerHTML =
        "<path d='M30,84 C36,92 44,92 50,84'></path>" +
        "<path d='M30,98 C36,106 44,106 50,98'></path>" +
        "<path d='M32,114 C36,120 44,120 48,114'></path>" +
        "<path d='M40,70 L40,140'></path>" +
        "<path d='M32,172 C34,186 34,198 32,212'></path><path d='M48,172 C46,186 46,198 48,212'></path>";
    }

    const title = document.createElementNS(ns, "text");
    title.setAttribute("x", "40");
    title.setAttribute("y", "266");
    title.setAttribute("text-anchor", "middle");
    title.setAttribute("fill", "#9b6e79");
    title.setAttribute("font-size", "11");
    title.textContent = label;

    g.appendChild(skin);
    g.appendChild(details);
    g.appendChild(title);
    svg.appendChild(g);
  }

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_USER) || "null");
    } catch (_) {
      return null;
    }
  }

  function getRecords() {
    try {
      const rows = JSON.parse(localStorage.getItem(STORAGE_RECORDS) || "[]");
      return Array.isArray(rows) ? rows : [];
    } catch (_) {
      return [];
    }
  }

  function saveRecords(records) {
    localStorage.setItem(STORAGE_RECORDS, JSON.stringify(records));
  }

  function filterByDays(records, days) {
    const now = Date.now();
    const ms = days * 24 * 60 * 60 * 1000;
    return records.filter((r) => now - Date.parse(r.timestamp) <= ms);
  }

  function countByPart(records) {
    const out = {};
    records.forEach((r) => {
      out[r.body_part] = (out[r.body_part] || 0) + 1;
    });
    return out;
  }

  function partLabel(key) {
    const found = BODY_PARTS.find((p) => p.key === key);
    if (!found) return key;
    return found[lang];
  }

  function createId() {
    return "r_" + Math.random().toString(36).slice(2, 9) + "_" + Date.now().toString(36);
  }

  function toDateTimeLocal(date) {
    const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return d.toISOString().slice(0, 16);
  }

  function formatDate(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString(lang === "zh" ? "zh-CN" : "en-US", { hour12: false });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
})();
