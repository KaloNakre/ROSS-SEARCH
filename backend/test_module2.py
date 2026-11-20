import sys
import os

# Ensure backend and packages are on path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.database.connection import SessionLocal
from app.models.research_knowledge import PreviousProject, SharedPaperKnowledge

client = TestClient(app)

def test_module2_full_suite():
    print("======================================================================")
    print("  ROSS-SEARCH MODULE 2 AUTOMATED VERIFICATION SUITE")
    print("  Research Discovery & Shared Paper Knowledge")
    print("======================================================================")

    # 1. [Riya Saha - ID: 715] Previous Projects Retrieval & Domain Filtering
    print("\n▶ 1. Testing Previous Projects Archive [Riya Saha - ID: 715]")
    res1 = client.get("/api/research/previous-projects")
    assert res1.status_code == 200, f"Status code was {res1.status_code}"
    projects = res1.json()
    assert len(projects) >= 8, f"Expected at least 8 projects, got {len(projects)}"
    print(f"  ✔ Retrieved {len(projects)} previous departmental projects from DB")

    # Filter by domain
    res_domain = client.get("/api/research/previous-projects?domain=Natural Language Processing")
    assert res_domain.status_code == 200
    nlp_projects = res_domain.json()
    assert len(nlp_projects) >= 2
    print(f"  ✔ Filter by 'Natural Language Processing' returned {len(nlp_projects)} projects")

    # Log query
    res_log = client.post("/api/research/log-query", data={
        "query_text": "Bengali transformer models for sentiment",
        "domain": "Natural Language Processing",
        "student_id": "232-35-715",
        "student_name": "Riya Saha"
    })
    assert res_log.status_code == 200
    print("  ✔ Successfully logged student research query")

    # 2. [Robayet Islam - ID: 809] AI 9-Point Structured Summarizer
    print("\n▶ 2. Testing AI 9-Point Structured Paper Summarizer [Robayet Islam - ID: 809]")
    sample_text = """
    Deep Learning for SCADA Cyber Security in Industrial Smart Grids
    Problem Statement:
    Cyber-physical attacks on critical SCADA infrastructure cause power grid disruption and cannot be detected by threshold rules.
    Objectives:
    1. Develop autoencoder anomaly detection.
    2. Mitigate false alarms in industrial telemetry.
    Methodology:
    Ensemble deep autoencoders coupled with Random Forest classifiers on network packets.
    Dataset:
    Evaluated on Tennessee Eastman SCADA process dataset with 50,000 telemetry records.
    Model and Technology:
    PyTorch autoencoder, Scikit-learn Random Forest, Python 3.12.
    Findings:
    Achieved 97.4% detection accuracy with 0.8% false positive rate.
    Limitations:
    High memory footprint during real-time packet inspection.
    Research Gap:
    Absence of zero-day attack identification without labeled signatures.
    Future Work:
    Deployment on edge micro-controllers and FPGA accelerators.
    """
    res_sum = client.post("/api/research/summarize-pdf", data={"raw_text": sample_text})
    assert res_sum.status_code == 200, f"Failed: {res_sum.text}"
    summary = res_sum.json()
    
    # Verify all 9 sections exist
    required_sections = [
        "problem_statement", "objectives", "methodology", "dataset",
        "model_technology", "findings", "limitations", "research_gap", "future_work"
    ]
    for sec in required_sections:
        assert sec in summary and len(summary[sec]) > 10, f"Section {sec} missing or empty"
    print(f"  ✔ All 9 structured sections successfully extracted & validated:")
    print(f"    - Problem: {summary['problem_statement'][:60]}...")
    print(f"    - Research Gap: {summary['research_gap'][:60]}...")
    print(f"    - Findings: {summary['findings'][:60]}...")

    # Also test PDF extraction via PyMuPDF in-memory
    import fitz
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((50, 72), "Title: Autonomous Aerial Robotics for Precision Agriculture\nProblem Statement: Weed detection in crop fields requires manual labor.\nObjectives: Automate drone vision classification.\nMethodology: YOLOv8 on UAV video.\nDataset: 5,000 aerial crop images.\nModel: YOLOv8 PyTorch.\nFindings: 92% mAP score.\nLimitations: Battery flight time.\nResearch Gap: Real-time edge inference.\nFuture Work: Solar-powered drones.")
    pdf_bytes = doc.tobytes()
    doc.close()

    res_pdf = client.post(
        "/api/research/summarize-pdf",
        files={"file": ("test_paper.pdf", pdf_bytes, "application/pdf")}
    )
    assert res_pdf.status_code == 200
    pdf_sum = res_pdf.json()
    assert "YOLOv8" in pdf_sum["methodology"] or "YOLOv8" in pdf_sum["model_technology"]
    print("  ✔ PyMuPDF binary PDF stream extracted and parsed into 9 points successfully")

    # 3. [Tamim Hasan Sami - ID: 313] Topic Similarity & Duplicate FYP Detector
    print("\n▶ 3. Testing Topic Similarity & Duplicate Check [Tamim Hasan Sami - ID: 313]")
    # High overlap test
    dup_req = {
        "title": "Bengali Sentiment Analysis and Opinion Mining Using Hybrid BiLSTM-BERT Models",
        "domain": "Natural Language Processing",
        "abstract": "Classifying sentiment in Romanized and standard Bengali text using BERT and BiLSTM layers."
    }
    res_dup = client.post("/api/research/check-similarity", json=dup_req)
    assert res_dup.status_code == 200
    dup_data = res_dup.json()
    assert dup_data["highest_similarity"] >= 65.0, f"Expected high similarity, got {dup_data['highest_similarity']}"
    assert "Duplicate" in dup_data["risk_level"] or "Moderate" in dup_data["risk_level"]
    print(f"  ✔ High similarity detected correctly: {dup_data['highest_similarity']}% (Risk: {dup_data['risk_level']})")

    # Novel topic test
    novel_req = {
        "title": "Quantum Key Distribution Protocols for Deep Space Laser Communication",
        "domain": "Cyber Security",
        "abstract": "Entangled photon state routing through high atmospheric turbulence."
    }
    res_novel = client.post("/api/research/check-similarity", json=novel_req)
    assert res_novel.status_code == 200
    novel_data = res_novel.json()
    assert novel_data["highest_similarity"] < 40.0
    print(f"  ✔ Novel topic recognized correctly: {novel_data['highest_similarity']}% (Risk: {novel_data['risk_level']})")

    # 4. [Tamim Hasan Sami - ID: 313] Shared Paper Knowledge Repository
    print("\n▶ 4. Testing Shared Paper Knowledge Repository [Tamim Hasan Sami - ID: 313]")
    res_shared = client.get("/api/research/shared-knowledge")
    assert res_shared.status_code == 200
    shared_list = res_shared.json()
    assert len(shared_list) >= 3
    print(f"  ✔ Retrieved {len(shared_list)} persistent shared papers from database")

    # Save newly analyzed paper into shared repository
    new_paper_payload = {
        "title": "Autonomous Aerial Robotics for Precision Agriculture",
        "authors": "Md. Robayet Islam, Riya Saha, Tamim Hasan Sami",
        "year": 2026,
        "journal_or_conference": "DIU Research Colloquium 2026",
        "domain": "Computer Vision",
        "uploaded_by_name": "Md. Robayet Islam",
        "uploaded_by_id": "232-35-809",
        "file_name": "Autonomous_Aerial_Robotics.pdf",
        "abstract": "Weed detection in crop fields using UAV vision.",
        "problem_statement": summary["problem_statement"],
        "objectives": summary["objectives"],
        "methodology": summary["methodology"],
        "dataset": summary["dataset"],
        "model_technology": summary["model_technology"],
        "findings": summary["findings"],
        "limitations": summary["limitations"],
        "research_gap": summary["research_gap"],
        "future_work": summary["future_work"]
    }
    res_save = client.post("/api/research/shared-knowledge", json=new_paper_payload)
    assert res_save.status_code == 201
    saved_paper = res_save.json()
    assert saved_paper["id"] is not None
    print(f"  ✔ Successfully persisted new paper ID {saved_paper['id']} into shared repository for future students")

    print("\n======================================================================")
    print("  🎉 ALL MODULE 2 TESTS COMPLETED WITH 100% SUCCESS!")
    print("======================================================================")

if __name__ == "__main__":
    test_module2_full_suite()
