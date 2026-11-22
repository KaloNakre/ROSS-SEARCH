from sqlalchemy.orm import Session
from app.models.research_knowledge import PreviousProject, SharedPaperKnowledge, ResearchQueryLog, StudentSavedPaper, AcademicPaperCache
from app.models.student import Student

DEMO_PREVIOUS_PROJECTS = [
    {
        "title": "Bengali Sentiment Analysis and Opinion Mining Using Hybrid BiLSTM-BERT Models",
        "abstract": "This thesis explores sentiment classification in Romanized and standard Bengali text collected from social media platforms. We propose a hybrid architecture combining fine-tuned Bengali-BERT with bidirectional LSTM layers to capture contextual morphological nuances. Evaluated on 15,000 annotated user comments.",
        "domain": "Natural Language Processing",
        "batch": "Batch 40",
        "year": 2024,
        "supervisor_name": "Prof. Dr. Syed Akhter Hossain",
        "team_members": "Sakib Al Hasan, Nusrat Jahan, Tanvir Ahmed",
        "keywords": "Bengali NLP, BiLSTM, BERT, Sentiment Analysis, Text Classification",
        "grade": "A+",
        "github_or_paper_url": "https://github.com/diu-cse-archive/bengali-sentiment-thesis"
    },
    {
        "title": "Cyber-Physical SCADA Network Threat Detection Using Deep Autoencoders and Random Forest",
        "abstract": "Industrial Control Systems (ICS) and SCADA environments are vulnerable to targeted cyber-physical attacks. This project presents a multi-stage intrusion detection system that integrates unsupervised autoencoders for anomaly generation and a supervised Random Forest classifier on the Tennessee Eastman process dataset.",
        "domain": "Cyber Security",
        "batch": "Batch 41",
        "year": 2024,
        "supervisor_name": "Dr. Sheak Rashed Haider Noori",
        "team_members": "Ahsan Habib, Mehedi Hasan, Farzana Akter",
        "keywords": "SCADA, Cyber Security, Deep Autoencoder, Anomaly Detection, ICS",
        "grade": "A",
        "github_or_paper_url": "https://github.com/diu-cse-archive/scada-threat-detector"
    },
    {
        "title": "Automated Brain Tumor Segmentation from Multi-Modal MRI Images Using Attention U-Net",
        "abstract": "Early and accurate detection of brain glioma tumors is crucial for clinical neuro-oncology. We propose a 3D Attention U-Net architecture trained on the BraTS 2023 dataset, incorporating spatial and channel-wise self-attention mechanisms to segment core and edema regions with high dice similarity coefficients.",
        "domain": "Computer Vision",
        "batch": "Batch 42",
        "year": 2025,
        "supervisor_name": "Dr. S. M. Aminul Haque",
        "team_members": "Mahmudul Hasan, Sadia Sultana, Arifur Rahman",
        "keywords": "Computer Vision, Medical Imaging, MRI, Attention U-Net, Tumor Segmentation",
        "grade": "A+",
        "github_or_paper_url": "https://github.com/diu-cse-archive/mri-brain-tumor-segmentation"
    },
    {
        "title": "Decentralized Academic Credential Verification Framework Utilizing Polygon Blockchain and IPFS",
        "abstract": "Fabrication of academic certificates presents severe trust challenges. This research develops an immutable verification platform leveraging Ethereum-compatible Polygon smart contracts and decentralized IPFS storage. Verification occurs instantly via QR code hashing with zero reliance on centralized certificate authorities.",
        "domain": "Blockchain",
        "batch": "Batch 42",
        "year": 2025,
        "supervisor_name": "Dr. Imran Mahmud",
        "team_members": "Nazmul Huda, Tanjila Islam, Fahim Shahriar",
        "keywords": "Blockchain, Smart Contracts, IPFS, Polygon, Credential Verification",
        "grade": "A",
        "github_or_paper_url": "https://github.com/diu-cse-archive/blockchain-credential-verifier"
    },
    {
        "title": "Smart Agricultural Crop Disease Identification Using Lightweight YOLOv8 for Edge Devices",
        "abstract": "Timely detection of leaf blight and fungal infections in paddy and tomato crops in rural Bangladesh. We optimized YOLOv8n with parameter pruning and INT8 quantization, deploying the model to a low-cost Raspberry Pi 4 edge device with real-time video inference at 28 FPS.",
        "domain": "Internet of Things",
        "batch": "Batch 43",
        "year": 2025,
        "supervisor_name": "Prof. Dr. Syed Akhter Hossain",
        "team_members": "Kamrul Hasan, Sumaiya Akter, Zubair Ahmed",
        "keywords": "IoT, Computer Vision, YOLOv8, Precision Agriculture, Edge Computing",
        "grade": "A+",
        "github_or_paper_url": "https://github.com/diu-cse-archive/smart-crop-edge-vision"
    },
    {
        "title": "Federated Learning for Privacy-Preserving Electronic Health Record (EHR) Diagnostics",
        "abstract": "Cross-institutional healthcare machine learning often infringes patient privacy regulations. This project implements a federated learning framework with differential privacy, allowing multiple hospital nodes to collaboratively train cardiac arrhythmia risk prediction models without sharing raw clinical records.",
        "domain": "Machine Learning",
        "batch": "Batch 43",
        "year": 2025,
        "supervisor_name": "Dr. Sheak Rashed Haider Noori",
        "team_members": "Tareq Aziz, Shamima Nasrin, Rashedul Islam",
        "keywords": "Federated Learning, Differential Privacy, Healthcare AI, EHR, Deep Learning",
        "grade": "A+",
        "github_or_paper_url": "https://github.com/diu-cse-archive/federated-ehr-diagnostics"
    },
    {
        "title": "Cloud-Native Microservices Autoscaling Using Reinforcement Learning (Deep Q-Networks)",
        "abstract": "Traditional CPU/Memory threshold autoscaling in Kubernetes exhibits lag during bursty traffic spikes. We formulate resource provisioning as a Markov Decision Process (MDP) and implement a DQN agent that forecasts request latency and preemptively scales pod replicas with minimal over-provisioning costs.",
        "domain": "Cloud Computing",
        "batch": "Batch 44",
        "year": 2026,
        "supervisor_name": "Dr. S. M. Aminul Haque",
        "team_members": "Shakil Hossain, Nabila Tabassum, Moniruzzaman",
        "keywords": "Cloud Computing, Kubernetes, Reinforcement Learning, DQN, Microservices",
        "grade": "A",
        "github_or_paper_url": "https://github.com/diu-cse-archive/k8s-dqn-autoscale"
    },
    {
        "title": "Bengali Abstractive Text Summarization Using Sequence-to-Sequence mT5 Transformers",
        "abstract": "Abstractive summarization in low-resource Bengali requires generative contextual understanding. We fine-tuned Google's multilingual mT5 model on a curated benchmark of 25,000 Bengali newspaper articles, outperforming extractive baselines in ROUGE-1 and ROUGE-L metrics.",
        "domain": "Natural Language Processing",
        "batch": "Batch 44",
        "year": 2026,
        "supervisor_name": "Dr. Imran Mahmud",
        "team_members": "Arif Hossain, Nabila Chowdhury, Farhan Islam",
        "keywords": "Bengali NLP, mT5, Abstractive Summarization, Transformer, Deep Learning",
        "grade": "A+",
        "github_or_paper_url": "https://github.com/diu-research/academic-nlp"
    }
]

