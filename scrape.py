import json
import os
import logging
from jobspy import scrape_jobs
from datetime import datetime

# Create the jobs directory if it doesn't exist
if not os.path.exists('jobs'):
    os.makedirs('jobs')

# Set up the logs directory if it doesn't exist
log_directory = 'logs/python_scrape_logs'
if not os.path.exists(log_directory):
    os.makedirs(log_directory)

# Get the current date and time to format the log filename
current_date = datetime.now()
log_filename = os.path.join(
    log_directory, 
    f"scrape_log_{current_date.strftime('%d-%B-%Y_%H-%M-%S')}.log"
)

# Configure logger
logging.basicConfig(
    filename=log_filename,
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
)

logger = logging.getLogger()

# Log to console as well
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

# Load search terms and size from config.json
with open('config.json', 'r') as config_file:
    config = json.load(config_file)


# Required fields
required_fields = ["search_terms", "array_size", "results_wanted", "location" , "hours_old"]

# Validate that all required fields exist in the config dictionary
for field in required_fields:
    if field not in config:
        logger.error(f"Missing required field in config.json: {field}")
        raise ValueError(f"Missing required field: {field}")

search_terms = config["search_terms"]
array_size = config["array_size"]
results_wanted = config["results_wanted"] 
location = config["location"]
hours_old = config["hours_old"]

# Validate that the size matches the number of search terms
if int(array_size) != len(search_terms):
    print(array_size , " " , len(search_terms))
    logger.error("Array size in JSON does not match the number of search terms.")
    raise ValueError("Array size in JSON does not match the number of search terms.")

# Loop through search terms and scrape jobs for each
for i, term in enumerate(search_terms, start=1):
    logger.info(f"Scraping jobs for: {term}...")
    
    jobs = scrape_jobs(
        site_name=["indeed", "linkedin", "zip_recruiter", "glassdoor", "google"],
        search_term=term,locationrm=f"{term} jobs in India",
        location=location,
        results_wanted=results_wanted,
        hours_old=hours_old,
        country_indeed='India',
    )
    
    # Convert jobs DataFrame to JSON format and save to a file
    json_filename = f"jobs/jobs{i}.json"
    jobs.to_json(json_filename, orient='records', lines=False)
    
    logger.info(f"Results for '{term}' saved to {json_filename}")

logger.info("Job scraping completed!")
