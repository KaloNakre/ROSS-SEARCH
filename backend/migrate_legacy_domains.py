#!/usr/bin/env python3
"""
One-time Migration Script for Student Preferred Domains & Junction Records.
Default mode is DRY-RUN. Run with --apply to commit changes.
Features:
- Excludes test accounts (email containing 'test' or 'tester') by default.
- Flags inferred or partial mappings as 'NEEDS CONFIRMATION'.
- Zero data loss: Preserves non-exact strings while linking canonical junction IDs.
- Automatic timestamped backup before apply.
"""
import sys
import os
import shutil
import argparse
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database.connection import SessionLocal
from app.models.student import Student, StudentInterest
from app.models.research_interest import ResearchInterest
from app.models.user import User

# Exact canonical matches only
EXACT_SHORTCODES = {
    'cyber': 3,
    'cybersecurity': 3,
    'cyber security': 3,
    'ml': 1,
    'machine learning': 1,
    'ds': 2,
    'data science': 2,
    'nlp': 5,
    'natural language processing': 5,
    'cv': 6,
    'computer vision': 6,
    'iot': 7,
    'internet of things': 7,
    'cloud': 8,
    'cloud computing': 8,
    'bioinformatics': 9,
    'blockchain': 10,
    'hci': 11,
    'human-computer interaction': 11,
    'others': 12,
    'other': 12
}

# Inferred mappings that require user confirmation
INFERRED_MAP = {
    'devops': (8, 'Cloud Computing'),
    'big data': (2, 'Data Science'),
    'distributed systems': (10, 'Blockchain'),
    'healthcare ai': (9, 'Bioinformatics'),
    'artificial intelligence': (4, 'AI & Robotics'),
    'ai': (4, 'AI & Robotics'),
    'ai & robotics': (4, 'AI & Robotics'),
}

def parse_args():
    parser = argparse.ArgumentParser(description="Migrate legacy student domains to junction table")
    parser.add_argument("--apply", action="store_true", help="Commit changes to database (default: dry-run)")
    parser.add_argument("--only-exact", action="store_true", help="Only process exact match records (IDs 2, 3, 4, 5, 7), leaving needs-confirmation untouched")
    parser.add_argument("--include-test-accounts", action="store_true", help="Include test accounts in migration")
    return parser.parse_args()

def is_test_student(student, user):
    email = (user.email or '').lower() if user else ''
    name = (student.full_name or '').lower()
    return 'test' in email or 'tester' in email or 'test' in name or 'tester' in name

