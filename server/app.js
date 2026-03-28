import express from "express";
import { scrapeJobs } from "./scraper/scrapeJobs.js";
import { extractSkills } from "./services/extractSkills.js";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
const app = express();

app.get("/test-scrape", async (req, res) => {
  try {
    const jobs = await scrapeJobs();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.get("/test-ai", async (req, res) => {
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
    res.json(processedJobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on 5000"));
