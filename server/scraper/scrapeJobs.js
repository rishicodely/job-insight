import puppeteer from "puppeteer";

export async function scrapeJobs() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
  });

  const context = await browser.createBrowserContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  });

  const page = await context.newPage();

  await page.goto("https://remoteok.com/remote-dev-jobs", {
    waitUntil: "networkidle2",
  });

  await page.waitForSelector("tr.job");

  const jobs = await page.evaluate(() => {
    const jobRows = document.querySelectorAll("tr.job");

    const results = [];

    jobRows.forEach((job) => {
      const title = job.querySelector("h2")?.innerText;
      const description = job.innerText;

      if (title) {
        results.push({ title, description });
      }
    });

    return results.slice(0, 10);
  });

  await browser.close();
  return jobs;
}
