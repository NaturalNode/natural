# Use the official Node.js 16 image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package.json ./
COPY spec ./

# Install project dependencies
RUN npm install

# Copy only the bundle, source map, and index.js to the container
COPY ../../dist/esm/index.js ./dist/
COPY ../../dist/esm/index.js.map ./dist/

# Run the test script
CMD ["npm", "test"]