# Stage 1: Build the React app
FROM node:20-alpine as build

# Set environment variables only for production
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# Conditional environment variable assignment for production
ARG REACT_APP_DJANGO_USERPROFILE_SERVICE
ARG REACT_APP_NODE_DESIGN_SERVICE

# Explicitly set these environment variables for the build process
ENV REACT_APP_DJANGO_USERPROFILE_SERVICE=$REACT_APP_DJANGO_USERPROFILE_SERVICE
ENV REACT_APP_NODE_DESIGN_SERVICE=$REACT_APP_NODE_DESIGN_SERVICE

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app for production
RUN npm run build

# Serve the app using a simple HTTP server
RUN npm install -g serve
CMD ["serve", "-s", "build"]

# Expose the port Heroku will use
EXPOSE 3000