DEMO_SHARED_PAPERS = [
    {
        "title": "Attention Is All You Need: Foundations of Modern Transformer Architecture",
        "authors": "Ashish Vaswani, Noam Shazeer, Niki Parmar, et al.",
        "year": 2017,
        "journal_or_conference": "NeurIPS 2017",
        "domain": "Natural Language Processing",
        "uploaded_by_name": "Arif Hossain",
        "uploaded_by_id": "201-15-101",
        "file_name": "Attention_Is_All_You_Need.pdf",
        "abstract": "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose the Transformer, a model architecture eschewing recurrence and relying entirely on an attention mechanism to draw global dependencies between input and output.",
        "research_problem": "Recurrent neural networks (RNNs/LSTMs) suffer from sequential computation bottlenecks, preventing parallel training across long sequence lengths and failing to preserve long-range dependencies.",
        "research_objective": "1. Replace sequential recurrence entirely with Multi-Head Self-Attention.\n2. Enable constant-time path length between arbitrary sequence positions.\n3. Drastically reduce training time while improving translation BLEU scores.",
        "proposed_methodology": "Encoder-Decoder structure with stacked Multi-Head Attention and Position-Wise Feed-Forward networks, sinusoidal positional encodings, and residual normalization.",
        "dataset_description": "WMT 2014 English-to-German (4.5 million sentence pairs) and WMT 2014 English-to-French (36 million pairs).",
        "models_algorithms": "Transformer Big (65M parameters), Multi-Head Scaled Dot-Product Attention, Adam Optimizer with warm-up schedule.",
        "important_findings": "Established state-of-the-art BLEU score of 28.4 on English-to-German and 41.8 on English-to-French, training over 3.5 days on 8 GPUs (orders of magnitude faster than ConvS2S and GNMT).",
        "limitations": "Quadratic computational complexity O(n^2) with respect to input sequence length, requiring massive memory for ultra-long documents.",
        "research_gap": "Absence of linear attention mechanisms for ultra-long sequence modeling and heavy reliance on extensive pre-training corpora.",
        "future_directions": "Exploration of sparse attention patterns, extending to multimodal inputs (images, audio), and localized low-resource dialect adaptation."
    },
    {
        "title": "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
        "authors": "Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova",
        "year": 2019,
        "journal_or_conference": "NAACL-HLT 2019",
        "domain": "Natural Language Processing",
        "uploaded_by_name": "Nabila Chowdhury",
        "uploaded_by_id": "201-15-204",
        "file_name": "BERT_Pretraining_Language_Understanding.pdf",
        "abstract": "We introduce BERT (Bidirectional Encoder Representations from Transformers). Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.",
        "research_problem": "Standard language models are strictly unidirectional (left-to-right), which severely limits context fusion during pre-training for token-level and sentence-level question answering tasks.",
        "research_objective": "1. Develop a masked language model (MLM) objective to enable deep bidirectional context learning.\n2. Formulate Next Sentence Prediction (NSP) for cross-sentence relationship capture.\n3. Establish fine-tuning paradigm requiring minimal task-specific architectural changes.",
        "proposed_methodology": "Pre-trained on BooksCorpus and English Wikipedia using Masked LM (15% token masking) and Next Sentence Prediction, followed by single-epoch task fine-tuning.",
        "dataset_description": "BooksCorpus (800M words) and English Wikipedia (2,500M words). Evaluated on GLUE benchmark, SQuAD v1.1/v2.0, and SWAG.",
        "models_algorithms": "BERT-Base (12 layers, 110M params) and BERT-Large (24 layers, 340M params), Gelu activation, AdamW.",
        "important_findings": "Achieved GLUE score of 80.5% (7.7% absolute improvement) and SQuAD v1.1 Test F1 of 93.2, outperforming human performance.",
        "limitations": "Discrepancy between pre-training and fine-tuning due to [MASK] tokens never appearing during inference; substantial parameter footprint.",
        "research_gap": "Native adaptation to morphologically rich agglutinative languages (like Bengali) without dedicated tokenization vocabularies.",
        "future_directions": "Domain-specific distillations (BioBERT, BanglaBERT) and parameter pruning for edge deployment."
    },
    {
        "title": "DeepLog: Anomaly Detection through Deep Learning from System Logs",
        "authors": "Min Du, Feifei Li, Guineng Zheng, Vivek Srikumar",
        "year": 2017,
        "journal_or_conference": "ACM CCS 2017",
        "domain": "Cyber Security",
        "uploaded_by_name": "Jamal Uddin",
        "uploaded_by_id": "201-15-103",
        "file_name": "DeepLog_Anomaly_Detection.pdf",
        "abstract": "Log data is universally available in enterprise software. We propose DeepLog, a deep neural network utilizing Long Short-Term Memory (LSTM) to model a system log as a natural language sequence.",
        "research_problem": "Traditional log analysis relies on static regex patterns and rule engines that fail to adapt to evolving cyber threats and high-volume streaming log anomalies.",
        "research_objective": "1. Model log execution paths sequentially using LSTM networks.\n2. Predict future log event types dynamically and flag unexpected sequences.\n3. Diagnose anomaly root causes via parameter value tracking.",
        "proposed_methodology": "Log key parser (Drain/Spell) converts unstructured text to structured events; Stacked LSTM learns log normal execution sequences; anomaly flagged when actual event falls outside top-g predictions.",
        "dataset_description": "HDFS log dataset (11,175,629 log entries generated on Amazon EC2) and OpenStack Cloud dataset.",
        "models_algorithms": "Stacked LSTM (2 layers, 64 hidden units), Softmax probability distribution, Spell log parser.",
        "important_findings": "Detected over 96% of HDFS anomalies with an extremely low false positive rate (FPR) under 1.8%, significantly outperforming PCA and invariant mining.",
        "limitations": "Computational overhead during continuous online retraining when log formatting changes during software upgrades.",
        "research_gap": "Automated recovery and zero-day threat attribution in multi-tenant Kubernetes and cloud microservice environments.",
        "future_directions": "Transformer-based log representation (LogBERT) and self-supervised contrastive learning for heterogeneous distributed logs."
    },
    {
        "title": "Communication-Efficient Learning of Deep Networks from Decentralized Data",
        "authors": "H. Brendan McMahan, Eider Moore, Daniel Ramage, Seth Hampson, Blaise Aguera y Arcas",
        "year": 2017,
        "journal_or_conference": "AISTATS 2017",
        "domain": "Machine Learning",
        "uploaded_by_name": "Kamal Hossain",
        "uploaded_by_id": "201-15-102",
        "file_name": "Federated_Learning_McMahan.pdf",
        "abstract": "Modern mobile devices have access to a wealth of data suitable for learning. We advocate Federated Learning, where training data remains distributed on mobile devices, and a shared model is learned by aggregating locally-computed updates.",
        "research_problem": "Centralized machine learning requires uploading massive sensitive user data to cloud servers, introducing severe privacy violations and communication latency bottlenecks.",
        "research_objective": "1. Design a practical algorithm for decentralized model training across millions of edge devices.\n2. Minimize client-to-server communication rounds through iterative local updates.\n3. Maintain model accuracy on unbalanced and non-IID data distributions.",
        "proposed_methodology": "FederatedAveraging (FedAvg) algorithm combining local stochastic gradient descent (SGD) on client devices with iterative central server model weight averaging.",
        "dataset_description": "MNIST digit dataset, Federated EMNIST, and The Complete Works of William Shakespeare character-level dataset.",
        "models_algorithms": "FedAvg, Federated SGD, CNN baselines, LSTM language models.",
        "important_findings": "Reduced required communication rounds by 10x to 100x compared to synchronized FedSGD, proving robust convergence on non-IID and heavily imbalanced device partitions.",
        "limitations": "Susceptible to poisoning attacks from malicious nodes and straggler delays from slow mobile connections.",
        "research_gap": "Personalized federated learning architectures and formal differential privacy guarantees with minimal utility degradation.",
        "future_directions": "Secure aggregation protocols, split federated learning, and edge hardware accelerators."
    },
    {
        "title": "Dermatologist-Level Classification of Skin Cancer with Deep Neural Networks",
        "authors": "Andre Esteva, Brett Kuprel, Roberto A. Novoa, et al.",
        "year": 2017,
        "journal_or_conference": "Nature 542",
        "domain": "Bioinformatics & Healthcare AI",
        "uploaded_by_name": "Farhana Yeasmin",
        "uploaded_by_id": "201-15-408",
        "file_name": "Skin_Cancer_Classification_Nature.pdf",
        "abstract": "Skin cancer, the most common human malignancy, is primarily diagnosed visually. We demonstrate classification of skin lesions using a single deep convolutional neural network (CNN), trained end-to-end from images directly.",
        "research_problem": "Melanoma accounts for the majority of skin cancer deaths, yet early screening relies heavily on subjective visual inspection by expert dermatologists who are scarce in rural clinics.",
        "research_objective": "1. Train a deep CNN to differentiate benign lesions from lethal malignant melanomas.\n2. Benchmark performance against 21 board-certified dermatologists on biopsy-proven clinical images.\n3. Enable mobile smartphone screening for remote and underserved populations.",
        "proposed_methodology": "Google Inception v3 CNN pre-trained on ImageNet and fine-tuned using transfer learning on clinical dermoscopy images across a multi-tier disease taxonomy.",
        "dataset_description": "Curated clinical dataset of 129,450 dermoscopic and photographic images encompassing 2,032 different skin diseases.",
        "models_algorithms": "Inception-v3 CNN, Transfer Learning, AUC-ROC curve evaluation, Softmax classification.",
        "important_findings": "The neural network achieved an area under the curve (AUC) of 0.96 for carcinoma and 0.94 for melanoma, matching the diagnostic sensitivity and specificity of 21 board-certified dermatologists.",
        "limitations": "Lack of representation for darker skin phototypes (Fitzpatrick scales V-VI) and vulnerability to imaging artifacts like surgical ink marks.",
        "research_gap": "Explainable saliency maps for clinical validation and multimodal fusion with patient demographic history.",
        "future_directions": "Deployment on lightweight mobile edge models and prospective real-world clinical trials."
    }
]

