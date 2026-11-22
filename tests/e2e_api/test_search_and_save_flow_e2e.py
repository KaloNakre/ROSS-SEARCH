"""
E2E Real HTTP Flow Test for Search & Save Verification across 5 Runs.
Tests Student A searching & saving paper, and Student B checking visibility.
Security: Passwords strictly from environment variables without defaults.
"""
import os
import sys
import time
import json
import subprocess
import urllib.request
import urllib.error
import urllib.parse

if "TEST_USER_PASSWORD" not in os.environ:
    raise RuntimeError("Missing required environment variable: TEST_USER_PASSWORD")

USER_PASS = os.environ["TEST_USER_PASSWORD"]
PORT = 8000
BASE_URL = f"http://127.0.0.1:{PORT}"
TEST_DB_NAME = "test_search_flow.db"
BACKEND_DIR = r"E:\Thesis\backend"
TEST_DB_PATH = os.path.join(BACKEND_DIR, TEST_DB_NAME)

def http_request(path, method="GET", payload=None, token=None, is_form=False, retries=3):
    url = f"{BASE_URL}{path}"
    headers = {"Connection": "close"}
    data = None

    if token:
        headers["Authorization"] = f"Bearer {token}"

    if payload is not None:
        if is_form:
            data = urllib.parse.urlencode(payload).encode("utf-8")
            headers["Content-Type"] = "application/x-www-form-urlencoded"
        else:
            data = json.dumps(payload).encode("utf-8")
            headers["Content-Type"] = "application/json"

    for attempt in range(retries):
        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=35) as resp:
                status = resp.status
                body = resp.read().decode("utf-8")
                try:
                    return status, json.loads(body)
                except Exception:
                    return status, body
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8")
            try:
                return e.code, json.loads(body)
            except Exception:
                return e.code, body
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(2)
                continue
            return 599, str(e)

def wait_for_server(timeout=30):
    start = time.time()
    while time.time() - start < timeout:
        try:
            status, data = http_request("/api/database/overview")
            if status == 200:
                return True
        except Exception:
            pass
        time.sleep(1)
    return False

