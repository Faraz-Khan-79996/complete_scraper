# Use an official Node.js image as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Install Python and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    rm -rf /var/lib/apt/lists/*

# Create a Python virtual environment
RUN python3 -m venv /env

# Set the virtual environment as the default Python interpreter
ENV PATH="/env/bin:$PATH"

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install Node.js dependencies
# RUN npm install --production

# Copy the rest of the application code
COPY . .

# Create a Python virtual environment and install Python dependencies
# Make sure you have a requirements.txt file for your Python dependencies
# COPY requirements.txt .
# RUN pip install -r requirements.txt

# Install Python and Node.js dependencies
RUN npm run install_dependencies

# Set the default command to run your Node.js app and Python scripts
CMD ["npm", "run", "start"]
