/**
 * ROSS-SEARCH: Module 2 — AI Research Paper PDF Summarizer
 * Contributor: Md. Robayet Islam (ID: 232-35-809)
 * Description: Extracts text from uploaded research paper PDFs using PyMuPDF and AI
 * (Google Gemini / Groq / Neural NLP) to generate a 9-point structured summary:
 * Problem, Objectives, Methodology, Dataset, Model/Technology, Findings,
 * Limitations, Research Gap, and Future Work.
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
  Share2,
  Key,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { module2Service } from '../../services/module2Service';
import { useAuth } from '../../context/AuthContext';

const PRELOADED_PAPERS = [
  {
    id: 1,
    title: "Deep Autoencoder and Random Forest Ensembles for SCADA Cyber-Physical Threat Detection",
    domain: "Cyber Security",
    authors: "Dr. Sheak Rashed Haider Noori, Farzana Akter, Mehedi Hasan",
    text: `Deep Autoencoder and Random Forest Ensembles for SCADA Cyber-Physical Threat Detection
Authors: Dr. Sheak Rashed Haider Noori, Farzana Akter, Mehedi Hasan
Published in: IEEE Transactions on Industrial Informatics (2024)

Abstract:
Industrial Control Systems (ICS) and SCADA environments are increasingly targeted by sophisticated zero-day cyber-physical attacks. This paper develops a semi-supervised pipeline employing deep variational autoencoders for network anomaly synthesis coupled with a cost-sensitive Random Forest classifier.

1. Problem Statement:
Industrial SCADA networks controlling critical power grids face high-frequency multi-stage injection attacks. Traditional signature-based firewalls fail against zero-day packet mutations, while static threshold rules yield unacceptable false positive rates that cause severe operational downtime.

2. Objectives:
1. Design an unsupervised deep autoencoder capable of reconstructing normal telemetry states.
2. Formulate an ensemble Random Forest classifier to categorize attack vectors (e.g. DoS, MitM, data manipulation).
3. Achieve sub-second packet classification with an overall detection rate exceeding 95% on realistic industrial benchmarks.

3. Methodology:
We deploy a two-stage hybrid pipeline. Stage 1 utilizes a 5-layer Deep Variational Autoencoder (VAE) trained exclusively on benign Modbus/DNP3 telemetry to generate reconstruction error vectors. Stage 2 feeds the reconstruction deviations alongside statistical packet flow metrics into a 200-tree cost-sensitive Random Forest ensemble with 10-fold stratified cross-validation.

4. Dataset:
Evaluated on the benchmark Tennessee Eastman Process SCADA dataset combined with the Mississippi State University Industrial Control Systems telemetry corpus comprising 125,000 multi-variable flow and pressure sensor readings.

5. Model / Technology:
Deep Variational Autoencoders (VAE) with LeakyReLU activations, Scikit-learn Cost-Sensitive Random Forest, PyTorch 2.2, Snort network packet inspection, and Python 3.12.

6. Findings:
Achieved 97.4% overall attack detection accuracy, 96.8% Macro F1-score, and reduced false alarms by 40% compared to standard one-class SVM baselines. Mean packet inspection latency is 14.2 milliseconds.

7. Limitations:
Requires high initial memory overhead for autoencoder latent space projections during peak network burst traffic, and sensitivity to noisy sensor telemetry during cold system boot.

8. Research Gap:
Absence of dynamic online continual learning to adapt to evolving attacker strategies without full model retraining, and lack of hardware explainability (XAI) on embedded programmable logic controllers (PLCs).

9. Future Work:
Deployment on edge hardware microcontrollers (e.g. Raspberry Pi 4, Jetson Orin Nano) with INT8 quantization, and exploring federated learning across isolated municipal utility grids.`
  },
  {
    id: 2,
    title: "BanglaBERT: Language Model Pretraining for Low-Resource Bengali Natural Language Processing",
    domain: "Natural Language Processing",
    authors: "Md. Robayet Islam, Sakib Hasan, Prof. Dr. Syed Akhter Hossain",
    text: `BanglaBERT: Language Model Pretraining for Low-Resource Bengali Natural Language Processing
Authors: Md. Robayet Islam, Sakib Hasan, Prof. Dr. Syed Akhter Hossain
Published in: Findings of the Association for Computational Linguistics (ACL 2024)

Abstract:
Pretrained language models have revolutionized NLP, but morphologically rich languages like Bengali suffer from sub-optimal vocabularies in multilingual models. We propose BanglaBERT, pretrained on 45GB of curated clean Bengali text using dedicated morphological tokenization.

1. Problem Statement:
Multilingual language models such as mBERT and XLM-RoBERTa allocate less than 2% of their vocabulary to Bengali tokens, resulting in excessive subword fragmentation, degraded contextual embeddings, and severe out-of-vocabulary penalties in complex syntactic sentences.

2. Objectives:
1. Build a high-quality 45GB clean Bengali corpus spanning news, literature, Wikipedia, and social forums.
2. Train a monolingual 110M parameter Bidirectional Transformer with a dedicated 32,000 Bengali WordPiece vocabulary.
3. Benchmark across 8 downstream tasks: Sentiment Analysis, Named Entity Recognition, POS Tagging, Natural Language Inference, and Question Answering.

3. Methodology:
Masked Language Modeling (MLM) with 15% dynamic token masking and Next Sentence Prediction. Model training was conducted on 8 NVIDIA A100 GPUs using mixed precision FP16 and AdamW optimizer over 1 million steps.

4. Dataset:
45GB text corpus (approx. 4.8 billion tokens) curated from 15 online portals, evaluated on Bengali GLUE, SentNoB sentiment dataset, and DIU Bengali NER corpus.

5. Model / Technology:
12-layer Transformer Encoder (110M params), PyTorch, Hugging Face Transformers, Tokenizers library, CUDA 12.1.

6. Findings:
Established new state-of-the-art results across all 8 benchmarks with an average Macro F1 of 86.4%, outperforming mBERT by 6.8% and XLM-RoBERTa by 4.2% while reducing inference token length by 32%.

7. Limitations:
Pretraining requires substantial compute infrastructure (over 180 GPU hours), and performance remains susceptible to Romanized phonetic Bengali (Banglish) slang in informal conversational text.

8. Research Gap:
Lack of robust parameter-efficient adapters (LoRA) for low-resource Bengali dialects and lack of instruction-tuned generative models for abstractive summarization.

9. Future Work:
Extend to instruction-following conversational agents (BanglaGPT) and develop parameter-efficient PEFT adapters for lightweight edge deployment on mobile devices.`
  },
  {
    id: 3,
    title: "Zero-Trust Architecture and Micro-Segmentation for Kubernetes Cloud Workloads",
    domain: "Cyber Security",
    authors: "Tariqul Islam, Dr. S. M. Aminul Haque, Nusrat Jahan",
    text: `Zero-Trust Architecture and Micro-Segmentation for Kubernetes Cloud Workloads
Authors: Tariqul Islam, Dr. S. M. Aminul Haque, Nusrat Jahan
Published in: ACM CCS 2025

Abstract:
Cloud-native microservices rely on flat internal network routing, which facilitates lateral cyber-attack movement when an edge pod is breached. We present an eBPF-driven zero-trust kernel policy enforcement engine that dynamically synthesizes micro-segmentation rules based on cryptographic pod identity.

1. Problem Statement:
Traditional perimeter firewalls are blind to east-west internal container traffic. Once an attacker gains a reverse shell in a frontend container, flat Kubernetes networking permits unfettered lateral traversal to backend databases and secret stores.

2. Objectives:
1. Eliminate IP-based security policies in favor of cryptographic SPIFFE/SPIRE workload identities.
2. Implement eBPF kernel hooks to inspect and filter Layer 4 and Layer 7 network packets with zero userspace context switching.
3. Automatically generate least-privilege network policies using dynamic traffic discovery.

3. Methodology:
eBPF bytecode programs injected into the Linux kernel socket layer intercept connect() and accept() syscalls. Workload cryptographic identities are validated via mTLS x509 SVID certificates issued by a local SPIRE agent. Unregistered network flows are dropped at the kernel boundary before reaching userspace.

4. Dataset:
Simulated multi-tier e-commerce microservices benchmark running across a 50-node Kubernetes cluster under automated Red-Team lateral movement penetration attacks.

5. Model / Technology:
Linux eBPF (Cilium kernel runtime), SPIFFE/SPIRE, Golang control plane, Kubernetes v1.28, Prometheus metrics.

6. Findings:
Completely prevented 100% of simulated lateral movement and credential theft attacks with less than 2.1% CPU overhead and an added packet latency of under 0.4 milliseconds.

7. Limitations:
Requires modern Linux kernel versions (5.10+) with BPF CO-RE support, and complex initial policy bootstrapping for legacy stateful services.

8. Research Gap:
Absence of automated zero-trust anomaly detection based on runtime system call sequences within the eBPF kernel boundary.

9. Future Work:
Incorporate lightweight anomaly detection autoencoders directly into BPF maps to detect zero-day syscall anomalies without control-plane roundtrips.`
  }
];

export const PaperSummarizerPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [inputMode, setInputMode] = useState('select'); // 'select' | 'upload' | 'text'
  const [selectedPreloadedId, setSelectedPreloadedId] = useState(1);
  const [pdfFile, setPdfFile] = useState(null);
  const [rawText, setRawText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showAiSettings, setShowAiSettings] = useState(false);

  const [analyzing, setAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [summaryData, setSummaryData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [savedToDb, setSavedToDb] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);

  // Check URL parameters if redirected from Research Discovery
  useEffect(() => {
    const paperId = searchParams.get('paperId');
    const title = searchParams.get('title');
    if (paperId) {
      const match = PRELOADED_PAPERS.find(p => p.id === Number(paperId));
      if (match) {
        setSelectedPreloadedId(match.id);
        setInputMode('select');
      }
    } else if (title) {
      setInputMode('text');
      setRawText(`Title: ${decodeURIComponent(title)}\n\nAbstract:\nThis academic research paper investigates key methodologies, experimental benchmarks, and empirical validations in the chosen academic domain.`);
    }
  }, [searchParams]);

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

  const handleAnalyze = async () => {
    setErrorMsg('');
    setSummaryData(null);
    setSavedToDb(false);

    let textToSend = null;
    let fileToSend = null;

    if (inputMode === 'select') {
      const paper = PRELOADED_PAPERS.find(p => p.id === Number(selectedPreloadedId));
      if (!paper) {
        setErrorMsg('Please select a paper from the list.');
        return;
      }
      textToSend = paper.text;
    } else if (inputMode === 'upload') {
      if (!pdfFile) {
        setErrorMsg('Please select a PDF file to analyze.');
        return;
      }
      fileToSend = pdfFile;
    } else if (inputMode === 'text') {
      if (!rawText.trim()) {
        setErrorMsg('Please enter or paste research paper text.');
        return;
      }
      textToSend = rawText;
    }

    setAnalyzing(true);
    try {
      const result = await module2Service.summarizePaper({
        file: fileToSend,
        rawText: textToSend,
        apiKey: apiKey.trim() || null
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
        title: summaryData.title || 'Analyzed Research Paper',
        authors: summaryData.authors || 'Document Authors',
        year: summaryData.year || 2026,
        domain: summaryData.domain || 'Machine Learning',
        uploaded_by_name: user?.full_name || 'Md. Robayet Islam',
        uploaded_by_id: user?.student_id || '232-35-809',
        file_name: pdfFile ? pdfFile.name : `${summaryData.title.slice(0, 30)}.pdf`,
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
AI Engine: ${summaryData.ai_engine || 'AI Engine'}

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
            <span>AI Research Paper Analyzer — PyMuPDF & Gemini/Groq LLM</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">
            Automated 9-Point Structured Paper Summarizer
          </h1>
          <p className="text-purple-200 text-sm leading-relaxed">
            Select an academic paper, upload a PDF, or paste text to instantly extract the fundamental research pillars: 
            <strong> Problem Statement, Objectives, Methodology, Dataset, Model, Findings, Limitations, Research Gap, and Future Scope</strong>.
          </p>
        </div>
      </div>

      {/* Input Selection Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 mb-5 gap-3">
          <div className="flex gap-4">
            <button
              onClick={() => setInputMode('select')}
              className={`text-xs font-bold pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
                inputMode === 'select'
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Select Discovered Paper</span>
            </button>
            <button
              onClick={() => setInputMode('upload')}
              className={`text-xs font-bold pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
                inputMode === 'upload'
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <FileUp className="w-4 h-4" />
              <span>Upload PDF Document</span>
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
          </div>

          {/* AI Settings Toggle */}
          <button
            onClick={() => setShowAiSettings(!showAiSettings)}
            className="text-xs text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200"
          >
            <Key className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Model & Key Settings</span>
            {showAiSettings ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible AI API Key Settings */}
        {showAiSettings && (
          <div className="mb-5 p-4 bg-purple-50/50 rounded-xl border border-purple-200 text-xs space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold text-purple-900">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Configure AI Engine (Google Gemini / Groq Cloud / Local Neural NLP)</span>
            </div>
            <p className="text-slate-600">
              By default, the platform uses our built-in <strong>PyMuPDF Neural NLP Engine</strong> (100% resilient & offline).
              If you have a <strong>Google Gemini API Key</strong> or <strong>Groq API Key</strong>, you can paste it below to enable live cloud LLM reasoning!
            </p>
            <div className="flex gap-2 pt-1">
              <input
                type="password"
                placeholder="Paste optional Gemini (AIzaSy...) or Groq (gsk_...) API key here"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-white border border-purple-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-600"
              />
              <button
                type="button"
                onClick={() => alert(apiKey ? 'AI API Key attached for analysis!' : 'Cleared. Will use built-in Neural NLP Engine.')}
                className="px-4 py-2 bg-purple-700 text-white font-bold rounded-lg text-xs hover:bg-purple-600"
              >
                Apply Key
              </button>
            </div>
          </div>
        )}

        {/* Mode 1: Select Discovered Paper */}
        {inputMode === 'select' && (
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Choose from Published Repository Papers:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PRELOADED_PAPERS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPreloadedId(p.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    selectedPreloadedId === p.id
                      ? 'border-purple-600 bg-purple-50/60 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 mb-2 inline-block">
                      {p.domain}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug mb-1">
                      {p.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {p.authors}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] font-semibold text-purple-700">
                    <span>{selectedPreloadedId === p.id ? '✓ Selected for AI Analysis' : 'Click to Select'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mode 2: Upload PDF */}
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
                  PyMuPDF will extract text and map all 9 academic sections automatically
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Mode 3: Paste Text */}
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
                <span>Extracting Text via PyMuPDF & Running AI Analysis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate 9-Point Structured Summary with AI</span>
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
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                  {summaryData.domain}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Engine: {summaryData.ai_engine || 'AI Engine'}</span>
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                {summaryData.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Academic 9-Section Evaluation • {summaryData.authors}
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

          {/* 9. Future Work */}
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
