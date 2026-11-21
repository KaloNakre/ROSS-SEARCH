"""
Comprehensive Technical Verification Suite for Module 2:
- Academic Paper Discovery & Federated Repositories (arXiv, Crossref)
- SSRF Security Protection & %PDF- Magic Header Validation
- 20-Point Research-Grade AI Paper Summarizer Engine
- Public AI Research Assistant Chat (No Authentication Required)
- Chromium Extension Domain Intelligence & Security Audit
- Personal Research Library & BibTeX Export
- Topic Similarity & Duplicate FYP Rejection Engine (>70% duplicate threshold)
- Concurrency-Safe Novel Thesis Topic Registration
- Shared Paper Knowledge Repository
"""

import sys
import os
import unittest
import io

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.database.connection import SessionLocal, engine
from app.database.base import Base
from app.models.user import User, UserRole
from app.models.student import Student
from app.models.research_knowledge import (
    PreviousProject,
    SharedPaperKnowledge,
    AcademicPaperCache,
    StudentSavedPaper,
    ExtensionDomainAuditLog
)
from app.core.security import hash_password, create_access_token
from app.services.pdf_processor import validate_safe_url_ssrf, extract_text_and_sections_from_pdf
from app.services.ai_provider import analyze_research_paper_multi_model, chat_research_assistant

client = TestClient(app)


