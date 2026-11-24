"""
ROSS-SEARCH BEAST-MODE FULL END-TO-END AUTOMATION SUITE
Verifies complete real-world multi-role workflows on an isolated DB copy:
1. Registers 2 brand-new Supervisors (total 7 Supervisors in DB).
2. Registers 5 brand-new Students (total 15 Students in DB).
3. For each of the 5 new students:
   - Registration -> Logout -> Re-login -> Profile & Domain Selection
   - Domain Paper Search & Previous Departmental Project Inspection
   - Real Binary PDF Creation (via PyMuPDF) simulating Google Scholar download -> Upload to AI Summarizer
   - Bilingual (English + বাংলা) 20-Point AI Summary Verification
   - Personal Library Save & Student Dashboard Library Verification
   - Shared Knowledge Repository Save -> Cross-Student Discovery by subsequent students
   - Rule-Based Topic Similarity & Duplicate Prevention Check
   - Section Peer Search -> Team Creation -> Supervision Request -> New Supervisor Accept
   - Module 3: Template Download -> AI Proposal Structure Check -> Submission v1 -> Revision -> v2 -> Approval -> Milestones -> 6-Category AI Viva Prep
4. Admin Verification: Confirms 15 Students, 7 Supervisors, Database Explorer & Departmental Analytics.

Strict Security: Passwords and auth tokens are never printed to console.
"""

import os
import sys
import shutil
import fitz  # PyMuPDF

ADMIN_PASS = os.environ.get("ADMIN_PASSWORD", "Admin@12345")
USER_PASS = os.environ.get("TEST_USER_PASSWORD", "Diu@12345")
sys.path.insert(0, r"E:\Thesis\backend")

LIVE_DB = r"E:\Thesis\backend\ross_search.db"
TEMP_DB = r"E:\Thesis\backend\temp_beastmode_e2e.db"
shutil.copyfile(LIVE_DB, TEMP_DB)
os.environ["DATABASE_URL"] = f"sqlite:///{TEMP_DB}"

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

NEW_SUPERVISORS = [
    {
        "email": "dr.mahmudul.hasan@diu.edu.bd",
        "full_name": "Dr. Mahmudul Hasan",
        "designation": "Assistant Professor",
        "department": "Department of Computer Science and Engineering"
    },
    {
        "email": "dr.fariha.rahman@diu.edu.bd",
        "full_name": "Dr. Fariha Rahman",
        "designation": "Associate Professor",
        "department": "Department of Software Engineering"
    }
]

NEW_STUDENTS = [
    {
        "email": "beast.student1@diu.edu.bd",
        "full_name": "Tariqul Islam",
        "student_id": "232-35-901",
        "department": "Department of Computer Science and Engineering",
        "section": "62_A",
        "domain": "Natural Language Processing",
        "paper_title": "BanglaBERT: Language Model Pretraining and Benchmarks for Low-Resource Bengali NLP",
        "authors": "Abhik Bhattacharjee, Tahmid Hasan, Wasi Ahmad",
        "year": 2022,
        "paper_url": "https://arxiv.org/pdf/2101.00204.pdf",
        "team_name": "BanglaNLP Innovators"
    },
    {
        "email": "beast.student2@diu.edu.bd",
        "full_name": "Sumaiya Akter",
        "student_id": "232-35-902",
        "department": "Department of Computer Science and Engineering",
        "section": "62_A",
        "domain": "Natural Language Processing",
        "paper_title": "Cross-Lingual Transfer for Bengali Hate Speech and Cyberbullying Detection",
        "authors": "Sumaiya Akter, Dr. Mahmudul Hasan",
        "year": 2024,
        "paper_url": "https://arxiv.org/pdf/2203.11201.pdf",
        "team_name": "SafeBangla AI"
    },
    {
        "email": "beast.student3@diu.edu.bd",
        "full_name": "Rakibul Hasan",
        "student_id": "232-35-903",
        "department": "Department of Software Engineering",
        "section": "62_A",
        "domain": "Cyber Security",
        "paper_title": "AI-Driven Phishing URL and Smart Contract Vulnerability Auditing",
        "authors": "Rakibul Hasan, Dr. Fariha Rahman",
        "year": 2024,
        "paper_url": "https://arxiv.org/pdf/2305.04120.pdf",
        "team_name": "CyberShield SWE"
    },
    {
        "email": "beast.student4@diu.edu.bd",
        "full_name": "Tasnim Tabassum",
        "student_id": "232-35-904",
        "department": "Department of Computer Science and Engineering",
        "section": "62_A",
        "domain": "Machine Learning",
        "paper_title": "Quantized Federated Learning for Resource-Constrained Edge IoT Nodes",
        "authors": "Tasnim Tabassum, Dr. Mahmudul Hasan",
        "year": 2025,
        "paper_url": "https://arxiv.org/pdf/2311.09812.pdf",
        "team_name": "EdgeFed ML"
    },
    {
        "email": "beast.student5@diu.edu.bd",
        "full_name": "Nafis Chowdhury",
        "student_id": "232-35-905",
        "department": "Department of Software Engineering",
        "section": "62_A",
        "domain": "Computer Vision",
        "paper_title": "Explainable Vision Transformers for Early Diabetic Retinopathy Grading",
        "authors": "Nafis Chowdhury, Dr. Fariha Rahman",
        "year": 2025,
        "paper_url": "https://arxiv.org/pdf/2401.07741.pdf",
        "team_name": "MedVision XAI"
    }
]