DEMO_QUERY_LOGS = [
    ("Bengali BERT sentiment analysis for low-resource social text", "Natural Language Processing", "201-15-101", "Arif Hossain"),
    ("Federated learning communication optimization on edge devices", "Machine Learning", "201-15-102", "Kamal Hossain"),
    ("SCADA deep autoencoder anomaly detection in power grid ICS", "Cyber Security", "201-15-103", "Jamal Uddin"),
    ("Bidirectional transformer dialogue response generation", "Machine Learning", "201-15-104", "Nabila Chowdhury"),
    ("Zero-trust memory safety and buffer overflow defense", "Cyber Security", "201-15-105", "Farhan Islam"),
    ("Kubernetes microservices autoscaling using deep Q-learning", "Cloud Computing & DevOps", "201-15-204", "Tanvir Ahmed"),
    ("Attention U-Net 3D brain tumor MRI segmentation", "Computer Vision", "201-15-205", "Mehedi Hasan"),
    ("High-throughput sensor stream processing with Apache Kafka", "Data Science & Big Data", "201-15-306", "Sadia Afrin"),
    ("Polygon IPFS academic certificate verification smart contracts", "Blockchain & Distributed Systems", "201-15-307", "Naimur Rahman"),
    ("Skin melanoma dermatological screening using deep Inception CNN", "Bioinformatics & Healthcare AI", "201-15-408", "Farhana Yeasmin"),
]

