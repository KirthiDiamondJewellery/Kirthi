#!/bin/bash
set -e
echo "Starting local server for pre-deploy validation..."
PORT=3010 BASE_URL="http://localhost:3010" node dist/server.cjs > /dev/null 2>&1 &
SERVER_PID=$!
sleep 5
echo "Running validation script..."
BASE_URL="http://localhost:3010" node validate-deploy.cjs
echo "Validation passed. Shutting down local server..."
kill $SERVER_PID
