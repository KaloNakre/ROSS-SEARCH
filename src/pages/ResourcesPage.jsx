import React from 'react';
import { BookOpen, FileText, Download, ExternalLink, ShieldCheck, GraduationCap } from 'lucide-react';

export const ResourcesPage = () => {
  const guidelines = [
    {
      title: "DIU FYP & Thesis Handbook (2024–2025 Edition)",
      desc: "Comprehensive academic guidelines for final year projects, phase milestones, and marking criteria.",
      size: "2.4 MB PDF",
      category: "Guidelines"
    },
    {
      title: "Formal Proposal LaTeX & Word Templates",
      desc: "Standard Daffodil International University formatted templates for initial proposal submissions.",
      size: "1.1 MB ZIP",
      category: "Templates"
    },
    {
      title: "Ethics Review & Human Subject Research Checklist",
      desc: "Mandatory compliance evaluation form for machine learning models and survey-based research.",
      size: "450 KB PDF",
      category: "Ethics"
    },
    {
      title: "Thesis Defense Slide Deck Master Template",
      desc: "Official DIU slide deck template with university branding and typography.",
      size: "3.8 MB PPTX",
      category: "Templates"
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Research Resources & Guidelines
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Official templates, formatting standards, and thesis handbooks for Daffodil International University
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {guidelines.map((doc, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-diu-blue">
                  {doc.category}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{doc.size}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-3 leading-snug">
                {doc.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {doc.desc}
              </p>
            </div>

            <button
              onClick={() => alert(`Downloading "${doc.title}"...`)}
              className="w-full py-2 px-4 rounded-xl bg-slate-50 hover:bg-diu-blue text-slate-700 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 border border-slate-200 transition-colors"
            >
              <Download size={14} /> Download Document
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourcesPage;

