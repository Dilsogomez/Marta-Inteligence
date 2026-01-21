# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages
RUN npm install

# Bundle app source
COPY . .

# Build the client-side app
RUN npm run build

# Make port 8080 available to the world outside this container
# The server in server.js uses process.env.PORT, which Cloud Run sets to 8080 by default.
EXPOSE 8080

# Define the command to run your app
CMD ["node", "server.js"]