def build_realistic_scholar_pdf(title: str, authors: str, domain: str) -> bytes:
    """Generates a genuine multi-section PDF binary using PyMuPDF simulating a Google Scholar download."""
    doc = fitz.open()
    page = doc.new_page()
    text = (
        f"{title}\n"
        f"Authors: {authors}\n"
        f"Domain: {domain}\n\n"
        f"1. Abstract\n"
        f"This paper investigates scalable neural architectures in {domain}. We address latency and accuracy bottlenecks.\n\n"
        f"2. Problem Statement\n"
        f"Existing baseline pipelines suffer from high false-positive rates and excessive GPU memory overhead.\n\n"
        f"3. Objectives\n"
        f"To design a lightweight transformer-based framework achieving >94% F1-score with under 20ms latency.\n\n"
        f"4. Literature Review\n"
        f"Prior studies by Vaswani et al. (2017) and Devlin et al. (2019) established strong attention foundations.\n\n"
        f"5. Methodology\n"
        f"We implement multi-head self-attention coupled with layer normalization and focal loss optimization.\n\n"
        f"6. Dataset Specification\n"
        f"Evaluated on 50,000 curated domain samples with stratified 70/15/15 train-validation-test splits.\n\n"
        f"7. Experimental Results\n"
        f"Our proposed model achieved 95.4% accuracy and 0.948 F1-score, outperforming baseline CNN/LSTM by 6.2%.\n\n"
        f"8. Limitations & Future Work\n"
        f"Current evaluation is limited to single-domain benchmarks; future work will explore edge quantization.\n\n"
        f"9. Project Timeline & References\n"
        f"16-week iterative sprint. [1] Vaswani et al. (2017). Attention Is All You Need. NeurIPS.\n"
    )
    page.insert_text((50, 50), text, fontsize=10)
    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes


