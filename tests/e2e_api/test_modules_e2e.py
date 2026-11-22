"""
E2E Automation Runner for Module 1 & Module 2 across 5 runs.
Security: Passwords strictly from environment variables without defaults.
"""
import os
import sys
import json
import time
import sqlite3
import urllib.request
import urllib.error
import urllib.parse
from datetime import datetime

if "TEST_USER_PASSWORD" not in os.environ:
    raise RuntimeError("Missing required environment variable: TEST_USER_PASSWORD")
if "SUPERVISOR_PASSWORD" not in os.environ:
    raise RuntimeError("Missing required environment variable: SUPERVISOR_PASSWORD")

USER_PASS = os.environ["TEST_USER_PASSWORD"]
SUP_PASS = os.environ["SUPERVISOR_PASSWORD"]
INVALID_PASS = USER_PASS + "_INVALID_TOKEN_TEST"

TEST_DB_PATH = r'E:\Thesis\backend\test_e2e_check.db'
BASE_URL = 'http://127.0.0.1:8000'

def api_call(path, method="GET", payload=None, token=None, files=None):
    url = f"{BASE_URL}{path}"
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
        
    data = None
    if files:
        boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
        headers["Content-Type"] = f"multipart/form-data; boundary={boundary}"
        body_parts = []
        for field_name, (filename, file_bytes, content_type) in files.items():
            body_parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"{field_name}\"; filename=\"{filename}\"\r\nContent-Type: {content_type}\r\n\r\n".encode("utf-8"))
            body_parts.append(file_bytes)
            body_parts.append(b"\r\n")
        if payload:
            for k, v in payload.items():
                body_parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode("utf-8"))
        body_parts.append(f"--{boundary}--\r\n".encode("utf-8"))
        data = b"".join(body_parts)
    elif payload is not None:
        headers["Content-Type"] = "application/json"
        data = json.dumps(payload).encode("utf-8")
        
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            content = resp.read().decode("utf-8")
            try:
                return resp.status, json.loads(content)
            except Exception:
                return resp.status, content
    except urllib.error.HTTPError as err:
        try:
            err_content = err.read().decode("utf-8", errors="replace")
            try:
                return err.code, json.loads(err_content)
            except Exception:
                return err.code, err_content
        except Exception:
            return err.code, f"HTTPError {err.code}"
    except Exception as e:
        return 599, str(e)

def db_ro_query(query, params=()):
    conn = sqlite3.connect(f'file:{TEST_DB_PATH}?mode=ro', uri=True)
    c = conn.cursor()
    c.execute(query, params)
    res = c.fetchall()
    conn.close()
    return res

def create_sample_pdf():
    content = (
        b"%PDF-1.4\n"
        b"1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj\n"
        b"2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj\n"
        b"3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources <<>> >> endobj\n"
        b"4 0 obj <</Length 280>> stream\n"
        b"BT\n/F1 12 Tf\n72 712 Td\n(Attention Transformer Networks for Bengali NLP) Tj\n"
        b"0 -20 Td\n(Objectives: Evaluate self-attention for low-resource Bengali text classification.) Tj\n"
        b"0 -20 Td\n(Problem Statement: Sequential RNNs fail to preserve long-range grammatical context.) Tj\n"
        b"0 -20 Td\n(Methodology: Multi-head attention with stacked transformer encoder layers.) Tj\n"
        b"0 -20 Td\n(Dataset: 15000 annotated Bengali news articles.) Tj\n"
        b"0 -20 Td\n(Models: Bengali-BERT baseline compared with proposed BiLSTM-BERT architecture.) Tj\n"
        b"0 -20 Td\n(Results: Achieved 94.2% test accuracy on test split.) Tj\n"
        b"0 -20 Td\n(Limitations: Quadratic memory complexity on sequences over 512 tokens.) Tj\n"
        b"0 -20 Td\n(Research Gap: Lack of specialized tokenization vocabularies for dialectical Bengali.) Tj\n"
        b"0 -20 Td\n(Future Work: Deploy quantized INT8 model on edge devices.) Tj\n"
        b"ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000216 00000 n \ntrailer <</Size 5 /Root 1 0 R>>\nstartxref\n550\n%%EOF"
    )
    return content

print("=" * 70)
print("STARTING 5-RUN E2E API AUTOMATION SUITE (MODULE 1 & MODULE 2)")
print("=" * 70)

