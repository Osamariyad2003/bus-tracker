#!/bin/bash

# Deploy to GitHub Pages Script

echo "🚀 Starting deployment to GitHub Pages..."

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Error: Not a git repository. Please initialize git first."
    echo "Run: git init"
    exit 1
fi

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Error: No git remote 'origin' found."
    echo "Please add your repository:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install || npm install

# Build the project
echo "🔨 Building project..."
pnpm run build || npm run build

if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. dist directory not found."
    exit 1
fi

# Deploy to gh-pages
echo "📤 Deploying to GitHub Pages..."

# Install gh-pages if not already installed
if ! command -v gh-pages &> /dev/null; then
    echo "Installing gh-pages..."
    npm install -g gh-pages
fi

# Deploy
gh-pages -d dist

echo "✅ Deployment complete!"
echo "🌐 Your site will be available at: https://YOUR_USERNAME.github.io/YOUR_REPO/"
echo ""
echo "⚠️  Remember to:"
echo "1. Enable GitHub Pages in repository settings"
echo "2. Set source to 'gh-pages' branch"
echo "3. Add environment variables as GitHub Secrets"

