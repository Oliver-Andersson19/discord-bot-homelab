# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the source code
COPY . .

# Expose any port if needed (for now bot doesn’t need a port)
# EXPOSE 3000

# Run the bot
CMD ["node", "src/index.js"]
