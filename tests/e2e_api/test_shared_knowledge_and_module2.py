"""
Dedicated verification script for shared_knowledge_save_and_reuse (5 Runs)
followed by full Module 2 verification (8/8) against live Uvicorn on http://127.0.0.1:8000.
Security: Passwords strictly from environment variables without defaults.
"""
import os
import sys
import json
import time
import socket
import sqlite3
import subprocess
import urllib.request
import urllib.error
import urllib.parse

if "TEST_USER_PASSWORD" not in os.environ:
    raise RuntimeError("Missing required environment variable: TEST_USER_PASSWORD")

USER_PASS = os.environ["TEST_USER_PASSWORD"]
TEST_DB_PATH = r'E:\Thesis\backend\test_e2e_check.db'
ORIGINAL_DB_PATH = r'E:\Thesis\backend\ross_search.db'
BASE_URL = 'http://127.0.0.1:8000'

def wait_for_port_free(port=8000, timeout=30):
    start = time.time()
    while time.time() - start < timeout:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('127.0.0.1', port)) != 0:
                return True
        time.sleep(1)
    return False

def http_json(path, method="GET", payload=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read().decode("utf-8")
            return resp.status, json.loads(content)
    except urllib.error.HTTPError as err:
        try:
            return err.code, json.loads(err.read().decode("utf-8"))
        except Exception:
            return err.code, err.reason
    except Exception as e:
        return 599, str(e)

def db_ro_count(table_name):
    conn = sqlite3.connect(f'file:{TEST_DB_PATH}?mode=ro', uri=True)
    c = conn.cursor()
    c.execute(f'SELECT COUNT(*) FROM "{table_name}"')
    cnt = c.fetchone()[0]
    conn.close()
    return cnt

# 1. Ensure Port 8000 is clean
print("Checking Port 8000 status...")
if not wait_for_port_free(8000, 20):
    print("Warning: Port 8000 was busy, continuing...")
else:
    print("Port 8000 is free and available ✓")

if os.path.exists(TEST_DB_PATH):
    try:
        os.remove(TEST_DB_PATH)
    except Exception:
        pass

env = os.environ.copy()
env['DATABASE_URL'] = 'sqlite:///./test_e2e_check.db'

print("\n=== Launching Live Uvicorn Server on 127.0.0.1:8000 ===")
server = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000"],
    cwd=r"E:\Thesis\backend",
    env=env,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True
)

boot_ok = False
for attempt in range(15):
    time.sleep(1)
    try:
        with urllib.request.urlopen("http://127.0.0.1:8000/docs", timeout=2) as r:
            if r.status == 200:
                print(f"Server is live at http://127.0.0.1:8000 (booted in {attempt + 1}s) ✓")
                boot_ok = True
                break
    except Exception:
        pass

if not boot_ok:
    print("FATAL: Failed to boot server on port 8000.")
    server.terminate()
    out, _ = server.communicate()
    print("Server output:\n", out)
    sys.exit(1)

initial_sk_count = db_ro_count("shared_paper_knowledge")
print(f"Initial shared_paper_knowledge row count in Test DB: {initial_sk_count} (seeded baseline)")

print("\n" + "=" * 70)
print("EXECUTING shared_knowledge_save_and_reuse FLOW (5 RUNS)")
print("=" * 70)

sk_flow_passes = 0

