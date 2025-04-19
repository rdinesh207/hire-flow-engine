
# HireFlow - AI-Powered Recruitment Matching Platform

HireFlow is a full-stack recruitment matching platform that uses AI to connect the right candidates with the right jobs. The platform leverages semantic matching, vector embeddings, and retrieval-augmented generation (RAG) to provide intelligent job and candidate recommendations.

## Features

### For Recruiters
- Upload and parse job descriptions automatically
- Search for candidates based on semantic matching
- View detailed candidate profiles with AI-generated insights
- Export matched candidates for further processing

### For Job Seekers
- Upload and parse resumes automatically
- Search for jobs based on semantic matching
- View detailed job listings with AI-generated insights
- Compare your skills with peers to identify skill gaps

### AI & Machine Learning
- Semantic search using vector embeddings
- Personalized insights with retrieval-augmented generation
- Skill gap analysis with visualizations
- Job and candidate matching scores

## Tech Stack

### Frontend (Current Repository)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Recharts for visualizations
- React Router for navigation
- React Query for data fetching

### Backend (To be implemented)
- Python + FastAPI
- LangChain for parsing and RAG
- PostgreSQL for structured data
- Pinecone for vector embeddings
- Apache Kafka for asynchronous processing

### Infrastructure (To be implemented)
- Docker Compose for local development
- Kubernetes manifests for deployment
- Environment variables with `.env` support

## Local Development

This repository contains the frontend application. The backend implementation will be available soon.

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/hire-flow.git
cd hire-flow
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to http://localhost:8080

## Demo Accounts

For demonstration purposes, you can use the following demo accounts:

### Recruiter
- Email: jordan@example.com
- Password: demo123

### Job Seeker
- Email: emily@example.com
- Password: demo123

## Architecture

The application follows a modern architecture pattern:

1. **Frontend**
   - React components for UI
   - React Router for navigation
   - Context API for state management
   - TypeScript for type safety
   - Responsive design with Tailwind CSS

2. **Backend** (Coming soon)
   - RESTful API with FastAPI
   - Database layer with SQLAlchemy
   - Vector embeddings with Pinecone
   - Asynchronous processing with Kafka
   - LangChain for NLP tasks

3. **Infrastructure** (Coming soon)
   - Docker containers
   - Kubernetes orchestration
   - CI/CD pipeline

## Roadmap

- [ ] Implement backend services with FastAPI
- [ ] Add real-time notifications
- [ ] Develop mobile application
- [ ] Add interview scheduling functionality
- [ ] Implement chatbot for user assistance

## License

[MIT](LICENSE)
