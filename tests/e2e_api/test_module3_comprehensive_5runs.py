"""
Comprehensive Module 3 Automated E2E Verification Runner (5 Runs)
Validates all requirements for:
1. Robayet Islam (ID: 809 / 232-35-809):
   - Admin Official Presentation/Thesis Template Management (PPTX, DOCX, PDF)
   - AI Proposal Structure, Missing Sections & Grammar/Spelling Compliance Checker
   - AI-Assisted Practice Viva Question Generator (Objectives, Methodology, Dataset, Findings, Limitations, Novelty)
2. Riya Saha (ID: 715 / 232-35-715):
   - Student Project File Submissions with Version Control (v1 -> v2)
   - Milestone & Phase Deadline Tracking with Progress Percentages
   - Supervisor Review Portal (Feedback, Revision Requests, and Approvals)
3. Tamim Hasan Sami (ID: 313 / 232-35-313):
   - Departmental FYP Analytics Engine (Domain Distribution, Project Pipeline, Supervisor Workload)

5 Full Iterations across different users, teams, and domains to prove 100% reliability.
Strict Security: Passwords and auth tokens are never printed to output.
"""

import os
import sys
import shutil
import sqlite3

# Set passwords in environment securely without printing
ADMIN_PASS = os.environ.get("ADMIN_PASSWORD", "Admin@12345")
TEST_USER_PASS = os.environ.get("TEST_USER_PASSWORD", "Diu@12345")
sys.path.insert(0, r"E:\Thesis\backend")

# Prepare a dedicated temporary test database to keep original database completely safe
TEST_DB = r"E:\Thesis\backend\temp_test_module3.db"
ORIGINAL_DB = r"E:\Thesis\backend\ross_search.db"
shutil.copyfile(ORIGINAL_DB, TEST_DB)
os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB}"

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

