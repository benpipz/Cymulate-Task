# Cymulate-Task

A phishing simulation platform for security testing purposes.

## Prerequisites

- Docker & Docker Compose
- Node.js (for local development)
- Gmail account with App Password enabled (for email sending)

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Cymulate-Task
   ```

2. **Configure environment variables**
   
   Copy the example environment file and configure it:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the following variables:
   - `SOURCE_EMAIL`: Your Gmail address
   - `GMAIL_APP_PASS`: Your Gmail App Password (generate from Google Account settings)
   - MongoDB credentials (if different from defaults)

3. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

   This will start:
   - **Phishing Simulator API** on port 3000
   - **Phishing Attempt Management API** on port 3001
   - **Admin Client** on port 5173
   - **MongoDB** on port 27017

## Access the Application

- Frontend: http://localhost:5173
- Simulator API: http://localhost:3000
- Management API: http://localhost:3001

## Security Note

⚠️ **IMPORTANT**: Never commit `.env` file to version control. The `.env` file is already included in `.gitignore`. Always use `.env.example` as a template for other developers.