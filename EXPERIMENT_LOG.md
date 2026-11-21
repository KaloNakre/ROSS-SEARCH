# Experiment Log: Academic Research & Machine Learning

## Research Focus
- **Domain:** Computer Vision, Defect Segmentation, Fabric Quality Inspection.
- **Application:** Textile Defect Detection on Woven & Knitted Fabrics.
- **Target:** High accuracy, lightweight models capable of edge inference and zero-shot / few-shot generalization to unseen fabric patterns.

---

## Log Entries

### EXP-001: Baseline Defect Segmentation Exploration
- **Date:** 2026-11-15
- **Architecture:** U-Net with ResNet-34 Encoder vs MobileNetV3 backbone.
- **Input Resolution:** 512x512 RGB fabric image patches.
- **Objective:** Evaluate baseline segmentation performance and inference latency on industrial defect classes (hole, stain, knot, snarl, broken end).
- **Evaluation Metrics:** Mean Intersection over Union (mIoU), Dice Similarity Coefficient (DSC), Inference Latency (ms).
- **Integrity Rule:** No synthetic fabric generation used without explicit labeling. Real loom camera captures prioritized.

### EXP-002: Token-Efficient Research Intelligence Architecture
- **Date:** 2026-11-22
- **Objective:** Benchmark prompt compression using RTK and Graphify AST mapping for academic paper literature indexing.
- **Result:** RTK achieved 89.4% token reduction on terminal operations. Graphify successfully indexed 765 nodes across repository without vector store overhead.
