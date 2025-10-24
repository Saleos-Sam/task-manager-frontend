# Task Manager Frontend - Docker Build Guide

## 🎯 **Overview**

This guide shows you how to build and run the Task Manager frontend application using Docker.

## 📋 **Prerequisites**

- **Docker** installed and running
- **Git** (to clone the repository)
- **Node.js** (for local development, optional)

## 🚀 **Quick Start**

### **Step 1: Navigate to Frontend Directory**

```bash
cd task-manager-frontend-master
```

### **Step 2: Build Docker Image**

```bash
docker build -t task-manager-frontend:v1.0.0-dev .
```

### **Step 3: Run Docker Container**

```bash
docker run -d -p 3000:3000 --name task-manager-frontend task-manager-frontend:v1.0.0-dev
```

### **Step 4: Access Application**

Open your browser and navigate to:
```
http://localhost:3000
```

## 🔧 **Detailed Build Process**

### **Build Options**

#### **Development Build**
```bash
# Build with development tag
docker build -t task-manager-frontend:v1.0.0-dev .

# Run in development mode
docker run -d -p 3000:3000 --name task-manager-frontend task-manager-frontend:v1.0.0-dev
```

#### **Production Build**
```bash
# Build with production tag
docker build -t task-manager-frontend:v1.0.0-prod .

# Run in production mode
docker run -d -p 3000:3000 --name task-manager-frontend-prod task-manager-frontend:v1.0.0-prod
```

#### **Latest Build**
```bash
# Build with latest tag
docker build -t task-manager-frontend:latest .

# Run latest version
docker run -d -p 3000:3000 --name task-manager-frontend-latest task-manager-frontend:latest
```

## 🌐 **Environment Configuration**

### **Default Environment Variables**

The Docker image uses these default environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_ENABLE_DEVTOOLS=false
NODE_ENV=production
HOSTNAME=0.0.0.0
PORT=3000
```

**Important:** The `HOSTNAME=0.0.0.0` is required for the Next.js server to bind to all network interfaces, allowing port forwarding and external access to work properly.

### **Custom Environment Variables**

To override environment variables, use the `-e` flag:

```bash
# Run with custom API URL
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://your-api-server:8080 \
  --name task-manager-frontend \
  task-manager-frontend:v1.0.0-dev

# Run with development tools enabled
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_ENABLE_DEVTOOLS=true \
  --name task-manager-frontend \
  task-manager-frontend:v1.0.0-dev
```

### **Using Environment File**

Create a `.env` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_ENABLE_DEVTOOLS=false
NODE_ENV=production
```

Then run with the environment file:

```bash
docker run -d -p 3000:3000 \
  --env-file .env \
  --name task-manager-frontend \
  task-manager-frontend:v1.0.0-dev
```

## 🔍 **Container Management**

### **Check Container Status**

```bash
# List running containers
docker ps

# Check specific container
docker ps --filter name=task-manager-frontend
```

### **View Container Logs**

```bash
# View logs
docker logs task-manager-frontend

# Follow logs in real-time
docker logs -f task-manager-frontend
```

### **Stop and Remove Container**

```bash
# Stop container
docker stop task-manager-frontend

# Remove container
docker rm task-manager-frontend

# Stop and remove in one command
docker rm -f task-manager-frontend
```

### **Restart Container**

```bash
# Restart existing container
docker restart task-manager-frontend

# Or stop and start new one
docker stop task-manager-frontend
docker rm task-manager-frontend
docker run -d -p 3000:3000 --name task-manager-frontend task-manager-frontend:v1.0.0-dev
```

## 🐳 **Docker Image Management**

### **List Images**

```bash
# List all images
docker images

# List specific image
docker images task-manager-frontend
```

### **Remove Images**

```bash
# Remove specific image
docker rmi task-manager-frontend:v1.0.0-dev

# Remove all unused images
docker image prune

# Remove all images (be careful!)
docker rmi $(docker images -q)
```

### **Tag Images**

```bash
# Tag for different registry
docker tag task-manager-frontend:v1.0.0-dev your-registry/task-manager-frontend:v1.0.0-dev

# Tag as latest
docker tag task-manager-frontend:v1.0.0-dev task-manager-frontend:latest
```
