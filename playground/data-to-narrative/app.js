(function () {
  const fileInput = document.getElementById("csvFile");
  const csvText = document.getElementById("csvText");
  const runBtn = document.getElementById("runBtn");
  const loadSampleBtn = document.getElementById("loadSampleBtn");
  const statusEl = document.getElementById("status");

  const schemaCard = document.getElementById("schemaCard");
  const schemaGrid = document.getElementById("schemaGrid");
  const insightsCard = document.getElementById("insightsCard");
  const insightsList = document.getElementById("insightsList");
  const narrativeCard = document.getElementById("narrativeCard");
  const headlineText = document.getElementById("headlineText");
  const problemText = document.getElementById("problemText");
  const insightText = document.getElementById("insightText");
  const actionText = document.getElementById("actionText");

  const SAMPLE = [
    "channel,month,sessions,conversions,revenue",
    "Email,2026-01,1200,66,4200",
    "Social,2026-01,2100,74,5100",
    "Search,2026-01,2700,128,9800",
    "Email,2026-02,1400,82,5500",
    "Social,2026-02,2200,78,5300",
    "Search,2026-02,2600,121,9400",
    "Email,2026-03,1600,98,6600",
    "Social,2026-03,2500,96,6900",
    "Search,2026-03,2550,110,9000",
  ].join("\n");

  loadSampleBtn.addEventListener("click", function () {
    csvText.value = SAMPLE;
    fileInput.value = "";
    setStatus("Sample loaded.");
  });

  runBtn.addEventListener("click", async function () {
    setStatus("Reading data...");
    try {
      const raw = await getRawCsv();
      const rows = parseCsv(raw);
      if (!rows.length) {
        throw new Error("No rows found.");
      }
      if (!rows[0] || Object.keys(rows[0]).length < 2) {
        throw new Error("CSV needs at least 2 columns.");
      }

      const summary = summarize(rows);
      render(summary);
      setStatus("Narrative generated.");
    } catch (err) {
      setStatus("Error: " + err.message);
      hideOutputs();
    }
  });

  async function getRawCsv() {
    if (fileInput.files && fileInput.files[0]) {
      return fileInput.files[0].text();
    }
    if (csvText.value.trim()) {
      return csvText.value.trim();
    }
    throw new Error("Upload a CSV file or paste CSV text first.");
  }

  function setStatus(message) {
    statusEl.textContent = message;
  }

  function hideOutputs() {
    schemaCard.hidden = true;
    insightsCard.hidden = true;
    narrativeCard.hidden = true;
  }

  function parseCsv(raw) {
    const lines = [];
    let cur = "";
    let inQuotes = false;

    for (let i = 0; i < raw.length; i += 1) {
      const ch = raw[i];
      if (ch === '"') {
        if (inQuotes && raw[i + 1] === '"') {
          cur += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if ((ch === "\n" || ch === "\r") && !inQuotes) {
        if (cur.trim()) lines.push(cur);
        cur = "";
        if (ch === "\r" && raw[i + 1] === "\n") i += 1;
      } else {
        cur += ch;
      }
    }
    if (cur.trim()) lines.push(cur);

    if (!lines.length) return [];

    const headers = splitCsvLine(lines[0]).map(cleanHeader);
    const out = [];

    for (let i = 1; i < lines.length; i += 1) {
      const vals = splitCsvLine(lines[i]);
      if (!vals.some((v) => String(v).trim() !== "")) continue;
      const row = {};
      headers.forEach(function (h, idx) {
        row[h] = (vals[idx] || "").trim();
      });
      out.push(row);
    }

    return out;
  }

  function splitCsvLine(line) {
    const cols = [];
    let cur = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        cols.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    cols.push(cur);
    return cols;
  }

  function cleanHeader(h, idx) {
    const value = String(h || "").trim();
    return value || "column_" + (idx + 1);
  }

  function summarize(rows) {
    const columns = Object.keys(rows[0]);
    const types = inferTypes(rows, columns);
    const numericCols = columns.filter((c) => types[c] === "numeric");
    const dateCols = columns.filter((c) => types[c] === "date");
    const categoricalCols = columns.filter((c) => types[c] === "categorical");

    if (!numericCols.length) {
      throw new Error("No numeric column detected. Include at least one metric column.");
    }

    const metric = chooseMetricName(numericCols);
    const category = chooseCategoryName(categoricalCols, metric);
    const dateCol = dateCols[0] || null;
    const metricValues = rows.map((r) => toNumber(r[metric])).filter((n) => Number.isFinite(n));

    const stats = calcStats(metricValues);
    const topGroups = category ? getTopGroups(rows, category, metric, 3) : [];
    const trend = dateCol ? computeTrend(rows, dateCol, metric) : null;

    return {
      rowsCount: rows.length,
      columns,
      types,
      metric,
      category,
      dateCol,
      stats,
      topGroups,
      trend,
    };
  }

  function inferTypes(rows, columns) {
    const out = {};
    columns.forEach(function (col) {
      const values = rows.map((r) => String(r[col] || "").trim()).filter(Boolean);
      if (!values.length) {
        out[col] = "text";
        return;
      }
      const numRate = values.filter((v) => Number.isFinite(toNumber(v))).length / values.length;
      const dateRate = values.filter((v) => Number.isFinite(Date.parse(v))).length / values.length;
      const uniq = new Set(values).size;

      if (numRate >= 0.85) out[col] = "numeric";
      else if (dateRate >= 0.85) out[col] = "date";
      else if (uniq <= Math.min(25, Math.floor(values.length * 0.5))) out[col] = "categorical";
      else out[col] = "text";
    });
    return out;
  }

  function chooseMetricName(numericCols) {
    const preferred = ["revenue", "sales", "amount", "conversion", "conversions", "profit", "sessions", "count"];
    for (let i = 0; i < preferred.length; i += 1) {
      const found = numericCols.find((c) => c.toLowerCase().includes(preferred[i]));
      if (found) return found;
    }
    return numericCols[0];
  }

  function chooseCategoryName(categoricalCols, metric) {
    const filtered = categoricalCols.filter((c) => c !== metric);
    return filtered[0] || null;
  }

  function calcStats(values) {
    const sorted = values.slice().sort((a, b) => a - b);
    const total = values.reduce((acc, cur) => acc + cur, 0);
    const avg = total / values.length;
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    return {
      total,
      avg,
      median,
      min: sorted[0],
      max: sorted[sorted.length - 1],
    };
  }

  function getTopGroups(rows, groupCol, metricCol, limit) {
    const map = {};
    rows.forEach(function (r) {
      const group = String(r[groupCol] || "Unknown");
      const value = toNumber(r[metricCol]);
      if (!Number.isFinite(value)) return;
      map[group] = (map[group] || 0) + value;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  }

  function computeTrend(rows, dateCol, metricCol) {
    const map = {};
    rows.forEach(function (r) {
      const t = Date.parse(r[dateCol]);
      const v = toNumber(r[metricCol]);
      if (!Number.isFinite(t) || !Number.isFinite(v)) return;
      const key = new Date(t).toISOString().slice(0, 10);
      map[key] = (map[key] || 0) + v;
    });

    const series = Object.entries(map)
      .map(([k, v]) => ({ date: k, value: v }))
      .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

    if (series.length < 2) return null;

    const first = series[0];
    const last = series[series.length - 1];
    const delta = last.value - first.value;
    const pct = first.value === 0 ? null : (delta / first.value) * 100;

    return { first, last, delta, pct };
  }

  function toNumber(raw) {
    const val = String(raw || "").replace(/[$,%\s]/g, "").replace(/,/g, "");
    const n = Number(val);
    return Number.isFinite(n) ? n : NaN;
  }

  function render(summary) {
    renderSchema(summary);
    renderInsights(summary);
    renderNarrative(summary);

    schemaCard.hidden = false;
    insightsCard.hidden = false;
    narrativeCard.hidden = false;
  }

  function renderSchema(summary) {
    schemaGrid.innerHTML = "";
    summary.columns.forEach(function (col) {
      const item = document.createElement("article");
      item.className = "schema-item";
      item.innerHTML = "<strong>" + escapeHtml(col) + "</strong><p>" + escapeHtml(summary.types[col]) + "</p>";
      schemaGrid.appendChild(item);
    });
  }

  function renderInsights(summary) {
    const insights = buildInsights(summary);
    insightsList.innerHTML = "";
    insights.forEach(function (line) {
      const li = document.createElement("li");
      li.textContent = line;
      insightsList.appendChild(li);
    });
  }

  function renderNarrative(summary) {
    const draft = buildNarrative(summary);
    headlineText.textContent = draft.headline;
    problemText.textContent = draft.problem;
    insightText.textContent = draft.insight;
    actionText.textContent = draft.action;
  }

  function buildInsights(summary) {
    const lines = [];
    const s = summary.stats;
    lines.push(
      "Dataset has " +
        summary.rowsCount +
        " rows. Primary metric `" +
        summary.metric +
        "` totals " +
        fmtNum(s.total) +
        " with average " +
        fmtNum(s.avg) +
        "."
    );

    if (summary.topGroups.length) {
      const top = summary.topGroups[0];
      lines.push(
        "Top `" + summary.category + "` segment is `" + top.name + "` at " + fmtNum(top.value) + " " + summary.metric + "."
      );
    }

    if (summary.trend) {
      const direction = summary.trend.delta >= 0 ? "up" : "down";
      const pct = summary.trend.pct === null ? "" : " (" + fmtPct(summary.trend.pct) + ")";
      lines.push(
        "Trend across `" +
          summary.dateCol +
          "` is " +
          direction +
          " by " +
          fmtNum(summary.trend.delta) +
          pct +
          ", from " +
          fmtNum(summary.trend.first.value) +
          " to " +
          fmtNum(summary.trend.last.value) +
          "."
      );
    } else {
      lines.push("No reliable time trend detected. Add a date column for temporal narrative.");
    }

    return lines;
  }

  function buildNarrative(summary) {
    const insights = buildInsights(summary);
    const best = summary.topGroups[0];
    const hasTrend = Boolean(summary.trend);
    const trendWord = hasTrend ? (summary.trend.delta >= 0 ? "growth" : "decline") : "performance spread";

    const headline =
      "Narrative draft: " +
      trendWord +
      " in " +
      summary.metric +
      (best ? ", led by " + best.name : "") +
      ".";

    const problem =
      "The team needs a concise explanation of what is driving `" +
      summary.metric +
      "` and where to focus next. Current reporting is data-heavy but not story-ready.";

    const insight =
      insights.join(" ") +
      (best
        ? " The strongest contribution currently comes from `" + best.name + "`, making it the benchmark segment."
        : "");

    const action =
      "Build the next update around 3 slides: (1) baseline metric summary, (2) segment comparison on `" +
      (summary.category || "key dimensions") +
      "`, (3) targeted experiment plan for the next period with a clear success metric.";

    return { headline, problem, insight, action };
  }

  function fmtNum(n) {
    return Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  function fmtPct(n) {
    return (Math.round(n * 100) / 100).toFixed(2) + "%";
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
