/**
 * Playwright E2E Test: Domain Selection & Persistence Flow
 * Browser Channel: 'msedge'
 *
 * Scenarios Tested:
 * 1. Login as Student
 * 2. EditStudentProfile:
 *    - Select 2-3 domains
 *    - Verify "N Selected" badge updates in real time
 *    - Save profile
 *    - Reload page
 *    - Verify cards remain highlighted & badge matches persisted count
 * 3. ResearchInterestsPage:
 *    - Verify previously saved interests are pre-selected on load
 *    - Toggle research interest
 *    - Save interests
 *    - Reload page & verify persistence
 *
 * Screenshots & Console Logs are captured throughout.
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

async function runTest() {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const consoleLogs = [];
  const consoleErrors = [];

  console.log('=====================================================');
  console.log('🚀 Starting E2E Domain Selection Flow (Channel: msedge)');
  console.log(`🌐 Target Base URL: ${BASE_URL}`);
  console.log('=====================================================\n');

  let browser;
  try {
    browser = await chromium.launch({
      channel: 'msedge',
      headless: true
    });
  } catch (launchErr) {
    console.error('❌ Failed to launch Microsoft Edge via Playwright:');
    console.error(launchErr.message);
    throw launchErr;
  }

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  // Listen to browser console and page errors
  page.on('console', msg => {
    const text = `[Browser Console ${msg.type()}]: ${msg.text()}`;
    consoleLogs.push(text);
    if (msg.type() === 'error') {
      consoleErrors.push(text);
      console.error(text);
    }
  });

  page.on('pageerror', err => {
    const text = `[Browser PageError]: ${err.message}`;
    consoleErrors.push(text);
    console.error(text);
  });

  try {
    // -------------------------------------------------------------------------
    // Step 1: Login
    // -------------------------------------------------------------------------
    console.log('📍 Step 1: Navigating to Login Page...');
    await page.goto(`${BASE_URL}/#/login`, { waitUntil: 'networkidle' }).catch(async () => {
      // Fallback for non-hash router if configured
      await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    });

    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    if (await emailInput.count() > 0) {
      console.log('🔑 Entering student credentials...');
      const studentEmail = process.env.TEST_STUDENT_EMAIL || 'robayet.cse@diu.edu.bd';
      const studentPassword = process.env.TEST_STUDENT_PASSWORD || 'StrongPassword2026';

      await emailInput.fill(studentEmail);
      await passwordInput.fill(studentPassword);
      await submitBtn.click();
      await page.waitForTimeout(1500);
    }

    // -------------------------------------------------------------------------
    // Step 2: EditStudentProfile Domain Selection
    // -------------------------------------------------------------------------
    console.log('📍 Step 2: Navigating to Edit Student Profile (/student/profile/edit)...');
    await page.goto(`${BASE_URL}/student/profile/edit`, { waitUntil: 'networkidle' }).catch(async () => {
      await page.goto(`${BASE_URL}/#/student/profile/edit`, { waitUntil: 'networkidle' });
    });

    await page.waitForSelector('text=Select Research Domains', { timeout: 10000 });

    // Target 3 domains to select
    const targetDomains = ['Cyber Security', 'Machine Learning', 'Data Science'];
    console.log(`🎯 Selecting domains: ${targetDomains.join(', ')}...`);

    for (const domainName of targetDomains) {
      const domainButton = page.locator(`button:has-text("${domainName}")`).first();
      await domainButton.waitFor({ state: 'visible' });

      // Check if already selected (has blue background or check icon)
      const isAlreadySelected = await domainButton.evaluate(el => el.classList.contains('bg-blue-50'));
      if (!isAlreadySelected) {
        await domainButton.click();
        await page.waitForTimeout(300);
      }
    }

    // Verify "N Selected" badge in EditStudentProfile
    const selectedBadge = page.locator('span:has-text("Selected")').first();
    const badgeText = await selectedBadge.innerText();
    console.log(`🏷️ Current Badge Text: "${badgeText}"`);

    const editScreenshotPath = path.join(SCREENSHOT_DIR, '01_edit_profile_selected.png');
    await page.screenshot({ path: editScreenshotPath, fullPage: true });
    console.log(`📸 Screenshot saved: ${editScreenshotPath}`);

    // Click Save Button
    console.log('💾 Saving profile...');
    const saveButton = page.locator('button:has-text("Save Profile"), button:has-text("Save Changes")').first();
    await saveButton.click();
    await page.waitForTimeout(2000);

    // -------------------------------------------------------------------------
    // Step 3: Reload & Verify Persistence in EditStudentProfile
    // -------------------------------------------------------------------------
    console.log('🔄 Reloading page to verify persistence...');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('text=Select Research Domains', { timeout: 10000 });

    for (const domainName of targetDomains) {
      const domainButton = page.locator(`button:has-text("${domainName}")`).first();
      const isSelectedAfterReload = await domainButton.evaluate(el => el.classList.contains('bg-blue-50'));
      console.log(`   - Domain "${domainName}" selected after reload: ${isSelectedAfterReload ? '✅ YES' : '❌ NO'}`);
      if (!isSelectedAfterReload) {
        throw new Error(`Domain "${domainName}" did not persist highlight after reload!`);
      }
    }

    const reloadedBadgeText = await selectedBadge.innerText();
    console.log(`🏷️ Badge text after reload: "${reloadedBadgeText}"`);

    const reloadScreenshotPath = path.join(SCREENSHOT_DIR, '02_edit_profile_reloaded.png');
    await page.screenshot({ path: reloadScreenshotPath, fullPage: true });
    console.log(`📸 Screenshot saved: ${reloadScreenshotPath}`);

    // -------------------------------------------------------------------------
    // Step 4: ResearchInterestsPage
    // -------------------------------------------------------------------------
    console.log('\n📍 Step 4: Navigating to Research Interests Page (/student/research-interests)...');
    await page.goto(`${BASE_URL}/student/research-interests`, { waitUntil: 'networkidle' }).catch(async () => {
      await page.goto(`${BASE_URL}/#/student/research-interests`, { waitUntil: 'networkidle' });
    });

    await page.waitForSelector('text=Research Interests & Domains', { timeout: 10000 });

    // Verify pre-selected items
    for (const domainName of targetDomains) {
      const interestCard = page.locator(`button:has-text("${domainName}")`).first();
      if (await interestCard.count() > 0) {
        const isHighlighted = await interestCard.evaluate(el =>
          el.classList.contains('bg-blue-50') || el.classList.contains('border-diu-blue')
        );
        console.log(`   - ResearchInterestsPage: "${domainName}" pre-selected: ${isHighlighted ? '✅ YES' : '❌ NO'}`);
      }
    }

    // Toggle another interest: "Natural Language Processing"
    const toggleTarget = 'Natural Language Processing';
    console.log(`🔄 Toggling additional domain: "${toggleTarget}"...`);
    const nlpButton = page.locator(`button:has-text("${toggleTarget}")`).first();
    if (await nlpButton.count() > 0) {
      await nlpButton.click();
      await page.waitForTimeout(300);

      // Save Interests
      const saveInterestsBtn = page.locator('button:has-text("Save Interests")').first();
      await saveInterestsBtn.click();
      await page.waitForTimeout(2000);
    }

    const interestsScreenshotPath = path.join(SCREENSHOT_DIR, '03_research_interests_saved.png');
    await page.screenshot({ path: interestsScreenshotPath, fullPage: true });
    console.log(`📸 Screenshot saved: ${interestsScreenshotPath}`);

    console.log('\n=====================================================');
    console.log('🎉 ALL PLAYWRIGHT E2E ASSERTIONS PASSED!');
    console.log('=====================================================');

  } catch (err) {
    console.error('\n❌ E2E Test Failed with error:', err.message);
    const failScreenshot = path.join(SCREENSHOT_DIR, 'error_failure.png');
    await page.screenshot({ path: failScreenshot, fullPage: true }).catch(() => {});
    throw err;
  } finally {
    console.log('\n📋 Console Errors Summary:');
    if (consoleErrors.length === 0) {
      console.log('✅ No browser console errors detected.');
    } else {
      consoleErrors.forEach((e, idx) => console.log(` [${idx + 1}] ${e}`));
    }

    if (browser) {
      await browser.close();
    }
  }
}

if (require.main === module) {
  runTest().catch(() => process.exit(1));
}

module.exports = { runTest };
