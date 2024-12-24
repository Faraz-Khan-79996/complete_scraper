import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up the logs directory if it doesn't exist
const logDirectory = path.join(__dirname, 'logs/combine_logger');
if (!await fs.access(logDirectory).catch(() => false)) {
  await fs.mkdir(logDirectory, { recursive: true });
}

// Get the current date and time to format the log filename
const currentDate = new Date();
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const timeStamp = `${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}`;
const logFilename = path.join(
  logDirectory, 
  `combine_log_${monthNames[currentDate.getMonth()]}-${currentDate.getDate()}-${currentDate.getFullYear()}_${timeStamp}.log`
);

// Log function
const logMessage = async (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;

  // Append the message to the log file
  await fs.appendFile(logFilename, logMessage, "utf8");
};

try {
  // Load the config.json file
  const configPath = path.join(__dirname, "config.json");
  const config = JSON.parse(await fs.readFile(configPath, "utf8"));
  await logMessage("Config.json file loaded successfully.");

  // Get the array size from config.json
  const arraySize = config.array_size;

  // Array to store all job data
  const allJobs = [];

  // Read and combine all jobs*.json files
  for (let i = 1; i <= arraySize; i++) {
    const filePath = path.join(__dirname, "/jobs", `jobs${i}.json`);

    try {
      // Read and parse the JSON file
      const fileContent = await fs.readFile(filePath, "utf8");
      const jobData = JSON.parse(fileContent);
      
      // Combine the data into the allJobs array
      allJobs.push(...jobData);
      
      await logMessage(`Successfully read and added data from jobs${i}.json`);
    } catch (err) {
      await logMessage(`Error reading jobs${i}.json: ${err.message}`);
      console.error(`Error reading jobs${i}.json:`, err.message);
    }
  }

  // Output the combined data (optional)
  await logMessage(`Total jobs combined: ${allJobs.length}`);

  // Save the combined data to a new file
  const outputFilePath = path.join(__dirname, "combined_jobs", "combined_jobs.json");
  await fs.writeFile(outputFilePath, JSON.stringify(allJobs, null, 2), "utf8");
  await logMessage(`All jobs combined and saved to ${outputFilePath}`);
  console.log(`All jobs combined and saved to ${outputFilePath}`);

} catch (err) {
  await logMessage(`An error occurred: ${err.message}`);
  console.error("An error occurred:", err.message);
}
