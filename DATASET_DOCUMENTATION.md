# Dataset Documentation: Fabric Defect Research

## 1. Research Overview
- **Project Scope:** High-precision automated visual defect detection, localization, and binary/multi-class segmentation on textile surfaces.
- **Data Location:** `E:\RIR\Dataset-20261023T052841Z-1-001\Dataset`
- **Integrity Principles:**
  - Original images and ground-truth masks are strictly preserved as immutable reference assets.
  - No destructive deletion or in-place modification of raw defect captures is permitted.
  - Any transformation, augmentation, or mask cleanup must write to separate derived folders with audit trails.

## 2. Defect Categories & Classes
1. **Hole / Tear:** Structural fabric rupture exposing background.
2. **Oil Stain / Spot:** Foreign substance discoloration on warp/weft yarns.
3. **Broken Yarn / Pick:** Missing or severed thread creating continuous linear irregularity.
4. **Knot / Slub:** Excessive yarn thickness or tying irregularity.
5. **Snarl / Loose Warp:** Tangled slack yarn loops on fabric surface.

## 3. Data Leakage Prevention Protocol
To guarantee scientifically sound model generalization to unseen fabric styles:
- **Loom & Roll Separation:** Images from the same textile roll or loom batch must NOT cross between training and test sets.
- **Pattern Stratification:** If plain weave, twill, and jacquard textures are present, unseen pattern validation splits must be strictly isolated.
- **Mask Integrity Checks:**
  - Binary masks must adhere strictly to `{0, 255}` (or `{0, 1}`) intensity ranges.
  - No thresholding artifacts or anti-aliased gray borders in ground-truth masks.
  - Bounding box annotations must tightly enclose defect regions without clipping.
