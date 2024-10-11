# Use an official Node.js runtime as a parent image
FROM node:18-alpine

ENV REACT_APP_API_DOMAIN=https://gozurite.apaluchdev.com
#ENV REACT_APP_API_DOMAIN=http://localhost:8080

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Install a simple web server
RUN npm install -g serve

# Command to run the app
CMD ["serve", "-s", "build"]

# Expose the port the app runs on
EXPOSE 3000