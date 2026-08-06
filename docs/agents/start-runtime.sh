#!/bin/bash
set -e

echo "🚀 OnlyMen Agent Runtime Startup"
echo "================================"

# Check for API key
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "❌ ANTHROPIC_API_KEY not set"
  echo "   Set it: export ANTHROPIC_API_KEY=sk-ant-xxxx"
  exit 1
fi

# Navigate to agent-runtime
cd "$(dirname "$0")/agent-runtime"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Build TypeScript
echo "🏗️  Building TypeScript..."
npm run build

# Start server
echo "✨ Starting server on http://localhost:3000"
npm start
