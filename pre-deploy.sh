#!/usr/bin/env bash
set -e

if [ -z "$1" ]; then
  echo "Error: CANDIDATE_URL not provided."
  exit 1
fi

export BASE_URL="$1"
echo "Running validation script against $BASE_URL..."
node validate-deploy.cjs
echo "Validation passed."
