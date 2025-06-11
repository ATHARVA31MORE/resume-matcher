import puppeteer from 'puppeteer';

async function scrapeLinkedIn(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // ✅ STEP 1: Set your LinkedIn session cookie (get this from browser dev tools after login)
    await page.setCookie({
      name: 'li_at',
      value: 'AQEDAUQQtFEEM1IOAAABlwKsvZYAAAGXU6619lYAiuW2mlZR1YFuZ5pT_ukTev-pFQ4RWSHYE3FOZyJRen2wz0qMApggNZDpbYh3oCNvc6uVRQ-TviyN4lvnlCJJ7hb3rW0B5KmYCBZ7vQfyBqKl3cgn',  // 👈 Paste your actual cookie here
      domain: '.linkedin.com'
    });

    // ✅ STEP 2: Visit the LinkedIn profile
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // ✅ STEP 3: Wait for content that exists on logged-in view
    await page.waitForSelector('.pv-text-details__left-panel', { timeout: 15000 });

    // ✅ STEP 4: Extract profile data
    const profileData = await page.evaluate(() => {
      const getText = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.innerText.trim() : '';
      };

      const getAllTexts = (selector) =>
        Array.from(document.querySelectorAll(selector)).map(el => el.innerText.trim());

      return {
        summary: getText('.pv-about__summary-text, .mt2.artdeco-card'),
        experience: getAllTexts('#experience-section li .t-bold span[aria-hidden="true"]'),
        education: getAllTexts('#education-section li .t-bold span[aria-hidden="true"]'),
        skills: getAllTexts('.pv-skill-category-entity__name-text, .pvs-entity__skill-name span[aria-hidden="true"]')
      };
    });

    await browser.close();
    return profileData;

  } catch (err) {
    console.error("❌ Scraper error:", err);
    await browser.close();
    return null;
  }
}