for run in range(1, 6):
    ts = int(time.time() * 1000) % 100000
    s1_email = f"student1.sk.run{run}.{ts}@diu.edu.bd"
    s1_id = f"201-15-7{run:02d}"
    s2_email = f"student2.sk.run{run}.{ts}@diu.edu.bd"
    s2_id = f"201-15-8{run:02d}"
    
    http_json("/api/auth/register", "POST", {
        "email": s1_email, "password": USER_PASS, "full_name": f"Student One Run{run}",
        "student_id": s1_id, "department": "Department of Computer Science and Engineering",
        "batch": "Batch 44", "section": "60_A"
    })
    _, log1 = http_json("/api/auth/login", "POST", {"email": s1_email, "password": USER_PASS})
    token1 = log1.get("access_token")

    http_json("/api/auth/register", "POST", {
        "email": s2_email, "password": USER_PASS, "full_name": f"Student Two Run{run}",
        "student_id": s2_id, "department": "Department of Computer Science and Engineering",
        "batch": "Batch 44", "section": "60_A"
    })
    _, log2 = http_json("/api/auth/login", "POST", {"email": s2_email, "password": USER_PASS})
    token2 = log2.get("access_token")

    unique_title = f"Empirical Transformers for Low-Resource NLP Run {run}_{ts}"
    paper_payload = {
        "title": unique_title,
        "authors": f"Research Scholar Run {run}",
        "year": 2026,
        "journal_or_conference": "NeurIPS 2026 Workshop",
        "domain": "Natural Language Processing",
        "uploaded_by_name": f"Student One Run{run}",
        "uploaded_by_id": s1_id,
        "file_name": f"transformer_nlp_run{run}.pdf",
        "abstract": "Benchmarking self-attention over low-resource linguistic morphology.",
        "research_objective": "Mitigate vocabulary bottlenecks in dialectical processing.",
        "research_problem": "Quadratic memory scaling on agglutinative corpora.",
        "proposed_methodology": "LoRA rank-8 adapter insertion into encoder layers.",
        "dataset_description": "DIU Bengali News Benchmark Corpus.",
        "models_algorithms": "BERT-Base with LoRA adapters.",
        "important_findings": "94.2% test accuracy achieved with 10x compute reduction.",
        "limitations": "Constrained to news domain; unverified on spoken clinical notes.",
        "research_gap": "Zero-shot cross-lingual transfer without fine-tuning.",
        "future_directions": "Multimodal speech-text attention fusion."
    }
    
    status_post, post_resp = http_json("/api/research/shared-knowledge", "POST", paper_payload, token=token1)
    
    search_keyword = urllib.parse.quote_plus(f"Run {run}_{ts}")
    status_get, get_resp = http_json(f"/api/research/shared-knowledge?q={search_keyword}", "GET", token=token2)
    
    current_count = db_ro_count("shared_paper_knowledge")
    expected_count = initial_sk_count + run
    
    saved_in_response = isinstance(post_resp, dict) and post_resp.get("title") == unique_title
    found_by_student_2 = isinstance(get_resp, list) and any(x.get("title") == unique_title for x in get_resp)
    db_row_incremented = (current_count == expected_count)
    
    print(f"Run {run}/5: POST status={status_post} | GET by Student 2={found_by_student_2} | DB Rows={current_count} (expected {expected_count})")
    
    if status_post == 201 and found_by_student_2 and db_row_incremented:
        sk_flow_passes += 1
        print(f"  -> Run {run} PASSED ✓")
    else:
        print(f"  -> Run {run} FAILED: post_resp={post_resp}")

print(f"\nResult: shared_knowledge_save_and_reuse: {sk_flow_passes}/5 PASS")

print("\n" + "=" * 70)
print("EXECUTING FULL MODULE 2 AUTOMATION SUITE (8 TARGETS)")
print("=" * 70)

m2_suite = {}

# 1. Domain list (/api/research/interests)
c1, d1 = http_json("/api/research/interests", "GET")
m2_suite["1. Research Interests List"] = (c1 == 200 and len(d1) >= 12)

# 2. Query logging and history
boundary = "----FormBoundary7MA4YWxk"
form_data = f"--{boundary}\r\nContent-Disposition: form-data; name=\"query_text\"\r\n\r\nQuantum ML Discovery\r\n--{boundary}\r\nContent-Disposition: form-data; name=\"domain\"\r\n\r\nMachine Learning\r\n--{boundary}--\r\n".encode("utf-8")
req_lq = urllib.request.Request(f"{BASE_URL}/api/research/log-query", data=form_data, headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}, method="POST")
with urllib.request.urlopen(req_lq, timeout=8) as r:
    clq = r.status
c2, d2 = http_json("/api/research/query-history?domain=Machine+Learning", "GET")
m2_suite["2. Query Log & History Tracking"] = (clq == 200 and c2 == 200 and any("Quantum ML" in x.get("query_text", "") for x in d2))

# 3. Query history DB persistence
conn = sqlite3.connect(f'file:{TEST_DB_PATH}?mode=ro', uri=True)
c = conn.cursor()
c.execute("SELECT COUNT(*) FROM research_query_logs WHERE query_text LIKE '%Quantum ML%'")
qh_db_ok = c.fetchone()[0] > 0
conn.close()
m2_suite["3. Query History DB Persistence"] = qh_db_ok

# 4. Previous projects search & filters
c4, d4 = http_json("/api/research/previous-projects?q=SCADA&domain=Cyber+Security", "GET")
m2_suite["4. Previous Projects Multi-Filter Search"] = (c4 == 200 and len(d4) >= 1 and "SCADA" in d4[0].get("title", ""))

# 5. Academic papers catalog fields
c5, d5 = http_json("/api/research/academic-papers?domain=Natural+Language+Processing", "GET")
req_fields = ["title", "authors", "year", "venue", "abstract", "doi", "pdf_url", "domain"]
m2_suite["5. Academic Papers Catalog Fields"] = (c5 == 200 and len(d5) > 0 and all(all(k in p for k in req_fields) for p in d5[:2]))

