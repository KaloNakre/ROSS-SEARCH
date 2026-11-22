import sqlite3

db = r'E:\Thesis\backend\ross_search.db'
conn = sqlite3.connect(f'file:{db}?mode=ro', uri=True)
c = conn.cursor()
print("=== ross_search.db Verification (mode=ro) ===")
for t in ['users', 'students', 'supervisors', 'previous_projects', 'shared_paper_knowledge', 'research_interests']:
    c.execute(f'SELECT COUNT(*) FROM "{t}"')
    print(f'  {t}: {c.fetchone()[0]}')
c.execute('PRAGMA integrity_check')
print('Integrity:', c.fetchone()[0])
conn.close()
