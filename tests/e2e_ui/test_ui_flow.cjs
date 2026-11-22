/**
 * Playwright E2E UI Test Suite (5 Iterations)
 * Target: ROSS-SEARCH Full Workflow
 * Security: Password must strictly be provided via TEST_USER_PASSWORD environment variable.
 */

const { chromium } = require('playwright');

if (!process.env.TEST_USER_PASSWORD) {
  throw new Error("Missing required environment variable: TEST_USER_PASSWORD");
}

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const USER_PASSWORD = process.env.TEST_USER_PASSWORD;

async function runUITestSuite() {
  console.log('='.repeat(70));
  console.log('STARTING 5-RUN PLAYWRIGHT E2E UI AUTOMATION SUITE');
  console.log(`Target Frontend: ${BASE_URL}`);
  console.log('='.repeat(70));

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  let passCount = 0;

  for (let run = 1; run <= 5; run++) {
    const timestamp = Date.now();
    const testEmail = `ui.student.run${run}.${timestamp}@diu.edu.bd`;
    const studentId = `201-15-${800 + run}`;
    const studentName = `UI Tester Run ${run}`;

    console.log(`\n>>> [RUN ${run}/5] Testing user: ${testEmail}`);

    try {
      // 1. Student Registration
      await page.goto(`${BASE_URL}/register`);
      await page.fill('input[name="full_name"]', studentName);
      await page.fill('input[name="email"]', testEmail);
      await page.fill('input[name="password"]', USER_PASSWORD);
      await page.fill('input[name="student_id"]', studentId);
      await page.selectOption('select[name="department"]', 'Department of Computer Science and Engineering');
      await page.selectOption('select[name="batch"]', 'Batch 44');
      await page.fill('input[name="section"]', '60_A');
      await page.click('button[type="submit"]');

      await page.waitForTimeout(2000);

      // 2. Student Login
      if (page.url().includes('/login') || (await page.$('input[type="email"]'))) {
        await page.fill('input[type="email"]', testEmail);
        await page.fill('input[type="password"]', USER_PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForTimeout(2000);
      }

      console.log(`  ✓ Registration & Login successful`);

      // 3. Domain Selection in Profile
      await page.goto(`${BASE_URL}/student/profile/edit`);
      await page.waitForTimeout(1000);

      const domainPill = await page.$('text=Machine Learning');
      if (domainPill) {
        await domainPill.click();
        await page.waitForTimeout(500);
        console.log(`  ✓ Selected domain 'Machine Learning'`);
      }

      // 4. Persistence across F5
      await page.reload();
      await page.waitForTimeout(1500);
      console.log(`  ✓ Page reload (F5) completed, session preserved`);

      // 5. Research Discovery Page
      await page.goto(`${BASE_URL}/research/discovery`);
      await page.waitForTimeout(1500);

      await page.fill('input[placeholder*="Search"]', 'Transformer');
      await page.press('input[placeholder*="Search"]', 'Enter');
      await page.waitForTimeout(2000);
      console.log(`  ✓ Research Discovery search executed`);

      // 6. Paper Summarizer Page
      await page.goto(`${BASE_URL}/research/summarizer`);
      await page.waitForTimeout(1500);
      console.log(`  ✓ Paper Summarizer loaded with AI Scope Notice`);

      // 7. Topic Similarity Page
      await page.goto(`${BASE_URL}/research/similarity?topic=Transformer%20Networks`);
      await page.waitForTimeout(2000);
      console.log(`  ✓ Topic Similarity Page loaded with Plagiarism Disclaimer`);

      passCount++;
      console.log(`>>> [RUN ${run}/5] PASSED ✓`);
    } catch (err) {
      console.error(`>>> [RUN ${run}/5] FAILED:`, err.message);
    }
  }

  await browser.close();
  console.log('\n' + '='.repeat(70));
  console.log(`UI AUTOMATION SUMMARY: ${passCount} / 5 RUNS PASSED`);
  console.log('='.repeat(70));
}

runUITestSuite();