class TestModule2MasterVerification(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)
        cls.db = SessionLocal()

        # Seed test student user
        test_email = "student_module2_test@diu.edu.bd"
        existing = cls.db.query(User).filter(User.email == test_email).first()
        if not existing:
            cls.test_user = User(
                email=test_email,
                password_hash=hash_password("Student@12345"),
                role=UserRole.student,
                is_active=True
            )
            cls.db.add(cls.test_user)
            cls.db.commit()
            cls.db.refresh(cls.test_user)

            cls.test_student = Student(
                user_id=cls.test_user.id,
                full_name="Module 2 Tester",
                student_id="232-35-999",
                batch="Batch 45",
                department="Computer Science & Engineering",
                preferred_domain="Cyber Security, Artificial Intelligence",
                subdomains="SCADA Security, Large Language Models"
            )

            cls.db.add(cls.test_student)
            cls.db.commit()
            cls.db.refresh(cls.test_student)
        else:
            cls.test_user = existing
            cls.test_student = cls.db.query(Student).filter(Student.user_id == existing.id).first()
            if not cls.test_student:
                cls.test_student = Student(
                    user_id=existing.id,
                    full_name="Module 2 Tester",
                    student_id="232-35-999",
                    batch="Batch 45",
                    department="Computer Science & Engineering",
                    preferred_domain="Cyber Security, Artificial Intelligence",
                    subdomains="SCADA Security, Large Language Models"
                )
                cls.db.add(cls.test_student)
                cls.db.commit()
                cls.db.refresh(cls.test_student)

        cls.token = create_access_token(data={"sub": str(cls.test_user.id), "role": cls.test_user.role.value})
        cls.headers = {"Authorization": f"Bearer {cls.token}"}




    @classmethod
    def tearDownClass(cls):
        cls.db.close()

    def test_01_ssrf_protection_engine(self):
        """Phase 10: Strict SSRF protection blocking private IPs, loopback, and cloud metadata."""
        # Loopback attack
        with self.assertRaises(Exception):
            validate_safe_url_ssrf("http://127.0.0.1:8000/internal-admin")

        with self.assertRaises(Exception):
            validate_safe_url_ssrf("http://localhost:8080/metrics")

        # AWS / GCP cloud metadata endpoints
        with self.assertRaises(Exception):
            validate_safe_url_ssrf("http://169.254.169.254/latest/meta-data/")

        # RFC1918 private subnets
        with self.assertRaises(Exception):
            validate_safe_url_ssrf("http://192.168.1.1/router-login")
        with self.assertRaises(Exception):
            validate_safe_url_ssrf("http://10.0.0.5/secrets.txt")

        # Legitimate academic URLs must pass
        valid_url = "https://arxiv.org/pdf/1706.03762.pdf"
        self.assertEqual(validate_safe_url_ssrf(valid_url), valid_url)

    def test_02_academic_papers_discovery_federated(self):
        """Phase 3: Real academic paper discovery with authentic DOIs and citations."""
        res = client.get("/api/research/academic-papers?domain=Natural+Language+Processing&limit=5")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)

        first = data[0]
        self.assertIn("title", first)
        self.assertIn("authors", first)
        self.assertIn("pdf_url", first)
        self.assertTrue(first.get("is_open_access"))

    def test_03_public_research_chat_no_auth(self):
        """Phase 5: Public AI research chatbot accessible with NO credentials or Gmail."""
        res = client.post(
            "/api/research/chat",
            json={
                "message": "What are good benchmark datasets for low-resource Bengali sentiment analysis?",
                "history": [],
                "model_choice": "auto"
            }
        )
        self.assertEqual(res.status_code, 200)
        body = res.json()
        self.assertIn("reply", body)
        self.assertIn("model_used", body)
        self.assertGreater(len(body["reply"]), 20)

    def test_04_extension_domain_intelligence_probe(self):
        """Phase 6: Browser extension domain intelligence endpoint with security score."""
        res = client.post(
            "/api/extension/analyze-domain",
            json={"url_or_domain": "https://daffodilvarsity.edu.bd"}
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("security_score", data)
        self.assertIn("risk_level", data)
        self.assertIn("missing_headers", data)
        self.assertIn("ai_analysis_summary", data)
        self.assertTrue(data.get("tls_active"))

    def test_05_20_point_paper_analysis_offline_nlp(self):
        """Phase 4: 20-Point AI Paper Analysis with strict academic honesty."""
        sample_paper_text = """
        BanglaBERT: Language Model Pretraining for Low-Resource Bengali Natural Language Processing
        Authors: Md. Robayet Islam, Sakib Hasan, Prof. Dr. Syed Akhter Hossain
        Abstract:
        We introduce BanglaBERT, pretrained on 45GB of curated clean Bengali text.
        1. Problem Statement:
        Existing multilingual models fail to represent Bengali morphological nuances due to sub-optimal tokenization.
        2. Objectives:
        Pretrain a monolingual transformer for Bengali and benchmark on 8 downstream NLP tasks.
        3. Methodology:
        12-layer Transformer encoder with masked language modeling (MLM) and next sentence prediction.
        4. Dataset:
        Curated 45GB corpus from Bengali newspapers, Wikipedia, and literature.
        5. Models & Technology:
        PyTorch, Hugging Face Transformers, RoBERTa architecture.
        6. Experimental Results:
        Achieved 86.4% Macro F1-score across downstream classification tasks.
        7. Limitations:
        High memory requirements during full fine-tuning on consumer GPUs.
        8. Research Gap:
        Lack of parameter-efficient adaptation (LoRA/QLoRA) for edge devices.
        9. Future Directions:
        Investigate model quantization and multimodal speech-text integration.
        """
        analysis = analyze_research_paper_multi_model(sample_paper_text, model_choice="neural-nlp-offline")

        # Verify all 20 academic points are present
        dimensions = [
            "research_objective", "research_problem", "research_gap", "research_motivation",
            "proposed_methodology", "dataset_description", "dataset_size", "features_parameters",
            "models_algorithms", "experimental_setup", "evaluation_metrics", "experimental_results",
            "accuracy_performance", "strengths", "limitations", "future_directions",
            "novel_contributions", "related_work", "important_findings", "research_opportunities"
        ]
        for dim in dimensions:
            self.assertIn(dim, analysis, f"Missing required dimension: {dim}")
            self.assertIsInstance(analysis[dim], str)
            self.assertGreater(len(analysis[dim]), 0)

    def test_06_personal_reading_library_and_bibtex(self):
        """Phase 3: Personal reading library management and BibTeX citation export."""
        # 1. Save paper
        save_res = client.post(
            "/api/research/library/save",
            headers=self.headers,
            json={
                "title": "Attention Is All You Need",
                "authors": "Ashish Vaswani et al.",
                "year": 2017,
                "domain": "Natural Language Processing",
                "venue": "NeurIPS 2017",
                "doi": "10.48550/arXiv.1706.03762",
                "arxiv_id": "1706.03762",
                "pdf_url": "https://arxiv.org/pdf/1706.03762.pdf",
                "notes": "Foundational Transformer paper for literature review chapter 2."
            }
        )
        self.assertEqual(save_res.status_code, 201)
        saved_id = save_res.json()["id"]

        # 2. Get library
        get_res = client.get("/api/research/library", headers=self.headers)
        self.assertEqual(get_res.status_code, 200)
        lib = get_res.json()
        self.assertTrue(any(p["id"] == saved_id for p in lib))

        # 3. Export as BibTeX
        export_res = client.get("/api/research/library/export?format=bibtex", headers=self.headers)
        self.assertEqual(export_res.status_code, 200)
        self.assertIn("@article", export_res.text)
        self.assertIn("Attention Is All You Need", export_res.text)

        # 4. Clean up
        del_res = client.delete(f"/api/research/library/{saved_id}", headers=self.headers)
        self.assertEqual(del_res.status_code, 200)

    def test_07_topic_similarity_rejection_and_concurrency(self):
        """Phase 7: Topic similarity >70% duplicate rejection and novel topic registration."""
        # Clear any project_title on test_student to ensure clean test state
        self.test_student.project_title = None
        self.db.commit()

        # Seed a departmental previous project

        prev_title = "SCADA Cyber Threat Detection Using Variational Autoencoders and Random Forest"
        existing_prev = self.db.query(PreviousProject).filter(PreviousProject.title == prev_title).first()
        if not existing_prev:
            p = PreviousProject(
                title=prev_title,
                abstract="Deep learning autoencoders and random forest classifiers on industrial SCADA sensor telemetry.",
                domain="Cyber Security",
                batch="Batch 42",
                year=2024,
                supervisor_name="Dr. Sheak Rashed Haider Noori",
                team_members="Student A, Student B"
            )
            self.db.add(p)
            self.db.commit()

        # 1. Test duplicate query (should be rejected, can_register = False)
        dup_res = client.post(
            "/api/research/check-similarity",
            json={
                "title": "SCADA Cyber Threat Detection Using Variational Autoencoders and Random Forest",
                "abstract": "Industrial SCADA sensor telemetry anomaly detection.",
                "domain": "Cyber Security"
            }
        )
        self.assertEqual(dup_res.status_code, 200)
        dup_data = dup_res.json()
        self.assertGreaterEqual(dup_data["highest_similarity"], 70.0)
        self.assertFalse(dup_data["can_register"])
        self.assertIn("REJECTED", dup_data["verdict_summary"])

        # 2. Test novel original query (should be approved, can_register = True)
        novel_title = f"Post-Quantum Kyber-768 Encryption for CubeSat Satellite Laser Inter-Links #{os.urandom(2).hex()}"
        novel_res = client.post(
            "/api/research/check-similarity",
            json={
                "title": novel_title,
                "abstract": "Quantum key distribution and Kyber lattice cryptography in space communication.",
                "domain": "Cyber Security"
            }
        )
        self.assertEqual(novel_res.status_code, 200)
        novel_data = novel_res.json()
        self.assertTrue(novel_data["can_register"])

        # 3. Register novel topic to student profile
        reg_res = client.post(
            "/api/research/register-topic",
            headers=self.headers,
            json={"title": novel_title, "domain": "Cyber Security"}
        )
        self.assertEqual(reg_res.status_code, 200)
        self.assertEqual(reg_res.json()["project_title"], novel_title)

        # 4. Concurrency conflict check: another student trying to register the identical title should receive 409 Conflict
        # Create second user
        user2 = User(email=f"student2_{os.urandom(2).hex()}@diu.edu.bd", password_hash=hash_password("Pass123!"), role=UserRole.student, is_active=True)
        self.db.add(user2)

        self.db.commit()
        s2 = Student(user_id=user2.id, full_name="Student 2", student_id=f"ID-{os.urandom(2).hex()}", department="Computer Science & Engineering")

        self.db.add(s2)
        self.db.commit()
        token2 = create_access_token(data={"sub": str(user2.id), "role": user2.role.value})


        conflict_res = client.post(
            "/api/research/register-topic",
            headers={"Authorization": f"Bearer {token2}"},
            json={"title": novel_title}
        )
        self.assertEqual(conflict_res.status_code, 409)


if __name__ == "__main__":
    unittest.main()
