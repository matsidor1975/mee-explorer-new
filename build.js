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

console.log('✨ Build completed successfully!');
console.log('📍 Files are now organized for deployment:');
console.log('   - index.html is in dist/');
console.log('   - assets/ folder is in dist/');
console.log('   - index.js (server) is in dist/');