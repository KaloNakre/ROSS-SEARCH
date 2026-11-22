"""
Master E2E Comprehensive 5-Run Verification Suite for Module 2:
1. Research Domain & Query-Based Paper Discovery (Riya Saha - ID: 715)
2. AI-Based Research Paper PDF Analysis & Multi-Model Switching (Robayet Islam - ID: 809)
3. AI-Based Similarity & Duplicate Topic Detection (Tamim Hasan Sami - ID: 313)
4. Shared Research Knowledge Database & Knowledge Reuse (Tamim Hasan Sami - ID: 313)
5. Multi-Role Accessibility (Student, Supervisor, Admin)
"""
import os
import sys
import time
import io
import json

if "TEST_USER_PASSWORD" not in os.environ:
    raise RuntimeError("Missing required environment variable: TEST_USER_PASSWORD")
if "SUPERVISOR_PASSWORD" not in os.environ:
    raise RuntimeError("Missing required environment variable: SUPERVISOR_PASSWORD")

STUDENT_PASS = os.environ["TEST_USER_PASSWORD"]
SUPERVISOR_PASS = os.environ["SUPERVISOR_PASSWORD"]
ADMIN_PASS = os.environ.get("ADMIN_PASSWORD", "Admin@12345")

backend_dir = r"E:\Thesis\backend"
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app
from fastapi.testclient import TestClient

def create_sample_pdf_bytes():
    """Create authentic minimal PDF with academic structure."""
    return (
        b"%PDF-1.4\n"
        b"1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj\n"
        b"2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj\n"
        b"3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources <<>> >> endobj\n"
        b"4 0 obj <</Length 320>> stream\n"
        b"BT\n/F1 12 Tf\n72 712 Td\n(Machine Learning for Phishing Detection in Web Systems) Tj\n"
        b"0 -20 Td\n(Problem Statement: Malicious phishing attacks exploit user credentials through fake websites.) Tj\n"
        b"0 -20 Td\n(Objectives: Detect zero-day phishing websites with high recall and low latency.) Tj\n"
        b"0 -20 Td\n(Methodology: Feature extraction from lexical URL tokens and HTML DOM elements.) Tj\n"
        b"0 -20 Td\n(Dataset: 10000 verified legitimate and phishing websites from PhishTank.) Tj\n"
        b"0 -20 Td\n(Model: Random Forest and XGBoost ensemble classification.) Tj\n"
        b"0 -20 Td\n(Findings: Achieved 98.4% detection accuracy on test split.) Tj\n"
        b"0 -20 Td\n(Limitations: Vulnerable to obfuscated JavaScript and dynamic redirection techniques.) Tj\n"
        b"0 -20 Td\n(Research Gap: Real-time client-side inference on mobile browsers with minimal CPU load.) Tj\n"
        b"0 -20 Td\n(Future Work: Integration of lightweight transformer embeddings for URL tokenization.) Tj\n"
        b"ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000216 00000 n \ntrailer <</Size 5 /Root 1 0 R>>\nstartxref\n590\n%%EOF"
    )