def main():
    print("=" * 70)
    print("STARTING REAL HTTP SERVER (Uvicorn on Port 8000) FOR SEARCH & SAVE FLOW")
    print(f"Target DB: {TEST_DB_PATH}")
    print("=" * 70)

    # Clean existing test DB if any
    for p in [TEST_DB_PATH, TEST_DB_PATH + "-shm", TEST_DB_PATH + "-wal"]:
        if os.path.exists(p):
            try:
                os.remove(p)
            except Exception:
                pass

    server_env = os.environ.copy()
    server_env["DATABASE_URL"] = f"sqlite:///./{TEST_DB_NAME}"

    log_file = open(os.path.join(BACKEND_DIR, "uvicorn_test_server.log"), "w", encoding="utf-8")
    proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", str(PORT)],
        cwd=BACKEND_DIR,
        env=server_env,
        stdout=log_file,
        stderr=log_file
    )

    try:
        if not wait_for_server(30):
            stdout, stderr = proc.communicate(timeout=5)
            raise RuntimeError(f"Server failed to start on port {PORT}. Stderr: {stderr}")

        print("Uvicorn server is UP and responding to HTTP requests.")

        results = {
            "student_a_search_executed": 0,
            "student_a_paper_saved": 0,
            "student_b_saw_student_a_query": 0,
            "student_b_saw_student_a_name_in_query": 0,
            "student_b_saw_student_a_library_paper": 0,
            "student_b_library_isolated_private": 0
        }

        for i in range(1, 6):
            print(f"\n--- RUN {i} / 5 ---")
            ts = int(time.time())
            # 1. Student A registration & login
            email_a = f"student.a.flow.run{i}.{ts}@diu.edu.bd"
            id_a = f"201-15-71{i}"
            name_a = f"Student Alpha Run{i}"

            code_reg_a, res_reg_a = http_request("/api/auth/register", "POST", {
                "email": email_a,
                "password": USER_PASS,
                "full_name": name_a,
                "student_id": id_a,
                "department": "Department of Computer Science and Engineering",
                "batch": "Batch 44",
                "section": "60_A"
            })
            code_log_a, res_log_a = http_request("/api/auth/login", "POST", {
                "email": email_a,
                "password": USER_PASS
            })
            if not isinstance(res_log_a, dict) or "access_token" not in res_log_a:
                print(f"  [A] Login failed in Run {i}: reg_code={code_reg_a}, reg_res={res_reg_a}, log_code={code_log_a}, log_res={res_log_a}")
                continue
            token_a = res_log_a.get("access_token")

            # 2. Student A sets domain to Cyber Security
            http_request("/api/students/me/interests", "PUT", {"interest_ids": [3]}, token=token_a)

            # 3. Student A searches "phishing detection"
            # In frontend handleSearchSubmit: calls log-query AND getAcademicPapers
            query_str = f"phishing detection run{i}"
            domain_str = "Cyber Security"

            code_log_q, res_log_q = http_request("/api/research/log-query", "POST", {
                "query_text": query_str,
                "domain": domain_str,
                "student_id": id_a,
                "student_name": name_a
            }, is_form=True)

            code_papers, papers_list = http_request(
                f"/api/research/academic-papers?q=phishing+detection&domain=Cyber+Security&limit=5",
                "GET"
            )

            if code_log_q == 200 and code_papers == 200:
                results["student_a_search_executed"] += 1
                print(f"  [A] Search logged (ID={res_log_q.get('id')}), Academic papers returned: {len(papers_list) if isinstance(papers_list, list) else 0}")
            else:
                print(f"  [A] Search error: code_log_q={code_log_q}, code_papers={code_papers}")

            # 4. Student A saves a paper to personal library
            paper_to_save = {
                "title": f"Deep Learning Framework for Phishing URL Detection in Cyber Systems Run {i}",
                "authors": "A. Rahman, T. Ahmed, M. Hasan",
                "year": 2025,
                "domain": "Cyber Security",
                "venue": "IEEE Transactions on Cyber Security",
                "abstract": "Evaluation of LSTM and transformer attention heads on malicious phishing detection datasets.",
                "doi": f"10.1109/TCS.2025.00{i}",
                "arxiv_id": f"2501.000{i}",
                "pdf_url": f"https://arxiv.org/pdf/2501.000{i}.pdf",
                "notes": f"High priority reading for thesis Run {i}",
                "reading_status": "reading"
            }

            code_save, res_save = http_request("/api/research/library/save", "POST", paper_to_save, token=token_a)
            if code_save == 201 and res_save.get("id"):
                results["student_a_paper_saved"] += 1
                saved_paper_id = res_save.get("id")
                print(f"  [A] Paper successfully saved to Personal Library (ID={saved_paper_id})")
            else:
                print(f"  [A] Failed to save paper: code={code_save}, res={res_save}")

            # Verify paper in Student A's library
            code_lib_a, lib_a = http_request("/api/research/library", "GET", token=token_a)
            a_has_paper = any(p.get("title") == paper_to_save["title"] for p in lib_a) if isinstance(lib_a, list) else False
            print(f"  [A] Verified in A's own library: {a_has_paper} (total items in A library: {len(lib_a) if isinstance(lib_a, list) else 0})")

            # 5. Student B registers and logs in with SAME domain (Cyber Security)
            email_b = f"student.b.flow.run{i}.{ts}@diu.edu.bd"
            id_b = f"201-15-82{i}"
            name_b = f"Student Beta Run{i}"

            code_reg_b, res_reg_b = http_request("/api/auth/register", "POST", {
                "email": email_b,
                "password": USER_PASS,
                "full_name": name_b,
                "student_id": id_b,
                "department": "Department of Computer Science and Engineering",
                "batch": "Batch 44",
                "section": "60_A"
            })
            code_log_b, res_log_b = http_request("/api/auth/login", "POST", {
                "email": email_b,
                "password": USER_PASS
            })
            if not isinstance(res_log_b, dict) or "access_token" not in res_log_b:
                print(f"  [B] Login failed in Run {i}: reg_code={code_reg_b}, reg_res={res_reg_b}, log_code={code_log_b}, log_res={res_log_b}")
                continue
            token_b = res_log_b.get("access_token")

            # Student B sets domain
            http_request("/api/students/me/interests", "PUT", {"interest_ids": [3]}, token=token_b)

            # 6. Student B checks Query History for "Cyber Security"
            code_hist, hist_b = http_request("/api/research/query-history?domain=Cyber+Security&limit=25", "GET", token=token_b)
            saw_a_query = False
            saw_a_name = False
            if code_hist == 200 and isinstance(hist_b, list):
                for q_entry in hist_b:
                    if q_entry.get("query_text") == query_str:
                        saw_a_query = True
                        if q_entry.get("student_name") == name_a and q_entry.get("student_id") == id_a:
                            saw_a_name = True
                        break

            if saw_a_query:
                results["student_b_saw_student_a_query"] += 1
            if saw_a_name:
                results["student_b_saw_student_a_name_in_query"] += 1

            print(f"  [B] Checking Query History: Saw A's Query='{query_str}': {saw_a_query} | Saw A's Name & ID: {saw_a_name}")

            # 7. Student B checks Personal Library (Privacy Check)
            code_lib_b, lib_b = http_request("/api/research/library", "GET", token=token_b)
            saw_a_saved_in_b_lib = any(p.get("title") == paper_to_save["title"] for p in lib_b) if isinstance(lib_b, list) else False
            if not saw_a_saved_in_b_lib and isinstance(lib_b, list) and len(lib_b) == 0:
                results["student_b_library_isolated_private"] += 1
                print(f"  [B] Personal Library is completely ISOLATED & PRIVATE (items count = {len(lib_b)}). A's saved paper is NOT visible in B's library.")
            else:
                results["student_b_saw_student_a_library_paper"] += 1
                print(f"  [B] WARNING: Student A's saved paper leaked into Student B's library! (count={len(lib_b)})")

            # 8. Student B checks Shared Knowledge Repository (Public Shared Knowledge)
            code_sk, sk_b = http_request("/api/research/shared-knowledge?domain=Cyber+Security", "GET", token=token_b)
            in_shared_knowledge = any(p.get("title") == paper_to_save["title"] for p in sk_b) if isinstance(sk_b, list) else False
            print(f"  [B] In Shared Knowledge Repository (Public DB): {in_shared_knowledge} (Because A only saved to personal reading library, NOT shared knowledge)")
            time.sleep(2)

        print("\n" + "=" * 70)
        print("SEARCH & SAVE E2E REAL HTTP TEST RESULTS ACROSS 5 RUNS:")
        print("=" * 70)
        for k, v in results.items():
            print(f"  {k:<45} : {v}/5")

    finally:
        print("\nShutting down Uvicorn background process...")
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except Exception:
            proc.kill()
        print("Uvicorn terminated.")
        try:
            log_file.close()
            log_path = os.path.join(BACKEND_DIR, "uvicorn_test_server.log")
            if os.path.exists(log_path):
                os.remove(log_path)
        except Exception:
            pass

        # Cleanup test DB
        for p in [TEST_DB_PATH, TEST_DB_PATH + "-shm", TEST_DB_PATH + "-wal"]:
            if os.path.exists(p):
                try:
                    os.remove(p)
                    print(f"Cleaned up test DB file: {p}")
                except Exception as e:
                    print(f"Could not remove {p}: {e}")

if __name__ == "__main__":
    main()
