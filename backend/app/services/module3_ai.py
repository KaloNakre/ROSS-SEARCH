import re
import os
from typing import Dict, Any, List

REQUIRED_PROPOSAL_SECTIONS = [
    {
        "name": "Title & Executive Abstract",
        "patterns": [r"abstract", r"executive summary", r"overview", r"introduction"],
        "weight": 15
    },
    {
        "name": "Problem Statement & Motivation",
        "patterns": [r"problem statement", r"research problem", r"motivation", r"background"],
        "weight": 15
    },
    {
        "name": "Research Objectives & Scope",
        "patterns": [r"objective", r"research goal", r"aim", r"scope"],
        "weight": 15
    },
    {
        "name": "Literature Review & Related Work",
        "patterns": [r"literature review", r"related work", r"prior research", r"state of the art"],
        "weight": 15
    },
    {
        "name": "Proposed Methodology & Architecture",
        "patterns": [r"methodology", r"proposed system", r"architecture", r"framework", r"algorithm"],
        "weight": 15
    },
    {
        "name": "Dataset & Experimental Setup",
        "patterns": [r"dataset", r"data collection", r"experimental setup", r"benchmark", r"evaluation metric"],
        "weight": 10
    },
    {
        "name": "Work Plan, Milestones & Timeline",
        "patterns": [r"work plan", r"timeline", r"gantt", r"milestone", r"schedule"],
        "weight": 10
    },
    {
        "name": "References & Bibliography (IEEE/APA)",
        "patterns": [r"reference", r"bibliography", r"\[\d+\]"],
        "weight": 5
    }
]

INFORMAL_TERMS = [
    ("a lot of", "substantial volume of / numerous"),
    ("very good", "superior / high-performing"),
    ("etc.", "among others / respectively"),
    ("kind of", "moderately / partially"),
    ("got", "obtained / achieved"),
    ("huge", "extensive / significant")
]

def check_proposal_document_structure(
    document_title: str,
    text: str,
    document_type: str = "proposal"
) -> Dict[str, Any]:
    """
    Evaluates thesis or proposal documents against the official DIU structure and formatting guidelines.
    Performs section detection, missing section alerts, academic grammar & tone auditing,
    and computes an objective format compliance score (0-100).
    """
    text_lower = text.lower()
    score = 0
    detected_sections = []
    missing_sections = []

    # 1. Section Structure Audit
    for sec in REQUIRED_PROPOSAL_SECTIONS:
        found = False
        matched_pattern = ""
        for pat in sec["patterns"]:
            m = re.search(pat, text_lower)
            if m:
                found = True
                matched_pattern = pat
                break

        if found:
            score += sec["weight"]
            # Extract brief context snippet
            idx = text_lower.find(matched_pattern)
            excerpt = text[max(0, idx - 10):min(len(text), idx + 120)].strip()
            detected_sections.append({
                "section_name": sec["name"],
                "status": "present",
                "confidence": 0.95,
                "excerpt": f"...{excerpt}..."
            })
        else:
            missing_sections.append(sec["name"])
            detected_sections.append({
                "section_name": sec["name"],
                "status": "missing",
                "confidence": 0.0,
                "excerpt": "Section heading not detected in uploaded text."
            })

    # 2. Academic Tone & Grammar Auditing
    grammar_issues = []
    for term, alternative in INFORMAL_TERMS:
        if re.search(r"\b" + re.escape(term) + r"\b", text_lower):
            grammar_issues.append({
                "type": "academic_tone",
                "issue": f"Informal phrase '{term}' detected.",
                "suggestion": f"Replace with formal academic vocabulary: '{alternative}'.",
                "context": f"Phrase found in text body."
            })

    # Check for citation markers
    has_citations = bool(re.search(r"\[\d+\]|\(\w+,\s*\d{4}\)", text))
    if not has_citations and len(text) > 300:
        grammar_issues.append({
            "type": "citation_format",
            "issue": "Missing standard in-text citation markers (e.g. [1] or (Author, 2024)).",
            "suggestion": "Ensure all claims and prior literature are formally cited using IEEE bracketed or APA style.",
            "context": "Throughout literature review and introduction."
        })

    # Deduct minor score for grammar/tone issues
    deduction = min(20, len(grammar_issues) * 4)
    final_score = max(20, score - deduction)

    # 3. Overall Compliance Determination
    if final_score >= 80:
        structure_status = "compliant"
        summary = "Document exhibits strong alignment with DIU formal thesis proposal guidelines."
    elif final_score >= 50:
        structure_status = "partially_compliant"
        summary = "Document contains core sections but requires revision for missing mandatory sections."
    else:
        structure_status = "non_compliant"
        summary = "Document is missing critical academic components required for supervisor approval."

    # Generate actionable recommendations
    recs = []
    if missing_sections:
        recs.append(f"Add required missing sections: {', '.join(missing_sections[:3])}.")
    if grammar_issues:
        recs.append("Enhance academic tone by eliminating colloquial expressions and standardizing in-text citations.")
    recs.append("Ensure proposal slides/pages align with the official DIU department PPTX master template.")

    return {
        "document_title": document_title,
        "document_type": document_type,
        "overall_compliance_score": final_score,
        "structure_status": structure_status,
        "detected_sections": detected_sections,
        "missing_sections": missing_sections,
        "grammar_spelling_issues": grammar_issues,
        "summary_findings": summary,
        "recommendations": " ".join(recs)
    }


