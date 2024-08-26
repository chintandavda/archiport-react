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

# Build the app
RUN npm run build

# Stage 2: Serve the React app using a lightweight web server
FROM nginx:alpine

# Copy your custom nginx.conf to the container
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy the build output to the Nginx web server directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port that the app runs on
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
