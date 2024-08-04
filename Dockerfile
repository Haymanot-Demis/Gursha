# Use an official Node.js runtime as a parent image
FROM node:20.11.1
# Set the working directory to /app
WORKDIR /app
# Copy the current directory contents into the container at /app
COPY . /app
# Install production dependencies only
RUN npm install
RUN npm install -D ts-node
# Make port 8000 available to the world outside this container
EXPOSE 8000
# Run index.js with increased memory limit
CMD ["npm", "start"]