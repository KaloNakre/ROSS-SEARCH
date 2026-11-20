/**
 * ROSS-SEARCH: Module 2 — AI Research Paper PDF Summarizer
 * Contributor: Md. Robayet Islam (ID: 232-35-809)
 * Description: Extracts text from uploaded research paper PDFs using PyMuPDF and AI
 * to generate a 9-point structured summary (Problem, Objectives, Methodology, Dataset,
 * Model/Technology, Findings, Limitations, Research Gap, and Future Work).
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileUp, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Copy, 
  Check, 
  BookmarkCheck, 
  Layers, 
  Cpu, 
  Database, 
  Target, 
  Search, 
  TrendingUp, 
  HelpCircle, 
  Compass, 
  FileText,
  Share2
} from 'lucide-react';
import { module2Service } from '../../services/module2Service';
import { useAuth } from '../../context/AuthContext';

export const PaperSummarizerPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pdfFile, setPdfFile] = useState(null);
  const [rawText, setRawText] = useState('');
  const [inputMode, setInputMode] = useState('upload'); // 'upload' | 'text' | 'sample'
  const [analyzing, setAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [summaryData, setSummaryData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [savedToDb, setSavedToDb] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        setErrorMsg('Please upload a valid PDF document.');
        return;
      }
      setPdfFile(file);
      setErrorMsg('');
    }
  };

  const loadSamplePaper = () => {
    setInputMode('text');
    setRawText(`Attention Is All You Need
Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin
Google Brain & Google Research

Abstract:
The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.

1. Introduction & Problem Statement:
Recurrent neural networks, especially LSTM and GRU, have been established as state of the art in sequence modeling. Recurrent models factor computation along the symbol positions of input and output sequences. This inherently sequential nature precludes parallelization within training examples, which becomes critical at longer sequence lengths, as memory constraints limit batching across examples.

2. Objectives:
Our goal is to construct a sequence-to-sequence model that eliminates recurrence, relying entirely on self-attention to compute representations of its input and output without using sequence-aligned RNNs or convolution.

3. Methodology & System Architecture:
The Transformer follows an encoder-decoder structure. Both encoder and decoder consist of stacked layers of Multi-Head Scaled Dot-Product Attention combined with position-wise fully connected feed-forward networks, layer normalization, and residual connections.

4. Dataset:
We trained on the standard WMT 2014 English-German dataset consisting of about 4.5 million sentence pairs, and WMT 2014 English-French dataset consisting of 36 million sentence pairs.

5. Model / Technology:
Transformer Big with 6 layers, 1024 embedding dimension, 16 attention heads, and 28M/65M parameters. Trained using Adam optimizer with beta1=0.9, beta2=0.98.

6. Findings:
On the WMT 2014 English-to-German task, the big transformer model achieves a state-of-the-art BLEU score of 28.4. On WMT 2014 English-to-French, our model establishes a new single-model state-of-the-art BLEU score of 41.8 after training for 3.5 days on 8 P100 GPUs.

7. Limitations:
The attention mechanism exhibits O(N^2) memory and computational complexity relative to sequence length, causing bottlenecks for inputs beyond 512 tokens.

8. Research Gap:
Lack of sub-quadratic linear attention approximations for very long documents, and sensitivity to hyperparameter initialization in low-resource language regimes.

9. Future Work:
Extending Transformer architecture to modalities beyond text, including images, audio, and video inputs, and designing sparse attention patterns.`);
  };

  const handleAnalyze = async () => {
    setErrorMsg('');
    setSummaryData(null);
    setSavedToDb(false);

    if (inputMode === 'upload' && !pdfFile) {
      setErrorMsg('Please select a PDF file to analyze.');
      return;
    }
    if (inputMode === 'text' && !rawText.trim()) {
      setErrorMsg('Please enter or paste research paper text.');
      return;
    }

    setAnalyzing(true);
    try {
      const result = await module2Service.summarizePaper({
        file: inputMode === 'upload' ? pdfFile : null,
        rawText: inputMode === 'text' ? rawText : null
      });
      setSummaryData(result);
    } catch (err) {
      setErrorMsg(err.message || 'Error occurred while analyzing the paper.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveToShared = async () => {
    if (!summaryData) return;
    setSavingLoading(true);
    try {
      await module2Service.saveToSharedKnowledge({
        title: summaryData.title || (pdfFile ? pdfFile.name : 'Analyzed Research Paper'),
        authors: summaryData.authors || 'Extracted in Document',
        year: summaryData.year || 2026,
        domain: summaryData.domain || 'Machine Learning',
        uploaded_by_name: user?.full_name || 'Md. Robayet Islam',
        uploaded_by_id: user?.student_id || '232-35-809',
        file_name: pdfFile ? pdfFile.name : 'Pasted_Document.pdf',
        problem_statement: summaryData.problem_statement,
        objectives: summaryData.objectives,
        methodology: summaryData.methodology,
        dataset: summaryData.dataset,
        model_technology: summaryData.model_technology,
        findings: summaryData.findings,
        limitations: summaryData.limitations,
        research_gap: summaryData.research_gap,
        future_work: summaryData.future_work
      });
      setSavedToDb(true);
    } catch (err) {
      alert(err.message || 'Could not save to shared database.');
    } finally {
      setSavingLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!summaryData) return;
    const text = `
=== ROSS-SEARCH 9-POINT STRUCTURED PAPER SUMMARY ===
Paper: ${summaryData.title}
Domain: ${summaryData.domain}

1. Problem Statement:
${summaryData.problem_statement}

2. Objectives:
${summaryData.objectives}

3. Methodology:
${summaryData.methodology}

4. Dataset:
${summaryData.dataset}

5. Model / Technology:
${summaryData.model_technology}

6. Findings:
${summaryData.findings}

7. Limitations:
${summaryData.limitations}

8. Research Gap:
${summaryData.research_gap}

9. Future Work:
${summaryData.future_work}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 rounded-2xl p-6 lg:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Research Paper Analyzer — PyMuPDF & Structured NLP</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">
            Automated 9-Point Structured Paper Summarizer
          </h1>
          <p className="text-purple-200 text-sm leading-relaxed">
            Upload any research paper PDF to instantly extract the fundamental research pillars: 
            <strong> Problem Statement, Objectives, Methodology, Dataset, Model, Findings, Limitations, Research Gap, and Future Scope</strong>.
          </p>
        </div>
      </div>

      {/* Input Selection Tabs */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex border-b border-slate-200 pb-3 mb-5 gap-4">
          <button
            onClick={() => setInputMode('upload')}
            className={`text-xs font-bold pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
              inputMode === 'upload'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileUp className="w-4 h-4" />
            <span>Upload PDF File</span>
          </button>
          <button
            onClick={() => setInputMode('text')}
            className={`text-xs font-bold pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
              inputMode === 'text'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste Paper Text</span>
          </button>
          <button
            onClick={loadSamplePaper}
            className="ml-auto text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Load Sample Transformer Paper</span>
          </button>
        </div>

        {/* Upload Mode UI */}
        {inputMode === 'upload' && (
          <div className="border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/30 rounded-xl p-8 text-center transition-all">
            <input
              type="file"
              id="paper-file-upload"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="paper-file-upload"
              className="cursor-pointer flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shadow-xs">
                <FileUp className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {pdfFile ? pdfFile.name : 'Click to upload research paper PDF'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports standard IEEE, ACM, Springer, arXiv or DIU Thesis PDF documents
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Paste Text Mode UI */}
        {inputMode === 'text' && (
          <div>
            <textarea
              rows={8}
              placeholder="Paste research paper abstract, methodology, results, or full content here..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full p-4 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-600"
            />
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="px-6 py-3 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Extracting Text via PyMuPDF & Analyzing Sections...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate 9-Point Structured Summary</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── 9-POINT STRUCTURED SUMMARY RESULTS ── */}
      {summaryData && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 space-y-6 animate-fadeIn">
          {/* Header & Meta */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 mb-2 inline-block">
                {summaryData.domain}
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                {summaryData.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Extracted via PyMuPDF Academic Parser • {summaryData.authors}
              </p>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopySummary}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
              </button>
              <button
                onClick={handleSaveToShared}
                disabled={savedToDb || savingLoading}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  savedToDb
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-diu-blue hover:bg-diu-dark text-white shadow-xs'
                }`}
              >
                {savingLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : savedToDb ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                    <span>Saved to Shared DB</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Save to Shared Knowledge DB</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 9 Structured Section Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Problem Statement */}
            <div className="bg-red-50/50 border border-red-100 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-red-800 uppercase tracking-wider mb-2">
                <Target className="w-4 h-4 text-red-600" />
                <span>1. Problem Statement</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {summaryData.problem_statement}
              </p>
            </div>

            {/* 2. Objectives */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>2. Objectives</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {summaryData.objectives}
              </p>
            </div>

            {/* 3. Methodology */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>3. Methodology</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {summaryData.methodology}
              </p>
            </div>

            {/* 4. Dataset */}
            <div className="bg-cyan-50/50 border border-cyan-100 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-800 uppercase tracking-wider mb-2">
                <Database className="w-4 h-4 text-cyan-600" />
                <span>4. Dataset</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {summaryData.dataset}
              </p>
            </div>

            {/* 5. Model / Technology */}
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">
                <Cpu className="w-4 h-4 text-indigo-600" />
                <span>5. Model / Technology</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {summaryData.model_technology}
              </p>
            </div>

            {/* 6. Findings */}
            <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wider mb-2">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                <span>6. Findings & Results</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {summaryData.findings}
              </p>
            </div>

            {/* 7. Limitations */}
            <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-800 uppercase tracking-wider mb-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span>7. Limitations</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {summaryData.limitations}
              </p>
            </div>

            {/* 8. Research Gap (Highlighted in Amber/Gold) */}
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>8. Research Gap (Opportunity for DIU Thesis)</span>
              </div>
              <p className="text-xs text-slate-900 font-medium leading-relaxed whitespace-pre-line">
                {summaryData.research_gap}
              </p>
            </div>
          </div>

          {/* 9. Future Work (Full Width Banner) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>9. Future Work & Next Steps</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
              {summaryData.future_work}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaperSummarizerPage;
