#!/bin/bash

# Local deployment script for auth-service
set -e

# Get image tag from parameter or default to latest
IMAGE_TAG=${1:-latest}
IMAGE_NAME="ghcr.io/testorg08/auth-service:${IMAGE_TAG}"

echo "🚀 Deploying auth-service locally..."
echo "📦 Using image: ${IMAGE_NAME}"

# Check if we're using minikube
if kubectl config current-context | grep -q "minikube"; then
    echo "🔧 Detected minikube - loading image locally..."
    
    # Try to pull the image first
    if docker pull "${IMAGE_NAME}" 2>/dev/null; then
        echo "✅ Pulled image from registry"
        # Load image into minikube
        minikube image load "${IMAGE_NAME}"
    else
        echo "⚠️  Could not pull from registry, building locally..."
        # Build local image if pull fails
        docker build -t "${IMAGE_NAME}" .
        minikube image load "${IMAGE_NAME}"
    fi
else
    echo "🔧 Using external cluster - pulling from registry..."
    # For external clusters, just ensure the image exists in registry
    if ! docker pull "${IMAGE_NAME}" 2>/dev/null; then
        echo "❌ Image not found in registry. Please push the image first."
        exit 1
    fi
fi

# Update kustomization to use the specified image
echo "📝 Updating kustomization..."
cd k8s/overlays/dev

# Create a temporary kustomization for deployment
cat > kustomization-deploy.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- ../../base
- namespace.yaml

images:
- name: ghcr.io/testorg08/auth-service
  newName: ghcr.io/testorg08/auth-service
  newTag: ${IMAGE_TAG}

# Development-specific configurations
replicas:
- name: auth-service
  count: 1

# Environment-specific labels
commonLabels:
  environment: development
  conga.io/environment: dev
EOF

# Add imagePullPolicy for minikube
if kubectl config current-context | grep -q "minikube"; then
    cat >> kustomization-deploy.yaml << EOF

# Use Never for minikube since we loaded the image locally
patchesStrategicMerge:
- |-
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: auth-service
  spec:
    template:
      spec:
        containers:
        - name: auth-service
          imagePullPolicy: Never
EOF
fi

# Deploy to cluster
echo "🚀 Deploying to Kubernetes..."
kubectl apply -k . -f kustomization-deploy.yaml

# Wait for deployment
echo "⏳ Waiting for deployment to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/auth-service -n ssg1-dev

# Clean up temporary file
rm kustomization-deploy.yaml

# Get service info
echo "✅ Deployment completed!"
echo ""
echo "📊 Service Status:"
kubectl get pods -n ssg1-dev -l app.kubernetes.io/name=auth-service
echo ""
echo "🌐 Service Info:"
kubectl get svc -n ssg1-dev auth-service

# Show access instructions
echo ""
echo "🔗 Access the service:"
if kubectl config current-context | grep -q "minikube"; then
    echo "minikube service auth-service -n ssg1-dev --url"
else
    echo "kubectl port-forward -n ssg1-dev svc/auth-service 3000:80"
fi

echo ""
echo "🎉 Auth service deployed successfully!"