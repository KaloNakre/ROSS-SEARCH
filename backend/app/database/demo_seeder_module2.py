from sqlalchemy.orm import Session
from app.models.research_knowledge import PreviousProject, SharedPaperKnowledge

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
        "title": "Deep Residual Learning for Image Recognition (ResNet)",
        "authors": "Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun",
        "year": 2016,
        "journal_or_conference": "CVPR 2016",
        "domain": "Computer Vision",
        "uploaded_by_name": "Farhan Islam",
        "uploaded_by_id": "201-15-205",
        "file_name": "Deep_Residual_Learning_ResNet.pdf",
        "abstract": "Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs.",
        "research_problem": "When deeper networks start converging, a degradation problem is exposed: with network depth increasing, accuracy gets saturated and then degrades rapidly due to vanishing/exploding gradients.",
        "research_objective": "1. Solve the degradation problem in ultra-deep networks up to 152 layers.\n2. Formulate identity shortcut connections that introduce no additional parameters or computational complexity.\n3. Win 1st place in ImageNet classification, detection, and localization challenges.",
        "proposed_methodology": "Residual building blocks with skip connections F(x) + x, batch normalization after convolutions, global average pooling, and SGD optimization.",
        "dataset_description": "ImageNet 2012 classification dataset (1.28 million training images across 1,000 classes) and COCO detection dataset.",
        "models_algorithms": "ResNet-50, ResNet-101, ResNet-152, Bottleneck architectures, Batch Normalization.",
        "important_findings": "ResNet-152 achieved 3.57% top-5 error on the ImageNet test set, winning 1st place in the ILSVRC 2015 competition and outperforming human-level recognition.",
        "limitations": "Diminishing marginal returns on depth alone without increased layer width; feature reusability can be constrained compared to dense connections.",
        "research_gap": "Optimal residual weighting in mixed-precision mobile architectures and low-contrast medical imaging.",
        "future_directions": "Wide ResNets, DenseNets, and integration of spatial attention mechanisms."
    }
]

def seed_module2_demo_data(db: Session):
    """Seed initial previous departmental projects and shared paper knowledge."""
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
