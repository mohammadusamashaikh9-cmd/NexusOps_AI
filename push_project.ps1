# Setup Git and push files to remote
Write-Host "Adding files..." -ForegroundColor Green
git add .

Write-Host "Committing files..." -ForegroundColor Green
git commit -m "Initial commit"

Write-Host "Pushing to GitHub repository NexusOps-AI..." -ForegroundColor Green
git push -u origin main

Write-Host "Done!" -ForegroundColor Green
