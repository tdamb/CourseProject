# Use the official Node.js 20 alpine image as the base image
FROM node:20-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app
RUN npm run build

# Start from Nginx image to serve the built application
FROM nginx:alpine

# Copy the build output from the build stage to the NGINX HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Remove the default server definition
RUN rm /etc/nginx/conf.d/default.conf

# Add custom server configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Command to run NGINX
CMD ["nginx", "-g", "daemon off;"]
