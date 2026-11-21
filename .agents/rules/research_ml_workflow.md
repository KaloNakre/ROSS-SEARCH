# Research & Machine Learning Integrity Protocol

## 1. Academic & Experimental Honesty
- **No Fabrication:** Never invent citations, authors, benchmarks, experimental results, or model accuracy metrics.
- **Primary Source Grounding:** Cite verified DOIs, official arXiv papers, and benchmark dataset repositories.

## 2. Fabric Defect Research Protocol
- **Dataset Preservation:** The raw textile defect dataset (`E:\RIR\Dataset-20261023T052841Z-1-001\Dataset`) is an immutable research asset. Never delete, truncate, or overwrite original images or ground-truth masks.
- **Audit Logging:** Maintain all dataset transformations, mask cleanups, and patch extractions in derived output directories with logged provenance.
- **Leakage Prevention:** Fabric rolls, looms, and pattern categories must never overlap between training and evaluation splits to ensure genuine generalizability to unseen fabrics.
- **Metric Standardization:** All defect segmentation evaluations must report Mean Intersection over Union (mIoU) and Dice Similarity Coefficient (DSC) with standard thresholds.