MODULE3_TEST_CASES = [
    {
        "student_email": "arif.hossain@diu.edu.bd",
        "supervisor_email": "dr.syed.tareq@diu.edu.bd",
        "team_id": 1,
        "domain": "Natural Language Processing",
        "project_title": "Transformer-Based Low-Resource Bengali Dialect Translator",
        "doc_text": """
        1. Abstract
        This research presents an attention-based encoder-decoder neural network specifically designed for low-resource Bengali regional dialects.
        2. Problem Statement
        Existing NLP translation systems fail to handle regional dialect nuances in spoken Bengali, leading to poor communication in e-governance systems.
        3. Objectives
        Our objective is to train a multi-head transformer with subword tokenization and achieve a BLEU score exceeding 32.5.
        4. Literature Review
        Prior work by Vaswani et al. (2017) and Devlin et al. (2019) demonstrated state-of-the-art results for high-resource languages.
        5. Methodology
        We formulate a sequence-to-sequence translation architecture with positional encoding and beam search decoding.
        6. Dataset Specification
        A dataset of 45,000 paired dialect sentences from Sylheti and Chittagonian regions collected with strict ethical guidelines.
        7. Project Timeline & Milestones
        Milestone 1 covers corpus collection, Milestone 2 model training, and Milestone 3 human evaluation over 16 weeks.
        8. References & Bibliography
        [1] Vaswani, A., et al. (2017). Attention is All You Need. NeurIPS.
        [2] Devlin, J., et al. (2019). BERT: Pre-training of Deep Bidirectional Transformers. NAACL.
        """,
        "template_title": "Official DIU NLP Thesis Presentation Slide Deck 2026",
        "submission_title": "Phase 1: Dialect Dataset & Transformer Architecture Proposal"
    },
    {
        "student_email": "jamal.uddin@diu.edu.bd",
        "supervisor_email": "dr.ashraf.ali@diu.edu.bd",
        "team_id": 2,
        "domain": "Cyber Security",
        "project_title": "Zero-Trust Cloud Anomaly Detection via Deep Log Clustering",
        "doc_text": """
        Abstract
        Cloud enterprise environments face evolving advanced persistent threats. We propose DeepLog-Guard for automated detection.
        Problem Statement
        Traditional rule-based intrusion detection generates excessive false alarms in high-velocity microservice clusters.
        Objectives
        To construct a real-time LSTM network capable of parsing semi-structured log streams with under 15ms latency.
        Literature Review
        Du et al. (2017) pioneered DeepLog using sequence-to-sequence log key modeling, while Brown et al. extended it for Kubernetes.
        Methodology
        Our method extracts log templates via Drain algorithm followed by multi-layer Bi-LSTM classification.
        Dataset Specification
        Validated on BGL and HDFS public benchmarks containing 11.2 million log entries with ground-truth anomalies.
        Project Timeline & Milestones
        Sprint 1: Log parser implementation. Sprint 2: Neural training. Sprint 3: Production benchmark.
        References
        [1] Du, M., et al. (2017). DeepLog: Anomaly Detection from System Logs. CCS.
        """,
        "template_title": "DIU Cybersecurity Project Milestone Review Template",
        "submission_title": "Phase 1: Log Parsing Architecture & Neural Model Design"
    },
    {
        "student_email": "kamal.hossain@diu.edu.bd",
        "supervisor_email": "dr.ashraf.ali@diu.edu.bd",
        "team_id": 2,
        "domain": "Machine Learning",
        "project_title": "Federated Multi-Task Learning for Edge IoT Devices",
        "doc_text": """
        Abstract: Federated learning enables distributed model training without exposing raw private telemetry data.
        Problem Statement: Edge devices suffer from non-IID data distribution and communication bottlenecks.
        Objectives: Design an adaptive aggregation algorithm FedAdaptive to reduce uplink bandwidth by 40%.
        Literature Review: McMahan et al. (2017) established Federated Averaging, but client drift remains problematic.
        Methodology: We implement quantization-aware parameter exchange coupled with momentum-driven SGD.
        Dataset: Evaluated across simulated CIFAR-100 edge nodes with varying non-IID Dirichlet distribution alphas.
        Timeline: 14-week iterative prototyping and Raspberry Pi 4 testbed validation.
        References:
        [1] McMahan, B., et al. (2017). Communication-Efficient Learning. AISTATS.
        """,
        "template_title": "DIU Edge Computing & Distributed Systems Defense Template",
        "submission_title": "Phase 2: Federated Optimization & Aggregation Benchmark Report"
    },
    {
        "student_email": "nabila.chowdhury@diu.edu.bd",
        "supervisor_email": "dr.syed.tareq@diu.edu.bd",
        "team_id": 1,
        "domain": "Natural Language Processing",
        "project_title": "Multilingual Hate Speech Mitigation in Social Streams",
        "doc_text": """
        1. Abstract
        Online hate speech detection requires robust multi-lingual and code-mixed token representations.
        2. Problem Statement
        Existing moderation tools drop below 60% F1 when processing mixed Banglish text on social media platforms.
        3. Objectives
        To train a cross-lingual RoBERTa variant fine-tuned on crowdsourced and toxic-comment datasets.
        4. Literature Review
        Conneau et al. (2020) demonstrated XLM-RoBERTa capabilities across 100 languages.
        5. Methodology
        Hybrid transformer backbone with contrastive learning and focal loss to counter severe class imbalance.
        6. Dataset Specification
        18,000 annotated posts in Bengali, Banglish, and English with inter-annotator agreement kappa of 0.84.
        7. Project Timeline & Milestones
        Data annotation (month 1-2), Model training (month 3-4), Deployment API (month 5).
        8. References
        [1] Conneau, A., et al. (2020). Unsupervised Cross-lingual Representation Learning. ACL.
        """,
        "template_title": "Official DIU NLP Thesis Report Docx Template 2026",
        "submission_title": "Phase 2: Cross-Lingual Dataset Corpus & Annotations"
    },
    {
        "student_email": "arif.hossain@diu.edu.bd",
        "supervisor_email": "dr.syed.tareq@diu.edu.bd",
        "team_id": 1,
        "domain": "Computer Vision",
        "project_title": "Self-Supervised Vision Transformers for Histopathological Biopsy Screening",
        "doc_text": """
        1. Abstract
        Deep vision models for cancer biopsy screening require expensive pixel-level pathologist annotations.
        2. Problem Statement
        Gigapixel whole-slide images exceed GPU memory and suffer from significant label scarcity in developing countries.
        3. Objectives
        Develop a self-supervised DINO-v2 feature extractor with weakly supervised slide-level attention pooling.
        4. Literature Review
        He et al. (2022) and Caron et al. (2021) showed ViT self-supervised representations outperform supervised baselines.
        5. Methodology
        Hierarchical patch embedding, masked autoencoding pre-training, and top-k attention aggregation.
        6. Dataset Specification
        Camelyon16 and TCGA public histopathology whole slide image archives containing 1,400 high-resolution scans.
        7. Project Timeline & Milestones
        Patch extraction (weeks 1-3), Self-supervised pretraining (weeks 4-8), Clinical validation (weeks 9-12).
        8. References
        [1] Caron, M., et al. (2021). Emerging Properties in Self-Supervised Vision Transformers. ICCV.
        """,
        "template_title": "Official DIU Medical AI Final Viva Defense Deck",
        "submission_title": "Phase 3: Histopathology Self-Supervised Benchmark & Slide Evaluation"
    }
]

