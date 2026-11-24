/**
 * ROSS-SEARCH: Module 3 Service
 * Proposal Analysis, Project Progress, Viva Preparation and Analytics
 * 
 * Contributor Responsibilities:
 * 1. [Robayet Islam - ID: 809]: Official proposal/thesis PPT/PPTX templates & AI Document Structure/Grammar Checking
 * 2. [Riya Saha - ID: 715]: Project submissions, version management, supervisor feedback & milestone progress
 * 3. [Robayet Islam - ID: 809]: AI Practice Viva Question & Defense Preparation
 * 4. [Tamim Hasan Sami - ID: 313]: Departmental FYP Analytics & Supervisor Workload Dashboard
 */

const API_BASE = '/api/module3';

export const module3Service = {
  // ── 1. Official Academic Templates (Admin & Students) ────────────────────
  async getTemplates(category = 'all') {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      const res = await fetch(`${API_BASE}/templates?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch academic templates');
      return await res.json();
    } catch (err) {
      console.warn('Templates fetch failed:', err);
      return [];
    }
  },

  async createTemplate(payload, token) {
    const res = await fetch(`${API_BASE}/templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to upload official template');
    }
    return await res.json();
  },

  async downloadTemplate(templateId) {
    const res = await fetch(`${API_BASE}/templates/${templateId}/download`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to record template download');
    return await res.json();
  },

  async deleteTemplate(templateId, token) {
    const res = await fetch(`${API_BASE}/templates/${templateId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete template');
    return await res.json();
  },

  // ── 2. AI Document Structure & Grammar Checker ───────────────────────────
  async checkDocument({ documentTitle, documentType = 'proposal', rawText, targetTemplateId }, token) {
    const res = await fetch(`${API_BASE}/check-document`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        document_title: documentTitle,
        document_type: documentType,
        raw_text: rawText,
        target_template_id: targetTemplateId
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to analyze document structure and grammar');
    }
    return await res.json();
  },

  // ── 3. Project Submissions & Supervisor Reviews ──────────────────────────
  async getSubmissions(filters = {}, token) {
    try {
      const params = new URLSearchParams();
      if (filters.team_id) params.append('team_id', filters.team_id);
      if (filters.phase && filters.phase !== 'all') params.append('phase', filters.phase);
      if (filters.status && filters.status !== 'all') params.append('status_filter', filters.status);

      const res = await fetch(`${API_BASE}/submissions?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch project submissions');
      return await res.json();
    } catch (err) {
      console.warn('Submissions fetch failed:', err);
      return [];
    }
  },

  async submitProjectFile(payload, token) {
    const res = await fetch(`${API_BASE}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to submit project file');
    }
    return await res.json();
  },

  async reviewSubmission(submissionId, { status, feedback_remarks }, token) {
    const res = await fetch(`${API_BASE}/submissions/${submissionId}/review`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status, feedback_remarks })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to review submission');
    }
    return await res.json();
  },

  // ── 4. Project Milestones & Progress Tracking ────────────────────────────
  async getMilestones(teamId, token) {
    try {
      const params = new URLSearchParams();
      if (teamId) params.append('team_id', teamId);
      const res = await fetch(`${API_BASE}/milestones?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch project milestones');
      return await res.json();
    } catch (err) {
      console.warn('Milestones fetch failed:', err);
      return [];
    }
  },

  async initStandardMilestones(teamId, token) {
    const res = await fetch(`${API_BASE}/milestones/init-standard/${teamId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to initialize standard FYP milestones');
    }
    return await res.json();
  },

  async updateMilestone(milestoneId, updateData, token) {
    const res = await fetch(`${API_BASE}/milestones/${milestoneId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to update milestone');
    }
    return await res.json();
  },

  // ── 5. AI Practice Viva Preparation ──────────────────────────────────────
  async generateVivaQuestions({ projectTitle, domain, abstract, documentText, questionsCount = 6 }, token) {
    const res = await fetch(`${API_BASE}/viva/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        project_title: projectTitle,
        domain,
        abstract,
        document_text: documentText,
        questions_count: questionsCount
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to generate AI viva defense questions');
    }
    return await res.json();
  },

  async getVivaHistory(token) {
    try {
      const res = await fetch(`${API_BASE}/viva/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load viva history');
      return await res.json();
    } catch (err) {
      console.warn('Viva history fetch failed:', err);
      return [];
    }
  },

  // ── 6. Departmental FYP Analytics (Admin) ────────────────────────────────
  async getDepartmentalAnalytics() {
    try {
      const res = await fetch(`${API_BASE}/analytics/departmental`);
      if (!res.ok) throw new Error('Failed to load departmental analytics');
      return await res.json();
    } catch (err) {
      console.warn('Analytics fetch failed:', err);
      return null;
    }
  }
};