def generate_viva_defense_questions(
    project_title: str,
    domain: str,
    abstract: str = "",
    document_text: str = "",
    questions_count: int = 6
) -> List[Dict[str, Any]]:
    """
    Generates targeted practice defense & viva examination questions based on
    the student's registered project details or uploaded thesis document.
    Categorized into objectives, methodology, dataset, findings, limitations, and novelty.
    """
    questions = [
        {
            "id": 1,
            "category": "objectives",
            "question": f"What specific research problem does '{project_title}' solve that existing models in {domain} fail to address?",
            "model_answer_points": [
                "Clearly state the concrete computational or practical bottleneck in current systems.",
                "Highlight why existing baseline solutions are insufficient or computationally prohibitive.",
                "Summarize your three core measurable project objectives."
            ],
            "defense_tips": "Do not give a vague general definition. Start directly with the specific gap in existing literature.",
            "difficulty": "Core"
        },
        {
            "id": 2,
            "category": "methodology",
            "question": f"Why did your team select this specific architectural pipeline or algorithm instead of standard baseline approaches?",
            "model_answer_points": [
                "Contrast your architecture with 2 alternative classical models.",
                "Explain the theoretical advantage (e.g. self-attention vs recurrence, parameter efficiency, latency).",
                "Discuss hyperparameter tuning and ablation validation choices."
            ],
            "defense_tips": "Panelists test whether you understand the algorithmic trade-offs, not just whether you imported a library.",
            "difficulty": "Challenging"
        },
        {
            "id": 3,
            "category": "dataset",
            "question": "Describe your dataset composition, preprocessing pipeline, and how you handled data imbalance or bias.",
            "model_answer_points": [
                "State exact sample count, train/validation/test split ratios (e.g., 70/15/15 or 80/20).",
                "Explain data augmentation, normalization, or tokenization steps.",
                "Detail class distribution and mitigation strategies (e.g., SMOTE, focal loss, stratified k-fold)."
            ],
            "defense_tips": "Always memorize your exact sample numbers and evaluation class distributions.",
            "difficulty": "Moderate"
        },
        {
            "id": 4,
            "category": "results",
            "question": "Which evaluation metrics did you prioritize, and how did your experimental results validate statistical significance?",
            "model_answer_points": [
                "Explain why accuracy alone is insufficient; cite Precision, Recall, F1-Score, BLEU, or AUC-ROC.",
                "Compare your model's quantitative scores against at least one published benchmark.",
                "Discuss error analysis and misclassified edge cases."
            ],
            "defense_tips": "Be prepared to explain the confusion matrix and why false positives or false negatives matter in your domain.",
            "difficulty": "Challenging"
        },
        {
            "id": 5,
            "category": "limitations",
            "question": "What are the boundary conditions, computational limitations, and threats to validity of your proposed system?",
            "model_answer_points": [
                "Admit realistic limitations (e.g. inference latency on edge hardware, dependence on annotated data).",
                "Explain under what domain-shift conditions the model performance degrades.",
                "Outline concrete strategies for future research phases."
            ],
            "defense_tips": "Acknowledging valid technical limitations demonstrates true scientific maturity and honesty.",
            "difficulty": "Challenging"
        },
        {
            "id": 6,
            "category": "novelty",
            "question": f"What is the original novelty and practical contribution of your thesis to the field of {domain} in Bangladesh?",
            "model_answer_points": [
                "Summarize your architectural, algorithmic, or domain-adaptation contribution in one sentence.",
                "Highlight applicability to local socio-economic, medical, or industrial infrastructure.",
                "Provide open-source reproducibility details (code repository, cleaned dataset)."
            ],
            "defense_tips": "Deliver your closing contribution statement with confidence and clear academic pride.",
            "difficulty": "Core"
        }
    ]

    return questions[:questions_count]