DEMO_SAVED_PAPERS = [
    {
        "student_matric": "201-15-101",
        "title": "Attention Is All You Need",
        "authors": "A. Vaswani, N. Shazeer, et al.",
        "year": 2017,
        "domain": "Natural Language Processing",
        "venue": "NeurIPS",
        "abstract": "Foundational transformer model architecture eliminating recurrence.",
        "pdf_url": "https://arxiv.org/pdf/1706.03762.pdf",
        "notes": "Core foundation paper for our Bengali sentiment analysis model.",
        "reading_status": "completed",
        "is_downloaded": True
    },
    {
        "student_matric": "201-15-103",
        "title": "DeepLog: Anomaly Detection through Deep Learning from System Logs",
        "authors": "M. Du, F. Li, et al.",
        "year": 2017,
        "domain": "Cyber Security",
        "venue": "ACM CCS",
        "abstract": "Deep neural network utilizing LSTM to model system log sequences.",
        "pdf_url": "https://arxiv.org/pdf/1706.03762.pdf",
        "notes": "Downloaded to local research folder; implementing the Drain parser.",
        "reading_status": "completed",
        "is_downloaded": True
    },
    {
        "student_matric": "201-15-205",
        "title": "Attention U-Net: Learning Where to Look for the Pancreas",
        "authors": "O. Oktay, J. Schlemper, et al.",
        "year": 2018,
        "domain": "Computer Vision",
        "venue": "MIDL",
        "abstract": "Novel attention gate model for medical image segmentation.",
        "pdf_url": "https://arxiv.org/pdf/1804.03999.pdf",
        "notes": "Downloaded; analyzing dice similarity coefficients on MRI scans.",
        "reading_status": "completed",
        "is_downloaded": True
    },
    {
        "student_matric": "201-15-408",
        "title": "Dermatologist-Level Classification of Skin Cancer with Deep Neural Networks",
        "authors": "A. Esteva, B. Kuprel, et al.",
        "year": 2017,
        "domain": "Bioinformatics & Healthcare AI",
        "venue": "Nature",
        "abstract": "Classification of skin lesions using deep convolutional neural networks.",
        "pdf_url": "https://doi.org/10.1038/nature21056",
        "notes": "Essential reference paper for our FYP thesis on dermoscopy.",
        "reading_status": "completed",
        "is_downloaded": True
    }
]

