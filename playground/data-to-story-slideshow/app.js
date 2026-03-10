(function () {
  const fileInput = document.getElementById("csvFile");
  const csvText = document.getElementById("csvText");
  const generateBtn = document.getElementById("generateBtn");
  const sampleBtn = document.getElementById("sampleBtn");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const statusEl = document.getElementById("status");

  const schemaPanel = document.getElementById("schemaPanel");
  const schemaEl = document.getElementById("schema");
  const slidesPanel = document.getElementById("slidesPanel");
  const slidesEl = document.getElementById("slides");

  let latestMarkdown = "";

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

  sampleBtn.addEventListener("click", () => {
    csvText.value = SAMPLE;
    fileInput.value = "";
    setStatus("Sample data loaded.");
  });

  generateBtn.addEventListener("click", async () => {
    setStatus("Parsing CSV...");
    try {
      const raw = await getRawCsv();
      const rows = parseCsv(raw);
      if (!rows.length) throw new Error("No rows found in CSV.");
      const summary = summarize(rows);
      const slides = makeSlides(summary);
      renderSchema(summary);
      renderSlides(slides);
      latestMarkdown = toMarkdown(summary, slides);

      copyBtn.disabled = false;
      downloadBtn.disabled = false;
      setStatus("3-slide draft generated.");
    } catch (err) {
      setStatus("Error: " + err.message);
      schemaPanel.hidden = true;
      slidesPanel.hidden = true;
      copyBtn.disabled = true;
      downloadBtn.disabled = true;
      latestMarkdown = "";
    }
  });

  copyBtn.addEventListener("click", async () => {
    if (!latestMarkdown) return;
    try {
      await navigator.clipboard.writeText(latestMarkdown);
      setStatus("Markdown copied to clipboard.");
    } catch (err) {
      setStatus("Clipboard blocked. Use Download .md instead.");
    }
  });

  downloadBtn.addEventListener("click", () => {
    if (!latestMarkdown) return;
    const blob = new Blob([latestMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data-story-slides.md";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setStatus("Markdown file downloaded.");
  });

  async function getRawCsv() {
    if (fileInput.files && fileInput.files[0]) return fileInput.files[0].text();
    if (csvText.value.trim()) return csvText.value.trim();
    throw new Error("Upload a CSV file or paste CSV text first.");
  }

  function setStatus(msg) {
    statusEl.textContent = msg;
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

    const headers = splitCsvLine(lines[0]).map((h, idx) => String(h || "").trim() || "column_" + (idx + 1));
    const rows = [];
    for (let i = 1; i < lines.length; i += 1) {
      const vals = splitCsvLine(lines[i]);
      if (!vals.some((v) => String(v).trim() !== "")) continue;
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = (vals[idx] || "").trim();
      });
      rows.push(row);
    }
    return rows;
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

  function summarize(rows) {
    const columns = Object.keys(rows[0]);
    const types = inferTypes(rows, columns);
    const numericCols = columns.filter((c) => types[c] === "numeric");
    const dateCols = columns.filter((c) => types[c] === "date");
    const categoricalCols = columns.filter((c) => types[c] === "categorical");
    if (!numericCols.length) throw new Error("At least one numeric metric column is required.");

    const metric = pickMetric(numericCols);
    const dateCol = dateCols[0] || null;
    const categoryCol = pickCategory(categoricalCols);

    const metricVals = rows.map((r) => toNumber(r[metric])).filter(Number.isFinite);
    if (!metricVals.length) throw new Error("Metric column has no valid numeric values.");
    const stats = getStats(metricVals);
    const topGroups = categoryCol ? groupTop(rows, categoryCol, metric, 3) : [];
    const trend = dateCol ? timeTrend(rows, dateCol, metric) : null;

    return {
      rowsCount: rows.length,
      columns,
      types,
      metric,
      dateCol,
      categoryCol,
      stats,
      topGroups,
      trend,
    };
  }

  function inferTypes(rows, columns) {
    const out = {};
    columns.forEach((col) => {
      const vals = rows.map((r) => String(r[col] || "").trim()).filter(Boolean);
      const numRate = vals.filter((v) => Number.isFinite(toNumber(v))).length / (vals.length || 1);
      const dateRate = vals.filter((v) => Number.isFinite(Date.parse(v))).length / (vals.length || 1);
      const uniq = new Set(vals).size;

      if (numRate >= 0.85) out[col] = "numeric";
      else if (dateRate >= 0.85) out[col] = "date";
      else if (uniq <= Math.min(30, Math.floor(vals.length * 0.5))) out[col] = "categorical";
      else out[col] = "text";
    });
    return out;
  }

  function pickMetric(numericCols) {
    const pref = ["revenue", "sales", "conversion", "profit", "sessions", "count"];
    for (let i = 0; i < pref.length; i += 1) {
      const found = numericCols.find((c) => c.toLowerCase().includes(pref[i]));
      if (found) return found;
    }
    return numericCols[0];
  }

  function pickCategory(categoricalCols) {
    return categoricalCols[0] || null;
  }

  function getStats(values) {
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const sorted = values.slice().sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    return { sum, avg, min, max };
  }

  function groupTop(rows, categoryCol, metricCol, limit) {
    const map = {};
    rows.forEach((r) => {
      const key = String(r[categoryCol] || "Unknown");
      const val = toNumber(r[metricCol]);
      if (!Number.isFinite(val)) return;
      map[key] = (map[key] || 0) + val;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  }

  function timeTrend(rows, dateCol, metricCol) {
    const map = {};
    rows.forEach((r) => {
      const t = Date.parse(r[dateCol]);
      const val = toNumber(r[metricCol]);
      if (!Number.isFinite(t) || !Number.isFinite(val)) return;
      const key = new Date(t).toISOString().slice(0, 10);
      map[key] = (map[key] || 0) + val;
    });
    const series = Object.entries(map)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    if (series.length < 2) return null;
    const first = series[0];
    const last = series[series.length - 1];
    const delta = last.value - first.value;
    const pct = first.value ? (delta / first.value) * 100 : null;
    return { first, last, delta, pct };
  }

  function makeSlides(summary) {
    const s1 = {
      number: 1,
      title: "Executive Snapshot",
      message:
        "Total " +
        summary.metric +
        " is " +
        fmt(summary.stats.sum) +
        " across " +
        summary.rowsCount +
        " records, with average " +
        fmt(summary.stats.avg) +
        ".",
      bullets: [
        "Range: " + fmt(summary.stats.min) + " to " + fmt(summary.stats.max),
        summary.trend
          ? "Trend: " +
            (summary.trend.delta >= 0 ? "up " : "down ") +
            fmt(summary.trend.delta) +
            " (" +
            fmtPct(summary.trend.pct) +
            ")"
          : "Trend: no robust time series detected",
        "Primary metric: " + summary.metric,
      ],
      chart: summary.dateCol ? "Line chart (" + summary.dateCol + " vs " + summary.metric + ")" : "KPI tiles + histogram",
      notes:
        "Open with one sentence on current performance and whether momentum is positive or negative. Keep this slide non-technical.",
    };

    const top = summary.topGroups[0] || { name: "N/A", value: 0 };
    const s2 = {
      number: 2,
      title: "What's Driving the Result",
      message: summary.categoryCol
        ? "Performance is uneven by `" + summary.categoryCol + "`, led by `" + top.name + "`."
        : "No clean category field found, so segmentation is limited in this draft.",
      bullets: summary.categoryCol
        ? summary.topGroups.map((g, idx) => "#" + (idx + 1) + " " + g.name + ": " + fmt(g.value) + " " + summary.metric)
        : ["Add one categorical column (e.g., channel, region, campaign) to unlock driver analysis."],
      chart: summary.categoryCol
        ? "Sorted bar chart (" + summary.categoryCol + " contribution)"
        : "N/A until category column is added",
      notes: "Contrast top and lagging segments. Explain why the top segment is leading and what can be replicated.",
    };

    const actionFocus = summary.categoryCol && top ? top.name : "highest-impact segment";
    const s3 = {
      number: 3,
      title: "Action Plan for Next Cycle",
      message: "Focus next sprint on controlled experiments to improve `" + summary.metric + "`.",
      bullets: [
        "Double down on " + actionFocus + " and document transferable tactics.",
        "Design one test for underperforming segments using the same KPI definition.",
        "Set weekly checkpoint: monitor " + summary.metric + " and variance by segment.",
      ],
      chart: "Before/after slope chart + experiment tracker table",
      notes:
        "Close with a concrete 2-4 week plan: owner, test design, and success threshold. This turns analysis into execution.",
    };

    return [s1, s2, s3];
  }

  function renderSchema(summary) {
    schemaEl.innerHTML = "";
    summary.columns.forEach((col) => {
      const el = document.createElement("article");
      el.className = "schema-pill";
      el.innerHTML = "<strong>" + escapeHtml(col) + "</strong><span>" + escapeHtml(summary.types[col]) + "</span>";
      schemaEl.appendChild(el);
    });
    schemaPanel.hidden = false;
  }

  function renderSlides(slides) {
    slidesEl.innerHTML = "";
    slides.forEach((slide) => {
      const card = document.createElement("article");
      card.className = "slide-card";
      card.innerHTML =
        "<h3>Slide " +
        slide.number +
        ": " +
        escapeHtml(slide.title) +
        "</h3>" +
        "<p>" +
        escapeHtml(slide.message) +
        "</p>" +
        "<ul>" +
        slide.bullets.map((b) => "<li>" + escapeHtml(b) + "</li>").join("") +
        "</ul>" +
        '<p class="meta"><strong>Chart:</strong> ' +
        escapeHtml(slide.chart) +
        "</p>" +
        '<p class="meta"><strong>Speaker note:</strong> ' +
        escapeHtml(slide.notes) +
        "</p>";
      slidesEl.appendChild(card);
    });
    slidesPanel.hidden = false;
  }

  function toMarkdown(summary, slides) {
    const lines = [];
    lines.push("# Data-to-Story Slideshow Draft");
    lines.push("");
    lines.push("## Dataset Summary");
    lines.push("- Rows: " + summary.rowsCount);
    lines.push("- Metric: `" + summary.metric + "`");
    lines.push("- Category: `" + (summary.categoryCol || "N/A") + "`");
    lines.push("- Date: `" + (summary.dateCol || "N/A") + "`");
    lines.push("- Total " + summary.metric + ": " + fmt(summary.stats.sum));
    lines.push("");

    slides.forEach((slide) => {
      lines.push("## Slide " + slide.number + ": " + slide.title);
      lines.push(slide.message);
      lines.push("");
      lines.push("Key points:");
      slide.bullets.forEach((b) => lines.push("- " + b));
      lines.push("");
      lines.push("Chart recommendation: " + slide.chart);
      lines.push("");
      lines.push("Speaker note: " + slide.notes);
      lines.push("");
    });

    return lines.join("\n");
  }

  function toNumber(val) {
    const cleaned = String(val || "").replace(/[$,%\s]/g, "").replace(/,/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : NaN;
  }

  function fmt(n) {
    return Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  function fmtPct(n) {
    if (n === null || !Number.isFinite(n)) return "n/a";
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