def run_suite():
    print("=" * 80)
    print("STARTING 5-RUN COMPREHENSIVE VERIFICATION SUITE FOR MODULE 2")
    print("=" * 80)

    scorecard = {
        "m2_1_domain_selection": 0,
        "m2_1_query_submission_log": 0,
        "m2_1_relevant_paper_discovery": 0,
        "m2_1_previous_departmental_projects": 0,
        "m2_2_pdf_upload_9_section_extraction": 0,
        "m2_2_ai_model_switching": 0,
        "m2_3_similarity_check_scoring": 0,
        "m2_3_duplicate_topic_rejection_409": 0,
        "m2_4_shared_knowledge_store": 0,
        "m2_4_shared_knowledge_future_reuse": 0,
        "multi_role_student_supervisor_admin_auth": 0
    }

    with TestClient(app) as client:
        # Pre-verify demo accounts
        # Student 1: Arif Hossain
        r_stud = client.post("/api/auth/login", json={"email": "arif.hossain@diu.edu.bd", "password": STUDENT_PASS})
        token_student = r_stud.json().get("access_token")

        # Student 2: Jamal Uddin
        r_stud2 = client.post("/api/auth/login", json={"email": "jamal.uddin@diu.edu.bd", "password": STUDENT_PASS})
        token_student2 = r_stud2.json().get("access_token")

        # Supervisor: Dr. Syed Tareq
        r_sup = client.post("/api/auth/login", json={"email": "dr.syed.tareq@diu.edu.bd", "password": SUPERVISOR_PASS})
        token_sup = r_sup.json().get("access_token")

        # Admin: admin@diu.edu.bd
        r_adm = client.post("/api/auth/login", json={"email": "admin@diu.edu.bd", "password": ADMIN_PASS})
        token_admin = r_adm.json().get("access_token")

        if token_student and token_sup and token_admin:
            print("✓ Base Multi-Role Authentication verified (Student, Supervisor, Admin all logged in).")

        for run in range(1, 6):
            print(f"\n" + "-" * 40)
            print(f">>> AUTOMATION TEST RUN {run} / 5")
            print("-" * 40)

            # ── 1. Research Domain Selection & Query Submission (Riya Saha - 715) ──
            # A. Select Domain: Cyber Security (id=4 or 3)
            r_dom = client.put(
                "/api/students/me/interests",
                json={"interest_ids": [4]},
                headers={"Authorization": f"Bearer {token_student}"}
            )
            r_me = client.get("/api/students/me", headers={"Authorization": f"Bearer {token_student}"})
            interests = [i.get("id") for i in r_me.json().get("interests", [])] if r_me.status_code == 200 else []
            if 4 in interests:
                scorecard["m2_1_domain_selection"] += 1
                print("  [1.A] Domain Selection: Student research interest dynamically persisted.")

            # B. Submit Research Query
            query_text = f"Machine Learning for Phishing Detection Run {run}"
            r_q = client.post("/api/research/log-query", data={
                "query_text": query_text,
                "domain": "Cyber Security",
                "student_id": "201-15-101",
                "student_name": "Arif Hossain"
            })
            if r_q.status_code == 200 and r_q.json().get("id"):
                scorecard["m2_1_query_submission_log"] += 1
                print(f"  [1.B] Research Query Submission: Query logged with ID={r_q.json().get('id')}.")

            # C. Relevant Research Paper Discovery
            r_papers = client.get("/api/research/academic-papers?q=Phishing+Detection&domain=Cyber+Security&limit=5")
            papers = r_papers.json() if r_papers.status_code == 200 else []
            has_paper_fields = False
            if len(papers) > 0:
                p = papers[0]
                has_paper_fields = all(k in p for k in ["title", "authors", "year", "abstract", "domain", "pdf_url"])
            if r_papers.status_code == 200 and has_paper_fields:
                scorecard["m2_1_relevant_paper_discovery"] += 1
                print(f"  [1.C] Paper Discovery: Found {len(papers)} authentic papers with complete metadata.")

            # D. Previous Departmental FYP/Thesis Search
            r_proj = client.get("/api/research/previous-projects?domain=Cyber+Security")
            projs = r_proj.json() if r_proj.status_code == 200 else []
            has_proj_fields = False
            if len(projs) > 0:
                pj = projs[0]
                has_proj_fields = all(k in pj for k in ["title", "domain", "batch", "year", "supervisor_name", "keywords"])
            if r_proj.status_code == 200 and has_proj_fields:
                scorecard["m2_1_previous_departmental_projects"] += 1
                print(f"  [1.D] Previous Projects Search: Found {len(projs)} departmental FYP/thesis records.")

            # ── 2. AI-Based Research Paper PDF Analysis (Robayet Islam - 809) ──
            # A. Upload PDF and extract 9 core sections
            pdf_bytes = create_sample_pdf_bytes()
            models_to_test = ["auto", "neural-nlp", "gemini-1.5-flash", "groq-llama-3.3-70b"]
            chosen_model = models_to_test[(run - 1) % len(models_to_test)]

            r_pdf = client.post(
                "/api/research/summarize-pdf",
                data={"model_choice": chosen_model},
                files={"file": ("sample_phishing_paper.pdf", pdf_bytes, "application/pdf")}
            )
            pdf_analysis = r_pdf.json() if r_pdf.status_code == 200 else {}
            core_sections = [
                "problem_statement", "objectives", "methodology", "dataset",
                "model_technology", "findings", "limitations", "research_gap", "future_work"
            ]
            has_all_sections = all(bool(pdf_analysis.get(sec)) for sec in core_sections)
            if r_pdf.status_code == 200 and has_all_sections:
                scorecard["m2_2_pdf_upload_9_section_extraction"] += 1
                print(f"  [2.A] PDF 9-Section Analysis: Successfully extracted all 9 core academic sections.")

            # B. Model Switching Verification
            if pdf_analysis.get("ai_engine"):
                scorecard["m2_2_ai_model_switching"] += 1
                print(f"  [2.B] AI Model Switching: Handled model_choice='{chosen_model}', engine='{pdf_analysis.get('ai_engine')}'.")

            # ── 3. AI-Based Similarity & Duplicate Topic Detection (Tamim Hasan Sami - 313) ──
            # A. Similarity Check against previous projects
            r_sim_high = client.post("/api/research/check-similarity", json={
                "title": "Bengali Sentiment Analysis and Opinion Mining Using Hybrid BiLSTM-BERT Models",
                "domain": "Natural Language Processing"
            })
            r_sim_low = client.post("/api/research/check-similarity", json={
                "title": f"Novel Multi-Agent Quantum Cryptography Protocol on Subsea Nodes Run {run}",
                "domain": "Cyber Security"
            })
            sim_high_val = r_sim_high.json().get("highest_similarity", 0) if r_sim_high.status_code == 200 else 0
            sim_low_val = r_sim_low.json().get("highest_similarity", 100) if r_sim_low.status_code == 200 else 100

            if sim_high_val >= 70.0 and sim_low_val < 45.0:
                scorecard["m2_3_similarity_check_scoring"] += 1
                print(f"  [3.A] Similarity Scoring: High match flagged={sim_high_val}%, Original low flagged={sim_low_val}%.")

            # B. Duplicate Topic Claim Rejection (HTTP 409 Conflict)
            # Jamal attempts to register Arif's claimed topic
            r_dup = client.post(
                "/api/research/register-topic",
                json={
                    "title": "Bengali Sentiment Analysis and Opinion Mining Using Hybrid BiLSTM-BERT Models",
                    "domain": "Natural Language Processing"
                },
                headers={"Authorization": f"Bearer {token_student2}"}
            )
            if r_dup.status_code == 409:
                scorecard["m2_3_duplicate_topic_rejection_409"] += 1
                print(f"  [3.B] Duplicate Prevention: Correctly blocked duplicate topic with HTTP 409 Conflict.")

            # ── 4. Shared Research Knowledge Database (Tamim Hasan Sami - 313) ──
            # A. Store Analyzed Paper to Shared Knowledge
            unique_paper_title = f"AI-Assisted Phishing Detection in Distributed Banking Portals Run {run}"
            r_sk_save = client.post(
                "/api/research/shared-knowledge",
                json={
                    "title": unique_paper_title,
                    "authors": "Riya Saha, Robayet Islam, Tamim Hasan Sami",
                    "year": 2026,
                    "domain": "Cyber Security",
                    "journal_or_conference": "IEEE Access",
                    "research_problem": "Credential harvesting via visual clone sites",
                    "research_objective": "Real-time DOM inspection",
                    "proposed_methodology": "Ensemble Gradient Boosted Trees",
                    "dataset_description": "PhishTank verified feed",
                    "models_algorithms": "XGBoost + LightGBM",
                    "important_findings": "98.7% test accuracy on zero-day attacks",
                    "limitations": "Headless browser scraping overhead",
                    "research_gap": "Adversarial evasion testing",
                    "future_directions": "Edge WebAssembly deployment"
                },
                headers={"Authorization": f"Bearer {token_student}"}
            )
            if r_sk_save.status_code in [200, 201]:
                scorecard["m2_4_shared_knowledge_store"] += 1
                print(f"  [4.A] Shared Knowledge Store: Successfully saved analyzed paper & research gap.")

            # B. Future Cohort Reuse & Visibility Check
            # Student 2 checks shared knowledge and query history
            r_sk_get = client.get("/api/research/shared-knowledge?domain=Cyber+Security")
            sk_items = r_sk_get.json() if r_sk_get.status_code == 200 else []
            can_see_stored = any(unique_paper_title in item.get("title", "") for item in sk_items)

            r_qh_get = client.get("/api/research/query-history?domain=Cyber+Security")
            qh_items = r_qh_get.json() if r_qh_get.status_code == 200 else []
            can_see_query = any(query_text in q.get("query_text", "") for q in qh_items)

            if can_see_stored and can_see_query:
                scorecard["m2_4_shared_knowledge_future_reuse"] += 1
                print("  [4.B] Knowledge Reuse: Student 2 successfully accessed Student 1's shared paper & query history.")

            # ── 5. Multi-Role Accessibility ──
            # Check supervisor and admin can also view shared knowledge and database overview
            r_sup_view = client.get("/api/research/shared-knowledge", headers={"Authorization": f"Bearer {token_sup}"})
            r_adm_view = client.get("/api/database/overview", headers={"Authorization": f"Bearer {token_admin}"})
            if r_sup_view.status_code == 200 and r_adm_view.status_code == 200:
                scorecard["multi_role_student_supervisor_admin_auth"] += 1
                print("  [5.0] Multi-Role Access: Supervisor & Admin full visibility verified.")

    print("\n" + "=" * 80)
    print("ALL 5 RUNS COMPLETED. FINAL COMPREHENSIVE SCORECARD:")
    print("=" * 80)
    for feature, passes in scorecard.items():
        status_str = "PASS (5/5)" if passes == 5 else f"PARTIAL ({passes}/5)"
        print(f"  * {feature:<48} : {status_str}")

if __name__ == "__main__":
    run_suite()
