/**
 * NetOps Toolkit - Packaging Script
 * Creates distributable zip archive and standalone single-file distribution
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const version = pkg.version;
const distDir = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

console.log(`Packaging NetOps Toolkit v${version}...`);

// 1. Create clean standalone HTML in dist
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const standaloneHtmlPath = path.join(distDir, `netops-toolkit-standalone-v${version}.html`);
fs.writeFileSync(standaloneHtmlPath, indexHtml, 'utf8');
console.log(`✓ Created standalone HTML: ${path.basename(standaloneHtmlPath)} (${(indexHtml.length / 1024).toFixed(1)} KB)`);

// 2. Create zip package of the webapp
const zipFileName = `netops-toolkit-v${version}.zip`;
const zipPath = path.join(distDir, zipFileName);

// Remove existing zip if any
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

const rootDir = path.join(__dirname, '..');
const filesToZip = [
  'index.html',
  'manifest.json',
  'sw.js',
  'README.md',
  'LICENSE',
  'assets/icon.svg',
  'assets/icon-192.png',
  'assets/icon-512.png'
];

try {
  execSync(`zip -r "${zipPath}" ${filesToZip.join(' ')}`, { cwd: rootDir, stdio: 'inherit' });
  const stat = fs.statSync(zipPath);
  console.log(`✓ Created release package: ${zipFileName} (${(stat.size / 1024).toFixed(1)} KB)`);
} catch (err) {
  console.error('Failed to create zip:', err);
  process.exit(1);
}

console.log('✓ Packaging complete!');