def seed_module2_demo_data(db: Session):
    """Seed initial previous departmental projects, shared paper knowledge, search query logs, and student libraries."""
    if db.query(PreviousProject).count() == 0:
        for proj in DEMO_PREVIOUS_PROJECTS:
            db.add(PreviousProject(**proj))
        db.commit()
        print(f"[ROSS-SEARCH Module 2] Seeded {len(DEMO_PREVIOUS_PROJECTS)} previous departmental projects.")

    if db.query(SharedPaperKnowledge).count() == 0:
        for paper in DEMO_SHARED_PAPERS:
            db.add(SharedPaperKnowledge(**paper))
        db.commit()
        print(f"[ROSS-SEARCH Module 2] Seeded {len(DEMO_SHARED_PAPERS)} shared paper knowledge records.")

    if db.query(ResearchQueryLog).count() == 0:
        for q_text, q_domain, s_id, s_name in DEMO_QUERY_LOGS:
            db.add(ResearchQueryLog(
                query_text=q_text,
                domain=q_domain,
                student_id=s_id,
                student_name=s_name
            ))
        db.commit()
        print(f"[ROSS-SEARCH Module 2] Seeded {len(DEMO_QUERY_LOGS)} realistic student research search query logs.")

    if db.query(StudentSavedPaper).count() == 0:
        for saved in DEMO_SAVED_PAPERS:
            st = db.query(Student).filter(Student.student_id == saved["student_matric"]).first()
            if st:
                db.add(StudentSavedPaper(
                    student_id=st.id,
                    title=saved["title"],
                    authors=saved["authors"],
                    year=saved["year"],
                    domain=saved["domain"],
                    venue=saved["venue"],
                    abstract=saved["abstract"],
                    pdf_url=saved["pdf_url"],
                    notes=saved["notes"],
                    reading_status=saved["reading_status"],
                    is_downloaded=saved["is_downloaded"]
                ))
        db.commit()
        print(f"[ROSS-SEARCH Module 2] Seeded {len(DEMO_SAVED_PAPERS)} downloaded student research library records.")
