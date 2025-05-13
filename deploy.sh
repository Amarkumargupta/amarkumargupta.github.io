#!/bin/bash

# Script to deploy Next.js static site to GitHub Pages
echo "Starting deployment to GitHub Pages..."

# Build the site (just in case, though we already have a build)
# npm run build

# Enter the out directory
cd out

# Initialize a new Git repository (just for deployment)
git init
git checkout -b main

# Add all files
git add .

# Commit
git commit -m "Deploy portfolio website to GitHub Pages"

# Add the remote repository
git remote add origin https://github.com/Amarkumargupta/amarkumargupta.github.io.git

# Force push to the main branch (this will replace all content)
git push -f origin main

echo "Deployment complete!"