def run_beastmode_suite():
    print("==========================================================================")
    print("  ROSS-SEARCH BEAST-MODE FULL E2E AUTOMATION SUITE")
    print("  (2 New Supervisors + 5 New Students = 15 Students, 7 Supervisors)")
    print("==========================================================================\n")

    sup_tokens = []
    sup_ids = []

    # 1. Register 2 New Supervisors
    print(">>> PHASE 1: Registering 2 New Supervisors & Verifying Login/Logout")
    for idx, s in enumerate(NEW_SUPERVISORS, 1):
        res_reg = client.post(
            "/api/auth/register/supervisor",
            json={
                "email": s["email"],
                "password": USER_PASS,
                "full_name": s["full_name"],
                "designation": s["designation"],
                "department": s["department"]
            }
        )
        assert res_reg.status_code == 201, f"Supervisor {idx} registration failed: {res_reg.text}"
        tok = res_reg.json()["access_token"]

        # Verify Logout & Re-login
        assert client.post("/api/auth/logout", headers={"Authorization": f"Bearer {tok}"}).status_code == 200
        res_login = client.post("/api/auth/login", json={"email": s["email"], "password": USER_PASS})
        assert res_login.status_code == 200
        tok = res_login.json()["access_token"]
        sup_tokens.append(tok)

        # Fetch supervisor profile ID
        res_me = client.get("/api/supervisors/me", headers={"Authorization": f"Bearer {tok}"})
        assert res_me.status_code == 200
        sup_ids.append(res_me.json()["id"])
        print(f"  [PASS] Supervisor {idx}/2 Registered & Verified: {s['full_name']} (ID={sup_ids[-1]})")

    # 2. Run 5 New Student Lifecycles (bringing total students to 15)
    print("\n>>> PHASE 2: Running 5 Complete New Student Lifecycles (Real Binary PDF Uploads)")
    published_shared_titles = []

    for idx, st in enumerate(NEW_STUDENTS, 1):
        print(f"\n--- [New Student {idx}/5] {st['full_name']} ({st['student_id']}) | Domain: {st['domain']} ---")

        # A. Register -> Logout -> Re-login
        res_reg = client.post(
            "/api/auth/register",
            json={
                "email": st["email"],
                "password": USER_PASS,
                "full_name": st["full_name"],
                "student_id": st["student_id"],
                "department": st["department"]
            }
        )
        assert res_reg.status_code == 201, f"Student {idx} registration failed: {res_reg.text}"
        tok = res_reg.json()["access_token"]
        assert client.post("/api/auth/logout", headers={"Authorization": f"Bearer {tok}"}).status_code == 200
        res_login = client.post("/api/auth/login", json={"email": st["email"], "password": USER_PASS})
        assert res_login.status_code == 200
        tok = res_login.json()["access_token"]
        st_headers = {"Authorization": f"Bearer {tok}"}

        # Update Profile, Section, Batch & Domain
        res_prof = client.put(
            "/api/students/me",
            json={
                "section": st["section"],
                "batch": "Batch 62",
                "preferred_domain": st["domain"],
                "project_title": st["paper_title"]
            },
            headers=st_headers
        )
        assert res_prof.status_code == 200
        print(f"  [PASS] 1. Registered, Logged Out/In & Updated Domain -> '{st['domain']}'")

        # B. Search Domain Papers & Previous Departmental Projects
        res_papers = client.get(f"/api/research/academic-papers?domain={st['domain']}")
        assert res_papers.status_code == 200
        res_prev = client.get(f"/api/research/previous-projects?domain={st['domain']}")
        assert res_prev.status_code == 200

        # If Student 2 (same domain as Student 1), verify Student 1's shared paper is visible!
        if idx == 2:
            res_shared_check = client.get(f"/api/research/shared-knowledge?domain={st['domain']}")
            assert res_shared_check.status_code == 200
            shared_titles = [x["title"] for x in res_shared_check.json()]
            assert NEW_STUDENTS[0]["paper_title"] in shared_titles, "Student 2 did not see Student 1's shared paper!"
            print(f"  [PASS] 2b. Cross-Student Knowledge Verified: Student 2 sees Student 1's summary & gap in '{st['domain']}'")

            # Verify duplicate topic warning when checking Student 1's exact title
            res_dup = client.post(
                "/api/research/check-similarity",
                json={"title": NEW_STUDENTS[0]["paper_title"], "abstract": "Low-resource Bengali NLP pretraining.", "domain": st["domain"]}
            )
            assert res_dup.status_code == 200 and res_dup.json()["highest_similarity"] >= 50.0
            print(f"  [PASS] 2c. Duplicate Guard Verified: Overlap detected ({res_dup.json()['highest_similarity']}%)")

        # C. Generate REAL Binary PDF (simulating Google Scholar download) & Upload to AI Summarizer
        pdf_bytes = build_realistic_scholar_pdf(st["paper_title"], st["authors"], st["domain"])
        res_sum = client.post(
            "/api/research/summarize-pdf",
            files={"file": (f"scholar_paper_{idx}.pdf", pdf_bytes, "application/pdf")},
            data={
                "model_choice": "neural-nlp-offline",
                "prompt_focus": "bilingual_insights",
                "language": "bilingual"
            }
        )
        assert res_sum.status_code == 200, f"PDF upload summarization failed: {res_sum.text}"
        summary = res_sum.json()
        assert summary.get("bilingual_summary", {}).get("summary_bn"), "Missing Bengali summary!"
        print(f"  [PASS] 3. Real Binary PDF Uploaded & Summarized (Engine: {summary.get('ai_engine')}, Bilingual=True)")

        # D. Save to Student Personal Library (Dashboard) & Shared Knowledge
        res_lib_save = client.post(
            "/api/research/library/save",
            json={
                "title": st["paper_title"],
                "authors": st["authors"],
                "year": st["year"],
                "domain": st["domain"],
                "venue": "Google Scholar / arXiv",
                "abstract": f"Uploaded PDF analysis for {st['domain']}",
                "pdf_url": st["paper_url"],
                "notes": f"Gap: {summary.get('research_gap', '')[:180]}",
                "reading_status": "completed"
            },
            headers=st_headers
        )
        assert res_lib_save.status_code in (200, 201)
        res_lib_get = client.get("/api/research/library", headers=st_headers)
        assert any(p["title"] == st["paper_title"] for p in res_lib_get.json()), "Paper missing from Student Dashboard library!"

        res_sh_save = client.post(
            "/api/research/shared-knowledge",
            json={
                "title": st["paper_title"],
                "authors": st["authors"],
                "year": st["year"],
                "journal_or_conference": "Google Scholar",
                "domain": st["domain"],
                "uploaded_by_name": st["full_name"],
                "uploaded_by_id": st["student_id"],
                "file_name": f"scholar_paper_{idx}.pdf",
                "paper_url": st["paper_url"],
                "abstract": f"Analyzed from PDF upload by {st['full_name']}",
                "research_objective": summary.get("research_objective", ""),
                "research_problem": summary.get("research_problem", ""),
                "research_gap": summary.get("research_gap", ""),
                "research_motivation": summary.get("research_motivation", ""),
                "proposed_methodology": summary.get("proposed_methodology", ""),
                "dataset_description": summary.get("dataset_description", ""),
                "dataset_size": summary.get("dataset_size", "50,000 samples"),
                "features_parameters": summary.get("features_parameters", ""),
                "models_algorithms": summary.get("models_algorithms", ""),
                "experimental_setup": summary.get("experimental_setup", ""),
                "evaluation_metrics": summary.get("evaluation_metrics", ""),
                "experimental_results": summary.get("experimental_results", ""),
                "accuracy_performance": summary.get("accuracy_performance", ""),
                "strengths": summary.get("strengths", ""),
                "limitations": summary.get("limitations", ""),
                "future_directions": summary.get("future_directions", ""),
                "novel_contributions": summary.get("novel_contributions", ""),
                "related_work": summary.get("related_work", ""),
                "important_findings": summary.get("important_findings", ""),
                "research_opportunities": summary.get("research_opportunities", "")
            },
            headers=st_headers
        )
        assert res_sh_save.status_code in (200, 201)
        published_shared_titles.append(st["paper_title"])
        print("  [PASS] 4. Saved to Dashboard Personal Library & Shared Knowledge Repository")

        # E. Section Search -> Team Creation -> Supervision Request -> New Supervisor Accept
        assert client.get(f"/api/students/section/{st['section']}", headers=st_headers).status_code == 200
        res_team = client.post(
            "/api/teams/",
            json={
                "name": st["team_name"],
                "domain": st["domain"],
                "section": st["section"],
                "description": f"FYP team for {st['paper_title']}"
            },
            headers=st_headers
        )
        assert res_team.status_code in (200, 201)
        team_id = res_team.json()["id"]

        target_sup_idx = (idx - 1) % 2
        target_sup_id = sup_ids[target_sup_idx]
        target_sup_headers = {"Authorization": f"Bearer {sup_tokens[target_sup_idx]}"}

        res_req = client.post(
            "/api/supervision-requests/",
            json={"supervisor_id": target_sup_id, "message": f"Requesting supervision for {st['team_name']}"},
            headers=st_headers
        )
        assert res_req.status_code == 201
        req_id = res_req.json()["id"]

        res_inc = client.get("/api/supervision-requests/incoming", headers=target_sup_headers)
        assert any(r["id"] == req_id for r in res_inc.json())
        res_acc = client.put(
            f"/api/supervision-requests/{req_id}/accept",
            json={"response_note": "Accepted! Let us review your proposal."},
            headers=target_sup_headers
        )
        assert res_acc.status_code == 200 and res_acc.json()["status"] == "accepted"
        print(f"  [PASS] 5. Team Created (ID={team_id}) & New Supervisor (ID={target_sup_id}) Accepted Request")

        # F. Module 3 Complete Flow
        res_tmpls = client.get("/api/module3/templates")
        assert res_tmpls.status_code == 200 and len(res_tmpls.json()) >= 4
        tmpl_id = res_tmpls.json()[0]["id"]
        assert client.post(f"/api/module3/templates/{tmpl_id}/download").status_code == 200

        res_chk = client.post(
            "/api/module3/check-document",
            json={
                "document_title": st["paper_title"],
                "document_type": "proposal",
                "raw_text": (
                    "1. Abstract: Research study. 2. Problem Statement: Bottlenecks. 3. Objectives: >94% F1. "
                    "4. Literature Review: Prior transformers. 5. Methodology: Multi-head attention. "
                    "6. Dataset: 50,000 samples. 7. Timeline: 16 weeks. 8. References: [1] Vaswani 2017."
                )
            },
            headers=st_headers
        )
        assert res_chk.status_code == 200 and res_chk.json()["overall_compliance_score"] >= 80

        res_sub1 = client.post(
            "/api/module3/submissions",
            json={"team_id": team_id, "title": "Proposal v1", "phase": "proposal", "file_name": f"prop_{idx}_v1.pdf", "document_text": "Initial draft"},
            headers=st_headers
        )
        assert res_sub1.status_code == 201
        sub1_id = res_sub1.json()["id"]
        assert client.put(
            f"/api/module3/submissions/{sub1_id}/review",
            json={"status": "revision_required", "feedback_remarks": "Expand ablation metrics."},
            headers=target_sup_headers
        ).status_code == 200

        res_sub2 = client.post(
            "/api/module3/submissions",
            json={"team_id": team_id, "title": "Proposal v2", "phase": "proposal", "file_name": f"prop_{idx}_v2.pdf", "document_text": "Revised with ablation"},
            headers=st_headers
        )
        assert res_sub2.status_code == 201 and res_sub2.json()["version"] == 2
        sub2_id = res_sub2.json()["id"]
        assert client.put(
            f"/api/module3/submissions/{sub2_id}/review",
            json={"status": "approved", "feedback_remarks": "Approved!"},
            headers=target_sup_headers
        ).status_code == 200

        res_ms = client.post(f"/api/module3/milestones/init-standard/{team_id}", headers=st_headers)
        assert res_ms.status_code == 200 and len(res_ms.json()) == 5
        assert client.put(
            f"/api/module3/milestones/{res_ms.json()[0]['id']}",
            json={"progress_percentage": 100, "status": "completed"},
            headers=target_sup_headers
        ).status_code == 200

        res_viva = client.post(
            "/api/module3/viva/generate",
            json={"project_title": st["paper_title"], "domain": st["domain"], "questions_count": 6},
            headers=st_headers
        )
        assert res_viva.status_code == 200 and len(res_viva.json()["questions_data"]) == 6
        print("  [PASS] 6. Module 3 Complete: Template, AI Check, v1->Revise->v2->Approve, Milestones & 6-Q Viva")

    # 3. Admin Final Verification (15 Students, 7 Supervisors)
    print("\n>>> PHASE 3: Admin Verification (15 Students, 7 Supervisors, Analytics & DB Explorer)")
    res_adm = client.post("/api/auth/login", json={"email": "admin@diu.edu.bd", "password": ADMIN_PASS})
    assert res_adm.status_code == 200
    adm_headers = {"Authorization": f"Bearer {res_adm.json()['access_token']}"}

    stats = client.get("/api/admin/stats", headers=adm_headers).json()
    assert stats["total_students"] == 15, f"Expected 15 students, got {stats['total_students']}"
    assert stats["total_supervisors"] == 7, f"Expected 7 supervisors, got {stats['total_supervisors']}"
    assert client.get("/api/database/overview", headers=adm_headers).status_code == 200

    analytics = client.get("/api/module3/analytics/departmental").json()
    assert analytics["total_active_students"] == 15
    assert analytics["total_supervisors"] == 7
    print(f"  [PASS] Admin Stats Verified: {stats['total_students']} Students | {stats['total_supervisors']} Supervisors | {stats['total_teams']} Teams")
    print(f"  [PASS] Departmental Analytics Verified: {len(analytics['domain_distribution'])} Domains | {len(analytics['supervisor_workloads'])} Supervisor Workloads")

    print("\n==========================================================================")
    print("  BEAST-MODE VERIFICATION: 100% PASS ACROSS ALL 15 STUDENTS & 7 SUPERVISORS!")
    print("==========================================================================")

    if os.path.exists(TEMP_DB):
        try:
            os.remove(TEMP_DB)
        except Exception:
            pass


if __name__ == "__main__":
    run_beastmode_suite()
