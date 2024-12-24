# Project Name

A brief description of your project and its purpose.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [License](#license)

## Prerequisites

Before running this project locally, ensure you have the following installed on your system:

1. [Python](https://www.python.org/downloads/)
2. [Node.js](https://nodejs.org/)

Additionally, you need to obtain an API key from the Galadriel platform:

1. Visit the [Galadriel API Key documentation](https://docs.galadriel.com/nodes/requirements#api-keys).
2. Register on the platform and generate your API key.

## Installation

Follow these steps to set up the project locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/Faraz-Khan-79996/complete_scraper.git
   cd complete_scraper
   ```

2. Create a `.env` file in the root directory and add the following line:

   ```env
   GALADRIEL_API_KEY=your-api-key
   ```


3. Install project dependencies:

   ```bash
   npm run install_dependencies
   ```
This will install both node and python dependencies.

## Usage

To run the project, execute the following command:

```bash
npm run start
```

This will start the project locally. The output will be generated in the `processed_jobs` folder.

## Configuration

You can modify the `config` file to adjust the behavior and results of the project. Below is the format of the `config` file:

```json
{
  "search_terms": [
    "Data Scientist"
  ],
  "array_size": "1",
  "hours_old": "336",
  "location": "India",
  "results_wanted": "10"
}
```

### Notes:
- `array_size` should be equal to the number of elements in the `search_terms` array.



