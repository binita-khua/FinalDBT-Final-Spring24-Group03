# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:18.15.0

# Create and change to the app directory.
WORKDIR /src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Run the web service on container startup.
CMD ["npm", "start"]
