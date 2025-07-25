#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🏗️  Building application for deployment...');

// Step 1: Build frontend with Vite
console.log('📦 Building frontend...');
execSync('vite build', { stdio: 'inherit' });

// Step 2: Build backend with esbuild
console.log('🔧 Building backend...');
execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });

// Step 3: Move files from dist/public to dist root
console.log('📁 Organizing files for deployment...');
const publicDir = path.join(process.cwd(), 'dist', 'public');
const distDir = path.join(process.cwd(), 'dist');

if (fs.existsSync(publicDir)) {
  // Read all files and directories in dist/public
  const items = fs.readdirSync(publicDir);
  
  for (const item of items) {
    const sourcePath = path.join(publicDir, item);
    const targetPath = path.join(distDir, item);
    
    // Remove target if it exists
    if (fs.existsSync(targetPath)) {
      if (fs.statSync(targetPath).isDirectory()) {
        fs.rmSync(targetPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(targetPath);
      }
    }
    
    // Move each item to the dist root
    fs.renameSync(sourcePath, targetPath);
    console.log(`  ✅ Moved ${item} to dist root`);
  }
  
  // Remove the now-empty public directory
  fs.rmdirSync(publicDir);
  console.log('  🗑️  Removed empty public directory');
}

// Step 4: Create SPA routing files for static hosting
console.log('🔧 Creating SPA routing files...');

// Create _redirects file for Netlify-style hosting
const redirectsContent = '/* /index.html 200';
fs.writeFileSync(path.join(distDir, '_redirects'), redirectsContent);
console.log('  ✅ Created _redirects file');

// Create 404.html for GitHub Pages and other static hosts
const html404Content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redirecting...</title>
  <script>
    // Store the current path in sessionStorage and redirect to root
    // This allows the SPA to pick up the intended route
    sessionStorage.setItem('redirectPath', window.location.pathname + window.location.search + window.location.hash);
    window.location.replace('/');
  </script>
</head>
<body>
  <p>Redirecting...</p>
</body>
</html>`;
fs.writeFileSync(path.join(distDir, '404.html'), html404Content);
console.log('  ✅ Created 404.html fallback');

console.log('✨ Build completed successfully!');
console.log('📍 Files are now organized for deployment:');
console.log('   - index.html is in dist/');
console.log('   - assets/ folder is in dist/');
console.log('   - index.js (server) is in dist/');
console.log('   - _redirects file for SPA routing');
console.log('   - 404.html fallback for static hosting');