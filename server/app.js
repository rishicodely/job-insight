import express from "express";
import { scrapeJobs } from "./scraper/scrapeJobs.js";
import { extractSkills } from "./services/extractSkills.js";
import dotenv from "dotenv";
import { aggregateSkills } from "./aggregateSkills.js";
import cors from "cors";

dotenv.config({ path: "../.env" });
const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/test-scrape", async (req, res) => {
  try {
    const jobs = await scrapeJobs();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.get("/insights", async (req, res) => {
  try {
    const jobs = await scrapeJobs();
    const processedJobs = [];
    for (const job of jobs) {
      console.log(`Processing: ${job.title}...`);

      const skills = await extractSkills(job.description);
      processedJobs.push({
        title: job.title,
        skills: skills,
      });

      console.log("Sleeping for 5 seconds to avoid rate limits...");
      await sleep(5000);
    }
    const aggregated = aggregateSkills(processedJobs);

    const sorted = Object.entries(aggregated)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
