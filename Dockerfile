# Use an official node image as a base
FROM node:16-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Install a simple server to serve the built React app
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Serve the build folder using a simple server
CMD ["serve", "-s", "build"]
