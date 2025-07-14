FROM node:20-alpine

# Set the workdir to the monorepo root
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy the lockfile and package.json files for all workspaces
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./

# Copy all packages and services
COPY packages ./packages
COPY services/api ./services/api

# Install dependencies (from the root, so all workspaces are installed)
RUN pnpm install --frozen-lockfile

# Set the workdir to the API service
WORKDIR /app/services/api

ARG PORT=8000
EXPOSE $PORT

# Start the API
CMD ["pnpm", "start"]