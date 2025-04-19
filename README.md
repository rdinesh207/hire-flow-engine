
# Recruitment Matching Platform

A full-stack application for matching job seekers with job listings using AI-powered semantic matching.

## Architecture

This project consists of:

- **Backend**: Python FastAPI application with LangChain for parsing and RAG
- **Frontend**: React application with Tailwind CSS
- **Database**: SQLite for structured data, Pinecone for vector embeddings
- **Message Broker**: Apache Kafka for asynchronous processing

## Prerequisites

- Docker and Docker Compose
- Minikube (for Kubernetes deployment)
- Node.js and npm (for local frontend development)
- Python 3.11+ (for local backend development)
- Google API Key for Vertex AI (Gemini)
- Pinecone API Key

## Local Development Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd recruitment-matching
```

### 2. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```
GOOGLE_API_KEY=your-google-api-key
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=us-west4-gcp
```

### 3. Run with Docker Compose

```bash
docker-compose up --build
```

This will start:
- Backend API on http://localhost:8000
- Frontend on http://localhost:3000
- Kafka and Zookeeper for async processing
- A mock Pinecone service (replace with real Pinecone in production)

### 4. Development without Docker

#### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend

```bash
npm install
npm run dev
```

## Kubernetes Deployment (Minikube)

### 1. Start Minikube

```bash
minikube start
```

### 2. Build Docker images

```bash
# Point Docker to Minikube
eval $(minikube docker-env)

# Build images
docker build -t recruitment-backend:latest -f Dockerfile.backend .
docker build -t recruitment-frontend:latest -f Dockerfile.frontend .
```

### 3. Create ConfigMap and Secret

Update the `k8s/config.yaml` file with your actual API keys (base64 encoded).

```bash
kubectl apply -f k8s/config.yaml
```

### 4. Create PersistentVolumeClaim

```bash
kubectl apply -f k8s/pvc.yaml
```

### 5. Deploy applications

```bash
kubectl apply -f k8s/kafka-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/kafka-worker-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

### 6. Access the application

```bash
minikube service frontend
```

## API Endpoints

### Job Endpoints

- `GET /jobs/`: List all jobs
- `GET /jobs/{job_id}`: Get job details
- `POST /jobs/parse`: Parse and store job description

### Applicant Endpoints

- `GET /applicants/`: List all applicants
- `GET /applicants/{applicant_id}`: Get applicant details
- `POST /applicants/parse`: Parse and store resume

### Search Endpoints

- `GET /search/jobs-for-applicant/{applicant_id}`: Find matching jobs
- `GET /search/applicants-for-job/{job_id}`: Find matching applicants

### Comparison Endpoints

- `GET /compare/{applicant_id_a}/{applicant_id_b}`: Compare two applicants
- `GET /compare/heatmap/{applicant_id}?peer_ids=id1,id2`: Generate skill heatmap

### RAG Endpoints

- `GET /rag/job/{job_id}`: Get job RAG summary
- `GET /rag/applicant/{applicant_id}`: Get applicant RAG summary

## Testing

### Uploading Job Descriptions

```bash
curl -X POST -F "file=@job_description.txt" http://localhost:8000/jobs/parse
```

### Uploading Resumes

```bash
curl -X POST -F "file=@resume.pdf" http://localhost:8000/applicants/parse
```

## License

[MIT License](LICENSE)