# 6. PDF Upload & 9-section analysis
sample_pdf_bytes = (
    b"%PDF-1.4\n1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj\n2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj\n"
    b"3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources <<>> >> endobj\n"
    b"4 0 obj <</Length 280>> stream\nBT\n/F1 12 Tf\n72 712 Td\n(Attention Transformer Networks for Bengali NLP) Tj\n"
    b"0 -20 Td\n(Objectives: Evaluate self-attention for low-resource Bengali text classification.) Tj\n"
    b"0 -20 Td\n(Problem Statement: Sequential RNNs fail to preserve long-range grammatical context.) Tj\n"
    b"0 -20 Td\n(Methodology: Multi-head attention with stacked transformer encoder layers.) Tj\n"
    b"0 -20 Td\n(Dataset: 15000 annotated Bengali news articles.) Tj\n"
    b"0 -20 Td\n(Models: Bengali-BERT baseline compared with proposed BiLSTM-BERT architecture.) Tj\n"
    b"0 -20 Td\n(Results: Achieved 94.2% test accuracy on test split.) Tj\n"
    b"0 -20 Td\n(Limitations: Quadratic memory complexity on sequences over 512 tokens.) Tj\n"
    b"0 -20 Td\n(Research Gap: Lack of specialized tokenization vocabularies for dialectical Bengali.) Tj\n"
    b"0 -20 Td\n(Future Work: Deploy quantized INT8 model on edge devices.) Tj\nET\nendstream\nendobj\n"
    b"xref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000216 00000 n \n"
    b"trailer <</Size 5 /Root 1 0 R>>\nstartxref\n550\n%%EOF"
)
boundary_pdf = "----WebKitFormBoundary7MA4YWxk"
pdf_body = (
    f"--{boundary_pdf}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"test_doc.pdf\"\r\nContent-Type: application/pdf\r\n\r\n".encode("utf-8")
    + sample_pdf_bytes
    + f"\r\n--{boundary_pdf}\r\nContent-Disposition: form-data; name=\"model_choice\"\r\n\r\nneural-nlp-offline\r\n--{boundary_pdf}--\r\n".encode("utf-8")
)
req_pdf = urllib.request.Request(f"{BASE_URL}/api/research/summarize-pdf", data=pdf_body, headers={"Content-Type": f"multipart/form-data; boundary={boundary_pdf}"}, method="POST")
with urllib.request.urlopen(req_pdf, timeout=12) as r:
    c6 = r.status
    d6 = json.loads(r.read().decode("utf-8"))

sections_9 = [
    "research_problem", "research_objective", "proposed_methodology",
    "dataset_description", "models_algorithms", "important_findings",
    "limitations", "research_gap", "future_directions"
]
m2_suite["6. PDF Upload & 9-Section Analysis"] = (c6 == 200 and all(d6.get(s) for s in sections_9))

# 7. Shared knowledge save & reuse
m2_suite["7. Shared Knowledge Save & Student Reuse"] = (sk_flow_passes == 5)

# 8. Topic similarity scoring bands
c8_h, d8_h = http_json("/api/research/check-similarity", "POST", {
    "title": "Bengali Sentiment Analysis and Opinion Mining Using Hybrid BiLSTM-BERT Models",
    "domain": "Natural Language Processing"
})
c8_l, d8_l = http_json("/api/research/check-similarity", "POST", {
    "title": "Quantum Entanglement Verification in Subsea Optical Fiber",
    "domain": "Physics"
})
score_h = d8_h.get("highest_similarity", 0)
score_l = d8_l.get("highest_similarity", 100)
m2_suite["8. Topic Similarity Multi-Band Scoring"] = (score_h >= 70.0 and score_l < 45.0)

for test_name, passed in m2_suite.items():
    mark = "PASS ✓" if passed else "FAIL ✗"
    print(f"  {test_name:<45} : {mark}")

total_m2_passed = sum(1 for v in m2_suite.values() if v)
print(f"\nModule 2 Full Suite Result: {total_m2_passed} / {len(m2_suite)} PASSED")

print("\n=== Shutting Down Test Server ===")
server.terminate()
try:
    server.communicate(timeout=6)
except Exception:
    server.kill()
    server.communicate()

if os.path.exists(TEST_DB_PATH):
    try:
        os.remove(TEST_DB_PATH)
        print(f"Test DB removed: {TEST_DB_PATH} ✓")
    except Exception as e:
        print(f"Test DB delete note: {e}")

print("\n=== ross_search.db Integrity & Row Counts (mode=ro) ===")
conn_orig = sqlite3.connect(f'file:{ORIGINAL_DB_PATH}?mode=ro', uri=True)
co = conn_orig.cursor()
counts = {}
for tbl in ["users", "students", "supervisors", "previous_projects", "shared_paper_knowledge", "research_interests"]:
    co.execute(f'SELECT COUNT(*) FROM "{tbl}"')
    counts[tbl] = co.fetchone()[0]
conn_orig.close()

for tbl, cnt in counts.items():
    print(f"  {tbl}: {cnt}")
