"""
Master E2E runner that waits for socket port 8000 to completely clear
before starting uvicorn, executes tests, and cleans up.
Security: Reads passwords strictly from environment variables without defaults.
"""
import os
import sys
import time
import socket
import urllib.request
import subprocess
import sqlite3

if "TEST_USER_PASSWORD" not in os.environ:
    raise RuntimeError("Missing required environment variable: TEST_USER_PASSWORD")
if "SUPERVISOR_PASSWORD" not in os.environ:
    raise RuntimeError("Missing required environment variable: SUPERVISOR_PASSWORD")

TEST_DB_PATH = r'E:\Thesis\backend\test_e2e_check.db'
ORIGINAL_DB_PATH = r'E:\Thesis\backend\ross_search.db'

def wait_port_free(port=8000, max_wait=30):
    start = time.time()
    while time.time() - start < max_wait:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('127.0.0.1', port)) != 0:
                return True
        time.sleep(1)
    return False

print("Ensuring port 8000 is completely released by OS...")
if not wait_port_free(8000, 30):
    print("Warning: Port 8000 still in use.")
else:
    print("Port 8000 is confirmed FREE ✓")

if os.path.exists(TEST_DB_PATH):
    try:
        os.remove(TEST_DB_PATH)
    except Exception:
        pass

env = os.environ.copy()
env['DATABASE_URL'] = 'sqlite:///./test_e2e_check.db'

print("\n=== STEP 1: Starting Uvicorn on Isolated Test DB ===")
server = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000"],
    cwd=r"E:\Thesis\backend",
    env=env,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True
)

boot_ok = False
for _ in range(15):
    time.sleep(1)
    try:
        with urllib.request.urlopen("http://127.0.0.1:8000/docs", timeout=2) as r:
            if r.status == 200:
                print("Backend booted successfully: HTTP 200 ✓")
                boot_ok = True
                break
    except Exception:
        pass

if not boot_ok:
    print("Failed to boot uvicorn.")
    server.terminate()
    out, _ = server.communicate()
    print("Server Log:", out)
    sys.exit(1)

print("\n=== STEP 2 & 3: Running 5-Pass Automation Suite ===")
test_res = subprocess.run(
    [sys.executable, r"E:\Thesis\tests\e2e_api\test_modules_e2e.py"],
    cwd=r"E:\Thesis",
    env=env,
    capture_output=True,
    text=True
)

print(test_res.stdout)
if test_res.stderr:
    print("Test Stderr:", test_res.stderr)

print("\n=== Stopping Test Server ===")
server.terminate()
try:
    srv_out, _ = server.communicate(timeout=6)
except Exception:
    server.kill()
    srv_out, _ = server.communicate()

# Server startup logs
print("\n--- Server Boot Logs ---")
for line in srv_out.splitlines()[:15]:
    if not any(k in line.lower() for k in ["password", "$2b$", "hash"]):
        print(line)

# Remove test DB
if os.path.exists(TEST_DB_PATH):
    try:
        os.remove(TEST_DB_PATH)
        print(f"\nIsolated Test DB deleted: {TEST_DB_PATH} ✓")
    except Exception as e:
        print(f"\nTest DB cleanup deferred: {e}")

# Original DB audit
print("\n=== Original ross_search.db Integrity Audit ===")
if os.path.exists(ORIGINAL_DB_PATH):
    size = os.path.getsize(ORIGINAL_DB_PATH)
    mtime = time.ctime(os.path.getmtime(ORIGINAL_DB_PATH))
    print(f"Original DB Size: {size} bytes")
    print(f"Original DB Last Modified: {mtime}")
    
    conn = sqlite3.connect(f"file:{ORIGINAL_DB_PATH}?mode=ro", uri=True)
    c = conn.cursor()
    counts = {}
    for tbl in ["users", "students", "supervisors", "previous_projects", "shared_paper_knowledge", "research_interests"]:
        c.execute(f"SELECT COUNT(*) FROM \"{tbl}\"")
        counts[tbl] = c.fetchone()[0]
    conn.close()
    print("Original DB Row Counts (read-only verification):")
    for k, v in counts.items():
        print(f"  {k}: {v}")
else:
    print("ERROR: Original DB not found!")
