FROM mcr.microsoft.com/devcontainers/python:3.11-bullseye

# Install Node.js 20 + pnpm — download binary directly to avoid apt/GPG/SSL issues
ARG NODE_VERSION=20.19.0
RUN curl -fsSLk "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" \
        -o /tmp/node.tar.xz \
    && tar -xJf /tmp/node.tar.xz -C /usr/local --strip-components=1 \
    && rm /tmp/node.tar.xz \
    && npm install -g pnpm
