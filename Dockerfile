# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory to /app inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 8080
EXPOSE 8080

# Command to run the application
CMD ["node", "server.js"]