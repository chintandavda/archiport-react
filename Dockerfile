# Use a Node.js base image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy the app
COPY . .

# Build the app
RUN npm run build

# Install 'serve' to serve the static files
RUN npm install -g serve

# Set the command to start the app
CMD ["serve", "-s", "build"]

# Expose port 80
EXPOSE 80
