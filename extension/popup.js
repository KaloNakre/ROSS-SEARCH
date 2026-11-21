// ROSS-SEARCH Browser Extension Popup Engine
const BACKEND_URL = "http://localhost:8000";

let currentActiveUrl = "";
let currentActiveDomain = "";
let chatHistory = [];

document.addEventListener("DOMContentLoaded", async () => {
  setupTabs();
  checkBackendHealth();
  await detectActiveTab();

  // Audit Button listener
  const btnAudit = document.getElementById("btnAuditDomain");
  if (btnAudit) {
    btnAudit.addEventListener("click", () => runDomainAudit(currentActiveUrl || currentActiveDomain));
  }

  // Chat Form listener
  const chatForm = document.getElementById("chatForm");
  if (chatForm) {
    chatForm.addEventListener("submit", handleChatSubmit);
  }

  // Search Papers listener
  const btnSearch = document.getElementById("btnSearchPapers");
  if (btnSearch) {
    btnSearch.addEventListener("click", handlePaperSearch);
  }
  const paperInput = document.getElementById("paperSearchInput");
  if (paperInput) {
    paperInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handlePaperSearch();
    });
  }
});

function setupTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      const targetId = tab.getAttribute("data-tab");
      const content = document.getElementById(targetId);
      if (content) content.classList.add("active");
    });
  });
}

async function checkBackendHealth() {
  const statusEl = document.getElementById("backendStatus");
  try {
    const res = await fetch(`${BACKEND_URL}/`);
    if (res.ok) {
      statusEl.style.color = "#10b981";
      statusEl.title = "Connected to ROSS-SEARCH Core";
    } else {
      statusEl.style.color = "#f59e0b";
      statusEl.title = "Backend responding with warning";
    }
  } catch (err) {
    statusEl.style.color = "#ef4444";
    statusEl.title = "Backend offline (Ensure FastAPI server is running on localhost:8000)";
  }
}

async function detectActiveTab() {
  const displayEl = document.getElementById("activeDomainDisplay");
  try {
    if (chrome && chrome.tabs && chrome.tabs.query) {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs && tabs[0] && tabs[0].url) {
        currentActiveUrl = tabs[0].url;
        const parsed = new URL(currentActiveUrl);
        currentActiveDomain = parsed.hostname;
        displayEl.textContent = `${currentActiveDomain} (${parsed.protocol.replace(':', '').toUpperCase()})`;
        return;
      }
    }
  } catch (e) {
    console.log("Tab detection fallback:", e);
  }
  currentActiveDomain = "daffodilvarsity.edu.bd";
  currentActiveUrl = "https://daffodilvarsity.edu.bd";
  displayEl.textContent = "daffodilvarsity.edu.bd (DIU Portal)";
}