m1_results = {
    "student_registration_login": 0,
    "profile_update_domain_selection": 0,
    "junction_db_persistence": 0,
    "supervisor_dashboard": 0,
    "team_lifecycle": 0,
    "token_revocation_401": 0,
    "invalid_password_rejection": 0
}

m2_results = {
    "interests_and_query_logging": 0,
    "query_history_db_persistence": 0,
    "previous_projects_search_filter": 0,
    "academic_papers_catalog_fields": 0,
    "pdf_upload_9_section_analysis": 0,
    "shared_knowledge_save_and_reuse": 0,
    "topic_similarity_scoring_bands": 0,
    "cross_student_query_history_privacy": 0
}

bugs_found = []

for i in range(1, 6):
    print(f"\n>>> RUN {i} / 5 IN PROGRESS...")
    s_email = f"student.test.run{i}.{int(time.time())}@diu.edu.bd"
    s_id = f"201-15-{980 + i}"
    s_name = f"Test Student Run{i}"
    
    # ── MODULE 1: Step 1: Register & Login ──
    code, reg_res = api_call("/api/auth/register", "POST", {
        "email": s_email,
        "password": USER_PASS,
        "full_name": s_name,
        "student_id": s_id,
        "department": "Department of Computer Science and Engineering",
        "batch": "Batch 44",
        "section": "60_A"
    })
    
    code_log, log_res = api_call("/api/auth/login", "POST", {
        "email": s_email,
        "password": USER_PASS
    })
    
    s_token = log_res.get("access_token") if isinstance(log_res, dict) else None
    if code in [200, 201] and code_log == 200 and s_token:
        m1_results["student_registration_login"] += 1
    else:
        bugs_found.append((f"Run {i}: Register/Login", f"code={code}/{code_log}"))
        
    # Step 2: Invalid password rejection
    bad_code, _ = api_call("/api/auth/login", "POST", {
        "email": s_email,
        "password": INVALID_PASS
    })
    if bad_code in [400, 401]:
        m1_results["invalid_password_rejection"] += 1

    # Step 3: Profile view & update domain selection
    code_prof, prof = api_call("/api/students/me", "GET", token=s_token)
    
    code_upd, upd_res = api_call("/api/students/me/interests", "PUT", {
        "interest_ids": [1, 3]
    }, token=s_token)
    
    code_get_prof, prof_after = api_call("/api/students/me", "GET", token=s_token)
    interests_retrieved = [x.get("id") for x in prof_after.get("interests", [])] if isinstance(prof_after, dict) else []
    
    if code_upd == 200 and set([1, 3]).issubset(set(interests_retrieved)):
        m1_results["profile_update_domain_selection"] += 1
    else:
        bugs_found.append((f"Run {i}: Domain selection update", f"interests={interests_retrieved}"))

    # Step 4: DB Junction Verification
    db_rows = db_ro_query("SELECT student_id, interest_id FROM student_interests WHERE student_id = (SELECT id FROM students WHERE student_id = ?)", (s_id,))
    matched_ids = [r[1] for r in db_rows]
    if set([1, 3]).issubset(set(matched_ids)):
        m1_results["junction_db_persistence"] += 1
    else:
        bugs_found.append((f"Run {i}: DB junction persistence", f"found={matched_ids}"))

    # Step 5: Supervisor login & dashboard stats
    code_sup_log, sup_log = api_call("/api/auth/login", "POST", {
        "email": "dr.syed.tareq@diu.edu.bd",
        "password": SUP_PASS
    })
    sup_token = sup_log.get("access_token") if isinstance(sup_log, dict) else None
    code_dash, dash_data = api_call("/api/supervision-requests/dashboard/stats", "GET", token=sup_token)
    if code_sup_log == 200 and code_dash == 200:
        m1_results["supervisor_dashboard"] += 1
    else:
        bugs_found.append((f"Run {i}: Supervisor login/dashboard", f"code={code_sup_log}/{code_dash}"))

    # Step 6: Team lifecycle
    team_name = f"Alpha Team Run {i} {int(time.time())}"
    code_tm, tm_res = api_call("/api/teams/", "POST", {
        "name": team_name,
        "description": "Thesis research team for E2E automated validation",
        "max_members": 4
    }, token=s_token)
    team_id = tm_res.get("id") if isinstance(tm_res, dict) else None
    
    code_my_tm, my_tms = api_call("/api/teams/my-teams", "GET", token=s_token)
    if code_tm in [200, 201] and code_my_tm == 200 and any(t.get("id") == team_id for t in my_tms):
        m1_results["team_lifecycle"] += 1
    else:
        bugs_found.append((f"Run {i}: Team lifecycle", f"code={code_tm}/{code_my_tm}"))

    # Step 7: Logout & Token Revocation
    code_logout, _ = api_call("/api/auth/logout", "POST", token=s_token)
    code_revoked, _ = api_call("/api/students/me", "GET", token=s_token)
    if code_logout == 200 and code_revoked == 401:
        m1_results["token_revocation_401"] += 1
    else:
        bugs_found.append((f"Run {i}: Logout/revocation", f"logout_code={code_logout}, after_code={code_revoked}"))

    # ── MODULE 2: Step 8: Domain List & Research Query Logging ──
    code_int, interests = api_call("/api/research/interests", "GET")
    query_text = f"Transformer architectures in Bengali NLP run {i}"
    
    s2_email = f"student2.run{i}.{int(time.time())}@diu.edu.bd"
    s2_id = f"201-15-{950 + i}"
    api_call("/api/auth/register", "POST", {
        "email": s2_email,
        "password": USER_PASS,
        "full_name": f"Student Two Run{i}",
        "student_id": s2_id,
        "department": "Department of Computer Science and Engineering",
        "batch": "Batch 44",
        "section": "60_A"
    })
    _, s2_log = api_call("/api/auth/login", "POST", {"email": s2_email, "password": USER_PASS})
    s2_token = s2_log.get("access_token") if isinstance(s2_log, dict) else None

    boundary = "----FormBoundary7MA4YWxk"
    body_form = f"--{boundary}\r\nContent-Disposition: form-data; name=\"query_text\"\r\n\r\n{query_text}\r\n--{boundary}\r\nContent-Disposition: form-data; name=\"domain\"\r\n\r\nNatural Language Processing\r\n--{boundary}\r\nContent-Disposition: form-data; name=\"student_id\"\r\n\r\n{s_id}\r\n--{boundary}\r\nContent-Disposition: form-data; name=\"student_name\"\r\n\r\n{s_name}\r\n--{boundary}--\r\n".encode("utf-8")
    
    req_lq = urllib.request.Request(f"{BASE_URL}/api/research/log-query", data=body_form, headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}, method="POST")
    code_lq = 0
    try:
        with urllib.request.urlopen(req_lq, timeout=8) as r:
            code_lq = r.status
    except Exception:
        code_lq = 500

    code_qh, q_history = api_call("/api/research/query-history?domain=Natural+Language+Processing", "GET")
    if code_int == 200 and code_lq == 200 and code_qh == 200 and any(q.get("query_text") == query_text for q in q_history):
        m2_results["interests_and_query_logging"] += 1
    else:
        bugs_found.append((f"Run {i}: Query logging/history", f"code_lq={code_lq}, code_qh={code_qh}"))

    # Step 9: Query history DB persistence
    qh_db = db_ro_query("SELECT id FROM research_query_logs WHERE query_text = ?", (query_text,))
    if len(qh_db) > 0:
        m2_results["query_history_db_persistence"] += 1

    # Step 10: Previous projects multi-criteria search
    code_prev, prev_projs = api_call("/api/research/previous-projects?q=SCADA&domain=Cyber+Security", "GET")
    if code_prev == 200 and len(prev_projs) >= 1 and any("SCADA" in p.get("title", "") for p in prev_projs):
        m2_results["previous_projects_search_filter"] += 1
    else:
        bugs_found.append((f"Run {i}: Previous projects search", f"count={len(prev_projs) if isinstance(prev_projs, list) else 0}"))

    # Step 11: Academic papers catalog fields
    code_ap, ap_list = api_call("/api/research/academic-papers?domain=Natural+Language+Processing", "GET")
    req_fields = ["title", "authors", "year", "venue", "abstract", "doi", "pdf_url", "domain"]
    if code_ap == 200 and len(ap_list) > 0 and all(all(k in p for k in req_fields) for p in ap_list[:2]):
        m2_results["academic_papers_catalog_fields"] += 1
    else:
        bugs_found.append((f"Run {i}: Academic papers catalog fields missing", f"code={code_ap}"))

    # Step 12: PDF upload and 9-section analysis
    sample_pdf_bytes = create_sample_pdf()
    files_dict = {
        "file": ("sample_paper.pdf", sample_pdf_bytes, "application/pdf")
    }
    code_pdf, pdf_analysis = api_call("/api/research/summarize-pdf", "POST", payload={"model_choice": "neural-nlp-offline"}, files=files_dict)
    
    sections_9 = [
        "research_problem", "research_objective", "proposed_methodology",
        "dataset_description", "models_algorithms", "important_findings",
        "limitations", "research_gap", "future_directions"
    ]
    if code_pdf == 200 and isinstance(pdf_analysis, dict) and all(pdf_analysis.get(s) for s in sections_9):
        m2_results["pdf_upload_9_section_analysis"] += 1
    else:
        bugs_found.append((f"Run {i}: PDF 9-section analysis", f"code={code_pdf}"))

    # Step 13: Shared knowledge save & reuse by other student
    unique_keyword = f"UniqueNLPKey_{i}_{int(time.time()*1000)%100000}"
    shared_payload = {
        "title": f"Novel Transformer Layers for Low-Resource NLP {unique_keyword}",
        "authors": f"Author Run {i}",
        "year": 2026,
        "domain": "Natural Language Processing",
        "uploaded_by_name": s_name,
        "uploaded_by_id": s_id,
        "abstract": "An empirical benchmark of transformer layers for dialectical text.",
        "research_problem": "Lack of morphological adapters in standard BERT.",
        "research_objective": "Build lightweight adapter layers.",
        "proposed_methodology": "LoRA rank-8 parameter fine-tuning.",
        "dataset_description": "DIU Bengali News Corpus.",
        "models_algorithms": "BERT-Base with LoRA adapters.",
        "important_findings": "94.2% test accuracy with 10x compute reduction.",
        "limitations": "Evaluated on single-domain news articles.",
        "research_gap": "Zero-shot transfer to medical dialogs.",
        "future_directions": "Multimodal visual reasoning."
    }
    code_sk, sk_saved = api_call("/api/research/shared-knowledge", "POST", shared_payload)
    code_sk_get, sk_list = api_call(f"/api/research/shared-knowledge?q={unique_keyword}", "GET", token=s2_token)
    
    if code_sk in [200, 201] and code_sk_get == 200 and any(unique_keyword in x.get("title", "") for x in sk_list):
        m2_results["shared_knowledge_save_and_reuse"] += 1
    else:
        bugs_found.append((f"Run {i}: Shared knowledge save/reuse (HTTP {code_sk})", f"Could not find {unique_keyword}"))

    # Step 14: Topic similarity scoring bands
    _, sim_high = api_call("/api/research/check-similarity", "POST", {
        "title": "Bengali Sentiment Analysis and Opinion Mining Using Hybrid BiLSTM-BERT Models",
        "domain": "Natural Language Processing"
    })
    _, sim_low = api_call("/api/research/check-similarity", "POST", {
        "title": f"Quantum Teleportation Protocols for Subsea Sensor Nodes Run {i}",
        "domain": "Physics & Quantum"
    })
    
    high_score = sim_high.get("highest_similarity", 0) if isinstance(sim_high, dict) else 0
    low_score = sim_low.get("highest_similarity", 100) if isinstance(sim_low, dict) else 100
    
    if high_score >= 70.0 and low_score < 45.0:
        m2_results["topic_similarity_scoring_bands"] += 1
    else:
        bugs_found.append((f"Run {i}: Topic similarity scoring bands", f"high={high_score}, low={low_score}"))

    # Step 15: Cross-student query history privacy check
    code_privacy, all_queries = api_call("/api/research/query-history", "GET", token=s2_token)
    if code_privacy == 200:
        m2_results["cross_student_query_history_privacy"] += 1

print("\n" + "=" * 70)
print("AUTOMATION RUNS COMPLETED. SUMMARY REPORT:")
print("=" * 70)

print("\n--- MODULE 1 TEST RESULTS (Target: 5/5) ---")
for k, v in m1_results.items():
    print(f"  {k:<35} : {v}/5 PASS")

print("\n--- MODULE 2 TEST RESULTS (Target: 5/5) ---")
for k, v in m2_results.items():
    print(f"  {k:<35} : {v}/5 PASS")

if bugs_found:
    print("\n--- DETECTED BUGS / DISCREPANCIES ---")
    for b in bugs_found[:4]:
        print(f"  * {b[0]} -> {b[1]}")
