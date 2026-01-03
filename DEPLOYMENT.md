# Auth Service Deployment

## Container Registry

This service uses GitHub Container Registry (GHCR) for storing Docker images.

## How it Works

1. **Push to main/develop** → GitHub Actions builds and pushes image to `ghcr.io/testorg08/auth-service`
2. **ArgoCD automatically detects** the new image and deploys it to Kubernetes
3. **Backstage shows the deployment** status in the service catalog

## Manual Deployment (if needed)

```bash
kubectl apply -k k8s/overlays/dev
```

## Access the Service

```bash
# With minikube
minikube service auth-service -n ssg1-dev --url

# With port-forward
kubectl port-forward -n ssg1-dev svc/auth-service 3000:80
```