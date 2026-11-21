/**
 * Module 2 Service: Research Discovery and Shared Paper Knowledge
 * 
 * Contributor Responsibilities:
 * 1. [Riya Saha - ID: 232-35-715]: Research domains, paper discovery & previous departmental projects archive
 * 2. [Robayet Islam - ID: 232-35-809]: AI Paper Summarizer Engine (PyMuPDF + Gemini/Groq + 9-point structured summary)
 * 3. [Tamim Hasan Sami - ID: 232-35-313]: Topic similarity & duplicate FYP detector
 * 4. [Tamim Hasan Sami - ID: 232-35-313]: Shared paper knowledge repository
 */

const API_BASE = '/api/research';

export const module2Service = {
  // ── [Riya Saha – ID: 715] Published Academic Papers Catalog ──────────────
  async getAcademicPapers(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.domain && filters.domain !== 'All') params.append('domain', filters.domain);
      if (filters.q) params.append('q', filters.q);

      const res = await fetch(`${API_BASE}/academic-papers?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch academic papers catalog');
      return await res.json();
    } catch (err) {
      console.warn('Academic papers fetch failed:', err);
      return [];
    }
  },

  // ── [Riya Saha – ID: 715] Previous Departmental Projects Archive ─────────
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

  // ── [Robayet Islam – ID: 809] AI Paper Summarizer Engine (PyMuPDF + Gemini/Groq) ──
  async summarizePaper({ file, rawText, apiKey }) {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    } else if (rawText) {
      formData.append('raw_text', rawText);
    } else {
      throw new Error('Please select a PDF file or paste research paper text.');
    }
    if (apiKey && apiKey.trim()) {
      formData.append('api_key', apiKey.trim());
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

  // ── [Tamim Hasan Sami – ID: 313] Topic Similarity & Duplicate Check ───────
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

  async registerThesisTopic(title, token) {
    const res = await fetch(`${API_BASE}/register-topic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to register thesis topic.');
    }
    return await res.json();
  },

  // ── [Tamim Hasan Sami – ID: 313] Shared Paper Knowledge Repository ────────
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
      throw new Error(errData.detail || 'Failed to save paper to shared repository.');
    }

    return await res.json();
  },

  async getSharedPaperDetail(id) {
    const res = await fetch(`${API_BASE}/shared-knowledge/${id}`);
    if (!res.ok) throw new Error('Paper not found');
    return await res.json();
  }
};
