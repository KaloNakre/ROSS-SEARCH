"""
Extract exact endpoint specifications directly from OpenAPI schema.
"""
import sys
import os
sys.path.insert(0, r'E:\Thesis\backend')

from app.main import app

schema = app.openapi()
paths = schema.get("paths", {})

print(f"Total OpenAPI Paths: {len(paths)}")
print(f"{'Path':<45} | {'Method':<8} | {'Auth Required':<14} | {'Tags'}")
print("=" * 95)

rows = []
for path, methods_dict in paths.items():
    for method, spec in methods_dict.items():
        if method.lower() in ["get", "post", "put", "delete", "patch"]:
            security = spec.get("security", [])
            auth_required = bool(security)
            tags = ",".join(spec.get("tags", [])) or "General"
            rows.append((path, method.upper(), auth_required, tags))

for p, m, a, t in sorted(rows, key=lambda x: (x[0], x[1])):
    print(f"{p:<45} | {m:<8} | {str(a):<14} | {t}")

print(f"\nTotal API Operations: {len(rows)}")