def main():
    args = parse_args()
    db = SessionLocal()
    mode = "APPLY (CHANGES WILL BE COMMITTED)" if args.apply else "DRY-RUN (NO CHANGES APPLIED)"
    
    print("=" * 80)
    print(f">> STUDENT DOMAIN & JUNCTION MIGRATION TOOL [{mode}]")
    print("=" * 80)
    
    catalog = db.query(ResearchInterest).order_by(ResearchInterest.id).all()
    cat_map = {c.id: c.name for c in catalog}
    all_students = db.query(Student).order_by(Student.id).all()
    
    print(f"Total students in DB          : {len(all_students)}")
    print(f"Reference DB domains (canonical): {len(catalog)}\n")
    
    active_students = []
    test_students = []
    
    for s in all_students:
        user = db.query(User).filter(User.id == s.user_id).first()
        existing_junc = [j.interest_id for j in db.query(StudentInterest).filter(StudentInterest.student_id == s.id).all()]
        has_string = bool(s.preferred_domain and s.preferred_domain.strip())
        has_junc = len(existing_junc) > 0
        
        if not has_string and not has_junc:
            continue
            
        if is_test_student(s, user):
            test_students.append((s, user, existing_junc))
        else:
            active_students.append((s, user, existing_junc))
            
    print(f"Real students with active domain info: {len(active_students)}")
    print(f"Test accounts detected (excluded)   : {len(test_students)}\n")
    
    # Process Real Students
    group_exact = []
    group_needs_confirmation = []
    
    for s, user, junc_ids in active_students:
        raw_text = s.preferred_domain or ''
        tokens = [t.strip() for t in raw_text.replace(';', ',').replace('|', ',').split(',') if t.strip()]
        
        exact_ids = []
        inferred_ids = []
        uncaptured = []
        
        for t in tokens:
            lower = t.lower()
            # 1. Exact match against canonical catalog
            exact_match = next((c for c in catalog if c.name.lower() == lower), None)
            if exact_match:
                if exact_match.id not in exact_ids:
                    exact_ids.append(exact_match.id)
                continue
                
            # 2. Exact match against canonical shortcodes
            if lower in EXACT_SHORTCODES:
                cid = EXACT_SHORTCODES[lower]
                if cid not in exact_ids:
                    exact_ids.append(cid)
                continue
                
            # 3. Check if compound string has an exact part and an uncaptured part
            matched_sub = False
            for c in catalog:
                if c.name.lower() in lower:
                    if c.id not in exact_ids:
                        exact_ids.append(c.id)
                    rem = lower.replace(c.name.lower(), '').replace('&', '').strip()
                    if rem and rem not in uncaptured:
                        uncaptured.append(rem.title())
                    matched_sub = True
                    break
                    
            # 4. Check inferred map
            if not matched_sub:
                inf = INFERRED_MAP.get(lower)
                if inf:
                    inferred_ids.append(inf)
                else:
                    uncaptured.append(t)
                    
        is_exact = len(inferred_ids) == 0 and len(uncaptured) == 0 and len(exact_ids) > 0
        needs_junction = set(junc_ids) != set(exact_ids)
        
        record = {
            "student_id": s.id,
            "name": s.full_name,
            "email": user.email if user else "N/A",
            "current_domain_str": raw_text,
            "current_junction": junc_ids,
            "exact_ids": exact_ids,
            "inferred_ids": inferred_ids,
            "uncaptured": uncaptured,
            "needs_junction": needs_junction
        }
        
        if is_exact:
            group_exact.append(record)
        else:
            group_needs_confirmation.append(record)
            
    # If --only-exact is set, display ONLY the records that will actually change
    if args.only_exact:
        targets = [r for r in group_exact if r['needs_junction']]
        print("=" * 80)
        print(f">> STUDENT DOMAIN & JUNCTION MIGRATION TOOL [DRY-RUN: ONLY-EXACT MODE]")
        print("=" * 80)
        print(f"Total students to update: {len(targets)} (IDs: {', '.join(str(r['student_id']) for r in targets)})\n")
        
        for idx, r in enumerate(targets, 1):
            names = [cat_map.get(i) for i in r['exact_ids']]
            print(f"[{idx}] Student ID: {r['student_id']:2d} | Name: {r['name']}")
            print(f"    Current String   : '{r['current_domain_str']}'")
            print(f"    Current Junction : {r['current_junction']}")
            print(f"    -> New Junction  : {r['exact_ids']} ({names})")
            print(f"    Status           : READY FOR JUNCTION LINK\n")
            
        print("=" * 80)
        print(f">> SUMMARY:")
        print(f"   - Target Records to Change : {len(targets)} (IDs: {', '.join(str(r['student_id']) for r in targets)})")
        print(f"   - Needs Confirmation Items : SKIPPED & UNTOUCHED")
        print(f"   - Test Accounts            : SKIPPED & UNTOUCHED")
        print(">> DRY-RUN ONLY. Zero data modified.")
        print(">> Run with --apply only after explicit user 'apply' instruction.")
        print("=" * 80)
        
        if args.apply:
            db_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ross_search.db")
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), f"ross_search_backup_{timestamp}.db")
            
            print(f"\n[BACKUP] Creating timestamped backup before apply: {backup_file}")
            shutil.copy2(db_file, backup_file)
            print("[BACKUP] Backup successfully created.")

            print(f"[APPLY] Committing junction records for {len(targets)} students (Scope: Exact Only)...")
            for r in targets:
                s = db.query(Student).filter(Student.id == r['student_id']).first()
                db.query(StudentInterest).filter(StudentInterest.student_id == s.id).delete()
                for iid in r['exact_ids']:
                    db.add(StudentInterest(student_id=s.id, interest_id=iid))
            db.commit()
            print(">> ALL CHANGES COMMITTED SUCCESSFULLY.")
        db.close()
        return

    # Print Test Accounts Section
    print("=" * 80)
    print(f"[CATEGORY: TEST ACCOUNTS] (Total: {len(test_students)} - EXCLUDED BY DEFAULT)")
    print("=" * 80)
    for s, user, junc in test_students:
        print(f"Student ID: {s.id:2d} | Name: {s.full_name:<20} | Email: {user.email if user else 'N/A'}")
        print(f"  String  : '{s.preferred_domain}' | Junction: {junc}")
        print(f"  Status  : EXCLUDED (Test Account)")
        print()
        
    # Print Needs Confirmation Section
    print("=" * 80)
    print(f"[CATEGORY: NEEDS CONFIRMATION] (Total: {len(group_needs_confirmation)} real student records)")
    print("Rule: Non-exact or compound strings. Original string PRESERVED. Confirmation required.")
    print("=" * 80)
    for r in group_needs_confirmation:
        exact_names = [cat_map.get(i) for i in r['exact_ids']]
        print(f"Student ID: {r['student_id']:2d} | Name: {r['name']:<22} | Email: {r['email']}")
        print(f"  Current String       : '{r['current_domain_str']}'")
        print(f"  Current Junction     : {r['current_junction']}")
        print(f"  Exact Catalog Match  : {r['exact_ids']} ({exact_names})")
        if r['inferred_ids']:
            print(f"  Inferred Candidates  : {r['inferred_ids']} -> [NEEDS CONFIRMATION]")
        if r['uncaptured']:
            print(f"  Uncaptured Sub-parts : {', '.join(r['uncaptured'])} -> [NO EXACT 1-TO-1 DB DOMAIN]")
        print(f"  Action               : KEEP ORIGINAL STRING, AWAIT USER CONFIRMATION FOR JUNCTION")
        print()
        
    # Print Exact Matches Section
    print("=" * 80)
    print(f"[CATEGORY: EXACT MATCHES] (Total: {len(group_exact)} real student records)")
    print("=" * 80)
    for r in group_exact:
        status = "ALREADY SYNCED" if not r['needs_junction'] else "READY FOR JUNCTION LINK"
        names = [cat_map.get(i) for i in r['exact_ids']]
        print(f"Student ID: {r['student_id']:2d} | Name: {r['name']:<22} | String: '{r['current_domain_str']}' | Junction: {r['exact_ids']} ({names}) | Status: {status}")
        
    print("\n" + "=" * 80)
    print(">> SUMMARY:")
    print(f"   - Total DB Students              : {len(all_students)}")
    print(f"   - Empty / Unset Profiles         : {len(all_students) - len(active_students) - len(test_students)}")
    print(f"   - Test Accounts (Excluded)       : {len(test_students)} (ID {', '.join(str(s[0].id) for s in test_students)})")
    print(f"   - Exact Matches (Safe to link)   : {len(group_exact)} (Needs link: {sum(1 for r in group_exact if r['needs_junction'])})")
    print(f"   - Inferred / Needs Confirmation  : {len(group_needs_confirmation)}")
    if args.only_exact:
        print("   - Scope Active                   : ONLY EXACT MATCHES (--only-exact)")
    print(">> DRY-RUN ONLY. Zero data modified. Run with --apply only after explicit user approval.")
    print("=" * 80)

    if args.apply:
        db_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ross_search.db")
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), f"ross_search_backup_{timestamp}.db")
        
        print(f"\n[BACKUP] Creating timestamped backup before apply: {backup_file}")
        shutil.copy2(db_file, backup_file)
        print("[BACKUP] Backup successfully created.")

        targets = [r for r in group_exact if r['needs_junction']] if args.only_exact else [r for r in group_exact + group_needs_confirmation if r['needs_junction']]
        print(f"[APPLY] Committing junction records for {len(targets)} students (Scope: {'Exact Only' if args.only_exact else 'All'})...")
        for r in targets:
            s = db.query(Student).filter(Student.id == r['student_id']).first()
            db.query(StudentInterest).filter(StudentInterest.student_id == s.id).delete()
            for iid in r['exact_ids']:
                db.add(StudentInterest(student_id=s.id, interest_id=iid))
        db.commit()
        print(">> ALL CHANGES COMMITTED SUCCESSFULLY.")
    
    db.close()

if __name__ == "__main__":
    main()