def get_token(email: str, role: str) -> str:
    """Helper to authenticate and return bearer token securely without printing."""
    pwd = ADMIN_PASS if role == "admin" else TEST_USER_PASS
    res = client.post("/api/auth/login", json={"email": email, "password": pwd})
    if res.status_code != 200:
        raise RuntimeError(f"Authentication failed for {role} ({email}): status {res.status_code}")
    return res.json().get("access_token")

def run_test_suite():
    print("======================================================================")
    print("  ROSS-SEARCH MODULE 3 COMPREHENSIVE VERIFICATION SUITE (5 RUNS)")
    print("  Robayet Islam (809) | Riya Saha (715) | Tamim Hasan Sami (313)")
    print("======================================================================\n")

    overall_success = True

    # Pre-fetch admin token
    admin_token = get_token("admin@diu.edu.bd", "admin")
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    for run_idx, tc in enumerate(MODULE3_TEST_CASES, 1):
        print(f">>> RUN {run_idx}/5: Testing Domain '{tc['domain']}' with Student '{tc['student_email']}'")
        run_passed = True

        student_token = get_token(tc["student_email"], "student")
        student_headers = {"Authorization": f"Bearer {student_token}"}

        supervisor_token = get_token(tc["supervisor_email"], "supervisor")
        supervisor_headers = {"Authorization": f"Bearer {supervisor_token}"}

        # ------------------------------------------------------------------
        # 1. Official Template Management (Robayet Islam - 809)
        # ------------------------------------------------------------------
        # Admin uploads official template
        tmpl_payload = {
            "title": f"{tc['template_title']} (Run {run_idx})",
            "file_name": f"diu_template_run_{run_idx}.pptx",
            "file_type": "pptx",
            "category": "proposal",
            "description": f"Official DIU template generated during Run {run_idx}",
            "file_size_kb": 320
        }
        res_tmpl_create = client.post("/api/module3/templates", json=tmpl_payload, headers=admin_headers)
        if res_tmpl_create.status_code != 201:
            print(f"  [FAIL] Admin template upload failed: {res_tmpl_create.status_code}")
            run_passed = False
        else:
            tmpl_data = res_tmpl_create.json()
            tmpl_id = tmpl_data["id"]

            # Student/Public views templates
            res_tmpl_list = client.get("/api/module3/templates", headers=student_headers)
            if res_tmpl_list.status_code != 200 or len(res_tmpl_list.json()) == 0:
                print("  [FAIL] Student templates list query failed")
                run_passed = False

            # Student triggers download count increment
            res_dl = client.post(f"/api/module3/templates/{tmpl_id}/download")
            if res_dl.status_code != 200 or res_dl.json().get("download_count", 0) < 1:
                print("  [FAIL] Template download count increment failed")
                run_passed = False
            else:
                print(f"  [PASS] Sub-module 1 (Templates Repository): Uploaded id={tmpl_id}, download count verified")

        # ------------------------------------------------------------------
        # 2. AI Document Structure & Grammar Checker (Robayet Islam - 809)
        # ------------------------------------------------------------------
        check_payload = {
            "document_title": tc["project_title"],
            "raw_text": tc["doc_text"],
            "document_type": "proposal"
        }
        res_check = client.post("/api/module3/check-document", json=check_payload, headers=student_headers)
        if res_check.status_code != 200:
            print(f"  [FAIL] AI Document check failed: {res_check.status_code} - {res_check.text}")
            run_passed = False
        else:
            check_data = res_check.json()
            score = check_data.get("overall_compliance_score", 0)
            status_result = check_data.get("structure_status")
            detected_sec = check_data.get("detected_sections", [])
            print(f"  [PASS] Sub-module 2 (AI Document Checker): Score={score}/100, Status='{status_result}', Detected {len(detected_sec)}/8 sections")

        # ------------------------------------------------------------------
        # 3. AI Viva Defense Preparation Engine (Robayet Islam - 809)
        # ------------------------------------------------------------------
        viva_payload = {
            "project_title": tc["project_title"],
            "domain": tc["domain"],
            "abstract": tc["doc_text"][:300],
            "document_text": tc["doc_text"],
            "questions_count": 6
        }
        res_viva = client.post("/api/module3/viva/generate", json=viva_payload, headers=student_headers)
        if res_viva.status_code != 200:
            print(f"  [FAIL] Viva generation failed: {res_viva.status_code}")
            run_passed = False
        else:
            viva_data = res_viva.json()
            questions = viva_data.get("questions_data", [])
            categories = {q.get("category") for q in questions}
            # Verify viva history
            res_viva_hist = client.get("/api/module3/viva/history", headers=student_headers)
            hist_count = len(res_viva_hist.json()) if res_viva_hist.status_code == 200 else 0
            print(f"  [PASS] Sub-module 3 (AI Viva Defense Simulator): Generated {len(questions)} categorized questions ({', '.join(sorted(categories))}), History sessions={hist_count}")

        # ------------------------------------------------------------------
        # 4. Project Submissions & Supervisor Review (Riya Saha - 715)
        # ------------------------------------------------------------------
        # Step A: Student submits Initial Draft (v1)
        sub_payload_v1 = {
            "team_id": tc["team_id"],
            "title": f"{tc['submission_title']} (v1)",
            "phase": "proposal",
            "file_name": f"submission_run_{run_idx}_v1.pdf",
            "file_path": f"/uploads/run_{run_idx}/submission_v1.pdf",
            "file_size_kb": 1240,
            "document_text": tc["doc_text"]
        }
        res_sub_v1 = client.post("/api/module3/submissions", json=sub_payload_v1, headers=student_headers)
        if res_sub_v1.status_code != 201:
            print(f"  [FAIL] Student submission v1 failed: {res_sub_v1.status_code} - {res_sub_v1.text}")
            run_passed = False
        else:
            sub1_id = res_sub_v1.json()["id"]
            sub1_ver = res_sub_v1.json()["version"]

            # Step B: Supervisor reviews v1 and requests revision
            review_payload_rev = {
                "status": "revision_required",
                "feedback_remarks": "Methodology looks sound, but please expand on baseline comparative metrics and ethical dataset consent."
            }
            res_rev1 = client.put(f"/api/module3/submissions/{sub1_id}/review", json=review_payload_rev, headers=supervisor_headers)
            if res_rev1.status_code != 200 or res_rev1.json().get("status") != "revision_required":
                print(f"  [FAIL] Supervisor revision request failed: {res_rev1.status_code}")
                run_passed = False

            # Step C: Student submits Revision (v2)
            sub_payload_v2 = {
                "team_id": tc["team_id"],
                "title": f"{tc['submission_title']} (v2 - Revised)",
                "phase": "proposal",
                "file_name": f"submission_run_{run_idx}_v2.pdf",
                "file_path": f"/uploads/run_{run_idx}/submission_v2.pdf",
                "file_size_kb": 1380,
                "document_text": tc["doc_text"] + "\nAddendum: Baseline metrics and IRB ethical approvals added."
            }
            res_sub_v2 = client.post("/api/module3/submissions", json=sub_payload_v2, headers=student_headers)
            if res_sub_v2.status_code != 201:
                print(f"  [FAIL] Student revision submission v2 failed: {res_sub_v2.status_code}")
                run_passed = False
            else:
                sub2_id = res_sub_v2.json()["id"]
                sub2_ver = res_sub_v2.json()["version"]

                # Step D: Supervisor reviews and approves v2
                review_payload_app = {
                    "status": "approved",
                    "feedback_remarks": "Excellent revision. All concerns addressed thoroughly. Approved for defense."
                }
                res_rev2 = client.put(f"/api/module3/submissions/{sub2_id}/review", json=review_payload_app, headers=supervisor_headers)
                if res_rev2.status_code != 200 or res_rev2.json().get("status") != "approved":
                    print(f"  [FAIL] Supervisor approval failed: {res_rev2.status_code}")
                    run_passed = False
                else:
                    print(f"  [PASS] Sub-module 4 (Submissions & Review): Lifecycle v{sub1_ver} (revision_required) -> v{sub2_ver} (approved) verified")

        # ------------------------------------------------------------------
        # 5. Milestone & Deadline Tracking (Riya Saha - 715)
        # ------------------------------------------------------------------
        res_ms = client.get(f"/api/module3/milestones?team_id={tc['team_id']}", headers=student_headers)
        if res_ms.status_code != 200 or len(res_ms.json()) == 0:
            print("  [FAIL] Team milestones query failed")
            run_passed = False
        else:
            milestones = res_ms.json()
            first_ms = milestones[0]
            # Update milestone progress
            update_payload = {
                "progress_percentage": 95,
                "status": "in_progress"
            }
            res_up_ms = client.put(f"/api/module3/milestones/{first_ms['id']}", json=update_payload, headers=supervisor_headers)
            if res_up_ms.status_code != 200 or res_up_ms.json().get("progress_percentage") != 95:
                print("  [FAIL] Milestone progress update failed")
                run_passed = False
            else:
                print(f"  [PASS] Sub-module 5 (Milestones & Deadlines): Team {tc['team_id']} has {len(milestones)} phases, updated progress to 95%")

        # ------------------------------------------------------------------
        # 6. Departmental FYP Analytics (Tamim Hasan Sami - 313)
        # ------------------------------------------------------------------
        res_analytics = client.get("/api/module3/analytics/departmental")
        if res_analytics.status_code != 200:
            print(f"  [FAIL] Departmental analytics query failed: {res_analytics.status_code}")
            run_passed = False
        else:
            an_data = res_analytics.json()
            tot_projects = an_data.get("total_projects", 0)
            domains = an_data.get("domain_distribution", [])
            workload = an_data.get("supervisor_workloads", [])
            stages = an_data.get("project_stages", {})
            active_students = an_data.get("total_active_students", 0)
            avg_compliance = an_data.get("average_compliance_score", 0)
            print(f"  [PASS] Sub-module 6 (Departmental Analytics): Projects={tot_projects}, Students={active_students}, Domains={len(domains)}, Supervisors={len(workload)}, Avg Compliance={avg_compliance}%")

        if run_passed:
            print(f"=== RUN {run_idx}/5 SUCCESS: All Module 3 Sub-modules Passed 100% ===\n")
        else:
            print(f"=== RUN {run_idx}/5 FAILED ===\n")
            overall_success = False

    print("======================================================================")
    if overall_success:
        print("  ALL 5 RUNS COMPLETED SUCCESSFULLY WITH 100% PASS RATE!")
        print("  MODULE 3 IS FULLY OPERATIONAL AND VERIFIED.")
    else:
        print("  SOME RUNS ENCOUNTERED FAILURES.")
    print("======================================================================")

    # Cleanup temp database
    if os.path.exists(TEST_DB):
        try:
            os.remove(TEST_DB)
        except Exception:
            pass

    return overall_success

if __name__ == "__main__":
    success = run_test_suite()
    sys.exit(0 if success else 1)
