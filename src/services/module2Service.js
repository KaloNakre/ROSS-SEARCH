/**
 * Research & Academic Intelligence Service
 * 
 * Contributor Responsibilities:
 * 1. [Paper Discovery]: Research domains, paper discovery & previous departmental projects archive
 * 2. [AI Analysis]: AI Paper Summarizer Engine (PyMuPDF + Gemini/Groq + AI research analysis)
 * 3. [Topic Intelligence]: Topic similarity & duplicate FYP detector
 * 4. [Topic Intelligence]: Shared paper knowledge repository
 */

const API_BASE = '/api/research';

export const module2Service = {
  // ── Published Academic Papers Catalog (arXiv, Crossref) ──
  async getAcademicPapers(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.domain && filters.domain !== 'All') params.append('domain', filters.domain);
      if (filters.q) params.append('q', filters.q);
      if (filters.year_from) params.append('year_from', filters.year_from);
      if (filters.year_to) params.append('year_to', filters.year_to);
      if (filters.author) params.append('author', filters.author);
      if (filters.limit) params.append('limit', filters.limit);

      const res = await fetch(`${API_BASE}/academic-papers?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch academic papers catalog');
      return await res.json();
    } catch (err) {
      console.warn('Academic papers fetch failed:', err);
      return [];
    }
  },

  // ── Previous Departmental Projects Archive ─────────
  async getPreviousProjects(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.domain && filters.domain !== 'All') params.append('domain', filters.domain);
      if (filters.batch && filters.batch !== 'All') params.append('batch', filters.batch);
      if (filters.supervisor && filters.supervisor !== 'All') params.append('supervisor', filters.supervisor);
      if (filters.q) params.append('q', filters.q);

      const res = await fetch(`${API_BASE}/previous-projects?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch previous projects archive');
      return await res.json();
    } catch (err) {
      console.warn('Backend fetch failed, returning fallback dataset:', err);
      return [];
    }
  },

  async logResearchQuery(payload) {
    try {
      const form = new FormData();
      form.append('query_text', payload.query_text);
      if (payload.domain) form.append('domain', payload.domain);
      if (payload.student_id) form.append('student_id', payload.student_id);
      if (payload.student_name) form.append('student_name', payload.student_name);

      const res = await fetch(`${API_BASE}/log-query`, {
        method: 'POST',
        body: form
      });
      return await res.json();
    } catch (err) {
      console.warn('Logging query failed:', err);
    }
  },

  // ── AI Research Breakdown Engine (Gemini / Groq / Neural NLP) ──
  async summarizePaper({ file, paperUrl, rawText, modelChoice = 'auto', apiKey, promptFocus = 'full_analysis', language = 'bilingual' }) {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    } else if (paperUrl) {
      formData.append('paper_url', paperUrl.trim());
    } else if (rawText) {
      formData.append('raw_text', rawText);
    } else {
      throw new Error('Please select a PDF file, provide an open-access PDF URL, or paste research paper text.');
    }

    formData.append('model_choice', modelChoice);
    if (apiKey && apiKey.trim()) {
      formData.append('api_key', apiKey.trim());
    }
    if (promptFocus) {
      formData.append('prompt_focus', promptFocus);
    }
    if (language) {
      formData.append('language', language);
    }

    const res = await fetch(`${API_BASE}/summarize-pdf`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to analyze and summarize research paper.');
    }

    return await res.json();
  },

  // ── [Public Access] AI Research Chatbot (No Login Required) ───────────────
  async sendChatMessage({ message, history = [], modelChoice = 'auto' }) {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history,
        model_choice: modelChoice
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Research Assistant chatbot unavailable.');
    }

    return await res.json();
  },

  // ── Personal Research Library & Reading List ─────────────────────────────
  async getLibrary(token) {
    const res = await fetch(`${API_BASE}/library`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch personal research library.');
    return await res.json();
  },

  async saveToLibrary(paperPayload, token) {
    const res = await fetch(`${API_BASE}/library/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paperPayload)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to save paper to reading library.');
    }
    return await res.json();
  },

  async deleteFromLibrary(savedId, token) {
    const res = await fetch(`${API_BASE}/library/${savedId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete paper from library.');
    return await res.json();
  },

  async exportLibrary(format = 'bibtex', token) {
    const res = await fetch(`${API_BASE}/library/export?format=${format}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to export library.');
    return res;
  },

  // ── Topic Similarity & Duplicate Check ───────
  async checkSimilarity({ title, abstract, domain }) {
    const res = await fetch(`${API_BASE}/check-similarity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, abstract, domain })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to execute topic similarity check.');
    }

    return await res.json();
  },

  async registerThesisTopic(title, token, domain = null) {
    const res = await fetch(`${API_BASE}/register-topic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, domain })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to register thesis topic.');
    }
    return await res.json();
  },

  // ── Shared Paper Knowledge Repository ────────
  async getSharedPaperKnowledge(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.domain && filters.domain !== 'All') params.append('domain', filters.domain);
      if (filters.q) params.append('q', filters.q);

      const res = await fetch(`${API_BASE}/shared-knowledge?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load shared paper knowledge repository.');
      return await res.json();
    } catch (err) {
      console.warn('Shared knowledge fetch error:', err);
      return [];
    }
  },

  async saveToSharedKnowledge(payload) {
    const res = await fetch(`${API_BASE}/shared-knowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to store structured analysis in shared repository.');
    }

    return await res.json();
  },

  async getSharedPaperDetail(itemId) {
    const res = await fetch(`${API_BASE}/shared-knowledge/${itemId}`);
    if (!res.ok) throw new Error('Failed to fetch shared paper details.');
    return await res.json();
  },

  // ── Novel Thesis Topic Suggestions ───────────────────────────────────────
  async getSuggestedTopics(domain) {
    try {
      const url = domain && domain !== 'All' 
        ? `${API_BASE}/suggest-topics?domain=${encodeURIComponent(domain)}`
        : `${API_BASE}/suggest-topics`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch topic suggestions');
      return await res.json();
    } catch (err) {
      console.warn('Suggested topics fetch failed:', err);
      return [];
    }
  },

  // ── Research Discovery Query History & Audit ──
  async getQueryHistory(domain = null, limit = 25) {
    try {
      const params = new URLSearchParams();
      if (domain && domain !== 'All') params.append('domain', domain);
      if (limit) params.append('limit', limit);
      const res = await fetch(`${API_BASE}/query-history?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load query history');
      return await res.json();
    } catch (err) {
      console.warn('Query history fetch error:', err);
      return [];
    }
  },

  async markPaperDownloaded(savedId, token) {
    const res = await fetch(`${API_BASE}/library/${savedId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ is_downloaded: true })
    });
    if (!res.ok) throw new Error('Failed to update download status.');
    return await res.json();
  },

  // ── Browser Extension Domain Auditor ─────────────────────────────────────
  async auditDomain(urlOrDomain) {
    const res = await fetch('/api/extension/analyze-domain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url_or_domain: urlOrDomain })
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to audit domain.');
    }
    return await res.json();
  }
};
