import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  RotateCcw,
  BookOpen,
  Cpu,
  Layers,
  ArrowRight,
  Copy,
  Check,
  HelpCircle,
  ShieldCheck,
  Search,
  ExternalLink
} from 'lucide-react';
import { module2Service } from '../../services/module2Service';

const SAMPLE_PROMPTS = [
  {
    title: "Find Research Gap",
    desc: "SCADA & Industrial Control Cybersecurity",
    prompt: "What are the most pressing unaddressed research gaps in SCADA and Industrial Control System intrusion detection for 2024–2026?"
  },
  {
    title: "Recommend Benchmark Datasets",
    desc: "Low-Resource Bengali NLP",
    prompt: "What public benchmark datasets exist for low-resource Bengali sentiment analysis, fake news detection, and transliteration?"
  },
  {
    title: "Compare Architectures",
    desc: "YOLOv8 vs RT-DETR for Edge Vision",
    prompt: "Compare lightweight YOLOv8 and RT-DETR for real-time agricultural crop disease detection on embedded Raspberry Pi 4 hardware."
  },
  {
    title: "Methodology Formulation",
    desc: "Thesis Proposal Structure",
    prompt: "How should I structure the methodology section for a thesis proposing differential privacy in federated healthcare machine learning?"
  }
];

const MODEL_OPTIONS = [
  { id: "auto", name: "Auto Select (Cloud Gemini / Groq / Neural NLP)" },
  { id: "gemini-1.5-flash", name: "Google Gemini 1.5 Flash (1M Token Context)" },
  { id: "gemini-1.5-pro", name: "Google Gemini 1.5 Pro (Deep Research Reasoning)" },
  { id: "groq-llama-3.3-70b", name: "Groq Cloud (Llama-3.3-70B Versatile)" },
  { id: "neural-nlp-offline", name: "ROSS-SEARCH Neural NLP Core (100% Offline)" }
];

export const PublicResearchChatPage = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am the ROSS-SEARCH AI Academic Research Assistant at Daffodil International University. You can ask me anything about research gaps, methodology design, benchmark datasets, algorithm comparison, or thesis defense preparation — **no login or account required**.",
      model: "ROSS-SEARCH Core"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('auto');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const query = inputMessage.trim();
    if (!query || loading) return;

    const userMessage = { role: 'user', content: query };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputMessage('');
    setLoading(true);

    try {
      const historyPayload = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await module2Service.sendChatMessage({
        message: query,
        history: historyPayload,
        modelChoice: selectedModel
      });

      setMessages([
        ...newHistory,
        {
          role: 'assistant',
          content: res.reply,
          model: res.model_used
        }
      ]);
    } catch (err) {
      setMessages([
        ...newHistory,
        {
          role: 'assistant',
          content: `⚠️ Failed to receive response: ${err.message}. Please check that the ROSS-SEARCH backend server is running.`,
          model: "System Error"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Chat reset. How can I assist your FYP or thesis research today?",
        model: "ROSS-SEARCH Core"
      }
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 px-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-diu-blue via-diu-dark to-slate-900 rounded-2xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 text-xs font-semibold mb-3 border border-cyan-400/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Public AI Research Assistant • Open to All Students & Guests</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">
            AI Research Assistant & Thesis Intelligence
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Formulate novel research questions, identify verifiable gaps in academic literature, find benchmarks, and get expert methodology recommendations. No Gmail login or credentials required.
          </p>

          {/* Model Selector Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-3 pt-3 border-t border-white/10 text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Engine:
            </span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              {MODEL_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id} className="bg-slate-900 text-white">
                  {opt.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleResetChat}
              className="ml-auto inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Chat
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Starter Prompts */}
      {messages.length <= 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_PROMPTS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputMessage(sample.prompt);
              }}
              className="text-left bg-white p-3.5 rounded-xl border border-slate-200 hover:border-diu-blue hover:shadow-md transition-all group"
            >
              <div className="text-xs font-semibold text-diu-blue group-hover:text-cyan-600 transition-colors">
                {sample.title}
              </div>
              <div className="text-[11px] text-slate-400 mb-1.5">{sample.desc}</div>
              <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                "{sample.prompt}"
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Chat Messages Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-diu-blue text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-cyan-300" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-diu-blue text-white rounded-br-xs'
                      : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  {!isUser && msg.model && (
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 pb-1 border-b border-slate-200/60">
                      <span className="font-medium text-cyan-700">{msg.model}</span>
                      <button
                        onClick={() => handleCopy(msg.content, index)}
                        className="hover:text-slate-600 p-0.5 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-diu-blue text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-cyan-300 animate-pulse" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-bl-xs p-4 text-sm text-slate-500 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                <span>ROSS-SEARCH AI is formulating academic recommendations...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 rounded-b-2xl">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask an academic research question (e.g., 'What are the main baselines for Transformer-based SCADA IDS?')..."
              className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="bg-diu-blue hover:bg-diu-dark text-white px-5 py-3 rounded-xl font-medium text-sm flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>Free & Open Access • Powered by Google Gemini, Groq Cloud & PyMuPDF NLP</span>
            <span>DIU Thesis Intelligence v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicResearchChatPage;
