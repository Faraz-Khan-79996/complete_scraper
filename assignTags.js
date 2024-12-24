import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
dotenv.config();

// Initialize OpenAI client with Galadriel API credentials
const openai = new OpenAI({
  apiKey: process.env.GALADRIEL_API_KEY, // Replace with your actual API key
  baseURL: "https://api.galadriel.com/v1", // Galadriel API base URL
});

// Predefined set of tags
const predefinedTags = [
  "data science", "machine learning", "artificial intelligence", "ai", "ml",
  "deep learning", "natural language processing", "computer vision", "ai research",
  "data mining", "big data", "predictive analytics", "data engineering", "data visualization",
  "reinforcement learning", "ai ethics", "neural networks", "tensorflow", "pytorch", 
  "statistical analysis", "time series analysis", "data wrangling", "sql", "r programming", 
  "python", "jupyter notebooks", "hadoop", "spark", "model deployment", "model training", 
  "model evaluation", "feature engineering", "data preprocessing", "business intelligence", 
  "data governance", "data quality", "data warehousing", "ai solutions"
];

// Determine current directory for log file creation
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a log file with a readable date format
const logFileName = `assign_tags_${new Date().toLocaleString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(/[\s,]/g, "-")}.log`;
const logFilePath = path.join(__dirname,"logs","assignTags_logs", logFileName);

function logMessage(message) {
  fs.appendFileSync(logFilePath, `${new Date().toLocaleString()} - ${message}\n`);
}

async function assignTags() {
  try {
    // Step 1: Read data from combined_jobs.json
    const data = fs.readFileSync("./combined_jobs/combined_jobs_no_duplicates.json", "utf-8");
    const jobs = JSON.parse(data);

    if (!jobs || jobs.length === 0) {
      logMessage("No jobs found in the JSON file.");
      console.error("No jobs found in the JSON file.");
      return;
    }

    const results = [];
    let successCount = 0;

    for (const job of jobs) {
      try {
        if (!job.title || !job.job_url) {
          console.log("Skipping File , No job URL or Title ");
          continue; // Skip jobs without a title or URL
        }
        
        console.log("Assigning Tags to : " , job.title);
        // Step 2: Use Galadriel API to generate tags
        const response = await openai.chat.completions.create({
          model: "llama3.1:70b",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that generates relevant tags for job titles.",
            },
            {
              role: "user",
              content: `Generate 2 to 3 relevant tags for the job title: "${job.title}". Out of the tags, choose ONLY ONE from the following predefined list of tags: "Artificial Intelligence", "Machine Learning", "Data Science". Return plain JSON array of tags and only use double quotes.`,
        //       content: `For the job title: "${job.title}",choose ONLY ONE from the following predefined list of categories: "Artificial Intelligence", "Machine Learning", "Data Science". Return tags as a JSON array and only use double quotes.`,
            },
          ],
        });

        const generatedTags = JSON.parse(response.choices[0].message.content);

        // Step 3: Filter tags to only include those from the predefined set
        const matchedTags = generatedTags
          .map(tag => tag.toLowerCase())
          // .filter(tag => predefinedTags.includes(tag));

        // // Ensure we have at least 3 tags or use default if not
        // // if (matchedTags.length < 3) {
        // //   matchedTags.push(...predefinedTags.slice(0, 3 - matchedTags.length)); // Add default tags if needed
        // // }

        // Step 4: Save results
        results.push({
          title: job.title,
          location: job.location || "Not available",
          company: job.company || "Not available",
          job_url: job.job_url,
          site: job.site || "Not available",
          tags: matchedTags,
        });

        successCount++;
      } catch (error) {
        logMessage(`Error processing job title: ${job.title}. Error: ${error.message}`);
        console.log("Error at job title:", job.title);
        console.log("Error msg:", error.message);
      }
      // if(successCount > 1) break
    }

    // Step 5: Write results to a JSON file
    fs.writeFileSync("./processed_jobs/processed_jobs.json", JSON.stringify(results, null, 2));
    logMessage(`Tags have been successfully assigned and saved to processed_jobs.json. Total jobs processed successfully: ${successCount}`);
    console.log("Tags have been successfully assigned and saved to processed_jobs.json.");
  } catch (error) {
    logMessage(`An error occurred: ${error.message}`);
    console.error("An error occurred:", error.message);
  }
}

// Run the script
assignTags();