async function runDomainAudit(target) {
  const loader = document.getElementById("auditLoading");
  const results = document.getElementById("auditResults");
  const btn = document.getElementById("btnAuditDomain");

  loader.classList.remove("hidden");
  results.classList.add("hidden");
  btn.disabled = true;

  try {
    const res = await fetch(`${BACKEND_URL}/api/extension/analyze-domain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url_or_domain: target })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `Server error (${res.status})`);
    }

    const data = await res.json();
    renderAuditResults(data);
  } catch (err) {
    alert(`Domain Audit Failed: ${err.message}`);
  } finally {
    loader.classList.add("hidden");
    btn.disabled = false;
  }
}

function renderAuditResults(data) {
  const results = document.getElementById("auditResults");
  const riskScore = document.getElementById("riskScore");
  const riskBadge = document.getElementById("riskBadge");
  const tlsStatus = document.getElementById("tlsStatus");
  const techPills = document.getElementById("techPills");
  const missingHeadersList = document.getElementById("missingHeadersList");
  const aiDomainInsight = document.getElementById("aiDomainInsight");

  riskScore.textContent = data.security_score;
  riskBadge.textContent = `${data.risk_level} RISK`;
  riskBadge.className = `risk-level-badge risk-${data.risk_level.toLowerCase()}`;

  tlsStatus.textContent = data.tls_active ? "🔒 TLS/HTTPS Active" : "⚠️ Insecure HTTP Protocol";

  // Tech stack pills
  techPills.innerHTML = "";
  if (data.server_technologies && data.server_technologies.length > 0) {
    data.server_technologies.forEach(tech => {
      const span = document.createElement("span");
      span.className = "pill";
      span.textContent = tech;
      techPills.appendChild(span);
    });
  } else {
    techPills.innerHTML = '<span class="pill">Undisclosed Server Stack</span>';
  }

  // Missing headers
  missingHeadersList.innerHTML = "";
  if (data.missing_headers && data.missing_headers.length > 0) {
    data.missing_headers.forEach(h => {
      const div = document.createElement("div");
      div.className = "missing-item";
      div.textContent = `❌ Missing: ${h}`;
      missingHeadersList.appendChild(div);
    });
  } else {
    missingHeadersList.innerHTML = '<div style="font-size:11px;color:#15803d;">✅ All recommended security headers detected!</div>';
  }

  aiDomainInsight.textContent = data.ai_analysis_summary;

  // 12-Point Technical Security Audit breakdown
  const sectionsBox = document.getElementById("auditSectionsBox");
  if (sectionsBox) {
    sectionsBox.innerHTML = "";
    if (data.audit_sections && typeof data.audit_sections === "object") {
      Object.entries(data.audit_sections).forEach(([secTitle, secContent]) => {
        const row = document.createElement("div");
        row.className = "audit-section-row";
        row.innerHTML = `<span class="audit-sec-label">${escapeHtml(secTitle)}:</span> <span class="audit-sec-val">${escapeHtml(secContent)}</span>`;
        sectionsBox.appendChild(row);
      });
    } else {
      sectionsBox.innerHTML = '<div style="font-size: 10.5px; color: #64748b;">Comprehensive domain audit complete.</div>';
    }
  }

  results.classList.remove("hidden");
}

async function handleChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("chatInput");
  const message = input.value.trim();
  if (!message) return;

  const container = document.getElementById("chatContainer");

  // Append user message
  const userDiv = document.createElement("div");
  userDiv.className = "chat-message user";
  userDiv.textContent = message;
  container.appendChild(userDiv);
  input.value = "";
  container.scrollTop = container.scrollHeight;

  // Add thinking message
  const botDiv = document.createElement("div");
  botDiv.className = "chat-message bot";
  botDiv.innerHTML = "<em>Analyzing with ROSS-SEARCH Research Intelligence...</em>";
  container.appendChild(botDiv);
  container.scrollTop = container.scrollHeight;

  try {
    const res = await fetch(`${BACKEND_URL}/api/research/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message,
        history: chatHistory,
        model_choice: "auto"
      })
    });

    if (!res.ok) throw new Error("Chat service unavailable");
    const data = await res.json();

    botDiv.innerHTML = `<strong>${data.model_used}:</strong><br>${escapeHtml(data.reply).replace(/\n/g, '<br>')}`;
    chatHistory.push({ role: "user", content: message });
    chatHistory.push({ role: "assistant", content: data.reply });
  } catch (err) {
    botDiv.innerHTML = `<span style="color:#ef4444;">⚠️ Unable to reach AI Research Assistant. Ensure backend is running.</span>`;
  }
  container.scrollTop = container.scrollHeight;
}

async function handlePaperSearch() {
  const input = document.getElementById("paperSearchInput");
  const query = input.value.trim();
  const container = document.getElementById("paperList");

  container.innerHTML = `<div class="loader-box"><div class="spinner"></div><div class="loader-text">Querying open-access academic papers...</div></div>`;

  try {
    const url = `${BACKEND_URL}/api/research/academic-papers?q=${encodeURIComponent(query)}&limit=8`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Search failed");
    const papers = await res.json();

    if (!papers || papers.length === 0) {
      container.innerHTML = '<div class="paper-placeholder">No matching papers found. Try another research query.</div>';
      return;
    }

    container.innerHTML = "";
    papers.forEach(p => {
      const card = document.createElement("div");
      card.className = "paper-item";
      card.innerHTML = `
        <a href="${p.pdf_url}" target="_blank" class="paper-item-title">${escapeHtml(p.title)}</a>
        <div class="paper-item-authors">${escapeHtml(p.authors)} (${p.year})</div>
        <div class="paper-item-meta">
          <span class="paper-badge">${escapeHtml(p.domain)}</span>
          <a href="${BACKEND_URL}${p.download_url}" target="_blank" class="paper-download-link">📥 PDF Direct</a>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = `<div class="paper-placeholder" style="color:#ef4444;">Search failed. Check backend connection.</div>`;
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
