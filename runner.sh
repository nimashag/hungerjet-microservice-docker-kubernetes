#!/bin/bash

set -e  # Exit script on errors
#set -x # Enable debugging

CONFIG_FILE="services.config.json"
DOCKER_DEV_REGISTRY="docker.io"

function rebuild_images() {
  echo "🔄 Rebuilding Docker images..."

  jq -c '.services[]' $CONFIG_FILE | while read -r svc; do
    NAME=$(echo $svc | jq -r '.name')
    FOLDER=$(echo $svc | jq -r '.folder')
    IMAGE=$(echo $svc | jq -r '.dockerImage')
    REGISTRY_IMAGE="$DOCKER_DEV_REGISTRY/$IMAGE"

    echo "→ Building image for $NAME..."
    docker build -t "$IMAGE" "$FOLDER"

    echo "→ Tagging image as $REGISTRY_IMAGE"
    docker tag "$IMAGE" "$REGISTRY_IMAGE"

    echo "→ Pushing image to $DOCKER_DEV_REGISTRY registry"
    docker push "$REGISTRY_IMAGE" || echo "⚠️ Warning: Failed to push image $REGISTRY_IMAGE, continuing..."
  done

  echo "✅ Docker images built and pushed to $DOCKER_DEV_REGISTRY registry"
}

function start_cluster() {
  echo "🚀 Applying Kubernetes configurations..."

  # All services
  jq -c '.services[]' $CONFIG_FILE | while read -r svc; do
    NAME=$(echo $svc | jq -r '.name')
    PREFIX=$(echo $svc | jq -r '.prefix')
    K8S_PATH=$(echo $svc | jq -r '.k8sPath')

    echo "→ Applying $NAME resources from $K8S_PATH"
    kubectl apply -f "$K8S_PATH/${PREFIX}-deployment.yaml"
    kubectl apply -f "$K8S_PATH/${PREFIX}-service.yaml"
  done

  # NGINX
  NGINX_PATH=$(jq -r '.nginx.k8sPath' $CONFIG_FILE)
  echo "→ Applying NGINX resources from $NGINX_PATH"
  kubectl apply -f "$NGINX_PATH/nginx-config.yaml"
  kubectl apply -f "$NGINX_PATH/nginx-deployment.yaml"
  kubectl apply -f "$NGINX_PATH/nginx-service.yaml"

  echo "✅ Kubernetes resources applied."
  list_resources
}

function stop_cluster() {
  echo "🛑 Deleting Kubernetes resources..."

  # All services
  jq -c '.services[]' $CONFIG_FILE | while read -r svc; do
    NAME=$(echo $svc | jq -r '.name')
    PREFIX=$(echo $svc | jq -r '.prefix')
    K8S_PATH=$(echo $svc | jq -r '.k8sPath')

    echo "→ Deleting $NAME resources from $K8S_PATH"
    kubectl delete -f "$K8S_PATH/${PREFIX}-deployment.yaml" || echo "⚠️ Warning: Failed to delete from $K8S_PATH, continuing..."
    kubectl delete -f "$K8S_PATH/${PREFIX}-service.yaml" || echo "⚠️ Warning: Failed to delete from $K8S_PATH, continuing..."
  done

  # NGINX
  NGINX_PATH=$(jq -r '.nginx.k8sPath' $CONFIG_FILE)
  echo "→ Deleting NGINX resources from $NGINX_PATH"
  kubectl delete -f "$NGINX_PATH/nginx-config.yaml" || echo "⚠️ Warning: Failed to delete from $NGINX_PATH, continuing..."
  kubectl delete -f "$NGINX_PATH/nginx-deployment.yaml" || echo "⚠️ Warning: Failed to delete from $NGINX_PATH, continuing..."
  kubectl delete -f "$NGINX_PATH/nginx-service.yaml" || echo "⚠️ Warning: Failed to delete from $NGINX_PATH, continuing..."

  echo "✅ Kubernetes resources deleted."
  list_resources
}

function print_logs() {
  if [ -z "$2" ]; then
    echo "❗ Please provide a pod name or part of it. Example: ./runner.sh logs order"
    return
  fi

  POD_NAME=$(kubectl get pods --no-headers -o custom-columns=":metadata.name" | grep "$2" | head -n 1)

  if [ -z "$POD_NAME" ]; then
    echo "❌ No pod found matching '$2'"
  else
    echo "📄 Showing logs for pod: $POD_NAME"
    kubectl logs "$POD_NAME"
  fi
}


function list_resources() {
  echo "📋 Current Kubernetes Resources:"
  kubectl get pods,svc,cm -o wide
}

function help_menu() {
  echo "Usage: ./runner.sh [command] [command] ..."
  echo
  echo "Commands:"
  echo "  rebuild      Rebuild all docker images"
  echo "  start        Create k8s resources"
  echo "  stop         Delete k8s resources"
  echo "  up           Rebuild docker + create k8s"
  echo "  logs [pod]   Print logs from a selected pod"
  echo "  help         Show this help menu"
}

# Run all commands passed as arguments
while [[ $# -gt 0 ]]; do
  cmd="$1"
  shift

  case "$cmd" in
    rebuild)
      rebuild_images
      ;;
    start)
      start_cluster
      ;;
    up)
      rebuild_images
      start_cluster
      ;;
    stop)
      stop_cluster
      ;;
    logs)
      print_logs "$cmd" "$1"
      shift
      ;;
    help)
      help_menu
      ;;
    *)
      echo "❌ Unknown command: $cmd"
      help_menu
      exit 1
      ;;
  esac
done
