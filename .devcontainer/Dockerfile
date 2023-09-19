FROM ubuntu:22.04

# Set environment variables to prevent interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install postgres
RUN apt update && \
    apt install -y postgresql && \
    service postgresql start && \
    su - postgres sh -c "psql -U postgres -d postgres -c \"ALTER USER postgres WITH PASSWORD 'postgres'\""

# Install node and yarn
RUN apt install -y git vim wget && \
    touch ~/.bashrc && \
    chmod +x ~/.bashrc && \
    wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash && \
    . ~/.bashrc && \
    nvm install --lts && \
    npm install --global yarn
