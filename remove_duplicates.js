import fs from 'fs/promises';
import path from 'path';

// Get the current directory
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Path to the combined jobs JSON file
const inputFilePath = path.join(__dirname, 'combined_jobs', 'combined_jobs.json');
const outputFilePath = path.join(__dirname, 'combined_jobs', 'combined_jobs_no_duplicates.json');

// Create the logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs', 'removeDuplicates_logs');
await fs.mkdir(logsDir, { recursive: true });

// Get the current date and time
const now = new Date();
const year = now.getFullYear();
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthName = monthNames[now.getMonth()]; // Get the current month name
const day = String(now.getDate()).padStart(2, '0'); // Pad day with leading zero if needed
const hours = String(now.getHours()).padStart(2, '0'); // Pad hours with leading zero if needed
const minutes = String(now.getMinutes()).padStart(2, '0'); // Pad minutes with leading zero if needed
const seconds = String(now.getSeconds()).padStart(2, '0'); // Pad seconds with leading zero if needed

// Generate the log file name
const logFileName = `remove_duplicates_${monthName}-${day}-${year}_${hours}-${minutes}-${seconds}.log`;
const logFilePath = path.join(logsDir, logFileName);

// Function to log messages to both console and log file
async function log(message) {
  const logMessage = `[${new Date().toISOString()}] ${message}`;
  console.log(logMessage); // Log to console
  try {
    await fs.appendFile(logFilePath, logMessage + '\n'); // Log to file
  } catch (err) {
    console.error('Failed to write to log file:', err);
  }
}

try {
  // Read the combined jobs JSON file
  const fileContent = await fs.readFile(inputFilePath, 'utf8');
  const jobs = JSON.parse(fileContent);

  // Log the number of jobs before deduplication
  await log(`Total jobs before deduplication: ${jobs.length}`);

  // Create a Set to store unique job titles and URLs
  const seenJobs = new Set();

  // Filter jobs to remove duplicates
  const uniqueJobs = jobs.filter(job => {
    const uniqueKey = `${job.title}_${job.job_url}`; // Combine job title and URL as a unique key
    if (seenJobs.has(uniqueKey)) {
      return false; // Skip if the job is already seen
    } else {
      seenJobs.add(uniqueKey); // Add the unique key to the Set
      return true; // Include this job
    }
  });

  // Log the number of jobs after deduplication
  await log(`Total jobs after deduplication: ${uniqueJobs.length}`);

  // Save the unique jobs to a new file
  await fs.writeFile(outputFilePath, JSON.stringify(uniqueJobs, null, 2), 'utf8');

  // Log the path of the output file
  await log(`Unique jobs saved to ${outputFilePath}`);
} catch (err) {
  // Log any errors
  await log(`Error: ${err.message}`);
}
